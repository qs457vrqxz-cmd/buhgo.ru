"use client";

import Script from "next/script";

// Google Analytics 4 Configuration
// Replace with your GA4 Measurement ID (G-XXXXXXXXXX)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Track page views (for SPA navigation)
export function trackPageView(url: string) {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

// Track custom events
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Track form submissions
export function trackFormSubmission(formName: string) {
  trackEvent("form_submit", "engagement", formName);
}

// Track button clicks
export function trackButtonClick(buttonName: string) {
  trackEvent("click", "button", buttonName);
}

// Track phone calls
export function trackPhoneClick() {
  trackEvent("click", "contact", "phone_call");
}

// Track email clicks
export function trackEmailClick() {
  trackEvent("click", "contact", "email");
}
