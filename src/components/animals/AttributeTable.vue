<template>
  <div class="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-0">
    <div class="flex-1 overflow-auto custom-scrollbar">
      <table class="w-full text-left border-collapse text-sm">
        <thead class="sticky top-0 bg-gray-50 dark:bg-gray-900/95 backdrop-blur-sm z-10 shadow-sm border-b border-gray-100 dark:border-gray-700">
          <tr>
            <th class="py-2.5 px-6 font-semibold text-gray-700 dark:text-gray-300">Nazwa atrybutu</th>
            <th class="py-2.5 px-6 font-semibold text-gray-700 dark:text-gray-300">Typ danych</th>
            <th class="py-2.5 px-6 font-semibold text-gray-700 dark:text-gray-300 text-right w-24">Akcje</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr
            v-for="attr in attributes"
            :key="attr.id"
            class="hover:bg-[#f0f9f4] dark:hover:bg-[#132a1e] transition-all duration-200 cursor-pointer hover:shadow-[inset_4px_0_0_0_#2d6a4f] dark:hover:shadow-[inset_4px_0_0_0_#4ade80]"
          >
            <td class="py-2 px-6">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-md bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 flex items-center justify-center font-bold text-xs">
                  {{ attr.name.charAt(0).toUpperCase() }}
                </div>
                <span class="font-medium text-gray-900 dark:text-white">{{ attr.name }}</span>
              </div>
            </td>
            <td class="py-2 px-6 text-gray-500 dark:text-gray-400">
              <span class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                {{ attr.type }}
              </span>
            </td>
            <td class="py-2 px-6 text-right">
              <button
                class="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Usuń"
                @click="$emit('delete', attr.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="attributes.length === 0">
            <td colspan="3" class="py-4 text-center text-gray-500">Brak atrybutów pasujących do wyszukiwania.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  attributes: {
    type: Array,
    required: true,
  },
});

defineEmits(['delete']);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; }
.dark .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #4b5563; }
</style>
