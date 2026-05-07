<script setup>
import AppSidebar from '../components/AppSidebar.vue';
</script>

<template>
  <div class="flex h-screen w-full bg-[#fbfbfa] text-gray-800 dark:bg-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-200">
    <AppSidebar />
    <main class="flex-1 flex flex-col h-screen overflow-y-auto relative">
      <slot />
    </main>
  </div>
</template>
