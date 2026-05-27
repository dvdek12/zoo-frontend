<template>
  <div class="shrink-0 w-full">
    <div class="relative flex bg-white dark:bg-[#1e2228] border border-gray-200 dark:border-gray-800 rounded-full p-1 shadow-sm w-full">
      <!-- Animated slider -->
      <div
        class="absolute top-1 bottom-1 bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] rounded-full shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0"
        :style="sliderStyle"
      />
      <button
        v-for="(tab, idx) in tabs"
        :key="tab.key"
        :id="`tab-${tab.key}`"
        class="relative z-10 flex-1 flex items-center justify-center gap-2 px-8 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-200"
        :class="modelValue === tab.key ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
        @click="$emit('update:modelValue', tab.key)"
        type="button"
      >
        <!-- Slot dla ikony SVG lub string -->
        <span v-if="tab.icon" class="w-4 h-4" v-html="tab.icon" />
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /**
   * Tablica zakładek: [{ key: string, label: string, icon?: string (svg html) }]
   */
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => tabs.every(t => t.key && t.label),
  },
  /** Aktualnie aktywna zakładka (klucz) */
  modelValue: {
    type: String,
    required: true,
  },
});

defineEmits(['update:modelValue']);

/** Oblicza pozycję i szerokość slidera na podstawie aktywnej zakładki */
const sliderStyle = computed(() => {
  const idx = props.tabs.findIndex(t => t.key === props.modelValue);
  const count = props.tabs.length;
  const pct = 100 / count;
  // Odstęp 4px między zakładkami (gap w p-1 rounded-full)
  const gap = 4;
  return {
    width: `calc(${pct}% - ${gap}px)`,
    transform: `translateX(calc(${idx * 100}% + ${idx * gap}px))`,
  };
});
</script>
