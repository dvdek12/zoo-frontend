<template>
  <div class="p-8 h-full flex flex-col">
    <div class="mb-6 flex items-center">
      <router-link
        to="/dashboard"
        class="text-[#2d6a4f] dark:text-green-400 hover:text-[#1a3b22] dark:hover:text-green-300 font-semibold flex items-center gap-2 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Back to Dashboard
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center flex-1 gap-4">
      <div class="w-10 h-10 rounded-full border-[3px] border-[#2d6a4f]/20 border-t-[#2d6a4f] animate-spin"></div>
      <p class="text-sm text-gray-400 font-medium">Loading task…</p>
    </div>

    <!-- Error / not found -->
    <div v-else-if="!task" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 flex-1 max-w-4xl text-center flex flex-col items-center justify-center transition-colors duration-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h2 class="text-2xl font-bold text-gray-400 dark:text-gray-500 mb-2">Task not found</h2>
      <p class="text-gray-500 dark:text-gray-400">{{ error ?? 'The task with the given ID does not exist or has been deleted.' }}</p>
    </div>

    <!-- Task detail -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 flex-1 max-w-4xl transition-colors duration-200">
      <div class="flex justify-between items-start mb-4 gap-4">
        <h2 class="text-3xl font-bold text-[#1a3b22] dark:text-green-400 leading-tight">{{ task.name }}</h2>
        <span
          :class="[
            'px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase whitespace-nowrap shrink-0',
            task.isCompleted
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : isOverdue(task.deadline)
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
          ]"
        >
          {{ task.isCompleted ? 'Completed' : isOverdue(task.deadline) ? 'Overdue' : 'In progress' }}
        </span>
      </div>

      <p class="text-gray-500 dark:text-gray-400 mb-8 flex items-center gap-2 text-base">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        Deadline: <strong>{{ formatDate(task.deadline) }}</strong>
        <span
          v-if="isOverdue(task.deadline) && !task.isCompleted"
          class="ml-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
        >Overdue</span>
        <span
          v-if="isToday(task.deadline) && !task.isCompleted"
          class="ml-2 bg-[#2d6a4f] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
        >Today</span>
      </p>

      <div class="prose max-w-none mb-10">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Task description</h3>
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-base whitespace-pre-wrap">
          {{ task.description || 'No description for this task.' }}
        </p>
      </div>

      <!-- Meta info -->
      <div v-if="task.categoryId || task.roleId" class="flex flex-wrap gap-3 mb-8">
        <span v-if="task.categoryId" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
          Category #{{ task.categoryId }}
        </span>
        <span v-if="task.roleId" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
          Role #{{ task.roleId }}
        </span>
      </div>

      <div class="flex gap-4 border-t pt-8 border-gray-100 dark:border-gray-700">
        <button
          v-if="!task.isCompleted"
          class="px-6 py-3 bg-[#2d6a4f] text-white rounded-lg font-bold hover:bg-[#1a3b22] transition-colors shadow-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Mark as completed
        </button>
        <button class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm">
          Report a problem / Request help
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import taskService from '../services/task.service';

const route  = useRoute();
const taskId = route.params.taskId;

const task      = ref(null);
const isLoading = ref(false);
const error     = ref(null);

const todayStr = new Date().toISOString().slice(0, 10);
const isToday   = (d) => !!d && d.slice(0, 10) === todayStr;
const isOverdue = (d) => !!d && new Date(d) < new Date() && !isToday(d);

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
}

onMounted(async () => {
  isLoading.value = true;
  try {
    const data = await taskService.getById(Number(taskId));
    if (!data) {
      error.value = 'Task not found.';
      return;
    }
    task.value = {
      id:          data.id          ?? data.Id,
      name:        data.name        ?? data.Name        ?? '(untitled)',
      description: data.description ?? data.Description ?? '',
      deadline:    data.deadline    ?? data.Deadline     ?? null,
      isCompleted: data.isCompleted ?? data.IsCompleted  ?? false,
      categoryId:  data.categoryId  ?? data.CategoryId  ?? null,
      roleId:      data.roleId      ?? data.RoleId      ?? null,
    };
  } catch (err) {
    console.error('[TaskDetailView] fetch error:', err);
    error.value = err?.response?.data?.message ?? 'Failed to load task details.';
  } finally {
    isLoading.value = false;
  }
});
</script>
