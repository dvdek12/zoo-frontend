<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-7 sticky top-0">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <div class="w-11 h-11 rounded-xl bg-[#2d6a4f]/10 dark:bg-green-400/10 border border-[#2d6a4f]/20 dark:border-green-400/20 flex items-center justify-center shrink-0">
        <svg class="w-5 h-5 stroke-[#2d6a4f] dark:stroke-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-bold text-[#1a3b22] dark:text-green-400 leading-tight">
          {{ editingTask ? 'Edit task' : 'New task' }}
        </h2>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ editingTask ? 'Modify selected task' : 'Create and configure a task for zoo employees' }}
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

      <!-- Nazwa -->
      <div class="flex flex-col gap-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
          <svg class="w-3.5 h-3.5 stroke-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Task name *
        </label>
        <input
          v-model="form.name"
          id="task-name"
          type="text"
          placeholder="e.g., Feeding lions, Cleaning enclosure..."
          required
          class="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] dark:focus:border-green-400 transition-all"
        />
      </div>

      <!-- Opis -->
      <div class="flex flex-col gap-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
          <svg class="w-3.5 h-3.5 stroke-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
          </svg>
          Description *
        </label>
        <textarea
          v-model="form.description"
          id="task-description"
          placeholder="Detailed task description..."
          required
          rows="3"
          class="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] dark:focus:border-green-400 transition-all resize-none font-[inherit]"
        ></textarea>
      </div>

      <!-- Termin + Kategoria -->
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-1.5">
          <label class="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
            <svg class="w-3.5 h-3.5 stroke-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Deadline *
          </label>
          <input
            v-model="form.deadline"
            id="task-deadline"
            type="datetime-local"
            required
            class="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] dark:focus:border-green-400 transition-all"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
            <svg class="w-3.5 h-3.5 stroke-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            Category
          </label>
          <select
            v-model="form.categoryId"
            id="task-category"
            class="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] dark:focus:border-green-400 transition-all cursor-pointer"
          >
            <option :value="null">Uncategorized</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <!-- Pracownik + Rola -->
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-1.5">
          <label class="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
            <svg class="w-3.5 h-3.5 stroke-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Employee
          </label>
          <select
            v-model="form.assignedEmployeeId"
            id="task-employee"
            class="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] dark:focus:border-green-400 transition-all cursor-pointer"
          >
            <option :value="null">Unassigned</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.firstName }} {{ emp.lastName }}
            </option>
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
            <svg class="w-3.5 h-3.5 stroke-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            Role
          </label>
          <select
            v-model="form.roleId"
            id="task-role"
            class="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] dark:focus:border-green-400 transition-all cursor-pointer"
          >
            <option :value="null">Any role</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </div>
      </div>

      <!-- Completed (editing) -->
      <div v-if="editingTask">
        <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
          <input type="checkbox" v-model="form.isCompleted" id="task-completed" class="w-4 h-4 accent-[#2d6a4f] cursor-pointer" />
          Mark as completed
        </label>
      </div>

      <!-- Error -->
      <FormError :error="error" />

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3 pt-1">
        <button
          v-if="editingTask"
          type="button"
          id="cancel-edit-task"
          @click="$emit('cancel')"
          class="px-5 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="submit-task"
          :disabled="isSubmitting"
          class="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] rounded-xl shadow-[0_2px_8px_rgba(45,106,79,0.3)] hover:shadow-[0_4px_16px_rgba(45,106,79,0.4)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <svg v-else class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="editingTask">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </template>
            <template v-else>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </template>
          </svg>
          {{ editingTask ? 'Save changes' : 'Create task' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import FormError from '../FormError.vue';

const props = defineProps({
  /** Task in edit mode (null = creating) */
  editingTask: {
    type: Object,
    default: null,
  },
  employees: {
    type: Array,
    default: () => [],
  },
  roles: {
    type: Array,
    default: () => [],
  },
  categories: {
    type: Array,
    default: () => [],
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

// Internal form state
const form = reactive({
  name: '',
  description: '',
  deadline: '',
  categoryId: null,
  assignedEmployeeId: null,
  roleId: null,
  isCompleted: false,
});

/** Fills the form with data from the edited task */
function fillFromTask(task) {
  if (!task) {
    Object.assign(form, { name: '', description: '', deadline: '', categoryId: null, assignedEmployeeId: null, roleId: null, isCompleted: false });
    return;
  }
  const d = task.deadline ? new Date(task.deadline) : null;
  const pad = (n) => String(n).padStart(2, '0');
  form.name               = task.name ?? '';
  form.description        = task.description ?? '';
  form.deadline           = d
    ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    : '';
  form.categoryId         = task.categoryId ?? null;
  form.assignedEmployeeId = task.assignedEmployeeId ?? null;
  form.roleId             = task.roleId ?? null;
  form.isCompleted        = task.isCompleted ?? false;
}

// Synchronize form with external editingTask changes
watch(() => props.editingTask, fillFromTask, { immediate: true });

function handleSubmit() {
  emit('submit', {
    name:               form.name,
    description:        form.description,
    deadline:           form.deadline,
    categoryId:         form.categoryId,
    assignedEmployeeId: form.assignedEmployeeId,
    roleId:             form.roleId,
    isCompleted:        form.isCompleted,
  });
}
</script>
