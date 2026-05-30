"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckCircle2,
  FileCheck,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Phone,
} from "lucide-react";

const features = [
  "Подготовка нулевых деклараций по всем системам налогообложения",
  "Сдача отчётности в ФНС в электронном виде",
  "Отчётность в СФР и РОССТАТ",
  "Контроль сроков сдачи",
  "Уведомления о принятии отчётов",
  "Хранение копий отчётности",
];

const reports = [
  { name: "Декларация по УСН", period: "1 раз в год" },
  { name: "6-НДФЛ", period: "Ежеквартально" },
  { name: "РСВ", period: "Ежеквартально" },
  { name: "Персонифицированные сведения", period: "Ежемесячно" },
  { name: "ЕФС-1", period: "Ежеквартально" },
  { name: "Бухгалтерская отчётность", period: "1 раз в год" },
];

const deadlines = [
  { report: "Декларация УСН (ООО)", deadline: "25 марта" },
  { report: "Декларация УСН (ИП)", deadline: "25 апреля" },
  { report: "6-НДФЛ за год", deadline: "25 февраля" },
  { report: "РСВ", deadline: "25 число после квартала" },
  { report: "Бухгалтерская отчётность", deadline: "31 марта" },
];

export default function NulevayaOtchetnostPage() {
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
                  Для ИП и ООО без деятельности
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Нулевая отчётность
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Даже если ваш бизнес временно не ведёт деятельность, отчётность сдавать обязательно.
                  Мы возьмём это на себя — вовремя и без штрафов.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-bold text-primary">от 5 000 ₽</span>
                  <span className="text-muted-foreground">/месяц</span>
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
              <div className="hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1586282391129-76a6df230234?w=600&h=400&fit=crop"
                  alt="Нулевая отчётность"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Warning */}
        <section className="py-8 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="flex items-start gap-4 max-w-3xl mx-auto">
              <AlertTriangle className="h-8 w-8 text-secondary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Важно знать!</h3>
                <p className="text-muted-foreground">
                  За несвоевременную сдачу нулевой отчётности предусмотрены штрафы:
                  от 1 000 ₽ за каждый непредставленный отчёт. При систематических нарушениях
                  возможна блокировка расчётного счёта.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Что входит в услугу</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
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

        {/* Reports List */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Какие отчёты сдаём</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {reports.map((report) => (
                <Card key={report.name}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">{report.period}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Deadlines */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Сроки сдачи отчётности</h2>
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  {deadlines.map((item, index) => (
                    <div
                      key={item.report}
                      className={`flex items-center justify-between p-4 ${
                        index !== deadlines.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>{item.report}</span>
                      </div>
                      <Badge variant="secondary">{item.deadline}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Не хотите следить за сроками?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Доверьте нулевую отчётность профессионалам — мы всё сделаем вовремя
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contacts#form">
                Заказать услугу
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
