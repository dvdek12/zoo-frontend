<template>
  <aside class="w-64 bg-[#f4f3ec] flex flex-col justify-between hidden md:flex shrink-0 h-screen sticky top-0">
    <div>
      <div class="px-8 pt-8 pb-4">
        <img src="/logozoone.png" alt="ZooNe Logo" class="w-1/2 object-contain mix-blend-multiply mb-1" />
        <p class="text-[10px] uppercase font-bold tracking-widest text-[#9e9a8f] mt-1 pl-1">Employee Dashboard</p>
      </div>
      <nav class="mt-4 px-4 space-y-2">
        <router-link to="/" class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors" :class="route.path === '/' ? 'bg-white text-[#1a3b22] font-semibold shadow-sm' : 'text-gray-500 hover:text-[#1a3b22] hover:bg-white/50'">
          <LayoutDashboard class="w-5 h-5 shrink-0" />
          Home
          <div v-if="route.path === '/'" class="ml-auto w-1 h-6 bg-[#1a3b22] rounded-full"></div>
        </router-link>
        <router-link to="/map" class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors" :class="route.path === '/map' ? 'bg-white text-[#1a3b22] font-semibold shadow-sm' : 'text-gray-500 hover:text-[#1a3b22] hover:bg-white/50'">
          <MapIcon class="w-5 h-5 shrink-0" />
          Map
          <div v-if="route.path === '/map'" class="ml-auto w-1 h-6 bg-[#1a3b22] rounded-full"></div>
        </router-link>
        <router-link to="/reports" class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors" :class="route.path === '/reports' ? 'bg-white text-[#1a3b22] font-semibold shadow-sm' : 'text-gray-500 hover:text-[#1a3b22] hover:bg-white/50'">
          <Activity class="w-5 h-5 shrink-0" />
          Reports
          <div v-if="route.path === '/reports'" class="ml-auto w-1 h-6 bg-[#1a3b22] rounded-full"></div>
        </router-link>
        <router-link to="/profile" class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors" :class="route.path === '/profile' ? 'bg-white text-[#1a3b22] font-semibold shadow-sm' : 'text-gray-500 hover:text-[#1a3b22] hover:bg-white/50'">
          <User class="w-5 h-5 shrink-0" />
          Profile
          <div v-if="route.path === '/profile'" class="ml-auto w-1 h-6 bg-[#1a3b22] rounded-full"></div>
        </router-link>
      </nav>
    </div>

    <!-- Bottom User Card -->
    <div class="p-4">
      <div class="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-[12px] font-bold text-gray-900 leading-tight truncate">{{user_mail}}</p>
          <p class="text-[10px] text-gray-500 font-medium leading-tight truncate">Lead Zoologist</p>
        </div>
        <button
          @click="logout"
          title="Logout"
          class="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#ba2a2a] hover:bg-red-50 transition-colors shrink-0"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import {ref, onMounted} from 'vue';
import AuthService from '../services/auth.service';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Activity, 
  User,
  LogOut
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const user_mail = ref("");

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
