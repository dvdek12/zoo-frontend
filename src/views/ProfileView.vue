<template>
  <div class="p-8 h-full flex flex-col">
    <div class="mb-8 flex items-center justify-between">
      <h2 class="text-[2.5rem] font-bold text-[#1a3b22] tracking-tight">Ustawienia Profilu</h2>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-8 flex-1 max-w-4xl">
      <form @submit.prevent="saveProfile" class="max-w-2xl">
        
        <div class="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
          <div class="w-24 h-24 rounded-full bg-[#f0f9f4] flex items-center justify-center text-[#2d6a4f] text-3xl font-bold border-4 border-white shadow-md">
            {{ initials }}
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">{{ form.firstName || 'Jan' }} {{ form.lastName || 'Kowalski' }}</h3>
            <p class="text-gray-500">{{ form.email }}</p>
            <button type="button" class="mt-2 text-sm text-[#2d6a4f] font-semibold hover:text-[#1a3b22] transition-colors">
              Zmień zdjęcie profilowe
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Imię</label>
            <input 
              v-model="form.firstName"
              type="text" 
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f] focus:ring-opacity-20 transition-all outline-none"
              placeholder="Wprowadź imię"
              required
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Nazwisko</label>
            <input 
              v-model="form.lastName"
              type="text" 
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f] focus:ring-opacity-20 transition-all outline-none"
              placeholder="Wprowadź nazwisko"
              required
            />
          </div>
        </div>

        <div class="space-y-2 mb-6">
          <label class="block text-sm font-semibold text-gray-700">Adres e-mail</label>
          <input 
            v-model="form.email"
            type="email" 
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f] focus:ring-opacity-20 transition-all outline-none"
            placeholder="Wprowadź e-mail"
            required
          />
        </div>

        <div class="space-y-2 mb-8">
          <label class="block text-sm font-semibold text-gray-700">Numer telefonu</label>
          <input 
            v-model="form.phone"
            type="tel" 
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f] focus:ring-opacity-20 transition-all outline-none"
            placeholder="Wprowadź numer (opcjonalnie)"
          />
        </div>

        <!-- Opcjonalne pole z komunikatem sukcesu -->
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
            :disabled="isSaving"
            class="px-8 py-3 bg-[#2d6a4f] text-white rounded-lg font-bold hover:bg-[#1a3b22] transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
          >
            <svg v-if="isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSaving ? 'Zapisywanie...' : 'Zapisz zmiany' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { ref, reactive, computed, onMounted } from 'vue';

const auth = useAuthStore();

const isSaving = ref(false);
const successMessage = ref('');

const form = reactive({
  firstName: 'Zookeeper',
  lastName: 'Admin',
  email: auth.userEmail || 'admin@zoo.pl',
  phone: '123-456-789'
});

const initials = computed(() => {
  const first = form.firstName?.charAt(0) || '';
  const last = form.lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || 'ZA';
});

const saveProfile = async () => {
  isSaving.value = true;
  successMessage.value = '';
  
  // Symulacja połączenia z API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Miejscowy mock zapisu
  isSaving.value = false;
  successMessage.value = 'Ustawienia profilu zostały pomyślnie zapisane.';
  
  // Opróżnienie komunikatu po 3 sekundach
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
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
