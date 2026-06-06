<template>
  <!-- Loading -->
  <div v-if="loading" class="flex-1 flex items-center justify-center py-16">
    <div class="flex flex-col items-center gap-3 text-gray-400">
      <svg class="animate-spin h-8 w-8 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <span class="text-sm">{{ loadingText }}</span>
    </div>
  </div>

  <!-- Error -->
  <div v-else-if="error" class="flex-1 flex items-center justify-center py-16">
    <div class="flex flex-col items-center gap-3 text-center">
      <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
      </div>
      <p class="text-sm text-red-500">{{ error }}</p>
      <button
        v-if="retryable"
        @click="$emit('retry')"
        class="text-sm text-[#2d6a4f] hover:underline"
      >
        Try again
      </button>
    </div>
  </div>

  <!-- Empty -->
  <div v-else-if="empty">
    <slot name="empty">
      <div class="flex flex-col items-center justify-center gap-2 py-12 text-gray-400">
        <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">No data</p>
      </div>
    </slot>
  </div>

  <!-- Content -->
  <slot v-else />
</template>

<script setup>
defineProps({
  loading:     { type: Boolean, default: false },
  error:       { type: String,  default: null },
  empty:       { type: Boolean, default: false },
  loadingText: { type: String,  default: 'Loading...' },
  retryable:   { type: Boolean, default: true },
});

defineEmits(['retry']);
</script>
