<template>
  <div class="flex flex-col gap-4 min-h-0">
    <!-- Header bar -->
    <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm px-5 py-3.5 flex items-center justify-between flex-wrap gap-3 shrink-0">
      <div>
        <h2 class="text-lg font-bold text-[#1a3b22] dark:text-green-400">Task List</h2>
        <p class="text-xs text-gray-400">{{ tasks.length }} tasks in the system</p>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            type="text"
            placeholder="Search tasks..."
            class="pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 transition-colors w-48"
          />
        </div>
        <select
          :value="filterStatus"
          @change="$emit('update:filterStatus', $event.target.value)"
          class="px-3 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 cursor-pointer transition-colors"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          :value="filterCategory"
          @change="$emit('update:filterCategory', $event.target.value)"
          class="px-3 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 cursor-pointer transition-colors"
        >
          <option value="">All categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>
    </div>

    <!-- Task list states -->
    <DataStateWrapper
      :loading="loading"
      :error="error"
      :empty="filteredTasks.length === 0"
      loading-text="Loading tasks…"
      @retry="$emit('retry')"
    >
      <template #empty>
        <div class="flex flex-col items-center justify-center gap-2 py-20 text-gray-400">
          <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-1">
            <svg class="w-7 h-7 stroke-gray-300 dark:stroke-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">No tasks</p>
          <p class="text-xs text-gray-300 dark:text-gray-600 text-center">
            {{ searchQuery ? 'No results for the given phrase' : 'Create your first task using the form on the left' }}
          </p>
        </div>
      </template>

      <div class="flex flex-col gap-3 overflow-y-auto pr-1 task-scrollbar">
        <TaskCard
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </DataStateWrapper>
  </div>
</template>

<script setup>
import DataStateWrapper from '../DataStateWrapper.vue';
import TaskCard from './TaskCard.vue';

defineProps({
  tasks:          { type: Array,   required: true },
  filteredTasks:  { type: Array,   required: true },
  categories:     { type: Array,   default: () => [] },
  searchQuery:    { type: String,  default: '' },
  filterStatus:   { type: String,  default: 'all' },
  filterCategory: { type: String,  default: '' },
  loading:        { type: Boolean, default: false },
  error:          { type: String,  default: null },
});

defineEmits(['update:searchQuery', 'update:filterStatus', 'update:filterCategory', 'edit', 'delete', 'retry']);
</script>

<style scoped>
.task-scrollbar::-webkit-scrollbar { width: 5px; }
.task-scrollbar::-webkit-scrollbar-track { background: transparent; }
.task-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
.dark .task-scrollbar::-webkit-scrollbar-thumb { background: #374151; }
</style>
