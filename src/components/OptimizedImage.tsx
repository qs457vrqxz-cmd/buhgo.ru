"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Check if it's an external URL or base64
  const isExternal = src.startsWith("http") || src.startsWith("data:");

  // Fallback image
  const fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='16'%3EИзображение%3C/text%3E%3C/svg%3E";

  if (error) {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center",
          className
        )}
        style={fill ? {} : { width, height }}
      >
        <span className="text-muted-foreground text-sm">Ошибка загрузки</span>
      </div>
    );
  }

  // For base64 images, use regular img tag
  if (src.startsWith("data:")) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
        loading="lazy"
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", fill ? "w-full h-full" : "")} style={fill ? {} : { width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={cn(
          "transition-opacity duration-300 object-cover",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwEPwAB//9k="
      />
    </div>
  );
}
