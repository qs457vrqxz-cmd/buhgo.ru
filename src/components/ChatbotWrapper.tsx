"use client";

import dynamic from "next/dynamic";

// Lazy load chatbot
const Chatbot = dynamic(() => import("@/components/Chatbot").then((mod) => mod.Chatbot), {
  ssr: false,
});

export function ChatbotWrapper() {
  return <Chatbot />;
}
