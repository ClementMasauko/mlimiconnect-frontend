// src/hooks/usePushNotifications.ts
import { useEffect, useState } from "react";

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported");
      return;
    }

    const registerServiceWorker = async () => {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.getSubscription();
      if (sub) setSubscription(sub);
    };

    const requestPermission = async () => {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === "granted") registerServiceWorker();
    };

    // Check existing permission
    setPermission(Notification.permission);
    if (Notification.permission === "granted") registerServiceWorker();

    // Listen for permission changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && Notification.permission === "default") {
        requestPermission();
      }
    });

    return () => document.removeEventListener("visibilitychange", () => {});
  }, []);

  const subscribe = async () => {
    if (permission !== "granted") {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return;
    }

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: "YOUR_PUBLIC_VAPID_KEY", // ← get from backend
    });

    setSubscription(sub);

    // Send subscription to your backend
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
  };

  return { permission, subscription, subscribe };
}