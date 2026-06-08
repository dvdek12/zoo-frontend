<template>
  <div
    :class="[
      'group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200',
      notif.isRead
        ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        : 'bg-[#f0f9f4] dark:bg-[#132a1e] border-[#2d6a4f]/30 dark:border-green-700/40 border-l-[3px] border-l-[#2d6a4f] dark:border-l-green-500 shadow-sm cursor-pointer'
    ]"
    @click="!notif.isRead && $emit('mark-read', notif.id)"
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
</template>

<script setup>
defineProps({
  notif: { type: Object, required: true },
});

defineEmits(['mark-read']);

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
</script>
