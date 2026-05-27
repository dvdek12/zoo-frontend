<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="message"
        class="fixed bottom-8 right-8 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl z-[9999] pointer-events-none"
        :class="type === 'error' ? 'bg-red-900' : 'bg-[#1a3b22]'"
      >
        <!-- Ikona sukcesu -->
        <svg
          v-if="type === 'success'"
          class="w-4 h-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20,6 9,17 4,12"/>
        </svg>
        <!-- Ikona błędu -->
        <svg
          v-else
          class="w-4 h-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'success',
    validator: (v) => ['success', 'error'].includes(v),
  },
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-enter-from,
.toast-leave-to     { opacity: 0; transform: translateY(1rem) scale(0.95); }
</style>
