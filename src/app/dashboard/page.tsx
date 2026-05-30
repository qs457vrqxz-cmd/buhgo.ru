"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  getClientById,
  getAccountantById,
  type Client,
  type Accountant,
} from "@/lib/users";
import {
  getDocumentsByClient,
  documentTypeLabels,
  documentStatusLabels,
  documentStatusColors,
  type Document,
} from "@/lib/documents";
import {
  getConversationsByClient,
  getMessagesByConversation,
  getOrCreateConversation,
  sendMessage,
  markMessagesAsRead,
  getUnreadNotificationCount,
  type Conversation,
  type Message,
  type MessageAttachment,
} from "@/lib/messages";
import { NotificationSettings } from "@/components/NotificationSettings";
import { ChatFileUpload, MessageAttachments } from "@/components/ChatFileUpload";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import {
  User,
  FileText,
  MessageSquare,
  Upload,
  Settings,
  LogOut,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Download,
  Bell,
  Building2,
  Send,
  Check,
  CheckCheck,
  PenLine,
  ArrowLeft,
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  companyName?: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  // Auto logout after 30 minutes of inactivity
  useAutoLogout({
    timeout: 30 * 60 * 1000, // 30 minutes
    enabled: true,
  });
  const [client, setClient] = useState<Client | null>(null);
  const [accountant, setAccountant] = useState<Accountant | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);

      // Redirect accountant to their dashboard
      if (parsed.role === "accountant") {
        router.push("/accountant");
        return;
      }

      // Load client data
      if (parsed.role === "client" && parsed.id) {
        const clientData = getClientById(parsed.id);
        if (clientData) {
          setClient(clientData);
          setDocuments(getDocumentsByClient(clientData.id));
          setConversations(getConversationsByClient(clientData.id));
          setUnreadCount(getUnreadNotificationCount(clientData.id));

          // Load accountant info
          if (clientData.assignedAccountant) {
            setAccountant(getAccountantById(clientData.assignedAccountant) || null);
          }
        }
      }
    } else {
      router.push("/login");
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = (convId: string) => {
    setMessages(getMessagesByConversation(convId));
    if (client) {
      markMessagesAsRead(convId, client.id);
      setConversations(getConversationsByClient(client.id));
    }
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConv(conv);
    loadMessages(conv.id);
  };

  const handleStartChat = () => {
    if (!client || !accountant) return;
    const conv = getOrCreateConversation(
      client.id,
      client.companyName,
      accountant.id,
      accountant.name
    );
    setConversations(getConversationsByClient(client.id));
    setSelectedConv(conv);
    loadMessages(conv.id);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConv || !client) return;

    sendMessage(
      selectedConv.id,
      client.id,
      client.name,
      "client",
      selectedConv.accountantId,
      newMessage.trim(),
      attachments.length > 0 ? attachments : undefined
    );

    setNewMessage("");
    setAttachments([]);
    loadMessages(selectedConv.id);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Вы вышли из системы");
    router.push("/");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  // Stats
  const pendingDocs = documents.filter((d) => d.status === "pending").length;
  const requiresSignature = documents.filter((d) => d.status === "requires_signature").length;
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

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

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />

      <main className="flex-1 py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Личный кабинет</h1>
              <p className="text-muted-foreground">
                Добро пожаловать, {user.name}!
                {client?.companyName && ` • ${client.companyName}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user.role === "admin" && (
                <Button variant="outline" asChild>
                  <Link href="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    Админ-панель
                  </Link>
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{documents.length}</p>
                    <p className="text-sm text-muted-foreground">Документов</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={requiresSignature > 0 ? "border-blue-200 bg-blue-50" : ""}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <PenLine className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{requiresSignature}</p>
                    <p className="text-sm text-muted-foreground">Требует подписи</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={pendingDocs > 0 ? "border-yellow-200 bg-yellow-50" : ""}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingDocs}</p>
                    <p className="text-sm text-muted-foreground">На рассмотрении</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={totalUnread > 0 ? "border-red-200 bg-red-50" : ""}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalUnread}</p>
                    <p className="text-sm text-muted-foreground">Новых сообщений</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="messages" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1">
              <TabsTrigger value="messages" className="relative flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">Сообщения</span>
                <span className="xs:hidden text-[10px]">Чат</span>
                {totalUnread > 0 && (
                  <Badge className="absolute -top-1 -right-1 sm:static sm:ml-1 h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] text-[10px] sm:text-xs bg-red-500 p-0 flex items-center justify-center">
                    {totalUnread}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm">
                <FileText className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">Документы</span>
                <span className="xs:hidden text-[10px]">Док.</span>
              </TabsTrigger>
              <TabsTrigger value="accountant" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Бухгалтер</span>
                <span className="sm:hidden text-[10px]">Бух.</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Профиль</span>
                <span className="sm:hidden text-[10px]">Проф.</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Настройки</span>
                <span className="sm:hidden text-[10px]">Настр.</span>
              </TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Мои документы</CardTitle>
                  <CardDescription>Документы от вашего бухгалтера</CardDescription>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Нет документов</p>
                      <p className="text-sm">Ваш бухгалтер ещё не загрузил документы</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{doc.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {documentTypeLabels[doc.type]} • {formatDate(doc.uploadedAt)}
                                {doc.description && ` • ${doc.description}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={documentStatusColors[doc.status]}>
                              {documentStatusLabels[doc.status]}
                            </Badge>
                            {doc.fileUrl && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={doc.fileUrl} download={doc.fileName || doc.name}>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card className="h-[calc(100vh-300px)] min-h-[400px] max-h-[600px] flex flex-col">
                <CardHeader className="border-b pb-3 sm:pb-4 px-3 sm:px-6">
                  <div className="flex items-center justify-between gap-2">
                    {selectedConv ? (
                      <>
                        <div className="flex items-center gap-2 min-w-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => setSelectedConv(null)}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          <div className="min-w-0">
                            <CardTitle className="text-base sm:text-lg truncate">{selectedConv.accountantName}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Бухгалтер</CardDescription>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <CardTitle className="text-base sm:text-lg">Сообщения</CardTitle>
                          <CardDescription className="text-xs sm:text-sm">Переписка с бухгалтером</CardDescription>
                        </div>
                        {accountant && conversations.length === 0 && (
                          <Button onClick={handleStartChat} size="sm">
                            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Начать чат</span>
                            <span className="sm:hidden">Чат</span>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  {!accountant ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground p-4">
                      <div className="text-center">
                        <User className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                        <p className="text-sm sm:text-base">Бухгалтер не назначен</p>
                        <p className="text-xs sm:text-sm">Свяжитесь с администратором</p>
                      </div>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground p-4">
                      <div className="text-center">
                        <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                        <p className="text-sm sm:text-base">Нет сообщений</p>
                        <p className="text-xs sm:text-sm">Начните чат с бухгалтером</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      {/* Messages list */}
                      <ScrollArea className="flex-1 p-3 sm:p-4">
                        {selectedConv ? (
                          <div className="space-y-3 sm:space-y-4">
                            {messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.senderRole === "client" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 ${
                                    msg.senderRole === "client"
                                      ? "bg-primary text-primary-foreground rounded-br-md"
                                      : "bg-muted rounded-bl-md"
                                  }`}
                                >
                                  {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mb-2">
                                      <MessageAttachments attachments={msg.attachments} isOwn={msg.senderRole === "client"} />
                                    </div>
                                  )}
                                  {msg.text && <p className="text-sm break-words">{msg.text}</p>}
                                  <div className={`flex items-center gap-1 mt-1 ${
                                    msg.senderRole === "client" ? "justify-end" : ""
                                  }`}>
                                    <span className={`text-[10px] sm:text-xs ${
                                      msg.senderRole === "client" ? "text-primary-foreground/70" : "text-muted-foreground"
                                    }`}>
                                      {formatTime(msg.createdAt)}
                                    </span>
                                    {msg.senderRole === "client" && (
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
                        ) : (
                          <div className="space-y-2">
                            {conversations.map((conv) => (
                              <button
                                key={conv.id}
                                onClick={() => handleSelectConversation(conv)}
                                className="w-full p-3 text-left rounded-lg hover:bg-muted active:bg-muted/80 transition-colors flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <User className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-sm truncate">{conv.accountantName}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {conv.lastMessage || "Нет сообщений"}
                                    </p>
                                  </div>
                                </div>
                                {conv.unreadCount > 0 && (
                                  <Badge className="bg-red-500 shrink-0">{conv.unreadCount}</Badge>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </ScrollArea>

                      {/* Message input */}
                      {selectedConv && (
                        <div className="p-2 sm:p-3 border-t bg-background">
                          <ChatFileUpload
                            attachments={attachments}
                            setAttachments={setAttachments}
                          />
                          <form onSubmit={handleSendMessage} className="flex gap-2 mt-2">
                            <Input
                              placeholder="Сообщение..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="flex-1 h-10 text-sm"
                            />
                            <Button
                              type="submit"
                              disabled={!newMessage.trim() && attachments.length === 0}
                              size="icon"
                              className="h-10 w-10 shrink-0"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accountant Tab */}
            <TabsContent value="accountant">
              <Card>
                <CardHeader>
                  <CardTitle>Ваш бухгалтер</CardTitle>
                  <CardDescription>Информация о назначенном бухгалтере</CardDescription>
                </CardHeader>
                <CardContent>
                  {accountant ? (
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-primary">
                          {accountant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold">{accountant.name}</h3>
                          {accountant.position && (
                            <p className="text-muted-foreground">{accountant.position}</p>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Email:</span>{" "}
                            <a href={`mailto:${accountant.email}`} className="text-primary hover:underline">
                              {accountant.email}
                            </a>
                          </p>
                          {accountant.phone && (
                            <p>
                              <span className="text-muted-foreground">Телефон:</span>{" "}
                              <a href={`tel:${accountant.phone}`} className="text-primary hover:underline">
                                {accountant.phone}
                              </a>
                            </p>
                          )}
                        </div>
                        <Button onClick={handleStartChat}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Написать сообщение
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Бухгалтер не назначен</p>
                      <p className="text-sm mt-2">
                        Свяжитесь с администратором для назначения бухгалтера
                      </p>
                      <Button variant="outline" asChild className="mt-4">
                        <Link href="/contacts">Связаться с нами</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Профиль компании</CardTitle>
                  <CardDescription>Ваши данные</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Компания</p>
                        <p className="font-medium">{client?.companyName || user.company || "—"}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Контактное лицо</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Телефон</p>
                        <p className="font-medium">{client?.phone || user.phone || "—"}</p>
                      </div>
                      {client?.inn && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">ИНН</p>
                          <p className="font-medium">{client.inn}</p>
                        </div>
                      )}
                      {client?.tariff && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Тариф</p>
                          <p className="font-medium">{client.tariff}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <NotificationSettings />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
}
