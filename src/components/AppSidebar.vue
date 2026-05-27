<template>
  <aside
    class="hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-transparent dark:border-gray-800 bg-[#f4f3ec] dark:bg-[#1a1c1e] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
    :class="collapsed ? 'w-[72px]' : 'w-64'"
  >
    <!-- ── TOP: Logo + Nav ── -->
    <div class="flex flex-col min-h-0">

      <!-- Logo area -->
      <div
        class="flex items-center transition-all duration-300 overflow-hidden shrink-0"
        :class="collapsed ? 'px-4 pt-5 pb-3 justify-center' : 'px-8 pt-8 pb-4'"
      >
        <template v-if="!collapsed">
          <div class="flex flex-col">
            <img src="/logozoone.png" alt="ZooNe Logo" class="w-1/2 object-contain mix-blend-multiply mb-1" />
            <p class="text-[10px] uppercase font-bold tracking-widest text-[#9e9a8f] mt-1 pl-1">
              Employee Dashboard
            </p>
          </div>
        </template>
        <template v-else>
          <!-- Mini logo / paw icon when collapsed -->
          <div class="w-9 h-9 rounded-xl bg-[#2d6a4f]/10 dark:bg-green-400/10 flex items-center justify-center">
            <svg class="w-5 h-5 stroke-[#2d6a4f] dark:stroke-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/>
              <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>
            </svg>
          </div>
        </template>
      </div>

      <!-- Nav links -->
      <nav class="mt-2 px-3 relative flex flex-col gap-1">
        <!-- Animated active highlight -->
        <div
          v-if="activeIndex !== -1"
          class="absolute left-3 right-3 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm transition-all duration-300 ease-out z-0 pointer-events-none"
          :style="{ transform: `translateY(${activeIndex * 52}px)` }"
        >
          <!-- Right accent bar — hidden when collapsed so icons stay centred -->
          <div
            class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#1a3b22] dark:bg-green-400 rounded-full transition-opacity duration-200"
            :class="collapsed ? 'opacity-0' : 'opacity-100'"
          ></div>
        </div>

        <router-link
          v-for="(link, index) in links"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors relative z-10 group"
          :class="[
            collapsed ? 'justify-center' : '',
            activeIndex === index
              ? 'text-[#1a3b22] dark:text-green-400 font-semibold'
              : 'text-gray-500 hover:text-[#1a3b22] hover:bg-white/50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-gray-800/50'
          ]"
        >
          <component :is="link.icon" class="w-5 h-5 shrink-0" />

          <!-- Label with transition -->
          <span
            class="whitespace-nowrap overflow-hidden transition-all duration-300"
            :class="collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
          >
            {{ link.name }}
          </span>

          <!-- Tooltip when collapsed -->
          <div
            v-if="collapsed"
            class="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50"
          >
            {{ link.name }}
            <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
          </div>
        </router-link>
      </nav>
    </div>

    <!-- ── BOTTOM: User Card + Collapse Toggle ── -->
    <div class="p-3 flex flex-col gap-2 shrink-0">

      <!-- Collapse toggle button -->
      <button
        @click="collapsed = !collapsed"
        class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-gray-400 hover:text-[#1a3b22] dark:hover:text-green-400 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 cursor-pointer"
        :title="collapsed ? 'Rozwiń sidebar' : 'Zwiń sidebar'"
      >
        <svg
          class="w-4.5 h-4.5 shrink-0 transition-transform duration-300"
          :class="collapsed ? 'rotate-180' : ''"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        <span
          class="text-xs font-semibold overflow-hidden transition-all duration-300"
          :class="collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
        >
          Zwiń panel
        </span>
      </button>

      <!-- User card -->

      <!-- EXPANDED: full card with email, theme toggle, logout -->
      <div v-if="!collapsed" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div class="flex items-center gap-3 p-3">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {{ userInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">{{ user_mail }}</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight">Lead Zoologist</p>
          </div>
          <div class="flex items-center gap-1">
            <ThemeToggle />
            <button
              @click="logout"
              title="Wyloguj"
              class="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#ba2a2a] hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- COLLAPSED: only avatar initial -->
      <div v-else class="flex justify-center">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] flex items-center justify-center text-white text-sm font-bold shadow-sm">
          {{ userInitial }}
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';

import ThemeToggle from './ThemeToggle.vue';
import { useAuthStore } from '../stores/auth';

import {
  LayoutDashboard,
  Map as MapIcon,
  Activity,
  User,
  LogOut,
  PawPrint,
  Users,
  Fence,
  ClipboardList,
  Ticket,
} from 'lucide-vue-next';

const auth   = useAuthStore();
const route  = useRoute();
const router = useRouter();

// ── Collapsed state (persisted) ──────────────────────────────
const collapsed = ref(localStorage.getItem('sidebar_collapsed') === 'true');

// Persist collapse state on toggle
const _toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
  localStorage.setItem('sidebar_collapsed', collapsed.value);
};

// We use direct toggle in the template; override to persist:
// (v-model approach: watch and save)
import { watch } from 'vue';
watch(collapsed, (val) => localStorage.setItem('sidebar_collapsed', val));

// ── User ──────────────────────────────────────────────────────
const user_mail = ref('');
const userInitial = computed(() => user_mail.value?.[0]?.toUpperCase() ?? '?');

onMounted(() => {
  const stored = localStorage.getItem('user_email');
  if (stored) user_mail.value = stored;
});

// ── Nav links ─────────────────────────────────────────────────
const links = computed(() => {
  const base = [
    { name: 'Home',     path: '/dashboard', icon: LayoutDashboard },
    { name: 'Map',      path: '/map',        icon: MapIcon         },
    { name: 'Reports',  path: '/reports',    icon: Activity        },
    { name: 'Profile',  path: '/profile',    icon: User            },
  ];
  if (auth.hasAnyRole('Manager')) {
    base.push({ name: 'Animals',    path: '/animals',    icon: PawPrint      });
    base.push({ name: 'Employees',  path: '/employees',  icon: Users         });
    base.push({ name: 'Enclosures', path: '/enclosures', icon: Fence         });
    base.push({ name: 'Tasks',      path: '/tasks',      icon: ClipboardList });
    base.push({ name: 'Tickets',    path: '/tickets',    icon: Ticket        });
  }
  return base;
});

const activeIndex = computed(() =>
  links.value.findIndex(l => route.path === l.path || route.path.startsWith(l.path + '/'))
);

// ── Logout ────────────────────────────────────────────────────
function logout() {
  auth.logout();
  router.push('/login');
}
</script>
