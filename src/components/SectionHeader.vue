<template>
  <div class="flex justify-between items-center shrink-0" :class="marginClass">
    <!-- Tytuł i podtytuł -->
    <div>
      <h2 class="text-2xl font-bold text-[#1a3b22] dark:text-green-400 tracking-tight">
        <slot name="title">{{ title }}</slot>
      </h2>
      <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ subtitle }}</p>
    </div>

    <!-- Slot na akcje (custom buttons) lub domyślny AddButton -->
    <slot name="actions">
      <AddButton
        v-if="buttonLabel"
        :label="buttonLabel"
        :id="buttonId"
        :variant="buttonVariant"
        @click="$emit('action')"
      />
    </slot>
  </div>
</template>

<script setup>
import AddButton from './AddButton.vue';

defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: null,
  },
  /** Etykieta przycisku akcji. Jeśli null — przycisk nie jest renderowany (chyba że slot #actions jest wypełniony) */
  buttonLabel: {
    type: String,
    default: null,
  },
  buttonId: {
    type: String,
    default: null,
  },
  buttonVariant: {
    type: String,
    default: 'primary',
  },
  /** Klasa marginesu dolnego */
  marginClass: {
    type: String,
    default: 'mb-4',
  },
});

defineEmits(['action']);
</script>
