<template>
  <!-- ═══ PAGE ═══ -->
  <div class="flex flex-col h-full bg-white dark:bg-[#111315] overflow-hidden">
    <PageBanner
      title="Tasks"
      eyebrow="Zoo Management"
      subtitle="Create, edit and assign tasks to zoo employees."
      image="/banner_tasks.png"
      image-position="center 35%"
    />

    <div class="flex flex-col flex-1 min-h-0 px-8 pt-6 gap-6">

      <!-- Tab Switcher -->
      <TabSwitcher v-model="activeTab" :tabs="tabs" />

      <!-- ═══ TASKS PANEL ═══ -->
      <div v-if="activeTab === 'tasks'" class="flex-1 min-h-0 grid grid-cols-[420px_1fr] gap-6 items-start overflow-y-auto">

        <!-- Left: Task Form -->
        <TaskForm
          :editing-task="editingTask"
          :employees="employees"
          :roles="roles"
          :categories="categories"
          :is-submitting="isSubmitting"
          :error="formError"
          @submit="handleFormSubmit"
          @cancel="cancelEdit"
        />

        <!-- Right: Task List -->
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
                  v-model="searchQuery"
                  id="task-search"
                  type="text"
                  placeholder="Search tasks..."
                  class="pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 transition-colors w-48"
                />
              </div>
              <select
                v-model="filterStatus"
                id="task-filter-status"
                class="px-3 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 cursor-pointer transition-colors"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              <select
                v-model="filterCategory"
                id="task-filter-category"
                class="px-3 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 cursor-pointer transition-colors"
              >
                <option value="">All categories</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <!-- Task list states -->
          <DataStateWrapper
            :loading="isLoadingTasks"
            :error="tasksError"
            :empty="filteredTasks.length === 0"
            loading-text="Loading tasks…"
            @retry="fetchTasks"
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

            <!-- Task Cards -->
            <div class="flex flex-col gap-3 overflow-y-auto pr-1 task-scrollbar">
              <div
                v-for="task in filteredTasks"
                :key="task.id"
                class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm px-5 py-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                :class="{
                  'opacity-60': task.isCompleted,
                  'border-l-4 !border-l-red-400': isOverdue(task) && !task.isCompleted,
                }"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      class="w-2 h-2 rounded-full shrink-0"
                      :class="{
                        'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]': task.isCompleted,
                        'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)] animate-pulse': isOverdue(task) && !task.isCompleted,
                        'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]': !task.isCompleted && !isOverdue(task),
                      }"
                    />
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ task.name }}</h3>
                  </div>
                  <div class="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      @click="startEdit(task)"
                      :id="`edit-task-${task.id}`"
                      class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#2d6a4f] hover:bg-[#2d6a4f]/10 transition-all cursor-pointer"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      @click="taskDelete.requestDelete(task)"
                      :id="`delete-task-${task.id}`"
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
                      :class="isOverdue(task) && !task.isCompleted ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
                    >
                      <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {{ formatDate(task.deadline) }}
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
                      'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400': !task.isCompleted && !isOverdue(task),
                      'bg-gray-100 dark:bg-gray-700 text-gray-400': task.isCompleted,
                      'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400': isOverdue(task) && !task.isCompleted,
                    }"
                  >
                    {{ task.isCompleted ? 'Completed' : isOverdue(task) ? 'Overdue' : 'Active' }}
                  </span>
                </div>
              </div>
            </div>
          </DataStateWrapper>
        </div>
      </div>

      <!-- ═══ ASSIGN PANEL ═══ -->
      <KanbanBoard
        v-if="activeTab === 'assign'"
        :tasks="tasks"
        :employees="employees"
        :is-loading-tasks="isLoadingTasks"
        :is-loading-employees="isLoadingEmployees"
        @assign="handleAssign"
        @unassign="handleUnassign"
      />

      <!-- ═══ CATEGORIES PANEL ═══ -->
      <div v-if="activeTab === 'categories'" class="flex-1 min-h-0 grid grid-cols-[380px_1fr] gap-6 items-start overflow-y-auto">

        <!-- Left: Add category form -->
        <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-7 sticky top-0">
          <!-- Header -->
          <div class="flex items-center gap-4 mb-6">
            <div>
              <h2 class="text-lg font-bold text-[#1a3b22] dark:text-green-400 leading-tight">Nowa kategoria</h2>
              <p class="text-xs text-gray-400 mt-0.5">Dodaj kategorię do grupowania zadań</p>
            </div>
          </div>

          <form @submit.prevent="handleCategorySubmit" class="flex flex-col gap-4">
            <!-- Category name -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
                Nazwa kategorii *
              </label>
              <input
                v-model="catForm.name"
                id="category-name"
                type="text"
                placeholder="np. Karmienie, Czyszczenie, Weterynaria…"
                required
                class="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] dark:focus:border-green-400 transition-all"
              />
            </div>

            <!-- Error -->
            <div v-if="catFormError" class="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-xs text-red-600 dark:text-red-400">
              <svg class="w-4 h-4 stroke-red-500 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ catFormError }}
            </div>

            <!-- Submit -->
            <div class="flex justify-end pt-1">
              <button
                type="submit"
                id="submit-category"
                :disabled="isCatSubmitting"
                class="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] rounded-xl shadow-[0_2px_8px_rgba(45,106,79,0.3)] hover:shadow-[0_4px_16px_rgba(45,106,79,0.4)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <svg v-if="isCatSubmitting" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <svg v-else class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                Dodaj kategorię
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Categories list -->
        <div class="flex flex-col gap-4 min-h-0">
          <!-- Header -->
          <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm px-5 py-3.5 flex items-center justify-between shrink-0">
            <div>
              <h2 class="text-lg font-bold text-[#1a3b22] dark:text-green-400">Kategorie zadań</h2>
              <p class="text-xs text-gray-400">{{ categories.length }} {{ categories.length === 1 ? 'kategoria' : categories.length < 5 ? 'kategorie' : 'kategorii' }} zdefiniowanych</p>
            </div>
          </div>

          <DataStateWrapper
            :loading="isLoadingCategories"
            :error="categoriesError"
            :empty="categories.length === 0"
            loading-text="Pobieranie kategorii…"
            @retry="fetchCategories"
          >
            <template #empty>
              <div class="flex flex-col items-center justify-center gap-2 py-20 text-gray-400">
                <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-1">
                  <svg class="w-7 h-7 stroke-gray-300 dark:stroke-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                </div>
                <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Brak kategorii</p>
                <p class="text-xs text-gray-300 dark:text-gray-600 text-center">Dodaj pierwszą kategorię używając formularza po lewej</p>
              </div>
            </template>

            <!-- Categories grid -->
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
                  @click="catDelete.requestDelete(cat)"
                  :id="`delete-category-${cat.id}`"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  title="Usuń kategorię"
                >
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </DataStateWrapper>
        </div>
      </div>

    </div>

    <!-- Confirm Delete — Task -->
    <ConfirmDialog
      :model-value="taskShowConfirm"
      @update:model-value="taskShowConfirm = $event"
      title="Delete task"
      :message="`Are you sure you want to delete the task &quot;${taskPendingDelete?.name ?? ''}&quot;? This action cannot be undone.`"
      confirm-label="Delete"
      cancel-label="Cancel"
      :loading="taskIsDeleting"
      @confirm="taskDelete.confirmDelete"
      @cancel="taskDelete.cancelDelete"
    />

    <!-- Confirm Delete — Category -->
    <ConfirmDialog
      :model-value="catShowConfirm"
      @update:model-value="catShowConfirm = $event"
      title="Usuń kategorię"
      :message="`Czy na pewno chcesz usunąć kategorię &quot;${catPendingDelete?.name ?? ''}&quot;? Zadania przypisane do tej kategorii nie zostaną usunięte.`"
      confirm-label="Usuń"
      cancel-label="Anuluj"
      :loading="catIsDeleting"
      @confirm="catDelete.confirmDelete"
      @cancel="catDelete.cancelDelete"
    />

    <!-- Toast -->
    <AppToast :message="toastMsg" :type="toastType" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue';
import PageBanner        from '../../components/PageBanner.vue';
import TabSwitcher       from '../../components/TabSwitcher.vue';
import DataStateWrapper  from '../../components/DataStateWrapper.vue';
import ConfirmDialog     from '../../components/ConfirmDialog.vue';
import AppToast          from '../../components/AppToast.vue';
import TaskForm          from '../../components/tasks/TaskForm.vue';
import KanbanBoard       from '../../components/tasks/KanbanBoard.vue';
import taskService       from '../../services/task.service';
import employeeService   from '../../services/employee.service';
import { useDeleteConfirm } from '../../composables/useDeleteConfirm';
import { useToast }         from '../../composables/useToast';

// ═══ TAB ═══
const tabs = [
  {
    key: 'tasks',
    label: 'Tasks',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  },
  {
    key: 'assign',
    label: 'Assign',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  },
];
const activeTab = ref('tasks');

// ═══ DATA ═══
const tasks      = ref([]);
const employees  = ref([]);
const roles      = ref([]);
const categories = ref([]);

// ═══ LOADING / ERROR ═══
const isLoadingTasks     = ref(false);
const tasksError         = ref(null);
const isLoadingEmployees = ref(false);

// ═══ FORM STATE ═══
const editingTask  = ref(null);
const isSubmitting = ref(false);
const formError    = ref(null);

// ═══ FILTERS ═══
const searchQuery    = ref('');
const filterStatus   = ref('all');
const filterCategory = ref('');

// ═══ TOAST ═══
const { toastMsg, toastType, showToast } = useToast();

// ═══ DELETE ═══
const taskDelete = useDeleteConfirm(async (task) => {
  await taskService.remove(task.id);
  tasks.value = tasks.value.filter(t => t.id !== task.id);
  showToast('Task deleted.');
});

// Destrukturyzacja refs dla template
const { showConfirm: taskShowConfirm, pendingDelete: taskPendingDelete, isDeleting: taskIsDeleting } = taskDelete;

// Obserwuj błąd usunięcia — pokaż toast
watch(taskDelete.deleteError, (err) => {
  if (err) showToast(err, 'error');
});

// ═══ COMPUTED ═══
const filteredTasks = computed(() => {
  let list = tasks.value;
  const q = searchQuery.value.toLowerCase().trim();
  if (q) list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  if (filterStatus.value === 'active')    list = list.filter(t => !t.isCompleted && !isOverdue(t));
  if (filterStatus.value === 'completed') list = list.filter(t => t.isCompleted);
  if (filterStatus.value === 'overdue')   list = list.filter(t => isOverdue(t) && !t.isCompleted);
  if (filterCategory.value !== '')        list = list.filter(t => t.categoryId === Number(filterCategory.value));
  return list;
});

// ═══ HELPERS ═══
function isOverdue(task) {
  if (!task.deadline) return false;
  return new Date(task.deadline) < new Date();
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function mapTask(t) {
  const emp = employees.value.find(e => e.id === t.assignedEmployeeId);
  return {
    id:                   t.id,
    name:                 t.name                ?? t.Name                ?? '',
    description:          t.description         ?? t.Description         ?? '',
    deadline:             t.deadline            ?? t.Deadline            ?? null,
    isCompleted:          t.isCompleted         ?? t.IsCompleted         ?? false,
    categoryId:           t.categoryId          ?? t.CategoryId          ?? null,
    assignedEmployeeId:   t.assignedEmployeeId  ?? t.AssignedEmployeeId  ?? null,
    roleId:               t.roleId              ?? t.RoleId              ?? null,
    assignedEmployeeName: emp
      ? `${emp.firstName} ${emp.lastName}`
      : (t.assignedEmployeeName ?? null),
  };
}

// ═══ FETCH ═══
async function fetchTasks() {
  isLoadingTasks.value = true;
  tasksError.value = null;
  try {
    const data = await taskService.getAll();
    tasks.value = (Array.isArray(data) ? data : []).map(mapTask);
  } catch (err) {
    console.error('[TasksView] fetchTasks:', err);
    tasksError.value = err?.response?.data?.message ?? 'Failed to load tasks.';
  } finally {
    isLoadingTasks.value = false;
  }
}

async function fetchEmployees() {
  isLoadingEmployees.value = true;
  try {
    const data = await employeeService.getAll();
    const mapped = (Array.isArray(data) ? data : []).map(e => ({
      id:        e.id        ?? e.employeeId,
      firstName: e.firstName ?? e.FirstName ?? '',
      lastName:  e.lastName  ?? e.LastName  ?? '',
      email:     e.email     ?? e.Email     ?? '',
      roleName:  e.roleName  ?? null,
    }));
    employees.value = mapped;

    const roleResults = await Promise.allSettled(mapped.map(e => employeeService.getEmployeeRole(e.id)));
    roleResults.forEach((r, i) => {
      if (r.status === 'fulfilled' && r.value)
        employees.value[i].roleName = r.value.name ?? r.value.Name ?? null;
    });
  } catch (err) {
    console.error('[TasksView] fetchEmployees:', err);
  } finally {
    isLoadingEmployees.value = false;
  }
}

async function fetchRoles() {
  try {
    const data = await employeeService.getAllRoles();
    roles.value = Array.isArray(data) ? data : [];
  } catch {}
}

// ═══ CATEGORIES ═══
const isLoadingCategories = ref(false);
const categoriesError     = ref(null);

async function fetchCategories() {
  isLoadingCategories.value = true;
  categoriesError.value = null;
  try {
    const data = await taskService.getAllCategories();
    categories.value = (Array.isArray(data) ? data : []).map(c => ({
      id:   c.id   ?? c.Id,
      name: c.category ?? c.Category ?? c.name ?? c.Name ?? '',
    }));
  } catch (err) {
    console.error('[TasksView] fetchCategories:', err);
    categoriesError.value = err?.response?.data?.message ?? 'Failed to load categories.';
  } finally {
    isLoadingCategories.value = false;
  }
}

// Category form
const catForm        = ref({ name: '' });
const isCatSubmitting = ref(false);
const catFormError   = ref(null);

async function handleCategorySubmit() {
  catFormError.value    = null;
  isCatSubmitting.value = true;
  try {
    await taskService.createCategory({ Category: catForm.value.name.trim() });
    catForm.value.name = '';
    showToast('Category created!');
    await fetchCategories();
  } catch (err) {
    console.error('[TasksView] handleCategorySubmit:', err);
    catFormError.value = err?.response?.data?.message ?? 'Failed to create category.';
  } finally {
    isCatSubmitting.value = false;
  }
}

// Category delete
const catDelete = useDeleteConfirm(async (cat) => {
  await taskService.deleteCategory(cat.id);
  categories.value = categories.value.filter(c => c.id !== cat.id);
  showToast('Category deleted.');
});

const { showConfirm: catShowConfirm, pendingDelete: catPendingDelete, isDeleting: catIsDeleting } = catDelete;

watch(catDelete.deleteError, (err) => {
  if (err) showToast(err, 'error');
});

// ═══ FORM ═══
async function handleFormSubmit(formData) {
  formError.value    = null;
  isSubmitting.value = true;
  try {
    const dto = {
      Name:               formData.name,
      Description:        formData.description,
      Deadline:           formData.deadline ? new Date(formData.deadline).toISOString() : null,
      IsCompleted:        formData.isCompleted,
      CategoryId:         formData.categoryId         || null,
      AssignedEmployeeId: formData.assignedEmployeeId || null,
      RoleId:             formData.roleId             || null,
    };
    if (editingTask.value) {
      await taskService.update(editingTask.value.id, dto);
      showToast('Task updated!');
    } else {
      await taskService.create(dto);
      showToast('Task created!');
    }
    editingTask.value = null;
    await fetchTasks();
  } catch (err) {
    console.error('[TasksView] handleFormSubmit:', err);
    formError.value = err?.response?.data?.message ?? 'Failed to save the task.';
  } finally {
    isSubmitting.value = false;
  }
}

function startEdit(task) {
  editingTask.value = task;
  formError.value   = null;
}

function cancelEdit() {
  editingTask.value = null;
  formError.value   = null;
}

// ═══ KANBAN ═══
async function handleAssign({ taskId, empId }) {
  const task = tasks.value.find(t => t.id === taskId);
  if (!task) return;
  const oldEmpId = task.assignedEmployeeId;
  task.assignedEmployeeId = empId;
  const emp = employees.value.find(e => e.id === empId);
  task.assignedEmployeeName = emp ? `${emp.firstName} ${emp.lastName}` : null;
  try {
    await taskService.update(taskId, { AssignedEmployeeId: empId });
    showToast(`Task assigned to ${emp?.firstName ?? ''}!`);
  } catch (err) {
    task.assignedEmployeeId = oldEmpId;
    const oldEmp = employees.value.find(e => e.id === oldEmpId);
    task.assignedEmployeeName = oldEmp ? `${oldEmp.firstName} ${oldEmp.lastName}` : null;
    showToast('Failed to assign the task.', 'error');
  }
}

async function handleUnassign(task) {
  const oldEmpId = task.assignedEmployeeId;
  task.assignedEmployeeId   = null;
  task.assignedEmployeeName = null;
  try {
    await taskService.update(task.id, { AssignedEmployeeId: null });
    showToast('Task unassigned from employee.');
  } catch (err) {
    task.assignedEmployeeId = oldEmpId;
    const oldEmp = employees.value.find(e => e.id === oldEmpId);
    task.assignedEmployeeName = oldEmp ? `${oldEmp.firstName} ${oldEmp.lastName}` : null;
    showToast('Failed to unassign the task.', 'error');
  }
}

// Ponowne mapowanie nazw pracowników po załadowaniu
watch(employees, () => {
  tasks.value = tasks.value.map(t => {
    const emp = employees.value.find(e => e.id === t.assignedEmployeeId);
    return { ...t, assignedEmployeeName: emp ? `${emp.firstName} ${emp.lastName}` : t.assignedEmployeeName };
  });
});

async function initData() {
  await fetchEmployees();
  await fetchRoles();
  await fetchCategories();
  await fetchTasks();
}
onMounted(initData);
onActivated(initData);
</script>

<style scoped>
.task-scrollbar::-webkit-scrollbar { width: 5px; }
.task-scrollbar::-webkit-scrollbar-track { background: transparent; }
.task-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
.dark .task-scrollbar::-webkit-scrollbar-thumb { background: #374151; }
</style>
