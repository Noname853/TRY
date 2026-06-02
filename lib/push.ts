import webpush from "web-push";
import type { PushSubscription as WebPushSubscription } from "web-push";

let configured = false;
function ensureConfig() {
  if (configured) return;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:hello@example.com";
  if (!pub || !priv) {
    throw new Error("VAPID keys belum diset di environment");
  }
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

export async function sendPush(
  subscription: WebPushSubscription,
  payload: PushPayload,
) {
  ensureConfig();
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}
