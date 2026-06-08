<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <form
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[92vh]"
      @submit.prevent="handleSave"
      novalidate
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEdit ? 'Edit enclosure' : 'Add new enclosure' }}
          </h3>
          <p class="text-sm text-gray-400 mt-0.5">
            {{ isEdit ? 'Update enclosure data' : 'Fill enclosure data' }}
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
            Enclosure name <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
            placeholder="e.g. Large lion enclosure"
          />
        </div>

        <!-- Type -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Enclosure type
          </label>
          <select
            v-model="form.typeId"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all appearance-none"
          >
            <option :value="null">Select type...</option>
            <option v-for="t in enclosureTypes" :key="t.id" :value="t.id">
              {{ t.typeName }}
            </option>
          </select>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all resize-none"
            placeholder="Additional information..."
          />
        </div>

        <!-- Location on map -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Location on map
            <span class="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <ZooMiniMap v-model="form.mapKey" :taken-keys="effectiveTakenKeys" />
        </div>
      </div>

      <!-- Save error banner -->
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
          :disabled="isSaving || !form.name"
          class="bg-[#2d6a4f] hover:bg-[#1a3b22] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 min-w-[150px] justify-center"
        >
          <svg v-if="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
          {{ isSaving ? 'Saving…' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import enclosureService from '../../services/enclosure.service';
import ZooMiniMap from './ZooMiniMap.vue';
import FormError from '../FormError.vue';
import { parseApiError } from '../../utils/parseApiError';

const props = defineProps({
  enclosure: {
    type: Object,
    default: null,
  },
  enclosureTypes: {
    type: Array,
    required: true,
  },
  /** MapKey keys of already assigned enclosures */
  takenKeys: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['save', 'close']);

const isEdit = ref(false);
const isSaving = ref(false);
const saveError = ref(null);

/**
 * When editing, we exclude our own mapKey from the taken list,
 * so the user can keep or change the same enclosure.
 */
const effectiveTakenKeys = computed(() => {
  if (isEdit.value && props.enclosure?.mapKey) {
    return props.takenKeys.filter(k => k !== props.enclosure.mapKey);
  }
  return props.takenKeys;
});

const form = reactive({
  name: '',
  description: '',
  typeId: null,
  mapKey: null,
});

onMounted(() => {
  if (props.enclosure) {
    isEdit.value = true;
    form.name = props.enclosure.name || '';
    form.description = props.enclosure.description || '';
    form.typeId = props.enclosure.typeId || null;
    form.mapKey = props.enclosure.mapKey || null;
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
      mapKey: form.mapKey,
    };

    if (isEdit.value) {
      await enclosureService.update(props.enclosure.id, dto);
    } else {
      await enclosureService.create(dto);
    }
    
    emit('save');
  } catch (err) {
    console.error('[EnclosureModal] Save error:', err);
    saveError.value = parseApiError(err, 'An error occurred while saving.');
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
