<template>
  <div class="flex flex-col gap-4 min-h-0">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm px-5 py-3.5 flex items-center justify-between shrink-0">
      <div>
        <h2 class="text-lg font-bold text-[#1a3b22] dark:text-green-400">Task Categories</h2>
        <p class="text-xs text-gray-400">{{ categories.length }} {{ categories.length === 1 ? 'category' : 'categories' }} defined</p>
      </div>
    </div>

    <DataStateWrapper
      :loading="loading"
      :error="error"
      :empty="categories.length === 0"
      loading-text="Loading categories…"
      @retry="$emit('retry')"
    >
      <template #empty>
        <div class="flex flex-col items-center justify-center gap-2 py-20 text-gray-400">
          <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-1">
            <svg class="w-7 h-7 stroke-gray-300 dark:stroke-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">No categories</p>
          <p class="text-xs text-gray-300 dark:text-gray-600 text-center">Add the first category using the form on the left</p>
        </div>
      </template>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm px-5 py-4 flex items-center justify-between gap-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <div class="flex items-center gap-3 min-w-0">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 text-[11px] font-bold text-gray-400 dark:text-gray-500 shrink-0">#{{ cat.id }}</span>
            <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ cat.name }}</p>
          </div>
          <button
            @click="$emit('delete', cat)"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            title="Delete category"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    </DataStateWrapper>
  </div>
</template>

<script setup>
import DataStateWrapper from '../DataStateWrapper.vue';

defineProps({
  categories: { type: Array,   default: () => [] },
  loading:    { type: Boolean, default: false },
  error:      { type: String,  default: null },
});

defineEmits(['delete', 'retry']);
</script>
