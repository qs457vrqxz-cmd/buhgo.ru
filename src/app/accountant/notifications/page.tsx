"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAccountantById, type Accountant } from "@/lib/users";
import {
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type Notification,
} from "@/lib/messages";
import {
  ArrowLeft,
  Bell,
  MessageSquare,
  FileText,
  Settings,
  AlertCircle,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
} from "lucide-react";

export default function AccountantNotificationsPage() {
  const router = useRouter();
  const [accountant, setAccountant] = useState<Accountant | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      loadNotifications(acc.id);
    }

    setIsLoading(false);
  }, [router]);

  const loadNotifications = (userId: string) => {
    setNotifications(getNotificationsByUser(userId));
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    if (accountant) {
      loadNotifications(accountant.id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (accountant) {
      markAllNotificationsAsRead(accountant.id);
      loadNotifications(accountant.id);
      toast.success("Все уведомления прочитаны");
    }
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    if (accountant) {
      loadNotifications(accountant.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case "document":
        return <FileText className="h-5 w-5 text-green-600" />;
      case "system":
        return <Settings className="h-5 w-5 text-gray-600" />;
      case "reminder":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} мин назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ч назад`;
    } else if (diffDays < 7) {
      return `${diffDays} дн назад`;
    }
    return date.toLocaleDateString("ru-RU");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/accountant">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Уведомления</h1>
                <p className="text-muted-foreground text-sm">
                  {unreadCount > 0 ? `${unreadCount} непрочитанных` : "Все прочитано"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Прочитать все
              </Button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Нет уведомлений</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all ${
                    !notification.read ? "border-primary/50 bg-primary/5" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {notification.text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {notification.link && (
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={notification.link}>
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(notification.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
