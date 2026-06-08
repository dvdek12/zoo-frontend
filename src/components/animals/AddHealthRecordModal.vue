<template>
<Teleport to="body">
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <form
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]"
      @submit.prevent="handleSave"
      novalidate
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#f0f9f4] dark:bg-[#132a1e] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2d6a4f] dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">New health record</h3>
            <p class="text-xs text-gray-400 mt-0.5">Fill in veterinary checkup results</p>
          </div>
        </div>
        <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto custom-scrollbar space-y-5">

        <!-- Health condition -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Health condition <span class="text-red-400">*</span>
          </label>
          <!-- Loading skeleton -->
          <div v-if="isLoadingConditions" class="grid grid-cols-3 gap-2">
            <div v-for="i in 3" :key="i" class="h-16 rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse" />
          </div>

          <!-- Enum buttons -->
          <div v-else class="grid grid-cols-3 gap-2">
            <button
              v-for="opt in conditionOptions"
              :key="opt.value"
              type="button"
              @click="form.conditionId = opt.value"
              :class="[
                'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                form.conditionId === opt.value
                  ? `${opt.activeBorder} ${opt.activeBg} shadow-md scale-[1.03]`
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              ]"
            >
              <span class="text-xl">{{ opt.icon }}</span>
              <span
                class="text-xs font-semibold text-center leading-tight"
                :class="form.conditionId === opt.value ? opt.activeText : 'text-gray-600 dark:text-gray-300'"
              >{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- Temperature + Weight -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Temperature (°C) <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.temperature"
                type="number"
                step="0.1"
                min="30"
                max="45"
                class="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
                placeholder="e.g. 38.5"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">°C</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Weight (kg) <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.weight"
                type="number"
                step="0.1"
                min="0"
                class="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
                placeholder="e.g. 120"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">kg</span>
            </div>
          </div>
        </div>

        <!-- Vaccination -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Vaccination</label>
          <div class="flex gap-3">
            <button
              type="button"
              @click="form.isVaccinated = true"
              :class="[
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all duration-200 font-medium text-sm',
                form.isVaccinated === true
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 shadow-sm'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:border-green-300'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Vaccinated
            </button>
            <button
              type="button"
              @click="form.isVaccinated = false"
              :class="[
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all duration-200 font-medium text-sm',
                form.isVaccinated === false
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 shadow-sm'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:border-red-300'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              Unvaccinated
            </button>
          </div>
        </div>

        <!-- Date of last checkup -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Date of last checkup
          </label>
          <input
            v-model="form.dateOfLastCheckup"
            type="datetime-local"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
          />
          <p class="text-xs text-gray-400 mt-1">Leave empty to use current date and time.</p>
        </div>
      </div>

      <!-- Error banner -->
      <div class="mx-5 mt-2">
        <FormError :error="saveError" />
      </div>

      <!-- Footer -->
      <div class="p-5 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 shrink-0">
        <button type="button" :disabled="isSaving" @click="$emit('close')" class="px-5 py-2 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSaving || form.conditionId === null || form.isVaccinated === null"
          class="bg-[#2d6a4f] hover:bg-[#1a3b22] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 min-w-[160px] justify-center"
        >
          <svg v-if="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
          </svg>
          {{ isSaving ? 'Saving...' : 'Save record' }}
        </button>
      </div>
    </form>
  </div>
</Teleport>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import animalService from '../../services/animal.service';
import { useAnimalConditions } from '../../composables/useAnimalConditions';
import FormError from '../FormError.vue';
import { parseApiError } from '../../utils/parseApiError';

const props = defineProps({
  animalId: { type: [Number, String], required: true },
});

const emit = defineEmits(['save', 'close']);

const { conditions, isLoading: isLoadingConditions, load: loadConditions } = useAnimalConditions();
const conditionOptions = computed(() => conditions.value);

onMounted(loadConditions);

const form = reactive({
  conditionId: null,
  temperature: '',
  weight: '',
  isVaccinated: null,
  dateOfLastCheckup: '',
});

const isSaving  = ref(false);
const saveError = ref(null);

const handleSave = async () => {
  if (form.conditionId === null || form.isVaccinated === null || isSaving.value) return;

  isSaving.value = true;
  saveError.value = null;

  const dto = {
    ConditionId: form.conditionId,
    Temperature: parseFloat(form.temperature) || 0,
    Weight: parseFloat(form.weight) || 0,
    IsVacinated: form.isVaccinated,
    DateOfLastCheckup: form.dateOfLastCheckup
      ? new Date(form.dateOfLastCheckup).toISOString()
      : null,
  };

  try {
    await animalService.addHistory(props.animalId, dto);
    emit('save');
  } catch (err) {
    console.error('[AddHealthRecordModal] error:', err);
    saveError.value = parseApiError(err, 'Failed to save the record. Check API connection.');
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
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; }
</style>
