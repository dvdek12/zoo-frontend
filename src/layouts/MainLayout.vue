<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from '../components/AppSidebar.vue';
import Breadcrumb from '../components/Breadcrumb.vue';

const mainEl = ref(null);
const route  = useRoute();

// Reset scroll do góry przy każdej zmianie trasy.
// Bez tego <main> (overflow-y-auto) zachowuje pozycję scrolla między
// podstronami — Router nie zarządza scrollem wewnątrz custom kontenerów.
watch(
  () => route.path,
  () => { if (mainEl.value) mainEl.value.scrollTop = 0; }
);
</script>

<template>
  <div class="flex h-screen w-full bg-[#fbfbfa] text-gray-800 dark:bg-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-200">
    <AppSidebar />
    <main ref="mainEl" class="flex-1 flex flex-col h-screen overflow-y-auto relative">
      <!-- Breadcrumb pływający nad banerem (always absolute, always white) -->
      <div class="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <Breadcrumb class="pointer-events-auto pl-14 md:pl-0" />
      </div>
      <slot />
    </main>
  </div>
</template>

