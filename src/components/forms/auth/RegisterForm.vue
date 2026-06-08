<template>
  <div>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-[#1a3b22] mb-1">Create account</h2>
      <p class="text-gray-500 text-sm">Register as a new staff member.</p>
    </div>
    <form class="space-y-5" @submit.prevent="handleRegister">
      <!-- First Name & Last Name -->
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">First Name</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <UserIcon class="w-5 h-5" />
            </div>
            <input
              type="text"
              v-model="regFirstName"
              placeholder="John"
              required
              class="w-full pl-10 pr-4 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
        <div class="flex-1">
          <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Last Name</label>
          <input
            type="text"
            v-model="regLastName"
            placeholder="Doe"
            required
            class="w-full px-4 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <!-- Date of Birth -->
      <div>
        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Date of Birth</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <CalendarIcon class="w-5 h-5" />
          </div>
          <input
            type="date"
            v-model="regBirthDate"
            required
            class="w-full pl-10 pr-4 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Mail class="w-5 h-5" />
          </div>
          <input
            type="email"
            v-model="regEmail"
            placeholder="john.doe@gmail.com"
            required
            class="w-full pl-10 pr-4 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <!-- Phone (optional) -->
      <div>
        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
          Phone <span class="text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <PhoneIcon class="w-5 h-5" />
          </div>
          <input
            type="tel"
            v-model="regPhone"
            placeholder="+48 123 456 789"
            class="w-full pl-10 pr-4 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Password</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <KeyRound class="w-5 h-5" />
          </div>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="regPassword"
            placeholder="Min. 8 characters"
            required
            class="w-full pl-10 pr-10 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <EyeOff v-if="showPassword" class="w-5 h-5" />
            <Eye v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex items-center justify-center gap-2 bg-[#1b4324] hover:bg-[#113118] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-full font-semibold transition-colors duration-200 mt-2"
      >
        <span v-if="isLoading" class="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
        <template v-else>
          Create account
          <ArrowRight class="w-5 h-5" />
        </template>
      </button>

      <!-- Response messages -->
      <FormError
        :error="messages.length > 0 ? messages : null"
        :variant="isSuccess ? 'success' : 'error'"
        class="mt-4"
      />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';
import { Mail, KeyRound, ArrowRight, Eye, EyeOff, User as UserIcon, Calendar as CalendarIcon, Phone as PhoneIcon } from 'lucide-vue-next';
import FormError from '../../FormError.vue';
import { parseApiError } from '../../../utils/parseApiError';

const auth = useAuthStore();

const regFirstName = ref('');
const regLastName = ref('');
const regBirthDate = ref('');
const regEmail = ref('');
const regPhone = ref('');
const regPassword = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const messages = ref([]);
const isSuccess = ref(false);

const router = useRouter();


const handleRegister = async () => {
  messages.value = [];
  isLoading.value = true;

  try {
    await auth.register(
      regFirstName.value,
      regLastName.value,
      regBirthDate.value,
      regEmail.value,
      regPhone.value,
      regPassword.value
    );

    isSuccess.value = true;
    messages.value = ['Account has been created! You can now log in.'];
    setTimeout(() => router.push('/login'), 1500);

  } catch (error) {
    isSuccess.value = false;
    const parsed = parseApiError(error, 'An unexpected error occurred. Please try again.');
    messages.value = Array.isArray(parsed) ? parsed : [parsed];
    console.error('[RegisterForm] full error object:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

