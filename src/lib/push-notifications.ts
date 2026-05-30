// Push Notifications Library

export type NotificationType =
  | 'document'      // New document uploaded
  | 'message'       // New message from accountant
  | 'reminder'      // Payment or deadline reminder
  | 'status'        // Document status change
  | 'system'        // System notifications
  | 'promo';        // Promotional notifications

export interface PushNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: { action: string; title: string }[];
  createdAt: Date;
}

export interface NotificationPreferences {
  enabled: boolean;
  documents: boolean;
  messages: boolean;
  reminders: boolean;
  statusUpdates: boolean;
  promo: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string;
}

export interface StoredSubscription {
  endpoint: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
  createdAt: string;
}

// Default preferences
const defaultPreferences: NotificationPreferences = {
  enabled: true,
  documents: true,
  messages: true,
  reminders: true,
  statusUpdates: true,
  promo: false,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
};

// Storage keys
const SUBSCRIPTION_KEY = 'push_subscription';
const PREFERENCES_KEY = 'notification_preferences';
const NOTIFICATIONS_KEY = 'push_notifications_history';

// Check if push notifications are supported
export const isPushSupported = (): boolean => {
  return typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;
};

// Check notification permission
export const getPermissionStatus = (): NotificationPermission | 'unsupported' => {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
};

// Request notification permission
export const requestPermission = async (): Promise<NotificationPermission> => {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported');
  }
  return await Notification.requestPermission();
};

// Register service worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    console.log('Service Worker registered:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

// Get current subscription
export const getSubscription = async (): Promise<PushSubscription | null> => {
  if (!isPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
};

// Subscribe to push notifications
export const subscribe = async (): Promise<PushSubscription | null> => {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported');
  }

  const permission = await requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // VAPID public key (in production, use environment variable)
    // This is a demo key - replace with your own in production
    const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // Save subscription locally
    saveSubscriptionLocal(subscription);

    // In production, send to server
    await sendSubscriptionToServer(subscription);

    console.log('Push subscription created:', subscription);
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    throw error;
  }
};

// Unsubscribe from push notifications
export const unsubscribe = async (): Promise<boolean> => {
  try {
    const subscription = await getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      localStorage.removeItem(SUBSCRIPTION_KEY);

      // In production, notify server
      await removeSubscriptionFromServer(subscription);

      return true;
    }
    return false;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return false;
  }
};

// Save subscription locally
const saveSubscriptionLocal = (subscription: PushSubscription): void => {
  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription.toJSON()));
};

// Send subscription to server (mock)
const sendSubscriptionToServer = async (subscription: PushSubscription): Promise<void> => {
  // In production, send to your backend
  console.log('Subscription to send to server:', subscription.toJSON());

  // Store in localStorage for demo
  const subscriptions = getStoredSubscriptions();
  const subJson = subscription.toJSON();
  const storedSub: StoredSubscription = {
    endpoint: subscription.endpoint,
    keys: subJson.keys as StoredSubscription['keys'],
    createdAt: new Date().toISOString(),
  };
  subscriptions.push(storedSub);
  localStorage.setItem('push_subscriptions_list', JSON.stringify(subscriptions));
};

// Remove subscription from server (mock)
const removeSubscriptionFromServer = async (subscription: PushSubscription): Promise<void> => {
  console.log('Removing subscription from server:', subscription.endpoint);

  const subscriptions = getStoredSubscriptions();
  const filtered = subscriptions.filter((s: StoredSubscription) => s.endpoint !== subscription.endpoint);
  localStorage.setItem('push_subscriptions_list', JSON.stringify(filtered));
};

// Get stored subscriptions (for admin)
export const getStoredSubscriptions = (): StoredSubscription[] => {
  const stored = localStorage.getItem('push_subscriptions_list');
  return stored ? JSON.parse(stored) : [];
};

// Get notification preferences
export const getPreferences = (): NotificationPreferences => {
  if (typeof window === 'undefined') return defaultPreferences;

  const stored = localStorage.getItem(PREFERENCES_KEY);
  if (stored) {
    try {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    } catch {
      return defaultPreferences;
    }
  }
  return defaultPreferences;
};

// Save notification preferences
export const savePreferences = (preferences: Partial<NotificationPreferences>): void => {
  const current = getPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
};

// Check if in quiet hours
export const isInQuietHours = (): boolean => {
  const prefs = getPreferences();
  if (!prefs.quietHoursEnabled) return false;

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const start = prefs.quietHoursStart;
  const end = prefs.quietHoursEnd;

  // Handle overnight quiet hours (e.g., 22:00 - 08:00)
  if (start > end) {
    return currentTime >= start || currentTime < end;
  }

  return currentTime >= start && currentTime < end;
};

// Should show notification based on type and preferences
export const shouldShowNotification = (type: NotificationType): boolean => {
  const prefs = getPreferences();

  if (!prefs.enabled) return false;
  if (isInQuietHours() && type !== 'system') return false;

  switch (type) {
    case 'document':
      return prefs.documents;
    case 'message':
      return prefs.messages;
    case 'reminder':
      return prefs.reminders;
    case 'status':
      return prefs.statusUpdates;
    case 'promo':
      return prefs.promo;
    case 'system':
      return true; // System notifications always show
    default:
      return true;
  }
};

// Show local notification (for testing)
export const showLocalNotification = async (
  title: string,
  options: NotificationOptions & { type?: NotificationType; url?: string }
): Promise<void> => {
  const type = options.type || 'system';

  if (!shouldShowNotification(type)) {
    console.log('Notification blocked by preferences:', type);
    return;
  }

  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    const notificationOptions: NotificationOptions & { vibrate?: number[] } = {
      body: options.body,
      icon: options.icon || '/icon.svg',
      badge: '/icon.svg',
      tag: options.tag || type,
      data: { url: options.url || '/dashboard', type },
      vibrate: [100, 50, 100],
      ...options,
    };

    await registration.showNotification(title, notificationOptions);

    // Save to history
    saveNotificationToHistory({
      id: `notif-${Date.now()}`,
      type,
      title,
      body: options.body || '',
      url: options.url,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

// Save notification to history
const saveNotificationToHistory = (notification: PushNotification): void => {
  const history = getNotificationHistory();
  history.unshift(notification);
  // Keep last 50 notifications
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(history.slice(0, 50)));
};

// Get notification history
export const getNotificationHistory = (): PushNotification[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(NOTIFICATIONS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

// Clear notification history
export const clearNotificationHistory = (): void => {
  localStorage.removeItem(NOTIFICATIONS_KEY);
};

// Helper: Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Notification templates
export const notificationTemplates = {
  newDocument: (docName: string, accountantName: string) => ({
    title: 'Новый документ',
    body: `${accountantName} загрузил документ: ${docName}`,
    type: 'document' as NotificationType,
    url: '/dashboard?tab=documents',
  }),

  newMessage: (senderName: string, preview: string) => ({
    title: `Сообщение от ${senderName}`,
    body: preview.length > 100 ? preview.slice(0, 100) + '...' : preview,
    type: 'message' as NotificationType,
    url: '/dashboard?tab=messages',
  }),

  documentStatusChanged: (docName: string, status: string) => ({
    title: 'Статус документа изменён',
    body: `"${docName}" — ${status}`,
    type: 'status' as NotificationType,
    url: '/dashboard?tab=documents',
  }),

  paymentReminder: (amount: string, dueDate: string) => ({
    title: 'Напоминание об оплате',
    body: `Сумма: ${amount}. Срок: ${dueDate}`,
    type: 'reminder' as NotificationType,
    url: '/dashboard',
  }),

  reportReminder: (reportName: string, dueDate: string) => ({
    title: 'Срок сдачи отчётности',
    body: `${reportName} необходимо сдать до ${dueDate}`,
    type: 'reminder' as NotificationType,
    url: '/dashboard',
  }),
};

// Initialize push notifications
export const initializePushNotifications = async (): Promise<boolean> => {
  if (!isPushSupported()) {
    console.log('Push notifications not supported');
    return false;
  }

  try {
    // Register service worker
    await registerServiceWorker();

    // Check if already subscribed
    const subscription = await getSubscription();
    if (subscription) {
      console.log('Already subscribed to push notifications');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
};
