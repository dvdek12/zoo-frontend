<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import ClientLayout from './layouts/ClientLayout.vue';
import { useThemeStore } from './stores/theme';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const auth = useAuthStore();

onMounted(() => {
  const themeStore = useThemeStore();
  themeStore.init();

  const role = auth.user.role;
  console.log(role)
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
