<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group relative">
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 pr-6">{{ enclosure.name }}</h3>
      <div class="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
        <button @click="$emit('edit', enclosure)" class="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        </button>
        <button @click="$emit('delete', enclosure.id)" class="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
    
    <div class="mb-4 flex-1">
      <span class="inline-block px-2.5 py-1 text-xs font-medium rounded-lg mb-2" 
            :class="enclosure.typeId ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'">
        {{ typeName }}
      </span>
      <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
        {{ enclosure.description || 'Brak opisu.' }}
      </p>
    </div>

    <div class="mt-auto pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center text-xs text-gray-400">
      <span>ID: {{ enclosure.id }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  enclosure: {
    type: Object,
    required: true
  },
  typeName: {
    type: String,
    required: true
  }
});

defineEmits(['edit', 'delete']);
</script>
