<template>
  <div
    class="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-0"
  >
    <!-- Tabela — widoczna gdy są wiersze -->
    <div v-if="rows.length > 0" class="flex-1 overflow-auto custom-scrollbar">
      <table class="w-full text-left border-collapse">
        <thead class="sticky top-0 bg-gray-50 dark:bg-gray-900/95 backdrop-blur-sm z-10 shadow-sm border-b border-gray-100 dark:border-gray-700">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :class="[
                'py-3 px-4 font-semibold text-gray-700 dark:text-gray-300',
                col.width  ? col.width  : '',
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : '',
                col.key !== columns[0].key ? 'px-6' : 'px-4',
              ]"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <TransitionGroup
          name="row"
          tag="tbody"
          class="divide-y divide-gray-100 dark:divide-gray-700"
        >
          <tr
            v-for="row in rows"
            :key="row[rowKey]"
            class="transition-colors duration-200 group"
            :class="[
              clickable
                ? 'hover:bg-[#f0f9f4] dark:hover:bg-[#132a1e] cursor-pointer hover:shadow-[inset_4px_0_0_0_#2d6a4f] dark:hover:shadow-[inset_4px_0_0_0_#4ade80]'
                : 'hover:bg-[#f0f9f4] dark:hover:bg-[#132a1e]',
            ]"
            @click="clickable ? $emit('row-click', row[rowKey]) : undefined"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[
                'py-3',
                col.key !== columns[0].key ? 'px-6' : 'px-4',
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : '',
              ]"
            >
              <!-- Slot na customowe renderowanie komórki: #cell-{key} -->
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                <span class="text-gray-700 dark:text-gray-300 text-sm">{{ row[col.key] ?? '—' }}</span>
              </slot>
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>

    <!-- Empty state -->
    <Transition name="fade">
      <div v-if="rows.length === 0" class="flex-1 flex flex-col items-center justify-center select-none overflow-hidden py-12">
        <slot name="empty">
          <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p class="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-1">No data</p>
          <p class="text-sm text-gray-300 dark:text-gray-600 text-center max-w-xs">Add the first record using the button above.</p>
        </slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import '../assets/table-animations.css';

defineProps({
  /**
   * Definicja kolumn:
   * [{ key: string, label: string, width?: string, align?: 'left'|'center'|'right' }]
   */
  columns: {
    type: Array,
    required: true,
  },
  /** Dane tabeli */
  rows: {
    type: Array,
    required: true,
  },
  /** Nazwa pola używanego jako klucz wiersza (domyślnie 'id') */
  rowKey: {
    type: String,
    default: 'id',
  },
  /** Czy wiersze są klikalne (emituje 'row-click') */
  clickable: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['row-click']);
</script>

<style scoped>
/* Fade dla empty state */
.fade-enter-active { transition: opacity 0.3s ease 0.1s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.1s; }
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from   { opacity: 0; transform: translateY(8px); }
.fade-leave-to     { opacity: 0; }

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; }
.dark .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #4b5563; }
</style>
