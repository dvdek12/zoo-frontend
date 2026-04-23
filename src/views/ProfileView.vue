<template>
  <div class="p-8 h-full flex flex-col">
    <div class="mb-8 flex items-center justify-between">
      <h2 class="text-[2.5rem] font-bold text-[#1a3b22] tracking-tight">Ustawienia Profilu</h2>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-8 flex-1 max-w-4xl">
      <EditProfileForm />
    </div>
  </div>
</template>

<script setup>
import EditProfileForm from '../components/forms/EditProfileForm.vue';
</script>
