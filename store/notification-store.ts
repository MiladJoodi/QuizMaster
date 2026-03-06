import { create } from 'zustand';
import { Notification } from '@/lib/types';
import { notifications as initialNotifications } from '@/lib/data';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  deleteNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter(n => !n.isRead).length,
  markAsRead: (id) => {
    set(state => {
      const notifications = state.notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length,
      };
    });
  },
  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set(state => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    }));
  },
  deleteNotification: (id) => {
    set(state => {
      const notification = state.notifications.find(n => n.id === id);
      const notifications = state.notifications.filter(n => n.id !== id);
      return {
        notifications,
        unreadCount: notification && !notification.isRead ? state.unreadCount - 1 : state.unreadCount,
      };
    });
  },
}));
