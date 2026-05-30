// Service Worker for Push Notifications
const CACHE_NAME = 'buhgalter-tech-v1';
const OFFLINE_URL = '/offline.html';

// Install event - cache offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  let data = {
    title: 'Buhgalter.tech',
    body: 'У вас новое уведомление',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'default',
    data: { url: '/dashboard' },
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/badge-72.png',
    tag: data.tag || 'default',
    data: data.data || { url: '/dashboard' },
    vibrate: [100, 50, 100],
    actions: data.actions || [
      { action: 'open', title: 'Открыть' },
      { action: 'close', title: 'Закрыть' },
    ],
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'close') {
    return;
  }

  // Open the URL from notification data
  const urlToOpen = data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(urlToOpen);
          return;
        }
      }
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  // Track notification dismissal if needed
  console.log('Notification closed:', event.notification.tag);
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  // Sync pending notifications when back online
  console.log('Syncing notifications...');
}

// Message handler for client communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
