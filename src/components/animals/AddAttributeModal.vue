<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Add attribute</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <!-- Attribute name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attribute name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all"
            placeholder="e.g. Can fly"
          />
        </div>

        <!-- Data type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data type</label>
          <select
            v-model.number="form.type"
            class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all appearance-none"
          >
            <option :value="0">Text (String)</option>
            <option :value="1">Number</option>
            <option :value="2">Yes/No (Boolean)</option>
            <option :value="3">Date</option>
          </select>
        </div>

        <!-- Animal type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Animal type
            <span class="text-gray-400 font-normal">(optional)</span>
          </label>
          <div class="relative">
            <select
              v-model="form.animalTypeId"
              :disabled="isLoadingTypes"
              class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all appearance-none disabled:opacity-60"
            >
              <option :value="null">— None (global attribute) —</option>
              <option
                v-for="animalType in animalTypes"
                :key="animalType.id"
                :value="animalType.id"
              >
                {{ animalType.animalTypeName ?? animalType.name ?? `Type #${animalType.id}` }}
              </option>
            </select>
            <!-- loading spinner -->
            <div v-if="isLoadingTypes" class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg class="animate-spin h-4 w-4 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          </div>
          <p v-if="typesError" class="text-xs text-red-500 mt-1">{{ typesError }}</p>
        </div>
      </div>

      <div v-if="saveError" class="mx-6 mt-2 mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
        {{ saveError }}
      </div>

      <div class="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
        <button type="button" :disabled="isSaving" @click="$emit('close')" class="px-5 py-2 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button :disabled="isSaving || !form.name" @click="handleSave" class="bg-[#2d6a4f] hover:bg-[#1a3b22] disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 min-w-[140px] justify-center">
          <svg v-if="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ isSaving ? 'Saving...' : 'Save attribute' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import animalService from '../../services/animal.service';
import animalTypeService from '../../services/animalType.service';

const emit = defineEmits(['save', 'close']);

const form = reactive({
  name: '',
  type: 0,
  animalTypeId: null,
});

const isSaving = ref(false);
const saveError = ref(null);

// --- Animal types ---
const animalTypes    = ref([]);
const isLoadingTypes = ref(false);
const typesError     = ref(null);

onMounted(async () => {
  isLoadingTypes.value = true;
  typesError.value = null;
  try {
    const data = await animalTypeService.getAll();
    animalTypes.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[AddAttributeModal] fetchAnimalTypes:', e);
    typesError.value = 'Failed to load animal types.';
  } finally {
    isLoadingTypes.value = false;
  }
});

const handleSave = async () => {
  if (!form.name || isSaving.value) return;
  isSaving.value = true;
  saveError.value = null;

  const dto = {
    AttributeName: form.name,
    AnimalTypeId: form.animalTypeId ?? null,
    AttributeType: form.type,
  };

  try {
    const saved = await animalService.createAttribute(dto);
    emit('save', saved || { name: form.name, type: form.type });
    form.name = '';
    form.type = 0;
    form.animalTypeId = null;
  } catch (err) {
    console.error('[AddAttributeModal] POST error:', err);
    saveError.value = err?.response?.data?.message ?? err?.response?.data ?? 'Failed to add attribute.';
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
