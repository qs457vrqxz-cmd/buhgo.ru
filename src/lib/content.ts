// Content Management System for Buhgalter.tech

// Types
export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  priceNote?: string;
  href: string;
  bonus?: string;
  order: number;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  features: string[];
  services: string[];
  color: string;
  url: string | null;
  bonus?: string;
  logo?: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  published: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  vkLink: string;
  telegramLink: string;
}

export interface AboutInfo {
  name: string;
  photo: string;
  bio: string[];
}

export interface SiteImages {
  heroImage: string;
  heroImageAlt: string;
  logo?: string;
  favicon?: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
}

// Storage keys
const STORAGE_KEYS = {
  services: "buhgalter_services",
  partners: "buhgalter_partners",
  testimonials: "buhgalter_testimonials",
  contacts: "buhgalter_contacts",
  about: "buhgalter_about",
  settings: "buhgalter_settings",
  images: "buhgalter_images",
};

// Default data
export const defaultServices: Service[] = [
  {
    id: "1",
    icon: "FileText",
    title: "Ведение бухгалтерского учёта",
    description: "Полное ведение бухгалтерии для ИП и ООО на любой системе налогообложения",
    price: "от 10 000",
    priceNote: "руб/мес",
    href: "/uslugi/vedenie-buhucheta",
    order: 1,
  },
  {
    id: "2",
    icon: "FileCheck",
    title: "Нулевая отчётность",
    description: "Своевременная сдача нулевой отчётности во все контролирующие органы",
    price: "от 5 000",
    priceNote: "руб/мес",
    href: "/uslugi/nulevaya-otchetnost",
    order: 2,
  },
  {
    id: "3",
    icon: "Building2",
    title: "Регистрация ИП/ООО",
    description: "Быстрая регистрация бизнеса с подготовкой всех необходимых документов",
    price: "от 0",
    priceNote: "руб",
    href: "/uslugi/registraciya",
    order: 3,
  },
  {
    id: "4",
    icon: "Calculator",
    title: "Открытие расчётного счёта",
    description: "Помощь в открытии счёта в надёжных банках-партнёрах с бонусами",
    price: "Бесплатно",
    href: "/uslugi/raschetny-schet",
    bonus: "+ 500 руб бонус",
    order: 4,
  },
  {
    id: "5",
    icon: "Users",
    title: "Кадровый учёт",
    description: "Ведение кадрового делопроизводства, расчёт зарплаты и взносов",
    price: "по запросу",
    href: "/uslugi/kadrovyj-uchet",
    order: 5,
  },
  {
    id: "6",
    icon: "Code",
    title: "1С программирование",
    description: "Настройка, доработка и интеграция программ 1С под ваши задачи",
    price: "по запросу",
    href: "/uslugi/1c",
    order: 6,
  },
  {
    id: "7",
    icon: "MessageSquare",
    title: "Консультации",
    description: "Консультации по бухгалтерским и налоговым вопросам любого формата и вида",
    price: "от 5 000",
    priceNote: "руб",
    href: "/uslugi/konsultacii",
    order: 7,
  },
  {
    id: "8",
    icon: "Briefcase",
    title: "Банкротство бизнеса",
    description: "Сопровождение процедуры банкротства ИП и ООО, ликвидация с долгами",
    price: "по запросу",
    href: "/uslugi/bankrotstvo",
    order: 8,
  },
];

export const defaultPartners: Partner[] = [
  {
    id: "sber",
    name: "Сбер Банк",
    description: "Крупнейший банк России с полным спектром услуг для бизнеса и выгодными тарифами.",
    features: [
      "Бесплатное открытие счёта",
      "Выгодные тарифы для ИП и ООО",
      "СберБизнес — современный интернет-банк",
      "Эквайринг и онлайн-касса",
      "Кредитование бизнеса",
    ],
    services: [
      "Помощь в открытии счёта",
      "Подбор тарифа",
      "Настройка интеграции с 1С",
      "Консультации",
    ],
    color: "#21A038",
    url: "https://sberbank.ru",
    bonus: "+ 500 руб бонус",
    order: 1,
  },
  {
    id: "alfa-bank",
    name: "Альфа Банк",
    description: "Один из крупнейших частных банков России. Выгодные условия для бизнеса.",
    features: [
      "Бесплатное открытие счёта",
      "Бесплатное обслуживание 1 месяц",
      "Интеграция с 1С и бухгалтерией",
      "Мобильный банк 24/7",
      "Онлайн-бухгалтерия",
    ],
    services: [
      "Помощь в открытии счёта",
      "Подбор тарифа",
      "Настройка интеграции",
      "Консультации",
    ],
    color: "#EF3124",
    url: "https://alfabank.ru",
    bonus: "+ 500 руб бонус",
    order: 3,
  },
  {
    id: "tbank",
    name: "Т-Банк",
    description: "Современный онлайн-банк для бизнеса с удобным сервисом и быстрым обслуживанием.",
    features: [
      "Полностью онлайн обслуживание",
      "Бесплатное открытие счёта",
      "Эквайринг и платёжные решения",
      "API для интеграции",
      "Кредитование бизнеса",
    ],
    services: [
      "Помощь в открытии счёта",
      "Подбор оптимального тарифа",
      "Настройка интеграции",
      "Консультации",
    ],
    color: "#FFDD2D",
    url: "https://www.tbank.ru/business/partnership/all-products?utm_medium=ptr.act&utm_campaign=sme.partners&utm_source=partner_rko_a_sme&agentId=5-E6BKCI1D&agentSsoId=d9caae3a-e1bf-4481-b4cc-2cfd12fb5f57&partnerId=5-3135T622N",
    bonus: "+ 500 руб бонус",
    order: 4,
  },
  {
    id: "tochka",
    name: "Точка Банк",
    description: "Банк для предпринимателей с современными цифровыми сервисами и гибкими тарифами.",
    features: [
      "Бесплатное открытие счёта",
      "Онлайн-бухгалтерия",
      "Интеграция с маркетплейсами",
      "Эквайринг и платежи",
      "API для разработчиков",
    ],
    services: [
      "Помощь в открытии счёта",
      "Подбор тарифа",
      "Настройка интеграций",
      "Консультации",
    ],
    color: "#FF4F12",
    url: "https://tochka.com",
    bonus: "+ 500 руб бонус",
    order: 2,
  },
  {
    id: "sbis",
    name: "СБИС",
    description: "Комплексная система для бизнеса: электронная отчётность, ЭДО, торговля, CRM и управление.",
    features: [
      "Электронная отчётность во все госорганы",
      "Электронный документооборот",
      "Проверка контрагентов",
      "Торговля и склад",
      "CRM и управление бизнесом",
    ],
    services: [
      "Подключение и настройка",
      "Интеграция с 1С",
      "Обучение персонала",
      "Техническое сопровождение",
    ],
    color: "#3FB449",
    url: "https://sbis.ru",
    order: 5,
  },
  {
    id: "kontur",
    name: "Контур",
    description: "Экосистема сервисов для бухгалтерии, бизнеса и госзакупок от СКБ Контур.",
    features: [
      "Контур.Экстерн — сдача отчётности",
      "Контур.Диадок — электронный документооборот",
      "Контур.Фокус — проверка контрагентов",
      "Контур.Эльба — бухгалтерия для ИП",
      "Электронная подпись",
    ],
    services: [
      "Подключение сервисов",
      "Настройка интеграций",
      "Консультации по работе",
      "Техническая поддержка",
    ],
    color: "#FF6600",
    url: "https://kontur.ru",
    order: 6,
  },
  {
    id: "taxcom",
    name: "Такском",
    description: "Оператор электронного документооборота и сдачи отчётности через интернет.",
    features: [
      "Сдача отчётности в ФНС, СФР, РОССТАТ",
      "Электронный документооборот",
      "Электронная подпись",
      "Проверка контрагентов",
      "Маркировка товаров",
    ],
    services: [
      "Подключение к сервисам",
      "Выпуск ЭЦП",
      "Настройка ЭДО",
      "Техническая поддержка",
    ],
    color: "#00A0E3",
    url: "https://taxcom.ru",
    order: 7,
  },
  {
    id: "1c",
    name: "1С",
    description: "Программные продукты 1С для автоматизации бухгалтерского учёта и управления предприятием.",
    features: [
      "1С:Бухгалтерия",
      "1С:Зарплата и управление персоналом",
      "1С:Управление торговлей",
      "1С:Розница",
      "1С:Управление нашей фирмой",
    ],
    services: [
      "Продажа и внедрение",
      "Настройка под ваши задачи",
      "Обновление программ",
      "Техническая поддержка",
    ],
    color: "#F7D116",
    url: "https://1c.ru",
    order: 8,
  },
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Алексей Петров",
    company: "ООО «ТехноСервис»",
    role: "Генеральный директор",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Работаем с BuhGo уже 3 года. За это время ни одного штрафа, все отчёты сдаются вовремя. Особенно ценю оперативные консультации по сложным вопросам. Рекомендую!",
    date: "Март 2026",
    published: true,
  },
  {
    id: "2",
    name: "Елена Смирнова",
    company: "ИП Смирнова Е.А.",
    role: "Индивидуальный предприниматель",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Как ИП на УСН долго искала надёжного бухгалтера. Нашла BuhGo и очень довольна. Всё понятно объясняют, помогли оптимизировать налоги. Теперь плачу меньше и сплю спокойно.",
    date: "Февраль 2026",
    published: true,
  },
  {
    id: "3",
    name: "Дмитрий Козлов",
    company: "ООО «Строй-Мастер»",
    role: "Учредитель",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Открывали ООО через BuhGo — всё сделали быстро и бесплатно. Теперь ведут нам бухгалтерию. Очень удобно, что всё в одних руках. Цены адекватные, качество отличное.",
    date: "Январь 2026",
    published: true,
  },
  {
    id: "4",
    name: "Анна Волкова",
    company: "ООО «Креатив Студио»",
    role: "Финансовый директор",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Пришли после другого бухгалтера с запущенным учётом. Михаил всё восстановил, исправил ошибки, сдал корректировки. Теперь работаем на постоянной основе. Профессионалы своего дела!",
    date: "Декабрь 2025",
    published: true,
  },
  {
    id: "5",
    name: "Игорь Новиков",
    company: "ИП Новиков И.С.",
    role: "Владелец интернет-магазина",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Веду бизнес на маркетплейсах, много операций. BuhGo настроили интеграцию с 1С, теперь всё автоматически. Экономлю кучу времени. Спасибо за профессионализм!",
    date: "Ноябрь 2025",
    published: true,
  },
];

export const defaultContacts: ContactInfo = {
  phone: "8 963 963 96 66",
  email: "info@buhgalter.tech",
  address: "Москва",
  workingHours: "Пн-Пт: 09:00 - 17:00",
  vkLink: "https://vk.com/buhgalter.tech",
  telegramLink: "https://t.me/buhgaltertech",
};

export const defaultAbout: AboutInfo = {
  name: "Михаил Кулумбегов",
  photo: "https://ext.same-assets.com/2735709038/3096627619.png",
  bio: [
    "Кандидат экономических наук, основатель BuhGo",
    "Я начал заниматься бухгалтерией и финансами ещё в университете. Уже более 12 лет я сопровождаю бизнес разных масштабов, а несколько лет назад защитил кандидатскую диссертацию по экономике, дополнив практический опыт фундаментальной экспертизой. За это время через мою практику прошло более 200 компаний, и за весь период работы — ни одного штрафа у клиентов.",
    "Этот результат — следствие системного подхода. Когда бухгалтерия, налоги и юридические процессы не связаны между собой, бизнес теряет управляемость и деньги. Пока всё стабильно — это незаметно. Но в критический момент именно такие слабые места приводят к серьёзным потерям. Поэтому я создал BuhGo — систему, в которой финансовая часть бизнеса работает как единый механизм.",
    "Моя задача — не просто вести учёт. Я выстраиваю прозрачную финансовую модель, где вы видите реальные цифры, понимаете, что происходит с деньгами, контролируете риски и принимаете решения на основе точных данных. Это даёт главное — уверенность и контроль над бизнесом без хаоса и догадок.",
    "Я лично отвечаю за качество и конфиденциальность работы. При этом за результатом стоит не один человек. В BuhGo работает команда бухгалтеров, юристов и финансовых специалистов, каждый проходит мой личный отбор и работает по единым стандартам. Это исключает ошибки, ускоряет процессы и даёт дополнительный уровень контроля: каждая задача проходит через систему, а не зависит от одного исполнителя.",
    "Средняя оценка работы с клиентами — 5.0. Это результат не только качества, но и подхода: понятная коммуникация, соблюдение сроков и полная прозрачность процессов.",
    "Со мной вы работаете не с отдельным бухгалтером, а с системой, которая объединяет бухгалтерию, право и финансовое управление. Системой, которая защищает ваш бизнес от ошибок, снижает риски и помогает сохранять деньги внутри компании. Уже на первых этапах работы вы получаете понятную картину финансов и видите, где бизнес теряет ресурсы. Если для вас важны контроль, предсказуемость и устойчивый рост — начните с диалога: мы разберём вашу ситуацию и покажем, какие решения дадут результат уже сейчас.",
  ],
};

export const defaultImages: SiteImages = {
  heroImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop",
  heroImageAlt: "Бухгалтерские услуги",
};

// Helper functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Services CRUD
export function getServices(): Service[] {
  return getFromStorage(STORAGE_KEYS.services, defaultServices).sort((a, b) => a.order - b.order);
}

export function saveServices(services: Service[]): void {
  saveToStorage(STORAGE_KEYS.services, services);
}

export function updateService(id: string, updates: Partial<Service>): void {
  const services = getServices();
  const index = services.findIndex((s) => s.id === id);
  if (index !== -1) {
    services[index] = { ...services[index], ...updates };
    saveServices(services);
  }
}

export function addService(service: Omit<Service, "id">): Service {
  const services = getServices();
  const newService: Service = {
    ...service,
    id: Date.now().toString(),
  };
  services.push(newService);
  saveServices(services);
  return newService;
}

export function deleteService(id: string): void {
  const services = getServices().filter((s) => s.id !== id);
  saveServices(services);
}

// Partners CRUD
export function getPartners(): Partner[] {
  return getFromStorage(STORAGE_KEYS.partners, defaultPartners).sort((a, b) => a.order - b.order);
}

export function savePartners(partners: Partner[]): void {
  saveToStorage(STORAGE_KEYS.partners, partners);
}

export function updatePartner(id: string, updates: Partial<Partner>): void {
  const partners = getPartners();
  const index = partners.findIndex((p) => p.id === id);
  if (index !== -1) {
    partners[index] = { ...partners[index], ...updates };
    savePartners(partners);
  }
}

export function addPartner(partner: Omit<Partner, "id">): Partner {
  const partners = getPartners();
  const newPartner: Partner = {
    ...partner,
    id: Date.now().toString(),
  };
  partners.push(newPartner);
  savePartners(partners);
  return newPartner;
}

export function deletePartner(id: string): void {
  const partners = getPartners().filter((p) => p.id !== id);
  savePartners(partners);
}

// Testimonials CRUD
export function getTestimonials(): Testimonial[] {
  return getFromStorage(STORAGE_KEYS.testimonials, defaultTestimonials);
}

export function getPublishedTestimonials(): Testimonial[] {
  return getTestimonials().filter((t) => t.published);
}

export function saveTestimonials(testimonials: Testimonial[]): void {
  saveToStorage(STORAGE_KEYS.testimonials, testimonials);
}

export function updateTestimonial(id: string, updates: Partial<Testimonial>): void {
  const testimonials = getTestimonials();
  const index = testimonials.findIndex((t) => t.id === id);
  if (index !== -1) {
    testimonials[index] = { ...testimonials[index], ...updates };
    saveTestimonials(testimonials);
  }
}

export function addTestimonial(testimonial: Omit<Testimonial, "id">): Testimonial {
  const testimonials = getTestimonials();
  const newTestimonial: Testimonial = {
    ...testimonial,
    id: Date.now().toString(),
  };
  testimonials.push(newTestimonial);
  saveTestimonials(testimonials);
  return newTestimonial;
}

export function deleteTestimonial(id: string): void {
  const testimonials = getTestimonials().filter((t) => t.id !== id);
  saveTestimonials(testimonials);
}

// Contacts CRUD
export function getContacts(): ContactInfo {
  return getFromStorage(STORAGE_KEYS.contacts, defaultContacts);
}

export function saveContacts(contacts: ContactInfo): void {
  saveToStorage(STORAGE_KEYS.contacts, contacts);
}

// About CRUD
export function getAbout(): AboutInfo {
  return getFromStorage(STORAGE_KEYS.about, defaultAbout);
}

export function saveAbout(about: AboutInfo): void {
  saveToStorage(STORAGE_KEYS.about, about);
}

// Images CRUD
export function getSiteImages(): SiteImages {
  return getFromStorage(STORAGE_KEYS.images, defaultImages);
}

export function saveSiteImages(images: SiteImages): void {
  saveToStorage(STORAGE_KEYS.images, images);
}

// Reset to defaults
export function resetToDefaults(section?: string): void {
  if (!section || section === "services") {
    saveServices(defaultServices);
  }
  if (!section || section === "partners") {
    savePartners(defaultPartners);
  }
  if (!section || section === "testimonials") {
    saveTestimonials(defaultTestimonials);
  }
  if (!section || section === "contacts") {
    saveContacts(defaultContacts);
  }
  if (!section || section === "about") {
    saveAbout(defaultAbout);
  }
  if (!section || section === "images") {
    saveSiteImages(defaultImages);
  }
}

// Icon options for services
export const iconOptions = [
  "FileText",
  "FileCheck",
  "Building2",
  "Calculator",
  "Users",
  "Code",
  "Briefcase",
  "MessageSquare",
  "RefreshCw",
  "Shield",
  "Clock",
  "Award",
  "HeadphonesIcon",
  "Phone",
  "Mail",
  "CreditCard",
  "PieChart",
];
