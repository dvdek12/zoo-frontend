<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @mousedown.self="$emit('cancel')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- Dialog -->
        <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-md mx-4 overflow-hidden">

          <!-- Top accent bar -->
          <div class="h-1 bg-gradient-to-r from-red-500 to-rose-600" />

          <div class="p-6">
            <!-- Icon -->
            <div class="flex items-center gap-4 mb-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ title }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ message }}</p>
              </div>
            </div>

            <!-- Detail slot (optional) -->
            <slot />

            <!-- Buttons -->
            <div class="flex justify-end gap-3 mt-6">
              <button
                @click="$emit('cancel')"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {{ cancelLabel }}
              </button>
              <button
                @click="$emit('confirm')"
                :disabled="loading"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg
                  v-if="loading"
                  class="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ loading ? 'Usuwanie…' : confirmLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue:   { type: Boolean, required: true },
  title:        { type: String,  default: 'Potwierdź akcję' },
  message:      { type: String,  default: 'Tej operacji nie można cofnąć.' },
  confirmLabel: { type: String,  default: 'Usuń' },
  cancelLabel:  { type: String,  default: 'Anuluj' },
  loading:      { type: Boolean, default: false },
});

defineEmits(['update:modelValue', 'confirm', 'cancel']);
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-enter-active .relative,
.dialog-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-from .relative {
  transform: scale(0.92) translateY(12px);
  opacity: 0;
}
.dialog-leave-to .relative {
  transform: scale(0.92) translateY(12px);
  opacity: 0;
}
</style>
