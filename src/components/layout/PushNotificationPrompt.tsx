"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const DISMISS_KEY = "push-notification-dismissed";
const DISMISS_DAYS = 7;
const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function PushNotificationPrompt({ lang }: { lang: string }) {
  const [show, setShow] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [subscribing, setSubscribing] = useState(false);

  const isHindi = lang === "hindi";

  useEffect(() => {
    if (!VAPID_KEY) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    // Check if dismissed recently
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (dismissed) {
        const dismissedAt = parseInt(dismissed, 10);
        if (!Number.isNaN(dismissedAt) && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
          return;
        }
      }
    } catch {
      // localStorage unavailable, proceed to show prompt
    }

    let cancelled = false;

    navigator.serviceWorker
      .register("/sw.js")
      .then(async (reg) => {
        if (cancelled) return;
        setRegistration(reg);
        const existing = await reg.pushManager.getSubscription();
        if (!existing && !cancelled) {
          setShow(true);
        }
      })
      .catch((err) => {
        console.warn("[PushNotification] Service worker registration failed:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleEnable = async () => {
    if (!registration || !VAPID_KEY) return;
    setSubscribing(true);

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY).buffer as ArrayBuffer,
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!res.ok) {
        console.error("[PushNotification] Subscribe API failed:", res.status);
        await subscription.unsubscribe();
        return;
      }

      setShow(false);
    } catch (err) {
      console.warn("[PushNotification] Subscription failed:", err);
    } finally {
      setSubscribing(false);
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // Ignore if localStorage is unavailable
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-700 p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Bell size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {isHindi ? "सूचनाएं प्राप्त करें" : "Stay Updated"}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              {isHindi
                ? "नई खबरों की सूचना तुरंत पाएं!"
                : "Get notified when new articles are published!"}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleEnable}
                disabled={subscribing}
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {subscribing
                  ? isHindi ? "सक्रिय हो रहा..." : "Enabling..."
                  : isHindi ? "सूचनाएं चालू करें" : "Enable Notifications"}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
              >
                {isHindi ? "बाद में" : "Not now"}
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            aria-label={isHindi ? "खारिज करें" : "Dismiss"}
            className="shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
