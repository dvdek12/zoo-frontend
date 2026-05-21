<template>
  <div class="p-8 h-full flex flex-col">
    <PageHeader title="Profil" subtitle="Zarządzaj swoimi danymi i ustawieniami konta." />

    <div class="bg-white rounded-xl shadow-sm p-8 flex-1 max-w-4xl">
      <EditProfileForm />
    </div>
  </div>
</template>

<script setup>
import EditProfileForm from '../components/forms/EditProfileForm.vue';
import PageHeader from '../components/PageHeader.vue';
</script>
