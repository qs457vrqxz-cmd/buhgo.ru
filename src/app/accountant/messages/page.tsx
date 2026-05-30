"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  getClientsByAccountant,
  getAccountantById,
  getClientById,
  type Client,
  type Accountant,
} from "@/lib/users";
import {
  getConversationsByAccountant,
  getMessagesByConversation,
  getOrCreateConversation,
  sendMessage,
  markMessagesAsRead,
  type Conversation,
  type Message,
  type MessageAttachment,
} from "@/lib/messages";
import { ChatFileUpload, MessageAttachments } from "@/components/ChatFileUpload";
import {
  ArrowLeft,
  Building2,
  MessageSquare,
  Send,
  Search,
  User,
  Check,
  CheckCheck,
} from "lucide-react";

export default function AccountantMessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const convParam = searchParams.get("conv");
  const clientParam = searchParams.get("client");

  const [accountant, setAccountant] = useState<Accountant | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback((accountantId: string) => {
    setConversations(getConversationsByAccountant(accountantId));
  }, []);

  const loadMessages = useCallback((convId: string, accountantId: string) => {
    setMessages(getMessagesByConversation(convId));
    markMessagesAsRead(convId, accountantId);
    loadConversations(accountantId);
  }, [loadConversations]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(userData);
    if (parsed.role !== "accountant") {
      router.push("/login");
      return;
    }

    const acc = getAccountantById(parsed.id);
    if (acc) {
      setAccountant(acc);
      const clientsList = getClientsByAccountant(acc.id);
      setClients(clientsList);
      loadConversations(acc.id);

      // Open conversation from URL params
      if (clientParam) {
        const client = getClientById(clientParam);
        if (client) {
          const conv = getOrCreateConversation(client.id, client.companyName, acc.id, acc.name);
          setSelectedConv(conv);
          loadMessages(conv.id, acc.id);
        }
      }
    }

    setIsLoading(false);
  }, [router, clientParam, loadMessages, loadConversations]);

  useEffect(() => {
    if (convParam && accountant) {
      const conv = conversations.find((c) => c.id === convParam);
      if (conv) {
        setSelectedConv(conv);
        loadMessages(conv.id, accountant.id);
      }
    }
  }, [convParam, conversations, accountant, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConv(conv);
    if (accountant) {
      loadMessages(conv.id, accountant.id);
    }
  };

  const handleStartConversation = (client: Client) => {
    if (!accountant) return;
    const conv = getOrCreateConversation(client.id, client.companyName, accountant.id, accountant.name);
    loadConversations(accountant.id);
    setSelectedConv(conv);
    loadMessages(conv.id, accountant.id);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConv || !accountant) return;

    sendMessage(
      selectedConv.id,
      accountant.id,
      accountant.name,
      "accountant",
      selectedConv.clientId,
      newMessage.trim(),
      attachments.length > 0 ? attachments : undefined
    );

    setNewMessage("");
    setAttachments([]);
    loadMessages(selectedConv.id, accountant.id);
    loadConversations(accountant.id);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Сегодня";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера";
    }
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="flex-1 py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/accountant">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Сообщения</h1>
              <p className="text-muted-foreground text-sm">
                Переписка с клиентами
              </p>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-420px)] min-h-[350px]">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      {conversations.length === 0 ? (
                        <div>
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Нет активных чатов</p>
                          <p className="text-xs mt-1">Выберите клиента для начала переписки</p>
                        </div>
                      ) : (
                        "Чаты не найдены"
                      )}
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        className={`w-full p-4 text-left hover:bg-muted transition-colors border-b ${
                          selectedConv?.id === conv.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm truncate">{conv.clientName}</p>
                              {conv.lastMessageAt && (
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(conv.lastMessageAt)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {conv.lastMessage || "Нет сообщений"}
                            </p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-red-500 h-5 min-w-[20px] flex items-center justify-center">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </ScrollArea>

                {/* New Chat with Client */}
                {clients.length > 0 && (
                  <div className="p-3 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Начать новый чат:</p>
                    <div className="flex flex-wrap gap-1">
                      {clients
                        .filter((c) => !conversations.some((conv) => conv.clientId === c.id))
                        .slice(0, 3)
                        .map((client) => (
                          <Button
                            key={client.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartConversation(client)}
                            className="text-xs"
                          >
                            + {client.companyName.slice(0, 15)}...
                          </Button>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Messages Area */}
            <Card className="lg:col-span-2 flex flex-col">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{selectedConv.clientName}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          Клиент
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-[calc(100vh-500px)] min-h-[250px] p-4">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <div className="text-center">
                            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Нет сообщений</p>
                            <p className="text-xs">Напишите первое сообщение</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.senderRole === "accountant" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                  msg.senderRole === "accountant"
                                    ? "bg-primary text-primary-foreground rounded-br-md"
                                    : "bg-muted rounded-bl-md"
                                }`}
                              >
                                {msg.attachments && msg.attachments.length > 0 && (
                                  <div className="mb-2">
                                    <MessageAttachments attachments={msg.attachments} isOwn={msg.senderRole === "accountant"} />
                                  </div>
                                )}
                                {msg.text && <p className="text-sm">{msg.text}</p>}
                                <div className={`flex items-center gap-1 mt-1 ${
                                  msg.senderRole === "accountant" ? "justify-end" : ""
                                }`}>
                                  <span className={`text-xs ${
                                    msg.senderRole === "accountant" ? "text-primary-foreground/70" : "text-muted-foreground"
                                  }`}>
                                    {formatTime(msg.createdAt)}
                                  </span>
                                  {msg.senderRole === "accountant" && (
                                    msg.readAt ? (
                                      <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                                    ) : (
                                      <Check className="h-3 w-3 text-primary-foreground/70" />
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-3 sm:p-4 border-t">
                    <ChatFileUpload
                      attachments={attachments}
                      setAttachments={setAttachments}
                    />
                    <form onSubmit={handleSendMessage} className="flex gap-2 mt-2">
                      <Input
                        placeholder="Введите сообщение..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!newMessage.trim() && attachments.length === 0}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Выберите чат для просмотра сообщений</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
