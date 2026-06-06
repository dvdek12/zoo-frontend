<template>
  <div class="h-full flex flex-col">
    <!-- Banner -->
    <PageBanner
      title="Notifications"
      eyebrow="Zoo Management"
      subtitle="Your latest system notifications"
      image="/banner_dashboard.png"
      image-position="center 40%"
      :stats="bannerStats"
    />

    <div class="px-8 pt-6 pb-8 flex flex-col flex-1 overflow-hidden">

      <!-- Toolbar -->
      <div class="flex items-center gap-3 mb-5 flex-wrap shrink-0">
        <!-- Filter pills -->
        <div class="flex items-center gap-2 flex-wrap">
          <button
            v-for="f in filterOptions"
            :key="f.key"
            @click="activeFilter = f.key"
            :class="[
              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border',
              activeFilter === f.key
                ? 'bg-[#2d6a4f] text-white border-[#2d6a4f] shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-[#2d6a4f] dark:hover:border-green-400 hover:text-[#2d6a4f] dark:hover:text-green-400'
            ]"
          >
            {{ f.label }}
            <span
              :class="[
                'inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-extrabold',
                activeFilter === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
              ]"
            >{{ f.count }}</span>
          </button>
        </div>

        <!-- Refresh button -->
        <button
          @click="fetchNotifications"
          :disabled="isLoading"
          class="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:border-[#2d6a4f] hover:text-[#2d6a4f] dark:hover:border-green-400 dark:hover:text-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            :class="['w-3.5 h-3.5', isLoading ? 'animate-spin' : '']"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
          Refresh
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading && notifications.length === 0" class="flex flex-col items-center justify-center flex-1 gap-4">
        <div class="w-10 h-10 rounded-full border-[3px] border-[#2d6a4f]/20 border-t-[#2d6a4f] animate-spin"></div>
        <p class="text-sm text-gray-400 font-medium">Loading notifications…</p>
      </div>

      <!-- Empty state (brak powiadomień lub błąd) -->
      <div v-else-if="filteredNotifications.length === 0" class="flex flex-col items-center justify-center flex-1 gap-3">
        <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg class="w-8 h-8 stroke-gray-300 dark:stroke-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {{ activeFilter === 'unread' ? 'No unread notifications' : 'No notifications' }}
        </p>
        <p class="text-xs text-gray-300 dark:text-gray-600 text-center">
          {{ activeFilter === 'unread' ? 'All notifications have been read.' : 'You do not have any notifications yet.' }}
        </p>
      </div>

      <!-- Notifications list -->
      <div v-else class="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <TransitionGroup name="notif-list" tag="div" class="flex flex-col gap-3 pb-4">
          <div
            v-for="notif in filteredNotifications"
            :key="notif.id"
            :class="[
              'group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200',
              notif.isRead
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                : 'bg-[#f0f9f4] dark:bg-[#132a1e] border-[#2d6a4f]/30 dark:border-green-700/40 border-l-[3px] border-l-[#2d6a4f] dark:border-l-green-500 shadow-sm'
            ]"
          >
            <!-- Icon container -->
            <div
              :class="[
                'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
                notif.isRead
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : 'bg-[#2d6a4f]/10 dark:bg-green-400/10'
              ]"
            >
              <svg
                :class="['w-5 h-5', notif.isRead ? 'stroke-gray-400 dark:stroke-gray-500' : 'stroke-[#2d6a4f] dark:stroke-green-400']"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <p
                    :class="[
                      'text-sm font-semibold leading-snug',
                      notif.isRead ? 'text-gray-700 dark:text-gray-200' : 'text-[#1a3b22] dark:text-green-300'
                    ]"
                  >
                    {{ notif.title }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                    {{ notif.message }}
                  </p>
                </div>

                <!-- Unread badge -->
                <div v-if="!notif.isRead" class="shrink-0 mt-0.5">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-[#2d6a4f] text-white text-[9px] font-bold uppercase tracking-wider">
                    New
                  </span>
                </div>
              </div>

              <!-- Date -->
              <p class="text-[10px] text-gray-400 dark:text-gray-600 mt-2 flex items-center gap-1">
                <svg class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ formatDate(notif.createdAt) }}
              </p>
            </div>
          </div>
        </TransitionGroup>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import PageBanner from '../components/PageBanner.vue';
import { notificationApi } from '../services/notification.service';

// ── State ──────────────────────────────────────────────────────────────
const notifications = ref([]);
const isLoading     = ref(false);
const error         = ref(null);
const activeFilter  = ref('all');

// ── Filters ────────────────────────────────────────────────────────────
const unreadList = computed(() => notifications.value.filter(n => !n.isRead));
const readList   = computed(() => notifications.value.filter(n => n.isRead));

const filterOptions = computed(() => [
  { key: 'all',    label: 'All',       count: notifications.value.length },
  { key: 'unread', label: 'Unread',  count: unreadList.value.length    },
  { key: 'read',   label: 'Read',     count: readList.value.length      },
]);

const filteredNotifications = computed(() => {
  switch (activeFilter.value) {
    case 'unread': return unreadList.value;
    case 'read':   return readList.value;
    default:       return notifications.value;
  }
});

// ── Banner stats ───────────────────────────────────────────────────────
const bannerStats = computed(() => [
  { value: notifications.value.length, label: 'Total' },
  { value: unreadList.value.length,    label: 'New'  },
]);

// ── Date helper ────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—';
  const date    = new Date(iso);
  const now     = new Date();
  const diffMin = Math.floor((now - date) / 60000);
  if (diffMin < 1)  return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)   return `${diffH} hrs ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7)    return `${diffD} days ago`;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Fetch ──────────────────────────────────────────────────────────────
async function fetchNotifications() {
  isLoading.value = true;
  error.value     = null;
  try {
    const data = await notificationApi.getForEmployee();
    notifications.value = (Array.isArray(data) ? data : []).map(n => ({
      id:        n.id        ?? n.Id,
      title:     n.title     ?? n.Title     ?? '(untitled)',
      message:   n.message   ?? n.Message   ?? '',
      isRead:    n.isRead    ?? n.IsRead    ?? false,
      createdAt: n.createdAt ?? n.CreatedAt ?? null,
    })).sort((a, b) => {
      // Unread first, then by date
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } catch (err) {
    console.error('[NotificationsView] fetchNotifications:', err);
    error.value = err?.response?.data?.message ?? 'Failed to load notifications.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchNotifications);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 20px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #9ca3af; }
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }

/* List transition */
.notif-list-enter-active,
.notif-list-leave-active { transition: all 0.25s ease; }
.notif-list-enter-from   { opacity: 0; transform: translateY(-8px); }
.notif-list-leave-to     { opacity: 0; transform: translateX(12px); }
</style>
