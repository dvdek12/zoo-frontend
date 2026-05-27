<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import ClientLayout from './layouts/ClientLayout.vue';
import NavProgressBar from './components/NavProgressBar.vue';
import { useThemeStore } from './stores/theme';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const auth = useAuthStore();

onMounted(() => {
  const themeStore = useThemeStore();
  themeStore.init();
});

const layout = computed(() => {
  if (route.path === '/login') return 'none';
  if (route.meta.layout === 'client') return 'client';
  return 'main';
});
</script>

<template>
  <!-- Global navigation progress bar -->
  <NavProgressBar />

  <!-- Main app layout (employee / manager) -->
  <ClientLayout v-if="layout === 'client'">
    <router-view v-slot="{ Component, route: r }">
      <Transition name="page-fade">
        <component :is="Component" :key="r.fullPath" />
      </Transition>
    </router-view>
  </ClientLayout>

  <!-- Internal layout with sidebar -->
  <!-- keep-alive: zachowuje instancje komponentów w pamięci między nawigacjami.
       Powrót na stronę jest natychmiastowy — dane i stan UI są z cache.
       max=10 → LRU, po przekroczeniu najstarszy komponent jest niszczony. -->
  <MainLayout v-else-if="layout === 'main'">
    <router-view v-slot="{ Component, route: r }">
      <Transition name="page-slide">
        <keep-alive :max="10">
          <component :is="Component" :key="r.fullPath" />
        </keep-alive>
      </Transition>
    </router-view>
  </MainLayout>

  <!-- Login page (no layout) -->
  <router-view v-else v-slot="{ Component, route: r }">
    <Transition name="page-fade">
      <component :is="Component" :key="r.fullPath" />
    </Transition>
  </router-view>
</template>

