"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckCircle2,
  CreditCard,
  Gift,
  ArrowRight,
  Phone,
  Shield,
  Zap,
} from "lucide-react";

const banks = [
  {
    name: "Альфа-Банк",
    bonus: "500 ₽",
    features: ["Бесплатное открытие", "Бесплатное обслуживание 1 мес", "Интеграция с 1С"],
    color: "#EF3124",
  },
  {
    name: "Т-Банк",
    bonus: "500 ₽",
    features: ["Открытие за 5 минут", "Бесплатная бухгалтерия", "Cashback"],
    color: "#FFDD2D",
  },
  {
    name: "Райффайзенбанк",
    bonus: "500 ₽",
    features: ["Надёжность", "Валютные операции", "API для интеграции"],
    color: "#FFE600",
  },
  {
    name: "СберБанк",
    bonus: "500 ₽",
    features: ["Широкая сеть", "Зарплатный проект", "Кредитование"],
    color: "#21A038",
  },
];

const advantages = [
  {
    icon: Gift,
    title: "Бонус 500 ₽",
    description: "При открытии счёта через нас вы получаете бонус на счёт",
  },
  {
    icon: Zap,
    title: "Быстрое открытие",
    description: "Счёт будет открыт в течение 1-2 рабочих дней",
  },
  {
    icon: Shield,
    title: "Помощь с документами",
    description: "Поможем собрать и оформить все необходимые документы",
  },
];

export default function RaschetnySchetPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-green-500/10 text-green-600 hover:bg-green-500/20">
                  Бесплатно + бонус
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Открытие расчётного счёта
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Поможем открыть расчётный счёт в надёжном банке с выгодными условиями.
                  При открытии через нас — бонус 500 ₽ на счёт!
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-bold text-green-600">Бесплатно</span>
                  <Badge className="bg-secondary text-secondary-foreground">
                    + 500 ₽ бонус
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                    <Link href="/contacts#form">
                      Открыть счёт
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
                  <div className="w-64 h-40 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-2xl flex items-center justify-center">
                    <CreditCard className="h-20 w-20 text-white/80" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {advantages.map((item) => (
                <Card key={item.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Banks */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Банки-партнёры</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Работаем с ведущими банками России. Поможем выбрать оптимальный вариант под ваши задачи.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {banks.map((bank) => (
                <Card key={bank.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div
                      className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: `${bank.color}20` }}
                    >
                      <CreditCard className="h-6 w-6" style={{ color: bank.color }} />
                    </div>
                    <CardTitle className="text-lg">{bank.name}</CardTitle>
                    <Badge className="bg-green-500 mx-auto">Бонус {bank.bonus}</Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {bank.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4" variant="outline" asChild>
                      <Link href="/contacts#form">Открыть счёт</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Откройте счёт с бонусом</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Оставьте заявку, и мы поможем выбрать лучший банк для вашего бизнеса
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contacts#form">
                Получить консультацию
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
