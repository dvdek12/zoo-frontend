<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-role-title"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')" />

      <!-- Panel -->
      <div class="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">

        <!-- Header -->
        <div class="px-8 pt-7 pb-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div>
            <h2 id="add-role-title" class="text-xl font-bold text-[#1a3b22] dark:text-green-400 tracking-tight">
              Add new role
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Define an employee role in the system</p>
          </div>
          <button
            id="close-add-role-modal"
            @click="$emit('close')"
            class="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submit" class="overflow-y-auto flex-1 custom-scrollbar">
          <div class="px-8 py-6 flex flex-col gap-5">

            <!-- Name -->
            <div class="flex flex-col gap-1.5">
              <label for="role-name" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                Name *
              </label>
              <input
                id="role-name"
                v-model="form.name"
                type="text"
                required
                maxlength="100"
                placeholder="e.g. Zookeeper"
                class="input-field"
                :class="{ 'border-red-400': errors.name }"
              />
              <span v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</span>
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-1.5">
              <label for="role-description" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                Description *
              </label>
              <textarea
                id="role-description"
                v-model="form.description"
                required
                maxlength="500"
                rows="3"
                placeholder="Describe the responsibilities of this role…"
                class="input-field resize-none"
                :class="{ 'border-red-400': errors.description }"
              />
              <div class="flex justify-between items-center">
                <span v-if="errors.description" class="text-xs text-red-500">{{ errors.description }}</span>
                <span class="text-xs text-gray-400 ml-auto">{{ form.description.length }}/500</span>
              </div>
            </div>

            <!-- Managerial role -->
            <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl">
              <button
                type="button"
                id="role-ismanagerial-toggle"
                @click="form.isManagerial = !form.isManagerial"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="form.isManagerial ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'"
                :aria-checked="form.isManagerial"
                role="switch"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out"
                  :class="form.isManagerial ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
              <div>
                <p class="text-sm font-semibold text-gray-800 dark:text-white">Managerial role</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Employees with this role have managerial privileges</p>
              </div>
            </div>

            <!-- Server error -->
            <div v-if="serverError" class="flex items-start gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <span>{{ serverError }}</span>
            </div>

            <!-- Success -->
            <div v-if="success" class="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Role added successfully!
            </div>
          </div>
        </form>

        <!-- Footer -->
        <div class="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
          <button
            id="cancel-add-role"
            type="button"
            @click="$emit('close')"
            class="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            id="submit-add-role"
            type="button"
            :disabled="isLoading"
            @click="submit"
            class="px-5 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1a3b22] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>{{ isLoading ? 'Adding…' : 'Add role' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from 'vue';
import employeeService from '../../services/employee.service';

const emit = defineEmits(['close', 'save']);

const isLoading   = ref(false);
const serverError = ref(null);
const success     = ref(false);

const form = reactive({
  name:         '',
  description:  '',
  isManagerial: false,
});

const errors = reactive({
  name:        '',
  description: '',
});

const validate = () => {
  errors.name        = form.name.trim()        ? '' : 'Name is required';
  errors.description = form.description.trim() ? '' : 'Description is required';
  return !errors.name && !errors.description;
};

const submit = async () => {
  serverError.value = null;
  success.value     = false;

  if (!validate()) return;

  const dto = {
    Name:         form.name.trim(),
    Description:  form.description.trim(),
    IsManagerial: form.isManagerial,
  };

  isLoading.value = true;
  try {
    await employeeService.createRole(dto);
    success.value = true;
    setTimeout(() => emit('save'), 1000);
  } catch (err) {
    serverError.value =
      err?.response?.data?.message ??
      (typeof err?.response?.data === 'string' ? err.response.data : null) ??
      'Failed to add role. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.input-field {
  display: block;
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #ffffff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  outline: none;
}
.input-field::placeholder { color: #9ca3af; }
.input-field:focus {
  box-shadow: 0 0 0 2px #2d6a4f;
  border-color: #2d6a4f;
}
:global(.dark) .input-field {
  border-color: #374151;
  background-color: #1f2937;
  color: #ffffff;
}
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 4px; }
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; }
</style>
