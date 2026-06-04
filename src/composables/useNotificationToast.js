import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useNotificationToast = defineStore('notificationToast', () => {
  const notifications = ref([]);
  const toasts = ref([]);
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

  function add(notification) {
    const id = Date.now();

    notifications.value.unshift({
      id,
      title: notification.title ?? notification.Title,
      message: notification.message ?? notification.Message,
      createdAt: notification.createdAt ?? notification.CreatedAt ?? new Date().toISOString(),
      read: false,
    });

    // Dodaj do kolejki toastów — znika po 5s
    toasts.value.push({ id, title: notification.title ?? notification.Title, message: notification.message ?? notification.Message });
    setTimeout(() => dismissToast(id), 5000);
  }

  /** Usuwa toast z kolejki (ręcznie lub po timeout). */
  function dismissToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }

  /** Oznacza wszystkie powiadomienia jako przeczytane. */
  function markAllAsRead() {
    notifications.value.forEach(n => (n.read = true));
  }

  /** Czyści całą historię powiadomień. */
  function clearAll() {
    notifications.value = [];
  }

  return {
    notifications,
    toasts,
    unreadCount,
    add,
    dismissToast,
    markAllAsRead,
    clearAll,
  };
});
