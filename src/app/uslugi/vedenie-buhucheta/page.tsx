"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckCircle2,
  FileText,
  Calculator,
  PieChart,
  Shield,
  ArrowRight,
  Phone,
} from "lucide-react";

const features = [
  "Ведение бухгалтерского и налогового учёта",
  "Расчёт и оптимизация налогов",
  "Подготовка и сдача отчётности в ФНС, СФР и РОССТАТ",
  "Работа с первичными документами",
  "Расчёт заработной платы и взносов",
  "Консультации по текущим вопросам",
  "Взаимодействие с контролирующими органами",
  "Подготовка документов для банков",
];

const steps = [
  {
    icon: FileText,
    title: "Сбор документов",
    description: "Собираем первичные документы: счета, акты, накладные, выписки банка",
  },
  {
    icon: Calculator,
    title: "Обработка данных",
    description: "Вносим данные в учётную систему, проводим сверку с контрагентами",
  },
  {
    icon: PieChart,
    title: "Расчёт налогов",
    description: "Рассчитываем налоги, ищем возможности для оптимизации",
  },
  {
    icon: Shield,
    title: "Сдача отчётности",
    description: "Формируем и сдаём отчётность во все контролирующие органы",
  },
];

export default function VedenieBuhuchetaPage() {
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
                  Основная услуга
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Ведение бухгалтерского учёта
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Полное ведение бухгалтерии для ИП и ООО на любой системе налогообложения:
                  ОСНО, УСН, патент, АУСН. Берём на себя всю рутину, вы занимаетесь бизнесом.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-bold text-primary">от 10 000 ₽</span>
                  <span className="text-muted-foreground">/месяц</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                    <Link href="/contacts#form">
                      Оставить заявку
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
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop"
                  alt="Бухгалтерский учёт"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Что входит в услугу</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={step.title} className="relative">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{step.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Оставьте заявку на бесплатную консультацию, и мы подберём оптимальный тариф для вашего бизнеса
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
