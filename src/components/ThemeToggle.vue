<script setup>
import { Sun, Moon } from 'lucide-vue-next';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();
</script>

<template>
  <button
    @click="themeStore.toggleTheme()"
    title="Przełącz motyw"
    class="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200
           text-gray-600 hover:text-gray-900 hover:bg-gray-100
           dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
  >
    <Sun v-if="themeStore.isDark" class="w-5 h-5" />
    <Moon v-else class="w-5 h-5" />
  </button>
</template>
