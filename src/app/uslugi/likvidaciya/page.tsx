"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileX,
  ArrowRight,
  Phone,
} from "lucide-react";

const ipSteps = [
  "Подготовка заявления о прекращении деятельности",
  "Сдача итоговой отчётности",
  "Закрытие расчётного счёта",
  "Снятие с учёта в ФНС",
  "Получение листа записи ЕГРИП",
];

const oooSteps = [
  "Принятие решения о ликвидации",
  "Уведомление ФНС и кредиторов",
  "Составление промежуточного баланса",
  "Расчёты с кредиторами",
  "Составление ликвидационного баланса",
  "Подача документов в ФНС",
  "Получение листа записи ЕГРЮЛ",
];

const reasons = [
  "Бизнес стал убыточным",
  "Смена сферы деятельности",
  "Переход на самозанятость",
  "Отсутствие деятельности",
  "Реорганизация бизнеса",
];

export default function LikvidaciyaPage() {
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
                  Закрытие бизнеса
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Ликвидация ИП и ООО
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Поможем правильно закрыть бизнес без долгов и штрафов.
                  Сдадим итоговую отчётность, закроем счета и снимем с учёта.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-bold text-primary">от 5 000 ₽</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                    <Link href="/contacts#form">
                      Закрыть бизнес
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
                <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center">
                  <FileX className="h-24 w-24 text-muted-foreground" />
                </div>
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
                <h3 className="font-semibold text-lg mb-2">Важно!</h3>
                <p className="text-muted-foreground">
                  Неправильная ликвидация может привести к штрафам и долгам.
                  Обязательно сдайте всю отчётность и закройте расчётные счета перед ликвидацией.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* IP vs OOO */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Процедура ликвидации</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* IP */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Закрытие ИП</CardTitle>
                  <CardDescription>Срок: 5-7 рабочих дней</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {ipSteps.map((step, index) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="font-semibold">Стоимость: от 5 000 ₽</p>
                  </div>
                </CardContent>
              </Card>

              {/* OOO */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Ликвидация ООО</CardTitle>
                  <CardDescription>Срок: 3-6 месяцев</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {oooSteps.map((step, index) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="font-semibold">Стоимость: от 25 000 ₽</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Нужно закрыть бизнес?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Проконсультируем по процедуре и рассчитаем стоимость
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
