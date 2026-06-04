<template>
  <div class="flex flex-col h-full bg-white dark:bg-[#111315] overflow-hidden">
    <PageBanner
      title="Tasks"
      eyebrow="Zoo Management"
      subtitle="Create, edit and assign tasks to zoo employees."
      image="/banner_tasks.png"
      image-position="center 35%"
    />

    <div class="flex flex-col flex-1 min-h-0 px-8 pt-6 gap-6">
      <TabSwitcher v-model="activeTab" :tabs="tabs" />

      <!-- ═══ TASKS PANEL ═══ -->
      <div v-if="activeTab === 'tasks'" class="flex-1 min-h-0 grid grid-cols-[420px_1fr] gap-6 items-start overflow-y-auto">
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
        <TaskList
          :tasks="tasks"
          :filtered-tasks="filteredTasks"
          :categories="categories"
          v-model:search-query="searchQuery"
          v-model:filter-status="filterStatus"
          v-model:filter-category="filterCategory"
          :loading="tasksLoading"
          :error="tasksError"
          @edit="startEdit"
          @delete="taskDelete.requestDelete"
          @retry="fetchTasks"
        />
      </div>

      <!-- ═══ ASSIGN PANEL ═══ -->
      <KanbanBoard
        v-if="activeTab === 'assign'"
        :tasks="tasks"
        :employees="employees"
        :is-loading-tasks="tasksLoading"
        :is-loading-employees="employeesLoading"
        @assign="kanban.handleAssign"
        @unassign="kanban.handleUnassign"
      />

      <!-- ═══ CATEGORIES PANEL ═══ -->
      <div v-if="activeTab === 'categories'" class="flex-1 min-h-0 grid grid-cols-[380px_1fr] gap-6 items-start overflow-y-auto">
        <CategoryForm
          v-model="catForm.name"
          :error="catFormError"
          :is-submitting="isCatSubmitting"
          @submit="createCategory"
        />
        <CategoryList
          :categories="categories"
          :loading="categoriesLoading"
          :error="categoriesError"
          @delete="catDelete.requestDelete"
          @retry="fetchCategories"
        />
      </div>
    </div>

    <!-- Confirm Delete — Task -->
    <ConfirmDialog
      :model-value="taskDelete.showConfirm.value"
      @update:model-value="taskDelete.showConfirm.value = $event"
      title="Delete task"
      :message="`Are you sure you want to delete the task &quot;${taskDelete.pendingDelete.value?.name ?? ''}&quot;? This action cannot be undone.`"
      confirm-label="Delete"
      cancel-label="Cancel"
      :loading="taskDelete.isDeleting.value"
      @confirm="taskDelete.confirmDelete"
      @cancel="taskDelete.cancelDelete"
    />

    <!-- Confirm Delete — Category -->
    <ConfirmDialog
      :model-value="catDelete.showConfirm.value"
      @update:model-value="catDelete.showConfirm.value = $event"
      title="Delete category"
      :message="`Are you sure you want to delete the category &quot;${catDelete.pendingDelete.value?.name ?? ''}&quot;? Tasks assigned to this category will not be deleted.`"
      confirm-label="Delete"
      cancel-label="Cancel"
      :loading="catDelete.isDeleting.value"
      @confirm="catDelete.confirmDelete"
      @cancel="catDelete.cancelDelete"
    />

    <AppToast :message="toastMsg" :type="toastType" />
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue';
import PageBanner       from '../../components/PageBanner.vue';
import TabSwitcher      from '../../components/TabSwitcher.vue';
import ConfirmDialog    from '../../components/ConfirmDialog.vue';
import AppToast         from '../../components/AppToast.vue';
import TaskForm         from '../../components/tasks/TaskForm.vue';
import TaskList         from '../../components/tasks/TaskList.vue';
import CategoryForm     from '../../components/tasks/CategoryForm.vue';
import CategoryList     from '../../components/tasks/CategoryList.vue';
import KanbanBoard      from '../../components/tasks/KanbanBoard.vue';
import { useTasks }           from '../../composables/features/useTasks';
import { useTaskCategories }  from '../../composables/features/useTaskCategories';
import { useKanban }          from '../../composables/features/useKanban';
import { useEmployees }       from '../../composables/features/useEmployees';
import { useToast }           from '../../composables/useToast';

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

const { toastMsg, toastType } = useToast();

const {
  employees,
  roles,
  loading: employeesLoading,
  fetchEmployees,
  fetchRoles,
} = useEmployees();

const {
  tasks,
  loading: tasksLoading,
  error: tasksError,
  searchQuery,
  filterStatus,
  filterCategory,
  filteredTasks,
  fetchTasks,
  saveTask,
  taskDelete,
} = useTasks(employees);

const {
  categories,
  loading: categoriesLoading,
  error: categoriesError,
  form: catForm,
  isSubmitting: isCatSubmitting,
  formError: catFormError,
  fetchCategories,
  createCategory,
  catDelete,
} = useTaskCategories();

const kanban = useKanban(tasks, employees);

// Form state
const editingTask  = ref(null);
const isSubmitting = ref(false);
const formError    = ref(null);

async function handleFormSubmit(formData) {
  formError.value    = null;
  isSubmitting.value = true;
  try {
    await saveTask(formData, editingTask.value?.id ?? null);
    editingTask.value = null;
  } catch (err) {
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

async function initData() {
  await fetchEmployees();
  await fetchRoles();
  await Promise.all([fetchCategories(), fetchTasks()]);
}

onMounted(initData);
onActivated(initData);
</script>
