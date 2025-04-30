/**
 * @description
 * This API route handles Stripe webhook events to synchronize subscription status changes with user profiles in the Neurogenesis app.
 * It processes events like checkout completion and subscription updates, ensuring payment data is reflected in the database.
 *
 * Key features:
 * - Webhook Verification: Validates events with Stripe signature
 * - Event Handling: Processes subscription-related events
 * - Profile Sync: Updates user profiles via server actions
 * - Logging: Detailed logs for debugging and monitoring
 *
 * @dependencies
 * - next/server: Provides NextRequest and NextResponse for API routes
 * - stripe: Stripe instance from '@/lib/stripe' for webhook validation
 * - stripe-actions: Server actions from '@/actions/stripe-actions' for profile updates
 *
 * @notes
 * - Requires STRIPE_WEBHOOK_SECRET in .env.local for signature verification
 * - Handles only relevant events; others are ignored with logs
 * - Edge case: Missing signature or secret results in 400 error
 * - Limitation: Does not retry failed events; could add queue in future
 */

import {
  manageSubscriptionStatusChange,
  updateStripeCustomer
} from "@/actions/stripe-actions"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Set of Stripe events relevant to subscription management
const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted"
])

/**
 * Handles POST requests from Stripe webhooks.
 *
 * @param req - The incoming Next.js request
 * @returns JSON response indicating success or error
 */
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = (await headers()).get("Stripe-Signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  // Log incoming webhook for debugging
  console.log("Webhook received", {
    hasSignature: !!sig,
    hasSecret: !!webhookSecret,
    bodyLength: body.length
  })

  // Verify webhook signature
  try {
    if (!sig || !webhookSecret) {
      console.error("Webhook secret or signature missing", {
        sig: !!sig,
        webhookSecret: !!webhookSecret
      })
      return new Response("Webhook Error: Missing signature or secret", {
        status: 400
      })
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

  // Process relevant events
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
          throw new Error(`Unhandled relevant event: ${event.type}`)
      }
      console.log(`Successfully processed event: ${event.type}`, {
        eventId: event.id
      })
    } catch (error: any) {
      console.error("Webhook handler failed:", error)
      return new Response(
        `Webhook handler failed: ${error.message}. View server logs for details.`,
        { status: 400 }
      )
    }
  } else {
    console.log(`Ignoring non-relevant event: ${event.type}`, {
      eventId: event.id
    })
  }

  // Return success response to Stripe
  return new Response(JSON.stringify({ received: true }), { status: 200 })
}

/**
 * Handles subscription change events (updated or deleted).
 *
 * @param event - The Stripe event object
 */
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

/**
 * Handles checkout session completion events.
 *
 * @param event - The Stripe event object
 */
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

    // Update user profile with Stripe data
    await updateStripeCustomer(
      checkoutSession.client_reference_id as string,
      subscriptionId,
      checkoutSession.customer as string
    )

    // Fetch subscription details and update membership status
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
