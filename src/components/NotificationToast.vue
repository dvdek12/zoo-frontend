<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 flex flex-col gap-2.5 z-[9998] pointer-events-none">
      <TransitionGroup name="notif-toast">
        <div
          v-for="toast in notifStore.toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 w-80 px-4 py-3.5 rounded-2xl shadow-xl bg-[#1a1c1e] dark:bg-gray-800 border border-white/10 text-white"
        >
          <!-- Ikona dzwonka -->
          <div class="shrink-0 mt-0.5 w-7 h-7 rounded-xl bg-[#2d6a4f]/30 flex items-center justify-center">
            <Bell class="w-3.5 h-3.5 text-green-400" />
          </div>

          <!-- Treść -->
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-bold leading-tight truncate text-white">{{ toast.title }}</p>
            <p class="text-[11px] text-gray-400 leading-snug mt-0.5 line-clamp-2">{{ toast.message }}</p>
          </div>

          <!-- Zamknij -->
          <button
            @click="notifStore.dismissToast(toast.id)"
            class="shrink-0 w-5 h-5 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { Bell, X } from 'lucide-vue-next';
import { useNotificationToast } from '../composables/useNotificationToast';

const notifStore = useNotificationToast();
</script>

<style scoped>
.notif-toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.notif-toast-leave-active { transition: all 0.25s ease-in; }
.notif-toast-enter-from   { opacity: 0; transform: translateX(1.5rem) scale(0.95); }
.notif-toast-leave-to     { opacity: 0; transform: translateX(1.5rem) scale(0.95); }
.notif-toast-move         { transition: transform 0.3s ease; }
</style>
