<template>
  <div class="h-full flex flex-col">
    <PageBanner
      title="Profile"
      eyebrow="Zoo Management"
      subtitle="Manage your personal data and account settings."
      image="/banner_profile.png"
      image-position="center 40%"
    />
    <div class="px-8 pt-6 pb-8 flex flex-col flex-1 overflow-y-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 flex-1 max-w-4xl">
        <EditProfileForm />
      </div>
    </div>
  </div>
</template>

<script setup>
import EditProfileForm from '../components/forms/EditProfileForm.vue';
import PageBanner from '../components/PageBanner.vue';
</script>
