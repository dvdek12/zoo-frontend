<template>
  <button
    :id="id"
    @click="$emit('click')"
    :class="[
      'font-semibold py-2 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5',
      variant === 'outline'
        ? 'bg-white dark:bg-gray-800 text-[#2d6a4f] dark:text-green-400 border border-[#2d6a4f] dark:border-green-400 hover:bg-[#2d6a4f] hover:text-white dark:hover:bg-green-400 dark:hover:text-gray-900 text-sm py-1.5'
        : 'bg-[#2d6a4f] hover:bg-[#1a3b22] text-white',
    ]"
    type="button"
  >
    <svg xmlns="http://www.w3.org/2000/svg" :class="variant === 'outline' ? 'h-4 w-4' : 'h-5 w-5'" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
    </svg>
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: null,
  },
  /**
   * 'primary' — zielony wypełniony (domyślny)
   * 'outline' — obramowanie, mniejszy
   */
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'outline'].includes(v),
  },
});

defineEmits(['click']);
</script>
