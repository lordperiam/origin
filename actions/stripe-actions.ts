/**
 * @description
 * This file contains server actions for managing Stripe payment integrations in the Neurogenesis app.
 * It handles subscription creation, status updates, and user profile synchronization with Stripe data.
 *
 * Key features:
 * - Subscription Status Management: Updates user membership based on Stripe events
 * - Profile Updates: Links Stripe customer and subscription IDs to user profiles
 * - Error Handling: Validates inputs and catches Stripe API errors
 *
 * @dependencies
 * - stripe: Stripe instance from '@/lib/stripe' for API interactions
 * - profiles-actions: CRUD actions from '@/actions/db/profiles-actions' for profile updates
 * - profiles-schema: SelectProfile type from '@/db/schema/profiles-schema' for type safety
 *
 * @notes
 * - Assumes Stripe products have metadata with 'membership' key (free, pro, institutional)
 * - Uses server actions per project rules for secure backend operations
 * - Edge case: Handles missing customer/subscription IDs with specific errors
 * - Limitation: Does not yet support downgrades or multiple subscriptions per user
 */

"use server"

import {
  updateProfileAction,
  updateProfileByStripeCustomerIdAction
} from "@/actions/db/profiles-actions"
import { SelectProfile } from "@/db/schema/profiles-schema"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

/**
 * Type representing valid membership statuses in the app.
 */
type MembershipStatus = SelectProfile["membership"]

/**
 * Maps Stripe subscription status to app membership status.
 *
 * @param status - Stripe subscription status
 * @param membership - Intended membership from product metadata
 * @returns Corresponding app membership status
 */
const getMembershipStatus = (
  status: Stripe.Subscription.Status,
  membership: MembershipStatus
): MembershipStatus => {
  switch (status) {
    case "active":
    case "trialing":
      return membership // Keep the intended membership if active or trialing
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
    case "past_due":
    case "paused":
    case "unpaid":
      return "free" // Downgrade to free for any inactive state
    default:
      console.warn(`Unknown Stripe status: ${status}, defaulting to free`)
      return "free" // Fallback for unexpected statuses
  }
}

/**
 * Retrieves a Stripe subscription with expanded details.
 *
 * @param subscriptionId - The ID of the subscription to fetch
 * @returns The subscription object with expanded payment method
 * @throws Error if retrieval fails
 */
const getSubscription = async (subscriptionId: string): Promise<Stripe.Subscription> => {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"]
  })
}

/**
 * Updates a user's profile with Stripe customer and subscription data.
 *
 * @param userId - Clerk user ID
 * @param subscriptionId - Stripe subscription ID
 * @param customerId - Stripe customer ID
 * @returns Updated profile data
 * @throws Error if update fails or parameters are missing
 */
export const updateStripeCustomer = async (
  userId: string,
  subscriptionId: string,
  customerId: string
): Promise<SelectProfile> => {
  try {
    // Validate inputs
    if (!userId || !subscriptionId || !customerId) {
      throw new Error("Missing required parameters: userId, subscriptionId, or customerId")
    }

    // Fetch subscription to ensure it exists
    const subscription = await getSubscription(subscriptionId)

    // Update profile with Stripe data
    const result = await updateProfileAction(userId, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id
    })

    if (!result.isSuccess || !result.data) {
      throw new Error(`Failed to update profile: ${result.message}`)
    }

    console.log(`Updated profile ${userId} with Stripe data: ${customerId}, ${subscriptionId}`)
    return result.data
  } catch (error) {
    console.error("Error in updateStripeCustomer:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update Stripe customer profile")
  }
}

/**
 * Manages subscription status changes and updates user profile accordingly.
 *
 * @param subscriptionId - Stripe subscription ID
 * @param customerId - Stripe customer ID
 * @param productId - Stripe product ID associated with the subscription
 * @returns Updated membership status
 * @throws Error if update fails or parameters are invalid
 */
export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  productId: string
): Promise<MembershipStatus> => {
  try {
    // Validate inputs
    if (!subscriptionId || !customerId || !productId) {
      throw new Error(
        "Missing required parameters: subscriptionId, customerId, or productId"
      )
    }

    // Fetch subscription and product details
    const subscription = await getSubscription(subscriptionId)
    const product = await stripe.products.retrieve(productId)

    // Extract membership from product metadata
    const membership = product.metadata.membership as MembershipStatus
    if (!["free", "pro", "institutional"].includes(membership)) {
      throw new Error(`Invalid membership type in product metadata: ${membership}`)
    }

    // Determine membership status based on subscription state
    const membershipStatus = getMembershipStatus(subscription.status, membership)

    // Update profile with new subscription status
    const updateResult = await updateProfileByStripeCustomerIdAction(customerId, {
      stripeSubscriptionId: subscription.id,
      membership: membershipStatus
    })

    if (!updateResult.isSuccess || !updateResult.data) {
      throw new Error(`Failed to update profile: ${updateResult.message}`)
    }

    console.log(
      `Subscription ${subscriptionId} status updated to ${membershipStatus} for customer ${customerId}`
    )
    return membershipStatus
  } catch (error) {
    console.error("Error in manageSubscriptionStatusChange:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to manage subscription status change")
  }
}