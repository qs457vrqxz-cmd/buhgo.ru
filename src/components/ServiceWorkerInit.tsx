"use client";

import { useEffect } from "react";
import { initializePushNotifications } from "@/lib/push-notifications";

export function ServiceWorkerInit() {
  useEffect(() => {
    // Initialize service worker and push notifications
    const init = async () => {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        try {
          await initializePushNotifications();
        } catch (error) {
          console.log("Push notifications initialization skipped:", error);
        }
      }
    };

    // Delay initialization to not block main thread
    const timer = setTimeout(init, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
