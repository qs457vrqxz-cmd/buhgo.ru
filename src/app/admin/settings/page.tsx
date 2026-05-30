"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  BarChart3,
  Mail,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Check environment variables status
  const [gaConfigured, setGaConfigured] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== "admin") {
      router.push("/login");
      return;
    }

    // Check if environment variables are set
    setGaConfigured(!!process.env.NEXT_PUBLIC_GA_ID);
    setEmailConfigured(!!process.env.NEXT_PUBLIC_WEB3FORMS_KEY || !!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID);

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

  return (
    <>
      <Header />

      <main className="flex-1 py-8 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Настройки интеграций</h1>
              <p className="text-muted-foreground text-sm">
                Аналитика, отправка email и другие интеграции
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Google Analytics */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Google Analytics 4</CardTitle>
                      <CardDescription>Отслеживание посетителей сайта</CardDescription>
                    </div>
                  </div>
                  {gaConfigured ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Настроено
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="h-3 w-3 mr-1" />
                      Не настроено
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Как настроить:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Перейдите в <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics</a></li>
                    <li>Создайте новый ресурс GA4</li>
                    <li>Скопируйте Measurement ID (G-XXXXXXXXXX)</li>
                    <li>Добавьте в файл <code className="bg-background px-1 py-0.5 rounded">.env.local</code>:</li>
                  </ol>
                  <pre className="mt-2 p-3 bg-background rounded text-xs overflow-x-auto">
                    NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
                  </pre>
                </div>
                <Button variant="outline" asChild>
                  <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
                    Открыть Google Analytics
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Email Service */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Отправка форм на Email</CardTitle>
                      <CardDescription>Web3Forms / EmailJS</CardDescription>
                    </div>
                  </div>
                  {emailConfigured ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Настроено
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="h-3 w-3 mr-1" />
                      Демо-режим
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Web3Forms (рекомендуется):</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Перейдите на <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Web3Forms</a></li>
                    <li>Введите ваш email для получения ключа</li>
                    <li>Скопируйте Access Key</li>
                    <li>Добавьте в файл <code className="bg-background px-1 py-0.5 rounded">.env.local</code>:</li>
                  </ol>
                  <pre className="mt-2 p-3 bg-background rounded text-xs overflow-x-auto">
                    NEXT_PUBLIC_WEB3FORMS_KEY=your-access-key
                  </pre>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer">
                      Web3Forms
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer">
                      EmailJS
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <strong className="text-yellow-800">Примечание:</strong> В демо-режиме формы работают,
                  но письма не отправляются. Настройте интеграцию для реальной отправки.
                </div>
              </CardContent>
            </Card>

            {/* Yandex Metrika */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Яндекс.Метрика</CardTitle>
                      <CardDescription>Уже подключена (ID: 89113684)</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Активна
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Яндекс.Метрика уже настроена и отслеживает посещения сайта.
                  Для просмотра статистики перейдите в кабинет Яндекс.Метрики.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="https://metrika.yandex.ru/dashboard?id=89113684" target="_blank" rel="noopener noreferrer">
                    Открыть Яндекс.Метрику
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Environment Variables Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 text-blue-900">Как применить настройки</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Создайте файл <code className="bg-blue-100 px-1 py-0.5 rounded">.env.local</code> в корне проекта</li>
                  <li>Добавьте необходимые переменные</li>
                  <li>Перезапустите сервер разработки</li>
                  <li>Для продакшена добавьте переменные в настройки хостинга</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
