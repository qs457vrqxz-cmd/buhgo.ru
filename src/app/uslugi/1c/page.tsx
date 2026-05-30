"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckCircle2,
  Code,
  Settings,
  RefreshCw,
  Wrench,
  ArrowRight,
  Phone,
  Database,
  Link2,
} from "lucide-react";

const services = [
  {
    icon: Settings,
    title: "Настройка и внедрение",
    description: "Установка и первичная настройка программ 1С под ваш бизнес",
  },
  {
    icon: Code,
    title: "Доработка конфигураций",
    description: "Разработка дополнительных отчётов, обработок и модулей",
  },
  {
    icon: RefreshCw,
    title: "Обновление программ",
    description: "Регулярное обновление до актуальных версий",
  },
  {
    icon: Link2,
    title: "Интеграции",
    description: "Интеграция 1С с банками, маркетплейсами, CRM",
  },
  {
    icon: Database,
    title: "Перенос данных",
    description: "Миграция данных из других систем в 1С",
  },
  {
    icon: Wrench,
    title: "Техническая поддержка",
    description: "Оперативное решение проблем и консультации",
  },
];

const products = [
  "1С:Бухгалтерия",
  "1С:Зарплата и управление персоналом",
  "1С:Управление торговлей",
  "1С:Розница",
  "1С:Управление нашей фирмой",
  "1С:ERP",
];

export default function OneCPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
                  Сертифицированный специалист
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  1С программирование
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Настройка, доработка и интеграция программ 1С под ваши задачи.
                  Работаем со всеми популярными конфигурациями.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-bold text-primary">от 4 500 ₽</span>
                  <span className="text-muted-foreground">/час</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                    <Link href="/contacts#form">
                      Заказать услугу
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="tel:+79639639666">
                      <Phone className="mr-2 h-5 w-5" />
                      Позвонить
                    </a>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl shadow-2xl flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">1C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Что мы делаем</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">С какими продуктами работаем</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Имеем опыт работы со всеми популярными конфигурациями 1С
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {products.map((product) => (
                <Badge
                  key={product}
                  variant="secondary"
                  className="text-base py-2 px-4"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {product}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Нужна помощь с 1С?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Опишите задачу, и мы рассчитаем стоимость и сроки выполнения
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contacts#form">
                Описать задачу
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
