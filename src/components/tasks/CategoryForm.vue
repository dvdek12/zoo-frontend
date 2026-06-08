<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-7 sticky top-0">
    <div class="flex items-center gap-4 mb-6">
      <div>
        <h2 class="text-lg font-bold text-[#1a3b22] dark:text-green-400 leading-tight">New Category</h2>
        <p class="text-xs text-gray-400 mt-0.5">Add a category to group tasks</p>
      </div>
    </div>

    <form @submit.prevent="$emit('submit')" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
          Category name *
        </label>
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          type="text"
          placeholder="e.g. Feeding, Cleaning, Veterinary…"
          required
          class="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] dark:focus:border-green-400 transition-all"
        />
      </div>

      <FormError :error="error" />

      <div class="flex justify-end pt-1">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] rounded-xl shadow-[0_2px_8px_rgba(45,106,79,0.3)] hover:shadow-[0_4px_16px_rgba(45,106,79,0.4)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          <svg v-else class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Add category
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import FormError from '../FormError.vue';

defineProps({
  modelValue:   { type: String,  default: '' },
  error:        { type: String,  default: null },
  isSubmitting: { type: Boolean, default: false },
});

defineEmits(['update:modelValue', 'submit']);
</script>
