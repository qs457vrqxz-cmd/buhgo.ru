"use client";

import { type ReactNode, memo, useMemo } from "react";
import { useScrollAnimation, animationVariants, type AnimationVariant } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationVariant;
  delay?: number;
  threshold?: number;
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "main";
}

export const AnimatedSection = memo(function AnimatedSection({
  children,
  className,
  animation = "slideUp",
  delay = 0,
  threshold = 0.1,
  as: Component = "div",
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold });
  const variant = useMemo(() => animationVariants[animation], [animation]);

  const style = useMemo(() => ({ transitionDelay: `${delay}ms` }), [delay]);

  return (
    <Component
      ref={ref}
      className={cn(
        isVisible ? variant.visible : variant.hidden,
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
});

// Stagger animation wrapper for lists
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  animation?: AnimationVariant;
}

export const StaggerContainer = memo(function StaggerContainer({
  children,
  className,
  staggerDelay = 100,
  animation = "slideUp",
}: StaggerContainerProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const variant = useMemo(() => animationVariants[animation], [animation]);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={cn(isVisible ? variant.visible : variant.hidden)}
              style={{ transitionDelay: `${index * staggerDelay}ms` }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
});
