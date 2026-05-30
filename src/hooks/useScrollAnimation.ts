"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (triggerOnce && observerRef.current && ref.current) {
          observerRef.current.unobserve(ref.current);
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    },
    [triggerOnce]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, handleIntersection]);

  return { ref, isVisible };
}

// Animation variants for different effects - using CSS classes for better performance
export const animationVariants = {
  fadeIn: {
    hidden: "opacity-0",
    visible: "opacity-100 transition-opacity duration-500 ease-out",
  },
  slideUp: {
    hidden: "opacity-0 translate-y-6",
    visible: "opacity-100 translate-y-0 transition-all duration-500 ease-out",
  },
  slideDown: {
    hidden: "opacity-0 -translate-y-6",
    visible: "opacity-100 translate-y-0 transition-all duration-500 ease-out",
  },
  slideLeft: {
    hidden: "opacity-0 translate-x-6",
    visible: "opacity-100 translate-x-0 transition-all duration-500 ease-out",
  },
  slideRight: {
    hidden: "opacity-0 -translate-x-6",
    visible: "opacity-100 translate-x-0 transition-all duration-500 ease-out",
  },
  scale: {
    hidden: "opacity-0 scale-95",
    visible: "opacity-100 scale-100 transition-all duration-500 ease-out",
  },
  rotateIn: {
    hidden: "opacity-0 rotate-3",
    visible: "opacity-100 rotate-0 transition-all duration-500 ease-out",
  },
};

export type AnimationVariant = keyof typeof animationVariants;
