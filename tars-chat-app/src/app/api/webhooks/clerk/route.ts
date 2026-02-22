/* ========================================================
   CLERK WEBHOOK - Sync Users from Clerk to Convex
   
   When a user signs up, updates their profile, or deletes
   their account in Clerk, Clerk sends a webhook to this
   endpoint. We then sync that data to our Convex database.
   
   Setup required:
   1. Go to Clerk Dashboard -> Webhooks
   2. Add endpoint: https://your-domain.com/api/webhooks/clerk
   3. Subscribe to: user.created, user.updated
   4. Copy the webhook secret to CLERK_WEBHOOK_SECRET env var
   ======================================================== */

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

// Create a Convex HTTP client for server-side API calls
const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  // If no webhook secret configured, skip verification (dev mode)
  // In production, ALWAYS verify webhook signatures!
  if (!WEBHOOK_SECRET) {
    console.warn("CLERK_WEBHOOK_SECRET not set - processing without verification");
    const payload = await req.json();
    await handleWebhookEvent(payload);
    return new Response("OK", { status: 200 });
  }

  // Get the Svix headers for webhook verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify the webhook signature using Svix
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Verification failed", { status: 400 });
  }

  await handleWebhookEvent(evt);
  return new Response("OK", { status: 200 });
}

// Process the webhook event and sync data to Convex
async function handleWebhookEvent(evt: WebhookEvent | Record<string, unknown>) {
  const eventType = (evt as WebhookEvent).type ?? (evt as Record<string, unknown>).type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const data = (evt as WebhookEvent).data ?? (evt as Record<string, unknown>).data;
    const userData = data as {
      id: string;
      first_name: string | null;
      last_name: string | null;
      email_addresses: Array<{ email_address: string }>;
      image_url: string;
    };

    // Extract user info from the Clerk webhook payload
    const clerkId = userData.id;
    const name =
      `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
      "Anonymous";
    const email = userData.email_addresses?.[0]?.email_address || "";
    const avatarUrl = userData.image_url || "";

    // Sync to Convex database using our createOrUpdateUser mutation
    await convex.mutation(api.users.createOrUpdateUser, {
      clerkId,
      name,
      email,
      avatarUrl,
    });
  }
}
