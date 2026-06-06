<template>
  <form @submit.prevent="saveProfile" class="max-w-2xl">

    <div v-if="isLoadingProfile" class="flex items-center gap-3 text-gray-500 py-8">
      <svg class="animate-spin h-5 w-5 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <span class="text-sm">Loading profile...</span>
    </div>

    <div v-else-if="loadError" class="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
      {{ loadError }}
    </div>

    <template v-else>
      <div class="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
        <div class="w-24 h-24 rounded-full bg-[#f0f9f4] flex items-center justify-center text-[#2d6a4f] text-3xl font-bold border-4 border-white shadow-md">
          {{ initials }}
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-800">{{ form.firstName }} {{ form.lastName }}</h3>
          <p class="text-gray-500">{{ form.email }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">First Name</label>
          <input
            v-model="form.firstName"
            type="text"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f] focus:ring-opacity-20 transition-all outline-none"
            placeholder="Enter first name"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Last Name</label>
          <input
            v-model="form.lastName"
            type="text"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f] focus:ring-opacity-20 transition-all outline-none"
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div class="space-y-2 mb-6">
        <label class="block text-sm font-semibold text-gray-700">Email address</label>
        <input
          v-model="form.email"
          type="email"
          readonly
          class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
        />
        <p class="text-xs text-gray-400">Email can only be changed by a manager.</p>
      </div>

      <div class="space-y-2 mb-8">
        <label class="block text-sm font-semibold text-gray-700">Phone number</label>
        <input
          v-model="form.phone"
          type="tel"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f] focus:ring-opacity-20 transition-all outline-none"
          placeholder="Enter number (optional)"
        />
      </div>

      <transition name="fade">
        <div v-if="saveError" class="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
          {{ saveError }}
        </div>
      </transition>

      <transition name="fade">
        <div v-if="successMessage" class="mb-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">{{ successMessage }}</span>
        </div>
      </transition>

      <div class="pt-4 border-t border-gray-100 flex gap-4">
        <button
          type="submit"
          :disabled="isSaving || !employeeId"
          class="px-8 py-3 bg-[#2d6a4f] text-white rounded-lg font-bold hover:bg-[#1a3b22] transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
        >
          <svg v-if="isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? 'Saving...' : 'Save changes' }}
        </button>
      </div>
    </template>

  </form>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';
import { ref, reactive, computed, onMounted } from 'vue';
import employeeService from '../../services/employee.service';

const auth = useAuthStore();

const employeeId = ref(null);
const isLoadingProfile = ref(true);
const isSaving = ref(false);
const loadError = ref('');
const saveError = ref('');
const successMessage = ref('');

const form = reactive({
  firstName: '',
  lastName: '',
  email: auth.userEmail || '',
  phone: '',
});

const initials = computed(() => {
  const first = form.firstName?.charAt(0) || '';
  const last = form.lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || '?';
});

const populateForm = (employee) => {
  employeeId.value = employee.id ?? employee.Id ?? null;
  form.firstName = employee.firstName ?? employee.FirstName ?? '';
  form.lastName = employee.lastName ?? employee.LastName ?? '';
  form.email = employee.email ?? employee.Email ?? auth.userEmail ?? '';
  form.phone = employee.phoneNumber ?? employee.PhoneNumber ?? '';
};

onMounted(async () => {
  isLoadingProfile.value = true;
  loadError.value = '';

  try {
    const email = auth.userEmail;
    if (!email) {
      loadError.value = 'No email in session. Please log in again.';
      return;
    }

    const employee = await employeeService.findByEmail(email);
    if (!employee) {
      loadError.value = 'No employee profile found associated with this account.';
      return;
    }

    populateForm(employee);
  } catch (err) {
    console.error('[EditProfileForm] load error:', err);
    loadError.value =
      err?.response?.data?.message ??
      'Failed to load profile data.';
  } finally {
    isLoadingProfile.value = false;
  }
});

const saveProfile = async () => {
  if (!employeeId.value || isSaving.value) return;

  isSaving.value = true;
  saveError.value = '';
  successMessage.value = '';

  const dto = {
    Id: employeeId.value,
    FirstName: form.firstName.trim(),
    LastName: form.lastName.trim(),
    PhoneNumber: form.phone.trim() || null,
  };

  try {
    await employeeService.updateAsEmployee(employeeId.value, dto);
    successMessage.value = 'Profile settings have been successfully saved.';
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (err) {
    console.error('[EditProfileForm] save error:', err);
    saveError.value =
      err?.response?.data?.message ??
      (typeof err?.response?.data === 'string' ? err.response.data : null) ??
      'Failed to save changes. Please try again.';
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
