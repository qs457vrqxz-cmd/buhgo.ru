"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckCircle2,
  RefreshCw,
  FileSearch,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Phone,
} from "lucide-react";

const services = [
  "Анализ текущего состояния учёта",
  "Восстановление первичных документов",
  "Корректировка регистров бухгалтерского учёта",
  "Сверка с контрагентами",
  "Подготовка и сдача корректирующих деклараций",
  "Устранение расхождений с данными ФНС",
  "Восстановление кадрового учёта",
  "Подготовка пояснений для налоговой",
];

const situations = [
  {
    title: "Смена бухгалтера",
    description: "Предыдущий бухгалтер вёл учёт с ошибками или не сдавал отчётность",
  },
  {
    title: "Самостоятельное ведение",
    description: "Вели учёт сами и накопились ошибки",
  },
  {
    title: "Требование налоговой",
    description: "Пришло требование о предоставлении пояснений или документов",
  },
  {
    title: "Подготовка к проверке",
    description: "Необходимо привести учёт в порядок перед проверкой",
  },
];

const steps = [
  { step: 1, title: "Аудит", description: "Анализируем текущее состояние учёта и выявляем проблемы" },
  { step: 2, title: "План работ", description: "Составляем план восстановления и согласовываем сроки" },
  { step: 3, title: "Восстановление", description: "Исправляем ошибки, восстанавливаем документы" },
  { step: 4, title: "Отчётность", description: "Сдаём корректирующие декларации при необходимости" },
];

export default function VosstanovleniePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                  Исправим ошибки
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Восстановление бухгалтерского учёта
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Приведём в порядок запущенный учёт, исправим ошибки предыдущего бухгалтера,
                  восстановим утраченные документы и сдадим корректирующую отчётность.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-bold text-primary">от 10 000 ₽</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                    <Link href="/contacts#form">
                      Заказать восстановление
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="tel:+79639639666">
                      <Phone className="mr-2 h-5 w-5" />
                      Консультация
                    </a>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                    <RefreshCw className="h-24 w-24 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Situations */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Когда нужно восстановление</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Узнайте себя в одной из ситуаций? Мы поможем!
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {situations.map((item) => (
                <Card key={item.title} className="text-center">
                  <CardContent className="pt-6">
                    <AlertTriangle className="h-10 w-10 text-secondary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Что входит в услугу</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {services.map((service) => (
                <div
                  key={service}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Как проходит работа</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {steps.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Нужно восстановить учёт?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Оставьте заявку — проведём бесплатный аудит и рассчитаем стоимость
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contacts#form">
                Заказать аудит
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
