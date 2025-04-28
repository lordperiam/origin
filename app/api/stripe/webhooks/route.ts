/*
This API route handles Stripe webhook events to manage subscription status changes and updates user profiles accordingly.
*/

import {
  manageSubscriptionStatusChange,
  updateStripeCustomer
} from "@/actions/stripe-actions"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted"
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get("Stripe-Signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  console.log("Webhook received", {
    hasSignature: !!sig,
    hasSecret: !!webhookSecret,
    bodyLength: body.length
  })

  try {
    if (!sig || !webhookSecret) {
      console.error("Webhook secret or signature missing", {
        sig: !!sig,
        webhookSecret: !!webhookSecret
      })
      throw new Error("Webhook secret or signature missing")
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    console.log("Webhook event constructed successfully", {
      type: event.type,
      id: event.id
    })
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`, { error: err })
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    console.log(`Processing relevant event: ${event.type}`, {
      eventId: event.id
    })
    try {
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await handleSubscriptionChange(event)
          break

        case "checkout.session.completed":
          await handleCheckoutSession(event)
          break

        default:
          throw new Error("Unhandled relevant event!")
      }
      console.log(`Successfully processed event: ${event.type}`, {
        eventId: event.id
      })
    } catch (error) {
      console.error("Webhook handler failed:", error)
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        { status: 400 }
      )
    }
  } else {
    console.log(`Ignoring non-relevant event: ${event.type}`)
  }

  return new Response(JSON.stringify({ received: true }))
}

async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const productId = subscription.items.data[0].price.product as string
  console.log("Handling subscription change", {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status
  })
  await manageSubscriptionStatusChange(
    subscription.id,
    subscription.customer as string,
    productId
  )
}

async function handleCheckoutSession(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session
  console.log("Handling checkout session", {
    mode: checkoutSession.mode,
    customerId: checkoutSession.customer,
    clientReferenceId: checkoutSession.client_reference_id
  })

  if (checkoutSession.mode === "subscription") {
    const subscriptionId = checkoutSession.subscription as string
    console.log("Processing subscription checkout", { subscriptionId })

    await updateStripeCustomer(
      checkoutSession.client_reference_id as string,
      subscriptionId,
      checkoutSession.customer as string
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"]
    })

    const productId = subscription.items.data[0].price.product as string
    await manageSubscriptionStatusChange(
      subscription.id,
      subscription.customer as string,
      productId
    )
  }
}
