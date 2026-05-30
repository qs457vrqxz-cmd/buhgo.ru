// A/B Testing utility for form optimization

// Declare global window types for analytics
declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
    gtag?: (action: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

export type VariantId = "A" | "B" | "C";

export interface ABVariant {
  id: VariantId;
  name: string;
  weight: number; // Percentage weight (0-100)
}

export interface ABTest {
  id: string;
  name: string;
  variants: ABVariant[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface ABTestResult {
  testId: string;
  variantId: VariantId;
  impressions: number;
  conversions: number;
  conversionRate: number;
}

export interface ABEvent {
  testId: string;
  variantId: VariantId;
  eventType: "impression" | "conversion";
  timestamp: Date;
  metadata?: Record<string, string>;
}

// Active A/B tests configuration
export const abTests: Record<string, ABTest> = {
  contactForm: {
    id: "contactForm",
    name: "Форма заявки - Вариации",
    variants: [
      { id: "A", name: "Стандартная форма", weight: 34 },
      { id: "B", name: "Форма с акцентом на скорость", weight: 33 },
      { id: "C", name: "Минималистичная форма", weight: 33 },
    ],
    startDate: new Date("2024-01-01"),
    isActive: true,
  },
  ctaButton: {
    id: "ctaButton",
    name: "CTA кнопка - Текст",
    variants: [
      { id: "A", name: "Оставить заявку", weight: 50 },
      { id: "B", name: "Получить консультацию", weight: 50 },
    ],
    startDate: new Date("2024-01-01"),
    isActive: true,
  },
  heroTitle: {
    id: "heroTitle",
    name: "Hero заголовок",
    variants: [
      { id: "A", name: "Бухгалтерское сопровождение под ключ", weight: 50 },
      { id: "B", name: "Надёжная бухгалтерия для вашего бизнеса", weight: 50 },
    ],
    startDate: new Date("2024-01-01"),
    isActive: true,
  },
};

// Storage keys
const VARIANT_STORAGE_KEY = "ab_test_variants";
const EVENTS_STORAGE_KEY = "ab_test_events";
const RESULTS_STORAGE_KEY = "ab_test_results";

// Get stored variants for user
const getStoredVariants = (): Record<string, VariantId> => {
  if (typeof window === "undefined") return {};

  const stored = localStorage.getItem(VARIANT_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }
  return {};
};

// Save variants for user
const saveVariants = (variants: Record<string, VariantId>): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(VARIANT_STORAGE_KEY, JSON.stringify(variants));
  }
};

// Select variant based on weights
const selectVariant = (test: ABTest): VariantId => {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const variant of test.variants) {
    cumulative += variant.weight;
    if (random <= cumulative) {
      return variant.id;
    }
  }

  return test.variants[0].id;
};

// Get variant for a specific test (consistent per user)
export const getVariant = (testId: string): VariantId => {
  const test = abTests[testId];
  if (!test || !test.isActive) {
    return "A"; // Default to variant A
  }

  const storedVariants = getStoredVariants();

  if (storedVariants[testId]) {
    return storedVariants[testId];
  }

  // Assign new variant
  const variant = selectVariant(test);
  storedVariants[testId] = variant;
  saveVariants(storedVariants);

  return variant;
};

// Track event
export const trackEvent = (
  testId: string,
  eventType: "impression" | "conversion",
  metadata?: Record<string, string>
): void => {
  if (typeof window === "undefined") return;

  const variant = getVariant(testId);

  const event: ABEvent = {
    testId,
    variantId: variant,
    eventType,
    timestamp: new Date(),
    metadata,
  };

  // Store event locally
  const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
  const events: ABEvent[] = stored ? JSON.parse(stored) : [];
  events.push(event);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events.slice(-1000))); // Keep last 1000 events

  // Update results
  updateResults(testId, variant, eventType);

  // In production, send to analytics
  if (process.env.NODE_ENV === "production") {
    // Send to Google Analytics, Yandex Metrika, or custom analytics
    sendToAnalytics(event);
  }

  console.log(`[A/B Test] ${testId}: ${eventType} for variant ${variant}`);
};

// Update local results
const updateResults = (
  testId: string,
  variantId: VariantId,
  eventType: "impression" | "conversion"
): void => {
  const stored = localStorage.getItem(RESULTS_STORAGE_KEY);
  const results: Record<string, Record<VariantId, ABTestResult>> = stored
    ? JSON.parse(stored)
    : {};

  if (!results[testId]) {
    results[testId] = {} as Record<VariantId, ABTestResult>;
  }

  if (!results[testId][variantId]) {
    results[testId][variantId] = {
      testId,
      variantId,
      impressions: 0,
      conversions: 0,
      conversionRate: 0,
    };
  }

  const result = results[testId][variantId];

  if (eventType === "impression") {
    result.impressions += 1;
  } else {
    result.conversions += 1;
  }

  result.conversionRate = result.impressions > 0
    ? (result.conversions / result.impressions) * 100
    : 0;

  localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
};

// Get results for a test
export const getResults = (testId: string): Record<VariantId, ABTestResult> | null => {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(RESULTS_STORAGE_KEY);
  if (!stored) return null;

  const results = JSON.parse(stored);
  return results[testId] || null;
};

// Get all results
export const getAllResults = (): Record<string, Record<VariantId, ABTestResult>> => {
  if (typeof window === "undefined") return {};

  const stored = localStorage.getItem(RESULTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

// Clear test data (for admin)
export const clearTestData = (testId?: string): void => {
  if (typeof window === "undefined") return;

  if (testId) {
    // Clear specific test
    const variants = getStoredVariants();
    delete variants[testId];
    saveVariants(variants);

    const results = getAllResults();
    delete results[testId];
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
  } else {
    // Clear all
    localStorage.removeItem(VARIANT_STORAGE_KEY);
    localStorage.removeItem(EVENTS_STORAGE_KEY);
    localStorage.removeItem(RESULTS_STORAGE_KEY);
  }
};

// Send to analytics (placeholder for real implementation)
const sendToAnalytics = (event: ABEvent): void => {
  // Yandex Metrika
  if (typeof window !== "undefined" && window.ym) {
    window.ym(89113684, "reachGoal", `ab_${event.testId}_${event.variantId}_${event.eventType}`);
  }

  // Google Analytics 4
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", `ab_${event.eventType}`, {
      test_id: event.testId,
      variant_id: event.variantId,
      ...event.metadata,
    });
  }
};

// Form variant configurations
export interface FormVariantConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonColor: string;
  showPhone: boolean;
  showEmail: boolean;
  showMessage: boolean;
  showService: boolean;
  layout: "default" | "compact" | "expanded";
  urgencyText?: string;
}

export const formVariants: Record<VariantId, FormVariantConfig> = {
  A: {
    title: "Оставить заявку",
    subtitle: "Заполните форму и мы перезвоним вам",
    buttonText: "Отправить заявку",
    buttonColor: "bg-secondary hover:bg-secondary/90",
    showPhone: true,
    showEmail: true,
    showMessage: true,
    showService: true,
    layout: "default",
  },
  B: {
    title: "Получите ответ за 15 минут!",
    subtitle: "Оставьте номер телефона — перезвоним мгновенно",
    buttonText: "Перезвоните мне",
    buttonColor: "bg-green-600 hover:bg-green-700",
    showPhone: true,
    showEmail: false,
    showMessage: false,
    showService: false,
    layout: "compact",
    urgencyText: "Свободных консультантов: 3",
  },
  C: {
    title: "Бесплатная консультация",
    subtitle: "Имя и телефон — всё, что нужно",
    buttonText: "Получить консультацию",
    buttonColor: "bg-primary hover:bg-primary/90",
    showPhone: true,
    showEmail: false,
    showMessage: true,
    showService: false,
    layout: "compact",
  },
};

// Get form config for current variant
export const getFormConfig = (): FormVariantConfig => {
  const variant = getVariant("contactForm");
  return formVariants[variant];
};

// CTA button variants
export const ctaVariants: Record<VariantId, { text: string; subtext?: string }> = {
  A: { text: "Оставить заявку" },
  B: { text: "Получить консультацию", subtext: "Бесплатно" },
  C: { text: "Начать сотрудничество" },
};

export const getCTAConfig = () => {
  const variant = getVariant("ctaButton");
  return ctaVariants[variant] || ctaVariants.A;
};

// Hero title variants
export const heroVariants: Record<VariantId, { title: string[]; highlight: string }> = {
  A: {
    title: ["Бухгалтерское", "сопровождение"],
    highlight: "под ключ",
  },
  B: {
    title: ["Надёжная", "бухгалтерия"],
    highlight: "для вашего бизнеса",
  },
  C: {
    title: ["Бухгалтерские", "услуги"],
    highlight: "без головной боли",
  },
};

export const getHeroConfig = () => {
  const variant = getVariant("heroTitle");
  return heroVariants[variant] || heroVariants.A;
};
