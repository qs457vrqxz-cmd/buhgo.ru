"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";
import { getServices, getSiteImages, type Service, type SiteImages } from "@/lib/content";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ContactFormAB } from "@/components/ContactFormAB";

// Lazy load heavy components
const Testimonials = dynamic(
  () => import("@/components/Testimonials").then((mod) => mod.Testimonials),
  {
    loading: () => (
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    ),
    ssr: false,
  }
);
import {
  FileText,
  Calculator,
  Building2,
  Users,
  Code,
  Shield,
  Clock,
  Award,
  HeadphonesIcon,
  CheckCircle2,
  ArrowRight,
  Phone,
  FileCheck,
  Briefcase,
  MessageSquare,
  RefreshCw,
  Mail,
  CreditCard,
  PieChart,
} from "lucide-react";

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  FileCheck,
  Building2,
  Calculator,
  Users,
  Code,
  Briefcase,
  MessageSquare,
  RefreshCw,
  Shield,
  Clock,
  Award,
  HeadphonesIcon,
  Phone,
  Mail,
  CreditCard,
  PieChart,
};

const features = [
  {
    icon: Shield,
    title: "Надёжность",
    description: "Гарантируем точность расчётов и своевременную сдачу отчётности",
  },
  {
    icon: Clock,
    title: "Экономия времени",
    description: "Вы занимаетесь бизнесом, мы берём на себя всю бухгалтерию",
  },
  {
    icon: Award,
    title: "Опыт работы",
    description: "Более 12 лет успешной работы с бизнесом разных сфер",
  },
  {
    icon: HeadphonesIcon,
    title: "Поддержка 24/7",
    description: "Всегда на связи для решения срочных вопросов",
  },
];

const steps = [
  { number: 1, title: "Оставить заявку", description: "Заполните форму на сайте или позвоните нам" },
  { number: 2, title: "Согласуем тариф", description: "Подберём оптимальный план в удобное время" },
  { number: 3, title: "Ведём учёт", description: "Берём на себя всю бухгалтерию под ключ" },
  { number: 4, title: "Акт выполненных работ", description: "Ежемесячно предоставляем отчёт о проделанной работе" },
];

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [siteImages, setSiteImages] = useState<SiteImages | null>(null);

  useEffect(() => {
    setServices(getServices());
    setSiteImages(getSiteImages());
  }, []);

  // Get icon component by name
  const getIcon = (iconName: string) => {
    return iconMap[iconName] || FileText;
  };

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-12 sm:py-16 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 hero-pattern opacity-50" />
          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <AnimatedSection animation="slideUp">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
                  <span className="text-primary">Бухгалтерское</span>
                  <br />
                  <span className="text-foreground">сопровождение</span>
                  <br />
                  <span className="text-secondary">под ключ</span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-lg">
                  Подберём программное решение под Ваш бизнес.
                  Закажите надёжную бухгалтерию уже сегодня!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 w-full sm:w-auto">
                    <Link href="#form">
                      Оставить заявку
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                    <a href="tel:+79639639666">
                      <Phone className="mr-2 h-5 w-5" />
                      8 963 963 96 66
                    </a>
                  </Button>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="slideLeft" delay={200} className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
                  <OptimizedImage
                    src={siteImages?.heroImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop"}
                    alt={siteImages?.heroImageAlt || "Бухгалтерские услуги"}
                    width={600}
                    height={400}
                    priority
                    className="relative rounded-2xl shadow-2xl"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-muted/30" id="services">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Наши услуги</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                Полный спектр бизнес решений для индивидуальных предпринимателей и организаций
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service, index) => {
                const IconComponent = getIcon(service.icon);
                return (
                  <AnimatedSection
                    key={service.id}
                    animation="slideUp"
                    delay={index * 100}
                  >
                    <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
                      <CardHeader className="pb-3 sm:pb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                        </div>
                        <CardTitle className="text-lg sm:text-xl">{service.title}</CardTitle>
                        <CardDescription className="text-sm">{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-xl sm:text-2xl font-bold text-primary">{service.price}</span>
                            {service.priceNote && (
                              <span className="text-xs sm:text-sm text-muted-foreground"> {service.priceNote}</span>
                            )}
                            {service.bonus && (
                              <span className="ml-2 text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                                {service.bonus}
                              </span>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
                            <Link href={service.href}>
                              Подробнее
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Calculator CTA */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    Рассчитайте стоимость обслуживания
                  </h2>
                  <p className="text-white/80">
                    Воспользуйтесь калькулятором для расчёта стоимости бухгалтерских услуг
                  </p>
                </div>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/calculator">
                    <Calculator className="mr-2 h-5 w-5" />
                    Открыть калькулятор
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp" className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Почему выбирают нас</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                Бухгалтер — это правая рука руководителя компании, который берёт все коммуникации
                с Налоговой и другими фондами на себя
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <AnimatedSection
                  key={feature.title}
                  animation="scale"
                  delay={index * 100}
                >
                  <div className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-white border hover:shadow-lg transition-all h-full">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">{feature.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Steps Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">4 шага к результату</h2>
            </AnimatedSection>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {steps.map((step, index) => (
                <AnimatedSection
                  key={step.number}
                  animation="slideUp"
                  delay={index * 150}
                >
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl sm:text-2xl font-bold">{step.number}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">{step.title}</h3>
                        <p className="text-white/80 text-xs sm:text-sm">{step.description}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-6 left-[calc(100%_-_2rem)] w-8 border-t-2 border-dashed border-white/30" />
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 sm:py-16 lg:py-20" id="form">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <AnimatedSection animation="slideRight">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                  Закажите надёжную бухгалтерию сейчас!
                </h2>
                <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                  Оставьте заявку, и мы свяжемся с вами в течение 15 минут для
                  бесплатной консультации по вашему бизнесу.
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">Что входит в стоимость</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Ведение учёта, расчёт налогов, сдача отчётности, консультации
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">Работа с первичкой</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Обработка и хранение всех первичных документов
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">Интеграция с банками и 1С</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Автоматическая загрузка выписок и синхронизация данных
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slideLeft" delay={200}>
                <ContactFormAB source="Главная страница" />
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
