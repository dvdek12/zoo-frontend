<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <form
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up flex flex-col"
      @submit.prevent="handleSave"
      novalidate
    >
      <!-- Header -->
      <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEdit ? 'Edit type' : 'Add type' }}
          </h3>
        </div>
        <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-5 space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Type name <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.typeName"
            type="text"
            required
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
            placeholder="e.g. Cage, Aquarium, Open enclosure"
          />
        </div>
      </div>

      <!-- Save error banner -->
      <div class="mx-5 mt-2">
        <FormError :error="saveError" />
      </div>

      <!-- Footer -->
      <div class="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 shrink-0 mt-4">
        <button type="button" :disabled="isSaving" @click="$emit('close')" class="px-4 py-1.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSaving || !form.typeName"
          class="bg-[#2d6a4f] hover:bg-[#1a3b22] disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-1.5 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <svg v-if="isSaving" class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ isSaving ? 'Saving…' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import enclosureService from '../../services/enclosure.service';
import FormError from '../FormError.vue';
import { parseApiError } from '../../utils/parseApiError';

const props = defineProps({
  enclosureType: {
    type: Object,
    default: null,
  }
});

const emit = defineEmits(['save', 'close']);

const isEdit = ref(false);
const isSaving = ref(false);
const saveError = ref(null);

const form = reactive({
  typeName: '',
});

onMounted(() => {
  if (props.enclosureType) {
    isEdit.value = true;
    form.typeName = props.enclosureType.typeName || '';
  }
});

const handleSave = async () => {
  if (!form.typeName || isSaving.value) return;

  isSaving.value = true;
  saveError.value = null;

  try {
    const dto = {
      typeName: form.typeName,
    };

    if (isEdit.value) {
      await enclosureService.updateType(props.enclosureType.id, dto);
    } else {
      await enclosureService.createType(dto);
    }
    
    emit('save');
  } catch (err) {
    console.error('[EnclosureTypeModal] Save error:', err);
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
</style>
