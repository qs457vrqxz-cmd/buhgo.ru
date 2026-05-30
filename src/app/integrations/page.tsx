"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";
import { CheckCircle2, ExternalLink, ArrowRight, Phone, Gift, Percent, CreditCard, Zap, Star, Lock } from "lucide-react";
import { getPartners, type Partner } from "@/lib/content";

const exclusiveOffers = [
  {
    icon: CreditCard,
    title: "Бесплатное обслуживание",
    description: "До 3 месяцев бесплатного обслуживания расчётного счёта в банках-партнёрах",
  },
  {
    icon: Percent,
    title: "Скидки на тарифы",
    description: "Эксклюзивные скидки до 30% на тарифы банков и сервисов для клиентов BuhGo",
  },
  {
    icon: Gift,
    title: "Денежные бонусы",
    description: "Кэшбэк до 500 рублей при открытии расчётного счёта через нас",
  },
  {
    icon: Zap,
    title: "Приоритетное подключение",
    description: "Ускоренное рассмотрение заявок и персональный менеджер от партнёра",
  },
];

export default function IntegrationsPage() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    setPartners(getPartners());
  }, []);

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
              <span className="text-muted-foreground">Партнёрские программы</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Автоматизация
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Партнёрские программы
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Мы работаем с ведущими сервисами и банками для автоматизации вашего бизнеса.
                Поможем подключить и настроить любое решение.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Exclusive Offers Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-secondary/5 via-secondary/10 to-secondary/5">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-secondary" />
                <Badge className="bg-secondary text-white">
                  Только для клиентов BuhGo
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Закрытые акции от партнёров
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Наши клиенты получают доступ к эксклюзивным предложениям, которые недоступны при прямом обращении в банки и сервисы
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {exclusiveOffers.map((offer, index) => (
                <AnimatedSection key={offer.title} animation="scale" delay={index * 100}>
                  <Card className="h-full text-center border-2 border-secondary/20 hover:border-secondary/40 transition-colors bg-white">
                    <CardContent className="pt-6">
                      <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                        <offer.icon className="h-7 w-7 text-secondary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{offer.title}</h3>
                      <p className="text-sm text-muted-foreground">{offer.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection animation="slideUp" delay={400} className="mt-10 text-center">
              <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto border-2 border-secondary/20 shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Как получить закрытые акции?</h3>
                <p className="text-muted-foreground mb-6">
                  Станьте клиентом BuhGo и получите доступ ко всем эксклюзивным предложениям партнёров.
                  Мы поможем выбрать лучшие условия и оформить подключение с максимальной выгодой.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
                    <Link href="/contacts#form">
                      Получить доступ к акциям
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
            </AnimatedSection>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Наши партнёры</h2>
              <p className="text-muted-foreground">
                Банки и сервисы, с которыми мы сотрудничаем
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner, index) => (
                <AnimatedSection
                  key={partner.id}
                  animation="slideUp"
                  delay={index * 100}
                >
                  <Card
                    id={partner.id}
                    className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                          style={{ backgroundColor: partner.color }}
                        >
                          {partner.name.charAt(0)}
                        </div>
                        {partner.bonus && (
                          <Badge className="bg-secondary/10 text-secondary">
                            {partner.bonus}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{partner.name}</CardTitle>
                      <CardDescription className="text-sm">{partner.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm">Возможности:</h4>
                        <ul className="space-y-1">
                          {partner.features.slice(0, 4).map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm">Наши услуги:</h4>
                        <ul className="space-y-1">
                          {partner.services.slice(0, 3).map((service) => (
                            <li key={service} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1" asChild>
                          <Link href="/contacts#form">
                            Подключить
                          </Link>
                        </Button>
                        {partner.url && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={partner.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                Большинство клиентов решают свои вопросы после первого звонка нам
              </h2>
              <p className="text-white/80 mb-4">позвоните по номеру:</p>
              <a
                href="tel:+79639639666"
                className="text-2xl sm:text-3xl font-bold hover:opacity-80 transition-opacity inline-flex items-center gap-3"
              >
                <Phone className="h-6 w-6 sm:h-8 sm:w-8" />
                8 963 963 96 66
              </a>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
