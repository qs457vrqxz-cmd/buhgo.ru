"use client";

import type React from "react";

export function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
      {children}
    </body>
  );
}
