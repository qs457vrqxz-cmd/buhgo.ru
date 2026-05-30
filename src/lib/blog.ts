// Blog types and data management

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  tags: string[];
}

export const categories = [
  { id: "nalogi", name: "Налоги" },
  { id: "otchetnost", name: "Отчётность" },
  { id: "ip", name: "ИП" },
  { id: "ooo", name: "ООО" },
  { id: "kadry", name: "Кадры" },
  { id: "novosti", name: "Новости" },
];

// Default blog posts
export const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "Изменения в налоговом законодательстве 2026",
    slug: "izmeneniya-nalogovoe-zakonodatelstvo-2026",
    excerpt: "Обзор ключевых изменений в налоговом законодательстве, которые вступают в силу с 1 января 2026 года.",
    content: `
# Изменения в налоговом законодательстве 2026

С 1 января 2026 года вступают в силу важные изменения в налоговом законодательстве РФ. В этой статье мы рассмотрим ключевые нововведения, которые затронут бизнес.

## Основные изменения

### 1. Изменение ставок УСН

Для организаций и ИП на упрощённой системе налогообложения предусмотрены следующие изменения:
- Увеличение лимита доходов для применения УСН
- Новые правила расчёта авансовых платежей

### 2. НДФЛ

- Изменение налоговых вычетов
- Новые правила уплаты налога для самозанятых

### 3. Страховые взносы

- Изменение предельной базы для начисления взносов
- Новые тарифы для отдельных категорий плательщиков

## Что делать бизнесу

Рекомендуем уже сейчас:
1. Провести аудит текущей системы учёта
2. Проконсультироваться с бухгалтером о применимых изменениях
3. Подготовить документы для перехода на новые правила

Если у вас остались вопросы, обращайтесь за консультацией!
    `,
    category: "nalogi",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    author: "Михаил Кулумбугов",
    createdAt: "2026-03-15",
    updatedAt: "2026-03-15",
    published: true,
    tags: ["налоги", "УСН", "законодательство", "2026"],
  },
  {
    id: "2",
    title: "Как выбрать систему налогообложения для ИП",
    slug: "kak-vybrat-sistemu-nalogooblozheniya-ip",
    excerpt: "Подробное руководство по выбору оптимальной системы налогообложения для индивидуального предпринимателя.",
    content: `
# Как выбрать систему налогообложения для ИП

Выбор правильной системы налогообложения — один из важнейших решений при регистрации ИП. От этого зависит размер налогов, объём отчётности и удобство ведения бизнеса.

## Доступные системы налогообложения

### ОСНО (Общая система)
- Подходит для крупного бизнеса
- НДС, НДФЛ 13%
- Большой объём отчётности

### УСН (Упрощённая система)
- 6% с доходов или 15% с разницы доходов и расходов
- Подходит для малого бизнеса
- Упрощённая отчётность

### Патент (ПСН)
- Фиксированный платёж
- Минимум отчётности
- Ограничения по видам деятельности

### НПД (Налог на профессиональный доход)
- 4-6% от дохода
- Без отчётности
- Для самозанятых и ИП без сотрудников

## Как выбрать?

1. Оцените предполагаемый доход
2. Проанализируйте расходы
3. Учтите специфику деятельности
4. Проконсультируйтесь с бухгалтером

Правильный выбор поможет сэкономить на налогах!
    `,
    category: "ip",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop",
    author: "Михаил Кулумбегов",
    createdAt: "2026-03-10",
    updatedAt: "2026-03-10",
    published: true,
    tags: ["ИП", "налогообложение", "УСН", "патент"],
  },
  {
    id: "3",
    title: "Обязательная отчётность для ООО в 2026 году",
    slug: "obyazatelnaya-otchetnost-ooo-2026",
    excerpt: "Полный список отчётов, которые необходимо сдавать организациям в 2026 году, и сроки их сдачи.",
    content: `
# Обязательная отчётность для ООО в 2026 году

Каждая организация обязана сдавать определённый набор отчётов. Несвоевременная сдача грозит штрафами. Рассмотрим основные виды отчётности.

## Бухгалтерская отчётность

- Бухгалтерский баланс
- Отчёт о финансовых результатах
- Приложения к балансу

**Срок сдачи:** до 31 марта следующего года

## Налоговая отчётность

### При ОСНО:
- Декларация по НДС (ежеквартально)
- Декларация по налогу на прибыль
- 6-НДФЛ

### При УСН:
- Декларация по УСН (1 раз в год)
- 6-НДФЛ (если есть сотрудники)

## Отчётность в фонды

- РСВ (ежеквартально)
- СЗВ-ТД (при изменениях)
- 4-ФСС (ежеквартально)

## Статистическая отчётность

Перечень форм зависит от вида деятельности и размера компании.

Не забывайте отслеживать сроки сдачи!
    `,
    category: "otchetnost",
    image: "https://images.unsplash.com/photo-1586282391129-76a6df230234?w=800&h=400&fit=crop",
    author: "Михаил Кулумбегов",
    createdAt: "2026-03-05",
    updatedAt: "2026-03-05",
    published: true,
    tags: ["ООО", "отчётность", "сроки", "2026"],
  },
  {
    id: "4",
    title: "Как правильно оформить сотрудника в штат",
    slug: "kak-pravilno-oformit-sotrudnika",
    excerpt: "Пошаговая инструкция по оформлению трудовых отношений с новым сотрудником.",
    content: `
# Как правильно оформить сотрудника в штат

Правильное оформление сотрудника — залог отсутствия проблем с трудовой инспекцией. Рассмотрим процедуру пошагово.

## Шаг 1. Документы от соискателя

Запросите у кандидата:
- Паспорт
- СНИЛС
- ИНН
- Трудовую книжку или сведения о трудовой деятельности
- Документы об образовании
- Военный билет (для военнообязанных)

## Шаг 2. Подготовка документов

Подготовьте:
- Трудовой договор (2 экземпляра)
- Приказ о приёме на работу
- Личную карточку работника

## Шаг 3. Ознакомление с документами

Ознакомьте сотрудника под подпись:
- Правила внутреннего трудового распорядка
- Должностная инструкция
- Положение об оплате труда

## Шаг 4. Регистрация

- Внесите запись в трудовую книжку (если ведётся)
- Подайте СЗВ-ТД в СФР
- Заведите личное дело

## Важно помнить

- Трудовой договор — обязательно в письменной форме
- Срок уведомления СФР — следующий рабочий день
- Храните документы согласно срокам

Если процесс кажется сложным — обращайтесь, поможем!
    `,
    category: "kadry",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop",
    author: "Михаил Кулумбегов",
    createdAt: "2026-02-28",
    updatedAt: "2026-02-28",
    published: true,
    tags: ["кадры", "трудовой договор", "оформление", "сотрудники"],
  },
];

// Local storage key
const BLOG_STORAGE_KEY = "buhgalter_blog_posts";

// Get posts from localStorage or return defaults
export function getPosts(): BlogPost[] {
  if (typeof window === "undefined") {
    return defaultPosts;
  }

  const stored = localStorage.getItem(BLOG_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultPosts;
    }
  }
  return defaultPosts;
}

// Save posts to localStorage
export function savePosts(posts: BlogPost[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
}

// Get single post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getPosts();
  return posts.find((p) => p.slug === slug);
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getPosts();
  return posts.filter((p) => p.category === category && p.published);
}

// Get published posts
export function getPublishedPosts(): BlogPost[] {
  const posts = getPosts();
  return posts.filter((p) => p.published).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Create new post
export function createPost(post: Omit<BlogPost, "id">): BlogPost {
  const posts = getPosts();
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
  };
  posts.push(newPost);
  savePosts(posts);
  return newPost;
}

// Update post
export function updatePost(id: string, updates: Partial<BlogPost>): BlogPost | undefined {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  posts[index] = { ...posts[index], ...updates, updatedAt: new Date().toISOString().split("T")[0] };
  savePosts(posts);
  return posts[index];
}

// Delete post
export function deletePost(id: string): boolean {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  savePosts(filtered);
  return true;
}

// Generate slug from title
export function generateSlug(title: string): string {
  const translitMap: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };

  return title
    .toLowerCase()
    .split("")
    .map((char) => translitMap[char] || char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
