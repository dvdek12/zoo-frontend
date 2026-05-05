<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Dodaj atrybut</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nazwa atrybutu</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all"
            placeholder="np. Czy lata"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Typ danych</label>
          <select
            v-model="form.type"
            class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all appearance-none"
          >
            <option value="Boolean (Tak/Nie)">Boolean (Tak/Nie)</option>
            <option value="Tekst">Tekst</option>
            <option value="Liczba">Liczba</option>
            <option value="Wybór z listy">Wybór z listy</option>
          </select>
        </div>
      </div>

      <div class="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
        <button @click="$emit('close')" class="px-5 py-2 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Anuluj
        </button>
        <button @click="handleSave" class="bg-[#2d6a4f] hover:bg-[#1a3b22] text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-sm">
          Zapisz atrybut
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['save', 'close']);

const form = reactive({
  name: '',
  type: 'Boolean (Tak/Nie)',
});

const handleSave = () => {
  if (!form.name) return;
  emit('save', { name: form.name, type: form.type });
  form.name = '';
  form.type = 'Boolean (Tak/Nie)';
};
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
