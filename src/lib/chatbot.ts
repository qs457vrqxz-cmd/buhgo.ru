// Chatbot FAQ responses and logic

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  quickReplies?: string[];
}

export interface FAQ {
  keywords: string[];
  question: string;
  answer: string;
  quickReplies?: string[];
}

// FAQ database
const faqDatabase: FAQ[] = [
  {
    keywords: ["цена", "стоимость", "сколько", "тариф", "прайс", "расценки"],
    question: "Сколько стоят ваши услуги?",
    answer: "Стоимость зависит от типа услуги и объёма работ:\n\n• Ведение бухучёта — от 10 000 руб/мес\n• Нулевая отчётность — от 5 000 руб/мес\n• Регистрация ИП/ООО — от 0 руб\n• Консультация — от 500 руб\n\nДля точного расчёта оставьте заявку, и мы подготовим индивидуальное предложение.",
    quickReplies: ["Оставить заявку", "Какие документы нужны?", "Связаться с менеджером"],
  },
  {
    keywords: ["документ", "документы", "нужно", "требуется", "подготовить"],
    question: "Какие документы нужны для начала работы?",
    answer: "Для начала сотрудничества нам понадобятся:\n\n• Копия паспорта руководителя\n• Свидетельство о регистрации ИП/ООО\n• Выписка из ЕГРИП/ЕГРЮЛ\n• Реквизиты банковского счёта\n\nВсё остальное мы поможем подготовить!",
    quickReplies: ["Как передать документы?", "Сколько это стоит?", "Оставить заявку"],
  },
  {
    keywords: ["регистрация", "открыть", "зарегистрировать", "ип", "ооо", "создать"],
    question: "Как зарегистрировать ИП или ООО?",
    answer: "Мы помогаем с регистрацией бизнеса «под ключ»:\n\n1. Консультация по выбору формы (ИП/ООО)\n2. Подготовка всех документов\n3. Подача в налоговую\n4. Получение документов\n5. Открытие расчётного счёта\n\nСрок: 3-5 рабочих дней. Стоимость — от 0 руб (при открытии счёта у партнёров).",
    quickReplies: ["ИП или ООО — что выбрать?", "Сколько стоит?", "Оставить заявку"],
  },
  {
    keywords: ["налог", "усн", "осно", "патент", "система", "налогообложение"],
    question: "Какую систему налогообложения выбрать?",
    answer: "Выбор зависит от вашего бизнеса:\n\n• УСН 6% — подходит для услуг с минимальными расходами\n• УСН 15% — если много расходов\n• Патент — для определённых видов деятельности\n• ОСНО — для работы с НДС\n\nМы поможем выбрать оптимальный вариант и рассчитаем налоговую нагрузку.",
    quickReplies: ["Нужна консультация", "Сколько стоит расчёт?", "Связаться с бухгалтером"],
  },
  {
    keywords: ["отчёт", "отчётность", "сдать", "декларация", "срок", "когда"],
    question: "Когда нужно сдавать отчётность?",
    answer: "Основные сроки сдачи отчётности:\n\n• УСН: до 25 апреля (ИП), до 25 марта (ООО)\n• НДС: ежеквартально до 25 числа\n• 6-НДФЛ: ежеквартально\n• Страховые взносы: ежемесячно\n\nМы отслеживаем все сроки и напоминаем заранее!",
    quickReplies: ["Сдать отчётность", "Нулевая отчётность", "Оставить заявку"],
  },
  {
    keywords: ["1с", "программа", "интеграция", "настройка", "доработка"],
    question: "Вы работаете с 1С?",
    answer: "Да, мы оказываем полный спектр услуг по 1С:\n\n• Настройка и доработка программ\n• Интеграция с банками и сервисами\n• Обновление конфигураций\n• Обучение сотрудников\n• Поддержка и консультации\n\nРаботаем с любыми конфигурациями 1С.",
    quickReplies: ["Нужна настройка 1С", "Сколько стоит?", "Связаться со специалистом"],
  },
  {
    keywords: ["контакт", "связь", "телефон", "позвонить", "написать", "адрес"],
    question: "Как с вами связаться?",
    answer: "Связаться с нами можно несколькими способами:\n\n📞 Телефон: 8 963 963 96 66\n📧 Email: info@buhgalter.tech\n💬 Telegram: @buhgaltertech\n\nРежим работы: Пн-Пт 09:00-17:00\n\nИли оставьте заявку, и мы перезвоним в течение 15 минут!",
    quickReplies: ["Оставить заявку", "Написать в Telegram", "Перейти на страницу контактов"],
  },
  {
    keywords: ["нулевая", "ноль", "деятельность", "приостановить", "не работаю"],
    question: "Что такое нулевая отчётность?",
    answer: "Нулевая отчётность — это сдача деклараций при отсутствии деятельности.\n\nДаже если вы не ведёте бизнес, сдавать отчётность обязательно!\n\nСтоимость: от 5 000 руб/мес\n\nМы возьмём это на себя — вам не нужно думать о сроках.",
    quickReplies: ["Заказать нулевую отчётность", "Сколько стоит?", "Нужна консультация"],
  },
  {
    keywords: ["ликвидация", "закрыть", "закрытие", "прекратить"],
    question: "Как закрыть ИП или ООО?",
    answer: "Ликвидация бизнеса включает:\n\n• Подготовку документов\n• Сдачу финальной отчётности\n• Уведомление налоговой и фондов\n• Снятие с учёта ККТ (если есть)\n• Закрытие расчётного счёта\n\nСрок: от 1 недели (ИП) до 3 месяцев (ООО).",
    quickReplies: ["Узнать стоимость", "Нужна консультация", "Оставить заявку"],
  },
  {
    keywords: ["привет", "здравствуй", "добрый", "приветствую", "хай", "hello"],
    question: "Приветствие",
    answer: "Здравствуйте! 👋\n\nЯ виртуальный помощник BuhGo. Могу ответить на вопросы о наших услугах, ценах и помочь оставить заявку.\n\nО чём хотите узнать?",
    quickReplies: ["Стоимость услуг", "Регистрация ИП/ООО", "Связаться с менеджером"],
  },
];

// Default response when no match found
const defaultResponse: ChatMessage = {
  id: "",
  text: "Извините, я не совсем понял ваш вопрос. Попробуйте переформулировать или выберите один из вариантов ниже.\n\nТакже вы можете связаться с нашим специалистом напрямую по телефону 8 963 963 96 66.",
  sender: "bot",
  timestamp: new Date(),
  quickReplies: ["Стоимость услуг", "Какие документы нужны?", "Связаться с менеджером", "Оставить заявку"],
};

// Generate unique ID
const generateId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Find best matching FAQ
const findBestMatch = (userMessage: string): FAQ | null => {
  const lowerMessage = userMessage.toLowerCase();

  let bestMatch: FAQ | null = null;
  let maxScore = 0;

  for (const faq of faqDatabase) {
    let score = 0;
    for (const keyword of faq.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = faq;
    }
  }

  return maxScore > 0 ? bestMatch : null;
};

// Process user message and generate response
export const processMessage = (userMessage: string): ChatMessage => {
  const match = findBestMatch(userMessage);

  if (match) {
    return {
      id: generateId(),
      text: match.answer,
      sender: "bot",
      timestamp: new Date(),
      quickReplies: match.quickReplies,
    };
  }

  return {
    ...defaultResponse,
    id: generateId(),
    timestamp: new Date(),
  };
};

// Handle quick reply actions
export const handleQuickReply = (reply: string): ChatMessage | { action: string; url?: string } => {
  const lowerReply = reply.toLowerCase();

  // Check for action triggers
  if (lowerReply.includes("оставить заявку") || lowerReply.includes("заказать")) {
    return { action: "openForm", url: "/contacts#form" };
  }

  if (lowerReply.includes("связаться с менеджером") || lowerReply.includes("связаться со специалистом") || lowerReply.includes("связаться с бухгалтером")) {
    return { action: "call", url: "tel:+79639639666" };
  }

  if (lowerReply.includes("telegram") || lowerReply.includes("написать в telegram")) {
    return { action: "telegram", url: "https://t.me/buhgaltertech" };
  }

  if (lowerReply.includes("контакт")) {
    return { action: "navigate", url: "/contacts" };
  }

  // Process as regular message
  return processMessage(reply);
};

// Get welcome message
export const getWelcomeMessage = (): ChatMessage => {
  return {
    id: generateId(),
    text: "Здравствуйте! 👋\n\nЯ виртуальный помощник BuhGo. Готов ответить на ваши вопросы о бухгалтерских услугах.\n\nЧем могу помочь?",
    sender: "bot",
    timestamp: new Date(),
    quickReplies: ["Стоимость услуг", "Регистрация ИП/ООО", "Нужна консультация", "Связаться с менеджером"],
  };
};

// Storage functions
const CHAT_STORAGE_KEY = "buhgalter_chat_history";

export const saveChatHistory = (messages: ChatMessage[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-50))); // Keep last 50 messages
  }
};

export const loadChatHistory = (): ChatMessage[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
  }
  return [];
};

export const clearChatHistory = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }
};
