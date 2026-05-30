"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FileText,
  Users,
  MessageSquare,
  Phone,
  User,
  Settings,
  Newspaper,
  Handshake,
  Star,
  ArrowRight,
  Image,
  Cog,
  UserCog,
  Building2,
  BarChart3,
} from "lucide-react";
import { useAutoLogout } from "@/hooks/useAutoLogout";

interface UserData {
  email: string;
  name: string;
  role: string;
}

const adminSections = [
  {
    title: "Бухгалтеры",
    description: "Управление аккаунтами бухгалтеров",
    icon: UserCog,
    href: "/admin/accountants",
    color: "bg-indigo-500",
  },
  {
    title: "Клиенты",
    description: "Компании с личными кабинетами",
    icon: Building2,
    href: "/admin/clients",
    color: "bg-emerald-500",
  },
  {
    title: "Услуги",
    description: "Управление списком услуг на главной странице",
    icon: FileText,
    href: "/admin/services",
    color: "bg-blue-500",
  },
  {
    title: "Партнёры",
    description: "Редактирование партнёрских программ",
    icon: Handshake,
    href: "/admin/partners",
    color: "bg-green-500",
  },
  {
    title: "Отзывы клиентов",
    description: "Управление отзывами на главной странице",
    icon: Star,
    href: "/admin/testimonials",
    color: "bg-yellow-500",
  },
  {
    title: "Контакты",
    description: "Редактирование контактной информации",
    icon: Phone,
    href: "/admin/contacts",
    color: "bg-purple-500",
  },
  {
    title: "Обо мне",
    description: "Редактирование страницы 'Обо мне'",
    icon: User,
    href: "/admin/about",
    color: "bg-pink-500",
  },
  {
    title: "Изображения",
    description: "Управление изображениями на сайте",
    icon: Image,
    href: "/admin/images",
    color: "bg-cyan-500",
  },
  {
    title: "Блог",
    description: "Управление статьями блога",
    icon: Newspaper,
    href: "/admin/blog",
    color: "bg-orange-500",
  },
  {
    title: "CRM и Аналитика",
    description: "Заявки, A/B тесты и интеграции",
    icon: BarChart3,
    href: "/admin/crm",
    color: "bg-red-500",
  },
  {
    title: "Настройки",
    description: "Аналитика, email и интеграции",
    icon: Cog,
    href: "/admin/settings",
    color: "bg-gray-500",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto logout after 30 minutes of inactivity
  useAutoLogout({
    timeout: 30 * 60 * 1000, // 30 minutes
    enabled: true,
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.role === "admin") {
        setUser(parsed);
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
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

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />

      <main className="flex-1 py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Админ-панель</h1>
            <p className="text-muted-foreground">
              Управление контентом сайта BuhGo
            </p>
          </div>

          {/* Admin Sections Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section) => (
              <Card
                key={section.href}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <Link href={section.href}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center`}>
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {section.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full justify-between">
                      Перейти
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/" target="_blank">
                  Открыть сайт
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  Личный кабинет
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
