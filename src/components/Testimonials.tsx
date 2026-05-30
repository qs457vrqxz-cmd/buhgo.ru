"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { getPublishedTestimonials, type Testimonial } from "@/lib/content";

// Memoized Testimonial Card component
const TestimonialCard = memo(function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-4 sm:p-6">
        {/* Quote icon */}
        <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-primary/20 mb-3 sm:mb-4" />

        {/* Rating */}
        <div className="flex gap-1 mb-3 sm:mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                i < testimonial.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted"
              }`}
            />
          ))}
        </div>

        {/* Text */}
        <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base line-clamp-4">
          "{testimonial.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div>
            <p className="font-semibold text-sm sm:text-base">{testimonial.name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.company}</p>
          </div>
        </div>

        {/* Date */}
        <p className="text-xs text-muted-foreground mt-3 sm:mt-4">{testimonial.date}</p>
      </CardContent>
    </Card>
  );
});

// Memoized Stats component
const Stats = memo(function Stats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
      <div className="p-3 sm:p-4">
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">200+</p>
        <p className="text-xs sm:text-sm text-muted-foreground">Довольных клиентов</p>
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">12+</p>
        <p className="text-xs sm:text-sm text-muted-foreground">Лет опыта</p>
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">0</p>
        <p className="text-xs sm:text-sm text-muted-foreground">Штрафов от налоговой</p>
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">5.0</p>
        <p className="text-xs sm:text-sm text-muted-foreground">Средняя оценка</p>
      </div>
    </div>
  );
});

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setTestimonials(getPublishedTestimonials());
  }, []);

  const nextSlide = useCallback(() => {
    if (isAnimating || testimonials.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, testimonials.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating || testimonials.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, testimonials.length]);

  const visibleTestimonials = useMemo(() => {
    if (testimonials.length === 0) return [];
    return [
      testimonials[currentIndex],
      testimonials[(currentIndex + 1) % testimonials.length],
      testimonials[(currentIndex + 2) % testimonials.length],
    ];
  }, [testimonials, currentIndex]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="slideUp" className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Отзывы клиентов</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Более 200 довольных клиентов доверяют нам свою бухгалтерию.
            Вот что они говорят о нашей работе.
          </p>
        </AnimatedSection>

        {/* Desktop view - 3 cards */}
        <div className="hidden lg:block relative">
          <div className="grid grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <AnimatedSection
                key={`${testimonial.id}-${currentIndex}`}
                animation="scale"
                delay={index * 100}
              >
                <TestimonialCard testimonial={testimonial} />
              </AnimatedSection>
            ))}
          </div>

          {/* Navigation arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg bg-white hover:bg-muted"
            onClick={prevSlide}
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg bg-white hover:bg-muted"
            onClick={nextSlide}
            aria-label="Следующий отзыв"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile/Tablet view - 1 card with swipe */}
        <div className="lg:hidden">
          <div className="relative">
            <AnimatedSection
              key={`mobile-${currentIndex}`}
              animation="slideLeft"
            >
              <TestimonialCard testimonial={testimonials[currentIndex]} />
            </AnimatedSection>

            {/* Mobile navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={prevSlide}
                aria-label="Предыдущий отзыв"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-6 bg-primary"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Перейти к отзыву ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={nextSlide}
                aria-label="Следующий отзыв"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <AnimatedSection animation="slideUp" delay={300} className="mt-12 sm:mt-16">
          <Stats />
        </AnimatedSection>
      </div>
    </section>
  );
}
