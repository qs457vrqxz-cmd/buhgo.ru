"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Phone,
  ExternalLink,
  Bot,
  User,
  Trash2,
} from "lucide-react";
import {
  processMessage,
  handleQuickReply,
  getWelcomeMessage,
  saveChatHistory,
  loadChatHistory,
  clearChatHistory,
  type ChatMessage,
} from "@/lib/chatbot";

// Message bubble component
const MessageBubble = memo(function MessageBubble({
  message,
  onQuickReply,
}: {
  message: ChatMessage;
  onQuickReply: (reply: string) => void;
}) {
  const isBot = message.sender === "bot";

  return (
    <div className={cn("flex gap-2 mb-4", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className={cn("max-w-[85%]", isBot ? "" : "")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
            isBot
              ? "bg-muted text-foreground rounded-tl-md"
              : "bg-primary text-primary-foreground rounded-tr-md"
          )}
        >
          {message.text}
        </div>
        {isBot && message.quickReplies && message.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => onQuickReply(reply)}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
});

export function Chatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history on mount
  useEffect(() => {
    const history = loadChatHistory();
    if (history.length > 0) {
      setMessages(history);
    }
  }, []);

  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // Scroll to bottom when new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Show new message indicator
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      setHasNewMessage(true);
    }
  }, [messages.length, isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasNewMessage(false);

    // Add welcome message if no history
    if (messages.length === 0) {
      const welcome = getWelcomeMessage();
      setMessages([welcome]);
    }
  }, [messages.length]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const handleClearHistory = useCallback(() => {
    clearChatHistory();
    const welcome = getWelcomeMessage();
    setMessages([welcome]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    return userMsg;
  }, []);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue("");
    addUserMessage(userText);

    // Simulate typing delay
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = processMessage(userText);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 500 + Math.random() * 500);
  }, [inputValue, addUserMessage]);

  const handleQuickReplyClick = useCallback((reply: string) => {
    addUserMessage(reply);

    setIsTyping(true);
    setTimeout(() => {
      const result = handleQuickReply(reply);

      if ("action" in result) {
        // Handle actions
        setIsTyping(false);
        switch (result.action) {
          case "openForm":
            router.push(result.url || "/contacts#form");
            setIsMinimized(true);
            break;
          case "call":
            window.open(result.url, "_self");
            break;
          case "telegram":
            window.open(result.url, "_blank");
            break;
          case "navigate":
            router.push(result.url || "/");
            setIsMinimized(true);
            break;
        }

        // Add confirmation message
        const confirmMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          text: result.action === "call"
            ? "Открываю номер телефона..."
            : result.action === "telegram"
            ? "Открываю Telegram..."
            : "Перехожу на страницу...",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, confirmMsg]);
      } else {
        // Regular message response
        setMessages((prev) => [...prev, result]);
        setIsTyping(false);
      }
    }, 500 + Math.random() * 500);
  }, [addUserMessage, router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Floating button when chat is closed
  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center justify-center group"
        aria-label="Открыть чат"
      >
        <MessageCircle className="h-6 w-6" />
        {hasNewMessage && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-pulse" />
        )}
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-white text-foreground text-sm rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Есть вопрос?
        </span>
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all"
        >
          <Bot className="h-5 w-5" />
          <span className="text-sm font-medium">Открыть чат</span>
        </button>
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-muted text-foreground shadow-lg hover:bg-muted/80 transition-all flex items-center justify-center"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  // Full chat window
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Помощник BuhGo</h3>
            <p className="text-xs opacity-80">Онлайн • Отвечаем мгновенно</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
            title="Очистить историю"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleMinimize}
            className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
            title="Свернуть"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
            title="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onQuickReply={handleQuickReplyClick}
          />
        ))}
        {isTyping && (
          <div className="flex gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Quick contact buttons */}
      <div className="px-4 py-2 border-t border-b bg-muted/30 flex gap-2">
        <a
          href="tel:+79639639666"
          className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <Phone className="h-4 w-4" />
          Позвонить
        </a>
        <a
          href="https://t.me/buhgaltertech"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Telegram
        </a>
      </div>

      {/* Input */}
      <div className="p-3 flex gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          className="flex-1 h-10"
        />
        <Button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          size="icon"
          className="h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
