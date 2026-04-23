<script setup>
import MainLayout from './layouts/MainLayout.vue';
import Map from './components/Map.vue';
</script>

<template>
  <MainLayout v-if="$route.path !== '/login'">
    <router-view />
  </MainLayout>
  <router-view v-else />
  
</template>
