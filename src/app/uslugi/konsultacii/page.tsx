"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";
import {
  MessageSquare,
  CheckCircle2,
  Phone,
  ArrowRight,
  Clock,
  FileText,
  Calculator,
  Scale,
  Users,
  Building2,
} from "lucide-react";

const consultationTopics = [
  {
    icon: Calculator,
    title: "Налоговые вопросы",
    description: "Оптимизация налогов, выбор системы налогообложения, расчёт налоговой нагрузки",
  },
  {
    icon: FileText,
    title: "Бухгалтерский учёт",
    description: "Вопросы по ведению учёта, первичным документам, отчётности",
  },
  {
    icon: Building2,
    title: "Регистрация бизнеса",
    description: "Выбор формы ведения бизнеса: ИП или ООО, ОКВЭД, юридический адрес",
  },
  {
    icon: Users,
    title: "Кадровые вопросы",
    description: "Трудовые договоры, расчёт зарплаты, отчётность за сотрудников",
  },
  {
    icon: Scale,
    title: "Проверки и споры",
    description: "Подготовка к налоговым проверкам, работа с требованиями ФНС",
  },
  {
    icon: Clock,
    title: "Срочные вопросы",
    description: "Решение срочных бухгалтерских и налоговых вопросов в кратчайшие сроки",
  },
];

const benefits = [
  "Ответы на любые вопросы по бухгалтерии и налогам",
  "Практические рекомендации для вашей ситуации",
  "Анализ документов и расчётов",
  "Помощь в принятии решений",
  "Экономия времени и денег",
  "Снижение налоговых рисков",
];

const formats = [
  {
    title: "Онлайн-консультация",
    description: "По видеосвязи или в мессенджере",
    duration: "30-60 минут",
    price: "от 5 000 ₽",
  },
  {
    title: "Телефонная консультация",
    description: "Быстрый ответ на ваш вопрос",
    duration: "15-30 минут",
    price: "от 5 000 ₽",
  },
  {
    title: "Письменная консультация",
    description: "Развёрнутый ответ с рекомендациями",
    duration: "1-2 рабочих дня",
    price: "от 5 000 ₽",
  },
];

export default function KonsultaciiPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-primary hover:underline">
                Главная
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">Консультации</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <AnimatedSection animation="slideUp">
                <Badge className="mb-4 bg-primary/10 text-primary">
                  Экспертная помощь
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  Консультации по бухгалтерии и налогам
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground mb-6">
                  Получите профессиональные ответы на вопросы по бухгалтерскому учёту,
                  налогообложению и ведению бизнеса от опытного специалиста.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                    <Link href="/contacts#form">
                      Записаться на консультацию
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="tel:+79639639666">
                      <Phone className="mr-2 h-5 w-5" />
                      8 963 963 96 66
                    </a>
                  </Button>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slideLeft" delay={200}>
                <div className="bg-white rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Консультация</h2>
                      <p className="text-muted-foreground">Ответы на ваши вопросы</p>
                    </div>
                  </div>
                  <div className="text-center py-6 bg-primary/5 rounded-xl mb-4">
                    <span className="text-sm text-muted-foreground">от </span>
                    <span className="text-4xl font-bold text-primary">5 000</span>
                    <span className="text-lg text-muted-foreground"> руб</span>
                    <p className="text-sm text-muted-foreground mt-1">любой формат консультации</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Онлайн, телефон или письменно
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Любые виды вопросов
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Практические рекомендации
                    </li>
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Topics */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Темы консультаций</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Консультируем по широкому спектру вопросов бухгалтерского и налогового учёта
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultationTopics.map((topic, index) => (
                <AnimatedSection key={topic.title} animation="slideUp" delay={index * 100}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <topic.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Formats */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Форматы консультаций</h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {formats.map((format, index) => (
                <AnimatedSection key={format.title} animation="scale" delay={index * 100}>
                  <Card className="h-full text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{format.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{format.description}</p>
                      <div className="text-sm text-muted-foreground mb-2">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {format.duration}
                      </div>
                      <div className="text-xl font-bold text-primary">{format.price}</div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Что вы получите</h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {benefits.map((benefit, index) => (
                <AnimatedSection key={benefit} animation="slideUp" delay={index * 50}>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection animation="slideUp">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Записаться на консультацию
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                Оставьте заявку, и мы свяжемся с вами для согласования удобного времени
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contacts#form">
                    Оставить заявку
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <a href="tel:+79639639666">
                    <Phone className="mr-2 h-5 w-5" />
                    8 963 963 96 66
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
