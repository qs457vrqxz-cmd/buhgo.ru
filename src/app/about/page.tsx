"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { getAbout, type AboutInfo } from "@/lib/content";

export default function AboutPage() {
  const [about, setAbout] = useState<AboutInfo | null>(null);

  useEffect(() => {
    setAbout(getAbout());
  }, []);

  if (!about) {
    return (
      <>
        <Header />
        <main className="flex-1 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
              <span className="text-muted-foreground">Обо мне</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp">
              <h1 className="text-3xl sm:text-4xl font-bold mb-8">Обо мне</h1>
            </AnimatedSection>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Photo */}
              <AnimatedSection animation="scale" className="lg:col-span-1">
                <div className="relative">
                  <img
                    src={about.photo}
                    alt={about.name}
                    className="w-full max-w-sm rounded-lg shadow-lg mx-auto lg:mx-0"
                  />
                </div>
              </AnimatedSection>

              {/* Bio Text */}
              <AnimatedSection animation="slideUp" delay={100} className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  {/* Name and Title */}
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {about.name}
                  </h2>
                  {about.bio[0] && (
                    <p className="text-lg text-primary font-medium mb-6">
                      {about.bio[0]}
                    </p>
                  )}

                  {/* Bio paragraphs */}
                  {about.bio.slice(1).map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base sm:text-lg leading-relaxed text-muted-foreground mt-4 first:mt-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="slideUp">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                Большинство клиентов решают свои вопросы после первого звонкам нам
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
