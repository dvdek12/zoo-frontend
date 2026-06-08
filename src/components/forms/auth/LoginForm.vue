<template>
  <div>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-[#1a3b22] mb-1">Welcome back</h2>
      <p class="text-gray-500 text-sm">Sign in to your account.</p>
    </div>
    <form class="space-y-5" @submit.prevent="handleLogin">
      <div>
        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Mail class="w-5 h-5" />
          </div>
          <input
            type="email"
            v-model="email"
            placeholder="marekkowalski@gmail.com"
            class="w-full pl-10 pr-4 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Password</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <KeyRound class="w-5 h-5" />
          </div>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="••••••••••••"
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
          Login
          <ArrowRight class="w-5 h-5" />
        </template>
      </button>

      <FormError :error="errorMessage" class="mt-4" />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Mail, KeyRound, Eye, EyeOff, ArrowRight } from 'lucide-vue-next';
import { useAuthStore } from '../../../stores/auth';
import FormError from '../../FormError.vue';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const router = useRouter();
const auth = useAuthStore();

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await auth.login(email.value, password.value);
    if (auth.hasRole('Employee')) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  } catch (error) {
    const data = error?.response?.data;
    if (data?.message) errorMessage.value = data.message;
    else if (typeof data === 'string' && data.trim()) errorMessage.value = data.trim();
    else errorMessage.value = 'Invalid email or password.';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
