<template>
  <div
    class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm px-5 py-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    :class="{
      'opacity-60': task.isCompleted,
      'border-l-4 !border-l-red-400': overdue && !task.isCompleted,
    }"
  >
    <div class="flex items-center justify-between mb-1.5">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <div
          class="w-2 h-2 rounded-full shrink-0"
          :class="{
            'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]': task.isCompleted,
            'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)] animate-pulse': overdue && !task.isCompleted,
            'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]': !task.isCompleted && !overdue,
          }"
        />
        <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ task.name }}</h3>
      </div>
      <div class="flex items-center gap-1 shrink-0 ml-2">
        <button
          @click="$emit('edit', task)"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#2d6a4f] hover:bg-[#2d6a4f]/10 transition-all cursor-pointer"
          title="Edit"
        >
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          @click="$emit('delete', task)"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
          title="Delete"
        >
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3,6 5,6 21,6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>

    <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">{{ task.description }}</p>

    <div class="flex items-center justify-between flex-wrap gap-2">
      <div class="flex items-center gap-1.5 flex-wrap">
        <span
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
          :class="overdue && !task.isCompleted
            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
        >
          <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {{ formattedDeadline }}
        </span>
        <span
          v-if="task.assignedEmployeeName"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        >
          <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          {{ task.assignedEmployeeName }}
        </span>
      </div>
      <span
        class="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
        :class="{
          'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400': !task.isCompleted && !overdue,
          'bg-gray-100 dark:bg-gray-700 text-gray-400': task.isCompleted,
          'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400': overdue && !task.isCompleted,
        }"
      >
        {{ statusLabel }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { isOverdue, formatDate } from '../../utils/formatters';

const props = defineProps({
  task: { type: Object, required: true },
});

defineEmits(['edit', 'delete']);

const overdue          = computed(() => isOverdue(props.task.deadline));
const formattedDeadline = computed(() => formatDate(props.task.deadline));
const statusLabel      = computed(() => {
  if (props.task.isCompleted) return 'Completed';
  if (overdue.value) return 'Overdue';
  return 'Active';
});
</script>
