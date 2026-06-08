<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Add animal type</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type name</label>
        <input
          v-model="name"
          type="text"
          class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all"
          placeholder="e.g. Mammal, Bird, Reptile..."
          @keydown.enter="handleSave"
        />
      </div>

      <div class="mx-6 mb-4">
        <FormError :error="saveError" />
      </div>

      <div class="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
        <button type="button" :disabled="isSaving" @click="$emit('close')" class="px-5 py-2 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button :disabled="isSaving || !name.trim()" @click="handleSave" class="bg-[#2d6a4f] hover:bg-[#1a3b22] disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 min-w-[140px] justify-center">
          <svg v-if="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ isSaving ? 'Saving...' : 'Save type' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import animalTypeService from '../../services/animalType.service';
import FormError from '../FormError.vue';
import { parseApiError } from '../../utils/parseApiError';

const emit = defineEmits(['save', 'close']);

const name     = ref('');
const isSaving = ref(false);
const saveError = ref(null);

const handleSave = async () => {
  if (!name.value.trim() || isSaving.value) return;
  isSaving.value = true;
  saveError.value = null;
  try {
    const saved = await animalTypeService.create(name.value.trim());
    emit('save', saved);
    name.value = '';
  } catch (err) {
    saveError.value = parseApiError(err, 'Failed to add type.');
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
