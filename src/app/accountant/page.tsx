"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  getClientsByAccountant,
  getAccountantById,
  type Client,
  type Accountant,
} from "@/lib/users";
import {
  getDocumentsByAccountant,
  documentTypeLabels,
  documentStatusLabels,
  documentStatusColors,
  type Document,
} from "@/lib/documents";
import {
  getConversationsByAccountant,
  getUnreadNotificationCount,
  type Conversation,
} from "@/lib/messages";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import {
  Users,
  FileText,
  MessageSquare,
  Bell,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AccountantDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [accountant, setAccountant] = useState<Accountant | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Auto logout after 30 minutes of inactivity
  useAutoLogout({
    timeout: 30 * 60 * 1000, // 30 minutes
    enabled: true,
  });

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

    setUser(parsed);

    // Load accountant data
    const acc = getAccountantById(parsed.id);
    if (acc) {
      setAccountant(acc);
      setClients(getClientsByAccountant(acc.id));
      setDocuments(getDocumentsByAccountant(acc.id));
      setConversations(getConversationsByAccountant(acc.id));
      setUnreadCount(getUnreadNotificationCount(acc.id));
    }

    setIsLoading(false);
  }, [router]);

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

  if (!user || !accountant) {
    return null;
  }

  const pendingDocs = documents.filter((d) => d.status === "pending").length;
  const requiresSignature = documents.filter((d) => d.status === "requires_signature").length;
  const totalUnreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const recentDocuments = documents
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 5);
  const recentConversations = conversations.slice(0, 5);

  return (
    <>
      <Header />

      <main className="flex-1 py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Добро пожаловать, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">
              {accountant.position || "Бухгалтер"} — Личный кабинет
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{clients.length}</p>
                    <p className="text-sm text-muted-foreground">Клиентов</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{documents.length}</p>
                    <p className="text-sm text-muted-foreground">Документов</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={pendingDocs > 0 ? "border-yellow-200 bg-yellow-50" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingDocs}</p>
                    <p className="text-sm text-muted-foreground">На проверке</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={totalUnreadMessages > 0 ? "border-red-200 bg-red-50" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalUnreadMessages}</p>
                    <p className="text-sm text-muted-foreground">Новых сообщений</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Button asChild className="h-auto py-4" variant="outline">
              <Link href="/accountant/clients" className="flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <span>Мои клиенты</span>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4" variant="outline">
              <Link href="/accountant/documents" className="flex flex-col items-center gap-2">
                <FileText className="h-6 w-6" />
                <span>Документы</span>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4" variant="outline">
              <Link href="/accountant/messages" className="flex flex-col items-center gap-2 relative">
                <MessageSquare className="h-6 w-6" />
                <span>Сообщения</span>
                {totalUnreadMessages > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                    {totalUnreadMessages}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button asChild className="h-auto py-4" variant="outline">
              <Link href="/accountant/notifications" className="flex flex-col items-center gap-2 relative">
                <Bell className="h-6 w-6" />
                <span>Уведомления</span>
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Documents */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Последние документы</CardTitle>
                  <CardDescription>Недавно загруженные документы</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/accountant/documents">
                    Все документы
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentDocuments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Нет документов
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {documentTypeLabels[doc.type]} • {doc.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <Badge className={documentStatusColors[doc.status]}>
                          {documentStatusLabels[doc.status]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Сообщения</CardTitle>
                  <CardDescription>Последняя переписка с клиентами</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/accountant/messages">
                    Все сообщения
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentConversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Нет сообщений
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentConversations.map((conv) => (
                      <Link
                        key={conv.id}
                        href={`/accountant/messages?conv=${conv.id}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors block"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{conv.clientName}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {conv.lastMessage || "Нет сообщений"}
                            </p>
                          </div>
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-red-500">{conv.unreadCount}</Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Clients Overview */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Мои клиенты</CardTitle>
                <CardDescription>Компании на обслуживании</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/accountant/clients">
                  Все клиенты
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Нет назначенных клиентов
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.slice(0, 6).map((client) => (
                    <div
                      key={client.id}
                      className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{client.companyName}</p>
                          <p className="text-xs text-muted-foreground truncate">{client.name}</p>
                          {client.tariff && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {client.tariff}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
