<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import ThemeToggle from '../components/ThemeToggle.vue';
import { LogOut, UserCircle2 } from 'lucide-vue-next';

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push('/login');
}
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans bg-[#fbfbfa] text-gray-800 dark:bg-[#121212] dark:text-gray-100 transition-colors duration-200">
    <!-- Navbar -->
    <header class="bg-[#11381c] dark:bg-[#0b2412] text-white py-4 px-6 md:px-12 sticky top-0 z-50 shadow-lg transition-colors duration-200">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <img src="/logozoone.png" alt="ZooNe Logo" class="h-10 object-contain rounded-md" />
        </router-link>
        
        <!-- Center Nav -->
        <nav class="hidden md:flex gap-8 items-center font-medium text-sm tracking-wide">
          <a href="#home" class="hover:text-green-300 transition-colors">Start</a>
          <a href="#tickets" class="hover:text-green-300 transition-colors">Bilety</a>
          <a href="#contact" class="hover:text-green-300 transition-colors">Kontakt</a>
        </nav>

        <!-- Right side -->
        <div class="flex items-center gap-4">
          <ThemeToggle />

          <!-- Zalogowany klient -->
          <template v-if="auth.isLoggedIn">
            <div class="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-medium">
              <UserCircle2 class="w-4 h-4 text-green-300 shrink-0" />
              <span class="max-w-[180px] truncate">{{ auth.userEmail }}</span>
            </div>
            <button
              @click="handleLogout"
              class="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 border border-red-400/30 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            >
              <LogOut class="w-4 h-4" />
              Wyloguj się
            </button>
          </template>

          <!-- Niezalogowany -->
          <template v-else>
            <router-link 
              to="/login"
              class="bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm"
            >
              Zaloguj się
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- Content slot -->
    <main class="flex-1 flex flex-col">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-[#0b2412] dark:bg-[#06180a] text-gray-400 py-10 px-8 text-center text-sm shadow-inner transition-colors duration-200">
      <div class="max-w-7xl mx-auto">
        <img src="/logozoone.png" alt="ZooNe Logo" class="h-8 object-contain mx-auto mb-6 opacity-50 grayscale" />
        <p>&copy; 2026 ZooNe - Ogród Zoologiczny. Wszelkie prawa zastrzeżone.</p>
        <p class="mt-2 text-gray-500 font-light">Application Made By Kacper Miczejko and Przemysław Dudek</p>
      </div>
    </footer>
  </div>
</template>

