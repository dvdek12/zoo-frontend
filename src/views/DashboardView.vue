<template>
  <div class="flex items-center justify-center h-full">
    <h2 
    v-if="auth.isLoggedIn"
    class="text-[2.5rem] font-bold text-[#1a3b22] tracking-tight">Good morning, {{ auth.userEmail }}!</h2>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
</script>
