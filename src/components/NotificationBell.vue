<template>
  <div class="relative" ref="bellRef">
    <!-- Przycisk dzwonka -->
    <button
      @click="togglePanel"
      class="relative w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#1a3b22] dark:hover:text-green-400 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors"
      title="Notifications"
    >
      <Bell class="w-4 h-4" />

      <!-- Badge z liczbą nieprzeczytanych -->
      <Transition name="badge-pop">
        <span
          v-if="notifStore.unreadCount > 0"
          class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none"
        >
          {{ notifStore.unreadCount > 99 ? '99+' : notifStore.unreadCount }}
        </span>
      </Transition>
    </button>

    <!-- Panel z historią powiadomień -->
    <Teleport to="body">
      <Transition name="panel-slide">
        <div
          v-if="open"
          class="fixed z-[9997] w-80 rounded-2xl shadow-2xl bg-white dark:bg-[#1a1c1e] border border-gray-200 dark:border-white/10 overflow-hidden"
          :style="panelStyle"
        >
          <!-- Nagłówek panelu -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/10">
            <span class="text-[13px] font-bold text-gray-800 dark:text-white">Notifications</span>
            <div class="flex items-center gap-1.5">
              <button
                v-if="notifStore.unreadCount > 0"
                @click="notifStore.markAllAsRead()"
                class="text-[10px] font-semibold text-[#2d6a4f] dark:text-green-400 hover:underline"
              >
                Mark all as read
              </button>
              <button
                v-if="notifStore.notifications.length > 0"
                @click="notifStore.clearAll()"
                class="text-[10px] font-semibold text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>

          <!-- Lista powiadomień -->
          <ul class="max-h-72 overflow-y-auto notification-scroll divide-y divide-gray-100 dark:divide-white/5">
            <li
              v-for="notif in notifStore.notifications"
              :key="notif.id"
              class="flex items-start gap-3 px-4 py-3 transition-colors"
              :class="notif.read
                ? 'bg-transparent'
                : 'bg-green-50/60 dark:bg-green-900/10'"
            >
              <!-- Dot nieprzeczytanego -->
              <div class="shrink-0 mt-1.5">
                <div
                  class="w-1.5 h-1.5 rounded-full transition-colors"
                  :class="notif.read ? 'bg-transparent' : 'bg-green-500'"
                />
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-[12px] font-semibold text-gray-800 dark:text-gray-100 leading-tight truncate">
                  {{ notif.title }}
                </p>
                <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-snug mt-0.5 line-clamp-2">
                  {{ notif.message }}
                </p>
                <p class="text-[10px] text-gray-400 dark:text-gray-600 mt-1">
                  {{ formatDate(notif.createdAt) }}
                </p>
              </div>
            </li>

            <!-- Brak powiadomień -->
            <li v-if="notifStore.notifications.length === 0" class="px-4 py-8 text-center">
              <Bell class="w-7 h-7 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p class="text-[12px] text-gray-400 dark:text-gray-500">No notifications</p>
            </li>
          </ul>
        </div>
      </Transition>

      <!-- Backdrop klikania poza panel -->
      <div
        v-if="open"
        class="fixed inset-0 z-[9996]"
        @click="open = false"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Bell } from 'lucide-vue-next';
import { useNotificationToast } from '../composables/useNotificationToast';

const notifStore = useNotificationToast();
const open = ref(false);
const bellRef = ref(null);

function togglePanel() {
  open.value = !open.value;
  if (open.value) notifStore.markAllAsRead();
}

// Pozycjonowanie panelu pod dzwonkiem
const panelStyle = computed(() => {
  if (!bellRef.value) return {};
  const rect = bellRef.value.getBoundingClientRect();
  return {
    top: `${rect.bottom + 8}px`,
    right: `${window.innerWidth - rect.right}px`,
  };
});

function formatDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const diffMin = Math.floor((now - date) / 60000);
  if (diffMin < 1)  return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)   return `${diffH} hrs ago`;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
.badge-pop-enter-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.badge-pop-leave-active { transition: all 0.15s ease-in; }
.badge-pop-enter-from,
.badge-pop-leave-to     { opacity: 0; transform: scale(0.5); }

.panel-slide-enter-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.panel-slide-leave-active { transition: all 0.15s ease-in; }
.panel-slide-enter-from,
.panel-slide-leave-to     { opacity: 0; transform: translateY(-0.5rem) scale(0.97); }

.notification-scroll { scrollbar-width: thin; scrollbar-color: rgba(45,106,79,0.2) transparent; }
.notification-scroll::-webkit-scrollbar { width: 4px; }
.notification-scroll::-webkit-scrollbar-thumb { background: rgba(45,106,79,0.2); border-radius: 4px; }
</style>
