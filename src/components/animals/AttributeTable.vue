<template>
  <DataTable
    :columns="columns"
    :rows="attributes"
    row-key="id"
  >
    <!-- Attribute name -->
    <template #cell-name="{ row }">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 flex items-center justify-center font-bold text-xs">
          {{ row.name.charAt(0).toUpperCase() }}
        </div>
        <span class="font-medium text-gray-900 dark:text-white">{{ row.name }}</span>
      </div>
    </template>

    <!-- Data type -->
    <template #cell-type="{ row }">
      <span class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
        {{ row.type }}
      </span>
    </template>

    <!-- Actions -->
    <template #cell-actions="{ row }">
      <button
        class="text-gray-400 hover:text-red-500 transition-colors p-1"
        title="Delete"
        @click.stop="$emit('delete', row.id)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </template>

    <!-- Empty state -->
    <template #empty>
      <p class="text-sm text-gray-400 py-4">No attributes match your search.</p>
    </template>
  </DataTable>
</template>

<script setup>
import DataTable from '../DataTable.vue';

defineProps({
  attributes: {
    type: Array,
    required: true,
  },
});

defineEmits(['delete']);

const columns = [
  { key: 'name',    label: 'Attribute name' },
  { key: 'type',    label: 'Data type' },
  { key: 'actions', label: 'Actions', width: 'w-24', align: 'right' },
];
</script>
