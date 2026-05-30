"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UseAutoLogoutOptions {
  timeout?: number; // in milliseconds
  onLogout?: () => void;
  enabled?: boolean;
}

export function useAutoLogout({
  timeout = 30 * 60 * 1000, // 30 minutes default
  onLogout,
  enabled = true,
}: UseAutoLogoutOptions = {}) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(async () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Call custom logout handler
    if (onLogout) {
      onLogout();
    }

    // Redirect to login
    window.location.href = "/login?reason=inactivity";
  }, [onLogout]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (enabled) {
      timeoutRef.current = setTimeout(() => {
        logout();
      }, timeout);
    }
  }, [timeout, enabled, logout]);

  useEffect(() => {
    if (!enabled) return;

    // Check if user should be remembered
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe === "true") {
      // Don't auto-logout if "remember me" is enabled
      return;
    }

    // Events to track user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Reset timer on user activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Start initial timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, resetTimer]);

  return {
    resetTimer,
    lastActivity: lastActivityRef.current,
  };
}
