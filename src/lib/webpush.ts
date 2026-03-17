import webpush from "web-push";
import { prisma } from "@/lib/prisma";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;

if (vapidPublicKey && vapidPrivateKey && vapidSubject) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

interface PushPayload {
  title: string;
  body: string;
  url: string;
}

export async function sendPushToAll(payload: PushPayload) {
  if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
    console.warn("[WebPush] VAPID keys not configured, skipping push notifications");
    return;
  }

  const subscriptions = await prisma.pushSubscription.findMany();

  console.log(`[WebPush] Sending to ${subscriptions.length} subscribers`, payload);

  if (subscriptions.length === 0) return;

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
        console.log(`[WebPush] Sent successfully to ${sub.endpoint.slice(0, 50)}...`);
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        console.error(`[WebPush] Failed for ${sub.endpoint.slice(0, 50)}... status: ${statusCode}`);
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
        throw err;
      }
    })
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  console.log(`[WebPush] Done: ${succeeded} succeeded, ${failed} failed`);
}
