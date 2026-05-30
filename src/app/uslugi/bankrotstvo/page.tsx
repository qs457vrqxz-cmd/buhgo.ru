"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Phone,
  ArrowRight,
  FileText,
  Scale,
  Shield,
  Clock,
  Users,
  AlertTriangle,
} from "lucide-react";

const features = [
  {
    icon: Scale,
    title: "Анализ ситуации",
    description: "Оценим финансовое состояние и определим оптимальный путь решения проблемы",
  },
  {
    icon: FileText,
    title: "Подготовка документов",
    description: "Соберём и подготовим полный пакет документов для процедуры банкротства",
  },
  {
    icon: Shield,
    title: "Защита интересов",
    description: "Защитим ваши интересы в суде и при взаимодействии с кредиторами",
  },
  {
    icon: Clock,
    title: "Сопровождение процесса",
    description: "Полное сопровождение на всех этапах процедуры банкротства",
  },
];

const services = [
  "Консультация по процедуре банкротства",
  "Анализ финансового состояния должника",
  "Подготовка заявления о банкротстве",
  "Взаимодействие с арбитражным управляющим",
  "Представление интересов в суде",
  "Работа с реестром кредиторов",
  "Сопровождение ликвидации с долгами",
  "Списание безнадёжной задолженности",
];

const situations = [
  "Невозможность погасить долги",
  "Задолженность по налогам и взносам",
  "Претензии от контрагентов",
  "Блокировка счетов",
  "Исполнительные производства",
  "Субсидиарная ответственность",
];

export default function BankrotstvoPage() {
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
              <span className="text-muted-foreground">Банкротство бизнеса</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <AnimatedSection animation="slideUp">
                <Badge className="mb-4 bg-secondary/10 text-secondary">
                  Юридическая поддержка
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  Банкротство бизнеса
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground mb-6">
                  Профессиональное сопровождение процедуры банкротства ИП и ООО.
                  Поможем законно избавиться от долгов и начать с чистого листа.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                    <Link href="/contacts#form">
                      Получить консультацию
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
                    <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Briefcase className="h-7 w-7 text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Банкротство под ключ</h2>
                      <p className="text-muted-foreground">Полное сопровождение</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Консультация</span>
                      <span className="font-semibold text-primary">Бесплатно</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Анализ ситуации</span>
                      <span className="font-semibold text-primary">от 10 000 ₽</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Сопровождение банкротства</span>
                      <span className="font-semibold text-primary">по запросу</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* When needed */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Когда нужно банкротство?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Банкротство — это законный способ решения финансовых проблем бизнеса
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {situations.map((situation, index) => (
                <AnimatedSection key={situation} animation="slideUp" delay={index * 100}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span>{situation}</span>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Как мы работаем</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Профессиональный подход на каждом этапе процедуры
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <AnimatedSection key={feature.title} animation="scale" delay={index * 100}>
                  <Card className="h-full text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Что входит в услугу</h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {services.map((service, index) => (
                <AnimatedSection key={service} animation="slideUp" delay={index * 50}>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{service}</span>
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
                Нужна консультация по банкротству?
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                Первая консультация бесплатно. Оценим вашу ситуацию и предложим оптимальное решение.
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
