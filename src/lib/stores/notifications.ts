import { writable } from 'svelte/store';
import type { Notification } from '../types';

// Notification state
export const notifications = writable<Notification[]>([]);
export const unreadCount = writable<number>(0);

// Notification functions
export const notificationFunctions = {
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date()
    };

    notifications.update(notifs => [newNotification, ...notifs]);
    unreadCount.update(count => count + 1);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      notifications.subscribe(notifs => {
        localStorage.setItem('edu-ruang-notifications', JSON.stringify(notifs));
      });
    }
  },

  markAsRead: (notificationId: string) => {
    notifications.update(notifs =>
      notifs.map(notif =>
        notif.id === notificationId && !notif.isRead
          ? { ...notif, isRead: true }
          : notif
      )
    );
    unreadCount.update(count => Math.max(0, count - 1));
  },

  markAllAsRead: () => {
    notifications.update(notifs =>
      notifs.map(notif => ({ ...notif, isRead: true }))
    );
    unreadCount.set(0);
  },

  clearNotification: (notificationId: string) => {
    notifications.update(notifs => notifs.filter(notif => notif.id !== notificationId));
  }
};

// Initialize notifications from localStorage
if (typeof window !== 'undefined') {
  const storedNotifications = localStorage.getItem('edu-ruang-notifications');
  if (storedNotifications) {
    try {
      const notifs = JSON.parse(storedNotifications);
      notifications.set(notifs);
      unreadCount.set(notifs.filter((n: Notification) => !n.isRead).length);
    } catch (e) {
      localStorage.removeItem('edu-ruang-notifications');
    }
  }
}