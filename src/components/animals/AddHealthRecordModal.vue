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
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Nowy wpis zdrowotny</h3>
            <p class="text-xs text-gray-400 mt-0.5">Uzupełnij wyniki badania weterynaryjnego</p>
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

        <!-- Stan zdrowia -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Stan zdrowia <span class="text-red-400">*</span>
          </label>
          <!-- Loading skeleton -->
          <div v-if="isLoadingConditions" class="grid grid-cols-3 gap-2">
            <div v-for="i in 3" :key="i" class="h-16 rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse" />
          </div>

          <!-- Przyciski enum -->
          <div v-else class="grid grid-cols-3 gap-2">
            <button
              v-for="opt in conditionOptions"
              :key="opt.value"
              type="button"
              @click="form.conditionAdmission = opt.value"
              :class="[
                'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                form.conditionAdmission === opt.value
                  ? `${opt.activeBorder} ${opt.activeBg} shadow-md scale-[1.03]`
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              ]"
            >
              <span class="text-xl">{{ opt.icon }}</span>
              <span
                class="text-xs font-semibold text-center leading-tight"
                :class="form.conditionAdmission === opt.value ? opt.activeText : 'text-gray-600 dark:text-gray-300'"
              >{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- Temperatura + Waga -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Temperatura (°C) <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.temperature"
                type="number"
                step="0.1"
                min="30"
                max="45"
                class="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
                placeholder="np. 38.5"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">°C</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Waga (kg) <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.weight"
                type="number"
                step="0.1"
                min="0"
                class="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
                placeholder="np. 120"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">kg</span>
            </div>
          </div>
        </div>

        <!-- Szczepienie -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Szczepienie</label>
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
              Zaszczepiony
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
              Niezaszczepiony
            </button>
          </div>
        </div>

        <!-- Data ostatniego checkupu -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Data ostatniego badania
          </label>
          <input
            v-model="form.dateOfLastCheckup"
            type="datetime-local"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
          />
          <p class="text-xs text-gray-400 mt-1">Pozostaw puste aby użyć aktualnej daty i godziny.</p>
        </div>
      </div>

      <!-- Error banner -->
      <div v-if="saveError" class="mx-5 mb-0 mt-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
        {{ saveError }}
      </div>

      <!-- Footer -->
      <div class="p-5 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 shrink-0">
        <button type="button" :disabled="isSaving" @click="$emit('close')" class="px-5 py-2 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
          Anuluj
        </button>
        <button
          type="submit"
          :disabled="isSaving || form.conditionAdmission === null || form.isVaccinated === null"
          class="bg-[#2d6a4f] hover:bg-[#1a3b22] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 min-w-[160px] justify-center"
        >
          <svg v-if="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
          </svg>
          {{ isSaving ? 'Zapisywanie…' : 'Zapisz wpis' }}
        </button>
      </div>
    </form>
  </div>
</Teleport>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import animalService from '../../services/animal.service';

const props = defineProps({
  animalId: { type: [Number, String], required: true },
});

const emit = defineEmits(['save', 'close']);

// --- ENUM STANÓW ZDROWIA ---
const isLoadingConditions = ref(false);

// Styl dla kolejnych pozycji enuma (cyklicznie)
const CONDITION_STYLES = [
  { icon: '😊', activeBorder: 'border-green-500',  activeBg: 'bg-green-50 dark:bg-green-900/20',   activeText: 'text-green-600 dark:text-green-400' },
  { icon: '😐', activeBorder: 'border-yellow-500', activeBg: 'bg-yellow-50 dark:bg-yellow-900/20', activeText: 'text-yellow-600 dark:text-yellow-400' },
  { icon: '😟', activeBorder: 'border-red-500',    activeBg: 'bg-red-50 dark:bg-red-900/20',       activeText: 'text-red-600 dark:text-red-400' },
  { icon: '🔵', activeBorder: 'border-blue-500',   activeBg: 'bg-blue-50 dark:bg-blue-900/20',     activeText: 'text-blue-600 dark:text-blue-400' },
];

const conditionOptions = ref([]);

const fetchConditions = async () => {
  isLoadingConditions.value = true;
  try {
    const data = await animalService.getAnimalConditions();
    console.log('[AddHealthRecordModal] Raw enum response:', JSON.stringify(data));

    let arr = [];

    if (Array.isArray(data)) {
      arr = data.map((item, idx) => {
        if (typeof item === 'string') return { value: idx, label: item };
        if (typeof item === 'number') return { value: item, label: String(item) };
        return {
          value: item.value ?? item.id ?? item.key ?? idx,
          label: item.name ?? item.label ?? item.displayName ?? item.key ?? String(idx),
        };
      });
    } else if (data && typeof data === 'object') {
      // format: { "Dobry": 0, "Przeciętny": 1, ... }
      arr = Object.entries(data).map(([name, value]) => ({ value, label: name }));
    }

    if (arr.length === 0) throw new Error('Pusta odpowiedź enuma');

    conditionOptions.value = arr.map((item, idx) => ({
      ...item,
      ...CONDITION_STYLES[idx % CONDITION_STYLES.length],
    }));

    console.log('[AddHealthRecordModal] Mapped conditionOptions:', conditionOptions.value);
  } catch (err) {
    console.error('[AddHealthRecordModal] Blad pobierania enumow, fallback:', err);
    conditionOptions.value = [
      { value: 0, label: 'Dobry',      ...CONDITION_STYLES[0] },
      { value: 1, label: 'Przecietny', ...CONDITION_STYLES[1] },
      { value: 2, label: 'Zly',        ...CONDITION_STYLES[2] },
    ];
  } finally {
    isLoadingConditions.value = false;
  }
};

onMounted(fetchConditions);

const form = reactive({
  conditionAdmission: null,
  temperature: '',
  weight: '',
  isVaccinated: null,
  dateOfLastCheckup: '',
});

const isSaving  = ref(false);
const saveError = ref(null);

const handleSave = async () => {
  if (form.conditionAdmission === null || form.isVaccinated === null || isSaving.value) return;

  isSaving.value = true;
  saveError.value = null;

  const dto = {
    ConditionAdmission: form.conditionAdmission,
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
    saveError.value =
      err?.response?.data?.message ??
      err?.response?.data ??
      'Nie udało się zapisać wpisu. Sprawdź połączenie z API.';
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
