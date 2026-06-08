<template>
  <Transition name="form-error">
    <div
      v-if="messages.length > 0"
      :class="[
        'flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm',
        variant === 'success'
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
      ]"
    >
      <!-- Icon -->
      <svg
        v-if="variant === 'success'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 shrink-0 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 shrink-0 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
      </svg>

      <!-- Message(s) -->
      <ul v-if="messages.length > 1" class="list-disc list-inside space-y-0.5 flex-1">
        <li v-for="(msg, i) in messages" :key="i">{{ msg }}</li>
      </ul>
      <span v-else class="flex-1">{{ messages[0] }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  error: {
    type: [String, Array],
    default: null,
  },
  variant: {
    type: String,
    default: 'error',
  },
});

const messages = computed(() => {
  if (!props.error) return [];

  // String — zwykły błąd np. "Failed to save"
  if (typeof props.error === 'string') {
    return props.error.trim() ? [props.error.trim()] : [];
  }

  // Tablica — błędy walidacji z backendu np. [{ errorMessage: "..." }]
  if (Array.isArray(props.error)) {
    const extracted = props.error
      .map(item => {
        if (!item) return null;
        if (typeof item === 'string') return item.trim() || null;
        // obiekt z errorMessage (Fluent Validation)
        if (item.errorMessage) return item.errorMessage;
        // inne formaty
        if (item.message) return item.message;
        if (item.description) return item.description;
        return null;
      })
      .filter(Boolean);

    // Jeśli żaden element nie miał errorMessage — zwróć pustą tablicę
    // (parent powinien wtedy pokazać fallback string)
    return extracted;
  }

  return [];
});
</script>

<style scoped>
.form-error-enter-active,
.form-error-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.form-error-enter-from,
.form-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
