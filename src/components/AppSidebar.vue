<template>
  <aside class="w-64 bg-[#f4f3ec] dark:bg-[#1a1c1e] flex flex-col justify-between hidden md:flex shrink-0 h-screen sticky top-0 transition-colors duration-200 border-r border-transparent dark:border-gray-800">
    <div>
      <div class="px-8 pt-8 pb-4">
        <img src="/logozoone.png" alt="ZooNe Logo" class="w-1/2 object-contain mix-blend-multiply mb-1" />
        <p class="text-[10px] uppercase font-bold tracking-widest text-[#9e9a8f] mt-1 pl-1">
          Employee Dashboard
        </p>
      </div>
      <nav class="mt-4 px-4 relative flex flex-col gap-2">
        <!-- Animated Active Background -->
        <div 
          v-if="activeIndex !== -1"
          class="absolute left-4 right-4 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm transition-all duration-300 ease-out z-0 pointer-events-none"
          :style="{ transform: `translateY(${activeIndex * 56}px)` }"
        >
          <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#1a3b22] dark:bg-green-400 rounded-full transition-opacity duration-300"></div>
        </div>

        <router-link 
          v-for="(link, index) in links" 
          :key="link.path"
          :to="link.path" 
          class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors relative z-10"
          :class="activeIndex === index ? 'text-[#1a3b22] dark:text-green-400 font-semibold' : 'text-gray-500 hover:text-[#1a3b22] hover:bg-white/50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-gray-800/50'"
        >
          <component :is="link.icon" class="w-5 h-5 shrink-0" />
          {{ link.name }}
        </router-link>
      </nav>
    </div>

    <!-- Bottom User Card -->
    <div class="p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm flex items-center gap-3 transition-colors duration-200">
        <div class="flex-1 min-w-0">
          <p class="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">{{user_mail}}</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight truncate">Lead Zoologist</p>
        </div>
        <ThemeToggle />
        <button
          @click="logout"
          title="Logout"
          class="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#ba2a2a] hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shrink-0"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import AuthService from '../services/auth.service';
import ThemeToggle from './ThemeToggle.vue';
import { useAuthStore } from '../stores/auth';
const auth = useAuthStore();
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Activity, 
  User,
  LogOut,
  PawPrint
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const user_mail = ref("");

const links = computed(() => {
  const allLinks = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Map', path: '/map', icon: MapIcon },
    { name: 'Reports', path: '/reports', icon: Activity },
    { name: 'Profile', path: '/profile', icon: User },
  ];
  if (auth.hasRole('Manager')) {
    allLinks.push({ name: 'Animals', path: '/animals', icon: PawPrint });
  }
  return allLinks;
});

const activeIndex = computed(() => {
  return links.value.findIndex(l => route.path === l.path || route.path.startsWith(l.path + '/'));
});

onMounted(() => {
  const storedEmail = localStorage.getItem("user_email");

  if(storedEmail){
    user_mail.value = storedEmail;
  }
})

function logout() {
  AuthService.logout();
  router.push('/login');
}
</script>
