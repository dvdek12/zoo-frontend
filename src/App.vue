<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import ClientLayout from './layouts/ClientLayout.vue';
import { useThemeStore } from './stores/theme';

const route = useRoute();

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
  <ClientLayout v-if="layout === 'client'">
    <router-view />
  </ClientLayout>
  <MainLayout v-else-if="layout === 'main'">
    <router-view />
  </MainLayout>
  <router-view v-else />
</template>
