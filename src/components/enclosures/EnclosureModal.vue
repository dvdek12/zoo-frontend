<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <form
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]"
      @submit.prevent="handleSave"
      novalidate
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEdit ? 'Edytuj wybieg' : 'Dodaj nowy wybieg' }}
          </h3>
          <p class="text-sm text-gray-400 mt-0.5">
            {{ isEdit ? 'Zaktualizuj dane wybiegu' : 'Wypełnij dane wybiegu' }}
          </p>
        </div>
        <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto custom-scrollbar space-y-5">
        <!-- Name -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Nazwa wybiegu <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
            placeholder="np. Duży wybieg dla lwów"
          />
        </div>

        <!-- Type -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Typ wybiegu
          </label>
          <select
            v-model="form.typeId"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all appearance-none"
          >
            <option :value="null">Wybierz typ...</option>
            <option v-for="t in enclosureTypes" :key="t.id" :value="t.id">
              {{ t.typeName }}
            </option>
          </select>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Opis</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all resize-none"
            placeholder="Dodatkowe informacje..."
          />
        </div>
      </div>

      <!-- Save error banner -->
      <div v-if="saveError" class="mx-5 mb-0 mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
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
          :disabled="isSaving || !form.name"
          class="bg-[#2d6a4f] hover:bg-[#1a3b22] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 min-w-[150px] justify-center"
        >
          <svg v-if="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
          {{ isSaving ? 'Zapisywanie…' : 'Zapisz' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import enclosureService from '../../services/enclosure.service';

const props = defineProps({
  enclosure: {
    type: Object,
    default: null,
  },
  enclosureTypes: {
    type: Array,
    required: true,
  }
});

const emit = defineEmits(['save', 'close']);

const isEdit = ref(false);
const isSaving = ref(false);
const saveError = ref(null);

const form = reactive({
  name: '',
  description: '',
  typeId: null,
});

onMounted(() => {
  if (props.enclosure) {
    isEdit.value = true;
    form.name = props.enclosure.name || '';
    form.description = props.enclosure.description || '';
    form.typeId = props.enclosure.typeId || null;
  }
});

const handleSave = async () => {
  if (!form.name || isSaving.value) return;

  isSaving.value = true;
  saveError.value = null;

  try {
    const dto = {
      name: form.name,
      description: form.description,
      typeId: form.typeId,
    };

    if (isEdit.value) {
      await enclosureService.update(props.enclosure.id, dto);
    } else {
      await enclosureService.create(dto);
    }
    
    emit('save');
  } catch (err) {
    console.error('[EnclosureModal] Save error:', err);
    saveError.value =
      err?.response?.data?.message ||
      err?.response?.data ||
      'Wystąpił błąd podczas zapisywania.';
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
.custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; }
.dark .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #4b5563; }
</style>
