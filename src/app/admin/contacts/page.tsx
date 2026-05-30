"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  getContacts,
  saveContacts,
  resetToDefaults,
  type ContactInfo,
} from "@/lib/content";
import {
  Save,
  ArrowLeft,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

export default function AdminContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

    setContacts(getContacts());
    setIsLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contacts) return;

    setIsSaving(true);

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    saveContacts(contacts);
    toast.success("Контактная информация сохранена");
    setIsSaving(false);
  };

  const handleReset = () => {
    if (confirm("Вы уверены? Все изменения будут потеряны.")) {
      resetToDefaults("contacts");
      setContacts(getContacts());
      toast.success("Контакты восстановлены");
    }
  };

  if (isLoading || !contacts) {
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
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Контактная информация</h1>
                <p className="text-muted-foreground text-sm">
                  Редактирование контактных данных
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Контакты</CardTitle>
              <CardDescription>
                Эти данные отображаются в шапке, подвале и на странице контактов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      Телефон
                    </Label>
                    <Input
                      value={contacts.phone}
                      onChange={(e) => setContacts({ ...contacts, phone: e.target.value })}
                      placeholder="8 963 963 96 66"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={contacts.email}
                      onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                      placeholder="info@buhgalter.tech"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Адрес
                    </Label>
                    <Input
                      value={contacts.address}
                      onChange={(e) => setContacts({ ...contacts, address: e.target.value })}
                      placeholder="Москва"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Часы работы
                    </Label>
                    <Input
                      value={contacts.workingHours}
                      onChange={(e) => setContacts({ ...contacts, workingHours: e.target.value })}
                      placeholder="Пн-Пт: 09:00 - 17:00"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Социальные сети</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>ВКонтакте</Label>
                      <Input
                        value={contacts.vkLink}
                        onChange={(e) => setContacts({ ...contacts, vkLink: e.target.value })}
                        placeholder="https://vk.com/buhgalter.tech"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Telegram</Label>
                      <Input
                        value={contacts.telegramLink}
                        onChange={(e) => setContacts({ ...contacts, telegramLink: e.target.value })}
                        placeholder="https://t.me/buhgaltertech"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
