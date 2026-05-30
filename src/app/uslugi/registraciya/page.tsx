"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckCircle2,
  Building2,
  User,
  FileText,
  ArrowRight,
  Phone,
  Clock,
} from "lucide-react";

const ipFeatures = [
  "Подбор кодов ОКВЭД",
  "Выбор системы налогообложения",
  "Подготовка заявления Р21001",
  "Подача документов в ФНС",
  "Получение листа записи ЕГРИП",
  "Консультация по дальнейшим шагам",
];

const oooFeatures = [
  "Подготовка устава и решения",
  "Подбор юридического адреса",
  "Формирование уставного капитала",
  "Подача документов в ФНС",
  "Получение учредительных документов",
  "Изготовление печати (опционально)",
];

const steps = [
  { step: 1, title: "Консультация", description: "Обсуждаем вид деятельности и выбираем оптимальную форму" },
  { step: 2, title: "Подготовка", description: "Готовим все необходимые документы" },
  { step: 3, title: "Подача", description: "Подаём документы в налоговую" },
  { step: 4, title: "Получение", description: "Получаете готовые документы через 3 рабочих дня" },
];

export default function RegistraciyaPage() {
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
                  Быстро и бесплатно
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Регистрация ИП и ООО
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Поможем зарегистрировать бизнес за 3 рабочих дня.
                  Подготовим все документы, подберём систему налогообложения и коды ОКВЭД.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-bold text-green-600">Бесплатно</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    при заключении договора на обслуживание
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                    <Link href="/contacts#form">
                      Зарегистрировать бизнес
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
              <div className="hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
                  alt="Регистрация бизнеса"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* IP vs OOO */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Что выбрать: ИП или ООО?</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* IP */}
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Индивидуальный предприниматель</CardTitle>
                  <CardDescription>Подходит для малого бизнеса и фрилансеров</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Госпошлина</span>
                      <span className="font-semibold">0 ₽ (онлайн)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Срок регистрации</span>
                      <span className="font-semibold">3 рабочих дня</span>
                    </div>
                    <ul className="space-y-2 pt-4">
                      {ipFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4" asChild>
                      <Link href="/contacts#form">Зарегистрировать ИП</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* OOO */}
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Общество с ограниченной ответственностью</CardTitle>
                  <CardDescription>Для бизнеса с партнёрами или инвестициями</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Госпошлина</span>
                      <span className="font-semibold">0 ₽ (онлайн)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Срок регистрации</span>
                      <span className="font-semibold">3 рабочих дня</span>
                    </div>
                    <ul className="space-y-2 pt-4">
                      {oooFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4" asChild>
                      <Link href="/contacts#form">Зарегистрировать ООО</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Как проходит регистрация</h2>
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
            <h2 className="text-3xl font-bold mb-4">Готовы начать бизнес?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Бесплатная регистрация при заключении договора на бухгалтерское обслуживание
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contacts#form">
                Оставить заявку
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
