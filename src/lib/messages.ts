// Messaging System for BuhGo

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "accountant" | "admin";
  recipientId: string;
  text: string;
  createdAt: string;
  readAt?: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

export interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  accountantId: string;
  accountantName: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "message" | "document" | "system" | "reminder";
  title: string;
  text: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// Storage keys
const STORAGE_KEYS = {
  messages: "buhgalter_messages",
  conversations: "buhgalter_conversations",
  notifications: "buhgalter_notifications",
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

// Demo data
const defaultConversations: Conversation[] = [
  {
    id: "conv-1",
    clientId: "client-1",
    clientName: "ООО «ТехноСервис»",
    accountantId: "acc-1",
    accountantName: "Мария Иванова",
    lastMessage: "Добрый день! Отправила вам акт на подпись.",
    lastMessageAt: "2026-04-01T10:30:00",
    unreadCount: 1,
    createdAt: "2024-02-01",
  },
  {
    id: "conv-2",
    clientId: "client-2",
    clientName: "ИП Смирнова Е.А.",
    accountantId: "acc-1",
    accountantName: "Мария Иванова",
    lastMessage: "Спасибо за декларацию!",
    lastMessageAt: "2026-03-28T15:45:00",
    unreadCount: 0,
    createdAt: "2024-03-15",
  },
  {
    id: "conv-3",
    clientId: "client-3",
    clientName: "ООО «Строй-Мастер»",
    accountantId: "acc-2",
    accountantName: "Анна Петрова",
    lastMessage: "Когда можно ожидать отчёт?",
    lastMessageAt: "2026-04-01T09:15:00",
    unreadCount: 2,
    createdAt: "2024-05-01",
  },
];

const defaultMessages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    senderId: "acc-1",
    senderName: "Мария Иванова",
    senderRole: "accountant",
    recipientId: "client-1",
    text: "Добрый день! Отправила вам акт на подпись. Пожалуйста, проверьте и подпишите.",
    createdAt: "2026-04-01T10:30:00",
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    senderId: "client-1",
    senderName: "Алексей Петров",
    senderRole: "client",
    recipientId: "acc-1",
    text: "Здравствуйте! Хорошо, сейчас посмотрю.",
    createdAt: "2026-04-01T10:25:00",
    readAt: "2026-04-01T10:26:00",
  },
  {
    id: "msg-3",
    conversationId: "conv-2",
    senderId: "client-2",
    senderName: "Елена Смирнова",
    senderRole: "client",
    recipientId: "acc-1",
    text: "Спасибо за декларацию! Всё подписала.",
    createdAt: "2026-03-28T15:45:00",
    readAt: "2026-03-28T16:00:00",
  },
  {
    id: "msg-4",
    conversationId: "conv-3",
    senderId: "client-3",
    senderName: "Дмитрий Козлов",
    senderRole: "client",
    recipientId: "acc-2",
    text: "Когда можно ожидать отчёт за первый квартал?",
    createdAt: "2026-04-01T09:15:00",
  },
];

const defaultNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "acc-1",
    type: "message",
    title: "Новое сообщение",
    text: "Алексей Петров написал вам сообщение",
    link: "/accountant/messages?conv=conv-1",
    read: false,
    createdAt: "2026-04-01T10:25:00",
  },
  {
    id: "notif-2",
    userId: "acc-1",
    type: "document",
    title: "Документ подписан",
    text: "Елена Смирнова подписала декларацию УСН",
    link: "/accountant/documents",
    read: true,
    createdAt: "2026-03-28T15:50:00",
  },
  {
    id: "notif-3",
    userId: "acc-2",
    type: "message",
    title: "Новое сообщение",
    text: "Дмитрий Козлов написал вам сообщение",
    link: "/accountant/messages?conv=conv-3",
    read: false,
    createdAt: "2026-04-01T09:15:00",
  },
];

// Conversations CRUD
export function getConversations(): Conversation[] {
  return getFromStorage(STORAGE_KEYS.conversations, defaultConversations);
}

export function saveConversations(conversations: Conversation[]): void {
  saveToStorage(STORAGE_KEYS.conversations, conversations);
}

export function getConversationById(id: string): Conversation | undefined {
  return getConversations().find((c) => c.id === id);
}

export function getConversationsByAccountant(accountantId: string): Conversation[] {
  return getConversations()
    .filter((c) => c.accountantId === accountantId)
    .sort((a, b) =>
      new Date(b.lastMessageAt || b.createdAt).getTime() -
      new Date(a.lastMessageAt || a.createdAt).getTime()
    );
}

export function getConversationsByClient(clientId: string): Conversation[] {
  return getConversations()
    .filter((c) => c.clientId === clientId)
    .sort((a, b) =>
      new Date(b.lastMessageAt || b.createdAt).getTime() -
      new Date(a.lastMessageAt || a.createdAt).getTime()
    );
}

export function getOrCreateConversation(
  clientId: string,
  clientName: string,
  accountantId: string,
  accountantName: string
): Conversation {
  const conversations = getConversations();
  const existing = conversations.find(
    (c) => c.clientId === clientId && c.accountantId === accountantId
  );

  if (existing) return existing;

  const newConv: Conversation = {
    id: `conv-${Date.now()}`,
    clientId,
    clientName,
    accountantId,
    accountantName,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  };

  conversations.push(newConv);
  saveConversations(conversations);
  return newConv;
}

// Messages CRUD
export function getMessages(): Message[] {
  return getFromStorage(STORAGE_KEYS.messages, defaultMessages);
}

export function saveMessages(messages: Message[]): void {
  saveToStorage(STORAGE_KEYS.messages, messages);
}

export function getMessagesByConversation(conversationId: string): Message[] {
  return getMessages()
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  senderRole: "client" | "accountant" | "admin",
  recipientId: string,
  text: string,
  attachments?: MessageAttachment[]
): Message {
  const messages = getMessages();
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId,
    senderName,
    senderRole,
    recipientId,
    text,
    createdAt: new Date().toISOString(),
    attachments,
  };

  messages.push(newMessage);
  saveMessages(messages);

  // Update conversation
  const conversations = getConversations();
  const convIndex = conversations.findIndex((c) => c.id === conversationId);
  if (convIndex !== -1) {
    conversations[convIndex].lastMessage = text.substring(0, 100);
    conversations[convIndex].lastMessageAt = newMessage.createdAt;
    conversations[convIndex].unreadCount += 1;
    saveConversations(conversations);
  }

  // Create notification for recipient
  addNotification({
    userId: recipientId,
    type: "message",
    title: "Новое сообщение",
    text: `${senderName} написал вам сообщение`,
    link: senderRole === "accountant"
      ? `/dashboard?tab=messages`
      : `/accountant/messages?conv=${conversationId}`,
    read: false,
  });

  // Trigger browser push notification if sender is accountant (notify client)
  if (senderRole === "accountant" && typeof window !== "undefined") {
    triggerPushNotification("message", senderName, text.substring(0, 100));
  }

  return newMessage;
}

// Trigger browser push notification
async function triggerPushNotification(
  type: "message" | "document" | "status",
  senderName: string,
  preview: string
): Promise<void> {
  // Dynamically import to avoid SSR issues
  try {
    const { showLocalNotification, shouldShowNotification } = await import("./push-notifications");

    if (!shouldShowNotification(type)) return;

    const notificationConfig = {
      message: {
        title: `Сообщение от ${senderName}`,
        body: preview,
        url: "/dashboard?tab=messages",
      },
      document: {
        title: "Новый документ",
        body: `${senderName} загрузил документ: ${preview}`,
        url: "/dashboard?tab=documents",
      },
      status: {
        title: "Статус документа изменён",
        body: preview,
        url: "/dashboard?tab=documents",
      },
    };

    const config = notificationConfig[type];
    await showLocalNotification(config.title, {
      body: config.body,
      type,
      url: config.url,
      tag: type,
    });
  } catch (error) {
    console.log("Push notification not available:", error);
  }
}

export function markMessagesAsRead(conversationId: string, userId: string): void {
  const messages = getMessages();
  const now = new Date().toISOString();

  messages.forEach((m) => {
    if (m.conversationId === conversationId && m.recipientId === userId && !m.readAt) {
      m.readAt = now;
    }
  });

  saveMessages(messages);

  // Reset unread count
  const conversations = getConversations();
  const convIndex = conversations.findIndex((c) => c.id === conversationId);
  if (convIndex !== -1) {
    conversations[convIndex].unreadCount = 0;
    saveConversations(conversations);
  }
}

// Notifications CRUD
export function getNotifications(): Notification[] {
  return getFromStorage(STORAGE_KEYS.notifications, defaultNotifications);
}

export function saveNotifications(notifications: Notification[]): void {
  saveToStorage(STORAGE_KEYS.notifications, notifications);
}

export function getNotificationsByUser(userId: string): Notification[] {
  return getNotifications()
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUnreadNotificationCount(userId: string): number {
  return getNotifications().filter((n) => n.userId === userId && !n.read).length;
}

export function addNotification(notification: Omit<Notification, "id" | "createdAt">): Notification {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  notifications.push(newNotification);
  saveNotifications(notifications);
  return newNotification;
}

export function markNotificationAsRead(id: string): void {
  const notifications = getNotifications();
  const index = notifications.findIndex((n) => n.id === id);
  if (index !== -1) {
    notifications[index].read = true;
    saveNotifications(notifications);
  }
}

export function markAllNotificationsAsRead(userId: string): void {
  const notifications = getNotifications();
  notifications.forEach((n) => {
    if (n.userId === userId) {
      n.read = true;
    }
  });
  saveNotifications(notifications);
}

export function deleteNotification(id: string): void {
  const notifications = getNotifications().filter((n) => n.id !== id);
  saveNotifications(notifications);
}

// Reset to defaults
export function resetMessagesToDefaults(): void {
  saveConversations(defaultConversations);
  saveMessages(defaultMessages);
  saveNotifications(defaultNotifications);
}
