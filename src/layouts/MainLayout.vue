<script setup>
import AppSidebar from '../components/AppSidebar.vue';
</script>

<template>
  <div class="flex h-screen w-full bg-[#fbfbfa] text-gray-800 font-sans overflow-hidden">
    <AppSidebar />
    <main class="flex-1 flex flex-col h-screen overflow-hidden relative">
      <slot />
    </main>
  </div>
</template>
