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
  Calendar,
  ArrowRight,
  Phone,
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Кадровое делопроизводство",
    items: [
      "Оформление приёма и увольнения",
      "Ведение личных дел сотрудников",
      "Подготовка трудовых договоров",
      "Оформление отпусков и больничных",
      "Ведение табеля учёта рабочего времени",
    ],
  },
  {
    icon: Calculator,
    title: "Расчёт заработной платы",
    items: [
      "Расчёт окладов и премий",
      "Расчёт отпускных и больничных",
      "Удержания из заработной платы",
      "Формирование расчётных листков",
      "Подготовка платёжных ведомостей",
    ],
  },
  {
    icon: Calendar,
    title: "Отчётность по сотрудникам",
    items: [
      "6-НДФЛ (ежеквартально)",
      "РСВ (ежеквартально)",
      "СЗВ-ТД (при изменениях)",
      "ЕФС-1 (ежеквартально)",
      "Персонифицированные сведения",
      "Декларация по налогу на прибыль (ежеквартально)",
      "Декларация по НДС (ежеквартально)",
    ],
  },
];

export default function KadrovyjUchetPage() {
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
                  Для компаний с сотрудниками
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Кадровый учёт
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Полное ведение кадрового делопроизводства: от оформления сотрудников
                  до расчёта зарплаты и сдачи отчётности. Всё в соответствии с ТК РФ.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-bold text-primary">от 15 000 ₽</span>
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
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop"
                  alt="Кадровый учёт"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Что входит в услугу</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.title} className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Нужен кадровый учёт?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Оставьте заявку для расчёта стоимости под вашу компанию
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contacts#form">
                Получить расчёт
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
