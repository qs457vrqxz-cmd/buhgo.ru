"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Calculator } from "@/components/Calculator";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const advantages = [
  "Прозрачное ценообразование без скрытых платежей",
  "Фиксированная стоимость на весь период обслуживания",
  "Все услуги включены в стоимость",
  "Возможность изменить тариф в любой момент",
];

export default function CalculatorPage() {
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
              <span className="text-muted-foreground">Калькулятор стоимости</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary">
                Онлайн-расчёт
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Калькулятор стоимости услуг
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Рассчитайте примерную стоимость бухгалтерского обслуживания
                для вашего бизнеса за несколько кликов
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AnimatedSection animation="slideUp">
                  <Calculator />
                </AnimatedSection>
              </div>

              <div className="lg:col-span-1">
                <AnimatedSection animation="slideLeft" delay={200}>
                  <div className="bg-muted/30 rounded-2xl p-6 sticky top-24">
                    <h3 className="text-lg font-semibold mb-4">Наши преимущества</h3>
                    <ul className="space-y-3">
                      {advantages.map((advantage) => (
                        <li key={advantage} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{advantage}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 p-4 bg-primary/5 rounded-xl">
                      <h4 className="font-semibold mb-2">Нужна консультация?</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Позвоните нам, и мы рассчитаем точную стоимость для вашего бизнеса
                      </p>
                      <a
                        href="tel:+79639639666"
                        className="text-primary font-semibold hover:underline"
                      >
                        8 963 963 96 66
                      </a>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing table */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Тарифы на бухгалтерские услуги</h2>
              <p className="text-muted-foreground">
                Полная таблица цен на бухгалтерское обслуживание
              </p>
            </AnimatedSection>

            <div className="max-w-4xl mx-auto">
              <AnimatedSection animation="slideUp" delay={100}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  {/* ИП */}
                  <div className="border-b">
                    <div className="bg-primary/5 px-6 py-4">
                      <h3 className="font-semibold text-lg">ИП (индивидуальный предприниматель)</h3>
                    </div>
                    <div className="divide-y">
                      <div className="px-6 py-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">УСН / Патент — нулевой оборот</p>
                          <p className="text-sm text-muted-foreground">Сдача нулевой отчётности</p>
                        </div>
                        <span className="font-semibold text-primary">5 000 ₽/мес</span>
                      </div>
                      <div className="px-6 py-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">УСН / Патент — с оборотом</p>
                          <p className="text-sm text-muted-foreground">Полное ведение учёта</p>
                        </div>
                        <span className="font-semibold text-primary">от 10 000 ₽/мес</span>
                      </div>
                      <div className="px-6 py-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">УСН / Патент — с сотрудниками (1-3 чел)</p>
                          <p className="text-sm text-muted-foreground">Полное ведение + кадры</p>
                        </div>
                        <span className="font-semibold text-primary">от 15 000 ₽/мес</span>
                      </div>
                      <div className="px-6 py-4 flex justify-between items-center bg-yellow-50">
                        <div>
                          <p className="font-medium">УСН + НДС — нулевой оборот</p>
                          <p className="text-sm text-muted-foreground">Сдача нулевой отчётности</p>
                        </div>
                        <span className="font-semibold text-primary">5 000 ₽/мес</span>
                      </div>
                      <div className="px-6 py-4 flex justify-between items-center bg-yellow-50">
                        <div>
                          <p className="font-medium">УСН + НДС — с оборотом</p>
                          <p className="text-sm text-muted-foreground">Полное ведение учёта</p>
                        </div>
                        <span className="font-semibold text-primary">от 15 000 ₽/мес</span>
                      </div>
                      <div className="px-6 py-4 flex justify-between items-center bg-yellow-50">
                        <div>
                          <p className="font-medium">УСН + НДС — с сотрудниками (1-3 чел)</p>
                          <p className="text-sm text-muted-foreground">Полное ведение + кадры</p>
                        </div>
                        <span className="font-semibold text-primary">от 20 000 ₽/мес</span>
                      </div>
                    </div>
                  </div>

                  {/* ООО */}
                  <div>
                    <div className="bg-primary/5 px-6 py-4">
                      <h3 className="font-semibold text-lg">ООО (общество с ограниченной ответственностью)</h3>
                    </div>
                    <div className="divide-y">
                      <div className="px-6 py-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">УСН — нулевой оборот</p>
                          <p className="text-sm text-muted-foreground">Сдача нулевой отчётности</p>
                        </div>
                        <span className="font-semibold text-primary">10 000 ₽/мес</span>
                      </div>
                      <div className="px-6 py-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">УСН — с оборотом</p>
                          <p className="text-sm text-muted-foreground">Полное ведение учёта</p>
                        </div>
                        <span className="font-semibold text-primary">от 15 000 ₽/мес</span>
                      </div>
                      <div className="px-6 py-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">УСН — с сотрудниками (2-3 чел)</p>
                          <p className="text-sm text-muted-foreground">Полное ведение + кадры</p>
                        </div>
                        <span className="font-semibold text-primary">от 25 000 ₽/мес</span>
                      </div>
                      <div className="px-6 py-4 flex justify-between items-center bg-yellow-50">
                        <div>
                          <p className="font-medium">УСН + НДС / ОСН — нулевой оборот</p>
                          <p className="text-sm text-muted-foreground">Сдача нулевой отчётности</p>
                        </div>
                        <span className="font-semibold text-primary">10 000 ₽/мес</span>
                      </div>
                      <div className="px-6 py-4 flex justify-between items-center bg-yellow-50">
                        <div>
                          <p className="font-medium">УСН + НДС / ОСН — с оборотом</p>
                          <p className="text-sm text-muted-foreground">Полное ведение учёта</p>
                        </div>
                        <span className="font-semibold text-primary">от 20 000 ₽/мес</span>
                      </div>
                      <div className="px-6 py-4 flex justify-between items-center bg-yellow-50">
                        <div>
                          <p className="font-medium">УСН + НДС / ОСН — с сотрудниками (2-3 чел)</p>
                          <p className="text-sm text-muted-foreground">Полное ведение + кадры</p>
                        </div>
                        <span className="font-semibold text-primary">от 25 000 ₽/мес</span>
                      </div>
                    </div>
                  </div>

                  {/* Консультации */}
                  <div>
                    <div className="bg-secondary/5 px-6 py-4">
                      <h3 className="font-semibold text-lg">Консультации (любой формат и виды)</h3>
                    </div>
                    <div className="divide-y">
                      <div className="px-6 py-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Консультация (онлайн, телефон, письменно)</p>
                          <p className="text-sm text-muted-foreground">Ответы на вопросы по бухгалтерии и налогам</p>
                        </div>
                        <span className="font-semibold text-primary">от 5 000 ₽</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <p className="text-center text-sm text-muted-foreground mt-6">
                * Окончательная стоимость рассчитывается индивидуально после консультации
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
