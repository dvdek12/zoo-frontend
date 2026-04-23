<template>
  <div class="flex h-screen w-full bg-[#fcfcfc] overflow-hidden font-sans">
    
    <!-- Left Section: Image and Branding -->
    <div class="relative hidden lg:flex flex-col justify-between w-1/2 p-12 text-white bg-green-900">
      <div class="absolute inset-0 z-0">
        <img src="/panda_bg.png" alt="Panda Background" class="obect-cover w-full h-full object-cover opacity-80 mix-blend-overlay" />
        <div class="absolute inset-0 bg-gradient-to-b from-[#11381c]/80 via-[#11381c]/60 to-[#11381c]/90"></div>
      </div>

      <!-- Top Branding -->
      <div class="relative z-10">
        <img src="/logozoone.png" alt="ZooNe Logo" class="w-40 rounded-2xl shadow-xl border border-white/10" />
      </div>

      <!-- Main Copy -->
      <div class="relative z-10 mb-24 max-w-xl">
        <h1 class="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
          Organic<br />Ledger
        </h1>
        <p class="text-xl font-light leading-relaxed text-gray-200">
          Precision zoological data meets the rhythmic beauty of the natural world. Protecting the future of our wildlife through intentional design.
        </p>
      </div>

      <!-- Footer -->
      <div class="relative z-10 flex items-center gap-4">
        <span class="text-sm font-medium text-gray-300">Application Made By Kacper Miczejko and Przemysław Dudek</span>
      </div>
    </div>

    <!-- Right Section: Forms -->
    <div class="relative flex flex-col justify-center items-center w-full lg:w-1/2 p-8 lg:p-16">
      <div class="w-full max-w-md">

        <!-- Toggle Tabs -->
        <div class="flex items-center gap-1 bg-[#eeede8] p-1 rounded-full mb-10 w-fit">
          <button
            @click="mode = 'login'"
            :class="mode === 'login' ? 'bg-white text-[#1a3b22] shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            class="px-6 py-2 rounded-full text-sm font-bold transition-all duration-200"
          >
            Sign In
          </button>
          <button
            @click="mode = 'register'"
            :class="mode === 'register' ? 'bg-white text-[#1a3b22] shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            class="px-6 py-2 rounded-full text-sm font-bold transition-all duration-200"
          >
            Register
          </button>
        </div>

        <!-- Animated Form Switch -->
        <Transition name="fade" mode="out-in">
          <LoginForm v-if="mode === 'login'" key="login" />
          <RegisterForm v-else key="register" />
        </Transition>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LoginForm from '../components/auth/LoginForm.vue';
import RegisterForm from '../components/auth/RegisterForm.vue';

const mode = ref('login');
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>