"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { getContacts, type ContactInfo } from "@/lib/content";
// Используем Netlify Forms вместо email API
// import { sendContactForm } from "@/lib/email";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    inn: "",
    email: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.inn.trim()) {
      toast.error("Заполните обязательные поля (Имя, Телефон, ИНН)");
      return;
    }

    // Validate INN format (10 or 12 digits)
    const innDigits = formData.inn.replace(/\D/g, '');
    if (innDigits.length !== 10 && innDigits.length !== 12) {
      toast.error("ИНН должен содержать 10 или 12 цифр");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Netlify Forms
      const netlifyFormData = new URLSearchParams();
      netlifyFormData.append("form-name", "contact");
      netlifyFormData.append("name", formData.name);
      netlifyFormData.append("phone", formData.phone);
      netlifyFormData.append("inn", formData.inn);
      netlifyFormData.append("email", formData.email || '');
      netlifyFormData.append("service", formData.service || '');
      netlifyFormData.append("message", formData.message || '');
      netlifyFormData.append("source", "Страница контактов");

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: netlifyFormData.toString(),
      });

      if (response.ok) {
        toast.success("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
        setFormData({ name: "", phone: "", inn: "", email: "", service: "", message: "" });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Form error:", error);
      toast.error("Ошибка отправки. Попробуйте ещё раз или позвоните нам.");
    }

    setIsSubmitting(false);
  };

  if (!contacts) {
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

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Контакты</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Свяжитесь с нами любым удобным способом.
              Мы всегда готовы ответить на ваши вопросы и помочь с бухгалтерией.
            </p>
          </div>
        </section>

        {/* Contact Info + Form */}
        <section className="py-16" id="form">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Свяжитесь с нами</h2>

                <div className="space-y-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Телефон</h3>
                        <a
                          href={`tel:${contacts.phone.replace(/\s/g, '')}`}
                          className="text-lg text-primary hover:underline"
                        >
                          {contacts.phone}
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">
                          Для справок и консультаций
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <a
                          href={`mailto:${contacts.email}`}
                          className="text-lg text-primary hover:underline"
                        >
                          {contacts.email}
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">
                          Для отправки документов и запросов
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Адрес</h3>
                        <p className="text-lg">{contacts.address}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Работаем удалённо по всей России
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Режим работы</h3>
                        <p className="text-lg">{contacts.workingHours}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ответим в течение 15 минут в рабочее время
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Social Links */}
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Мы в социальных сетях</h3>
                  <div className="flex gap-3">
                    <a
                      href={contacts.vkLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.147-1.744-1.147-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.743c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.716-.576.716z"/>
                      </svg>
                    </a>
                    <a
                      href={contacts.telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Оставить заявку</CardTitle>
                  <CardDescription>
                    Заполните форму и мы свяжемся с вами в ближайшее время
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ваше имя *</Label>
                      <Input
                        id="name"
                        placeholder="Иван Иванов"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+7 (999) 999-99-99"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inn">ИНН *</Label>
                        <Input
                          id="inn"
                          placeholder="1234567890"
                          value={formData.inn}
                          onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@mail.ru"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Интересующая услуга</Label>
                      <select
                        id="service"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Выберите услугу</option>
                        <option value="accounting">Ведение бухгалтерского учёта</option>
                        <option value="zero">Нулевая отчётность</option>
                        <option value="registration">Регистрация ИП/ООО</option>
                        <option value="liquidation">Ликвидация ИП/ООО</option>
                        <option value="account">Открытие расчётного счёта</option>
                        <option value="hr">Кадровый учёт</option>
                        <option value="1c">1С программирование</option>
                        <option value="consultation">Консультация</option>
                        <option value="other">Другое</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Сообщение</Label>
                      <Textarea
                        id="message"
                        placeholder="Опишите вашу ситуацию или задайте вопрос"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary/90"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Отправка..."
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Отправить заявку
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Нажимая кнопку, вы соглашаетесь с{" "}
                      <Link href="/privacy" className="underline hover:text-primary">
                        политикой конфиденциальности
                      </Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section (placeholder) */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Как нас найти</h2>
            <div className="aspect-[2/1] lg:aspect-[3/1] rounded-2xl overflow-hidden bg-muted flex items-center justify-center border">
              <div className="text-center p-8">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Мы работаем удалённо</p>
                <p className="text-muted-foreground">
                  Обслуживаем клиентов по всей России через интернет
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
