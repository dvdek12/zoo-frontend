<template>
  <div class="flex items-center gap-3 shrink-0 mb-6">
    <!-- Optional icon slot -->
    <div
      v-if="$slots.icon"
      class="w-11 h-11 rounded-2xl bg-[#2d6a4f]/10 dark:bg-green-400/10 border border-[#2d6a4f]/15 dark:border-green-400/15 flex items-center justify-center shrink-0"
    >
      <slot name="icon" />
    </div>

    <div>
      <h1 class="text-2xl font-bold text-[#1a3b22] dark:text-green-400 tracking-tight leading-tight">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: null,
  },
});
</script>
