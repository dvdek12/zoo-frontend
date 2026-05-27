<template>
  <!-- ═══════════════════════════════════════════════
       DESKTOP SIDEBAR (md+)
       ═══════════════════════════════════════════════ -->
  <aside
    class="hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-transparent dark:border-gray-800 bg-[#f4f3ec] dark:bg-[#1a1c1e] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
    :class="collapsed ? 'w-[72px]' : 'w-64'"
  >
    <!-- TOP: Logo + Nav -->
    <div class="flex flex-col min-h-0">

      <!-- Logo area -->
      <div
        class="flex items-center transition-all duration-300 overflow-hidden shrink-0"
        :class="collapsed ? 'px-4 pt-5 pb-3 justify-center' : 'px-8 pt-8 pb-4'"
      >
        <template v-if="!collapsed">
          <div class="flex flex-col">
            <img src="/logozoone.png" alt="ZooNe Logo" class="w-1/2 object-contain mix-blend-multiply mb-1" />
            <p class="text-[10px] uppercase font-bold tracking-widest text-[#9e9a8f] mt-1 pl-1">Employee Dashboard</p>
          </div>
        </template>
        <template v-else>
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
          <div
            class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#1a3b22] dark:bg-green-400 rounded-full transition-opacity duration-200"
            :class="collapsed ? 'opacity-0' : 'opacity-100'"
          />
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
            <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
          </div>
        </router-link>
      </nav>
    </div>

    <!-- BOTTOM: Collapse toggle + User card -->
    <div class="p-3 flex flex-col gap-2 shrink-0">
      <button
        @click="collapsed = !collapsed"
        class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-gray-400 hover:text-[#1a3b22] dark:hover:text-green-400 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 cursor-pointer"
        :title="collapsed ? 'Rozwiń sidebar' : 'Zwiń sidebar'"
      >
        <svg
          class="w-4 h-4 shrink-0 transition-transform duration-300"
          :class="collapsed ? 'rotate-180' : ''"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
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

      <!-- User card — expanded -->
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
            <button @click="logout" title="Wyloguj" class="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shrink-0 cursor-pointer">
              <LogOut class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- User card — collapsed -->
      <div v-else class="flex justify-center">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] flex items-center justify-center text-white text-sm font-bold shadow-sm">
          {{ userInitial }}
        </div>
      </div>
    </div>
  </aside>

  <!-- ═══════════════════════════════════════════════
       MOBILE — hamburger button (fixed, top-left)
       ═══════════════════════════════════════════════ -->
  <button
    class="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-2xl bg-[#f4f3ec] dark:bg-[#1a1c1e] shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
    @click="mobileOpen = true"
    aria-label="Otwórz menu"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  </button>

  <!-- ═══════════════════════════════════════════════
       MOBILE DRAWER — backdrop + panel przez Teleport
       ═══════════════════════════════════════════════ -->
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade-backdrop">
      <div
        v-if="mobileOpen"
        class="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="mobileOpen = false"
      />
    </Transition>

    <!-- Drawer panel -->
    <Transition name="slide-drawer">
      <div
        v-if="mobileOpen"
        class="md:hidden fixed top-0 left-0 h-full w-72 z-50 flex flex-col bg-[#f4f3ec] dark:bg-[#1a1c1e] shadow-2xl"
      >
        <!-- Logo + zamknij -->
        <div class="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <div class="flex flex-col">
            <img src="/logozoone.png" alt="ZooNe Logo" class="w-28 object-contain mix-blend-multiply mb-1" />
            <p class="text-[10px] uppercase font-bold tracking-widest text-[#9e9a8f]">Employee Dashboard</p>
          </div>
          <button
            @click="mobileOpen = false"
            class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Nav links -->
        <nav class="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
          <router-link
            v-for="(link, index) in links"
            :key="link.path"
            :to="link.path"
            @click="mobileOpen = false"
            class="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-150 relative"
            :class="activeIndex === index
              ? 'bg-white dark:bg-gray-800 text-[#1a3b22] dark:text-green-400 font-semibold shadow-sm'
              : 'text-gray-500 hover:text-[#1a3b22] hover:bg-white/60 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-gray-800/60'"
          >
            <div v-if="activeIndex === index" class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#1a3b22] dark:bg-green-400 rounded-full" />
            <component :is="link.icon" class="w-5 h-5 shrink-0" />
            <span class="text-sm">{{ link.name }}</span>
          </router-link>
        </nav>

        <!-- User card -->
        <div class="p-4 shrink-0 border-t border-gray-200 dark:border-gray-700">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div class="flex items-center gap-3 p-3">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {{ userInitial }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">{{ user_mail }}</p>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Lead Zoologist</p>
              </div>
              <div class="flex items-center gap-1">
                <ThemeToggle />
                <button @click="logout" class="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
                  <LogOut class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed, watch } from 'vue';
import ThemeToggle from './ThemeToggle.vue';
import { useAuthStore } from '../stores/auth';
import {
  LayoutDashboard, Map as MapIcon, Activity,
  User, LogOut, PawPrint, Users, Fence, ClipboardList, Ticket,
} from 'lucide-vue-next';

const auth   = useAuthStore();
const route  = useRoute();
const router = useRouter();

// ── Desktop collapsed (persisted) ─────────────────────────────
const collapsed = ref(localStorage.getItem('sidebar_collapsed') === 'true');
watch(collapsed, (val) => localStorage.setItem('sidebar_collapsed', val));

// ── Mobile drawer ──────────────────────────────────────────────
const mobileOpen = ref(false);
watch(() => route.path, () => { mobileOpen.value = false; });
watch(mobileOpen, (open) => { document.body.style.overflow = open ? 'hidden' : ''; });

// ── User ──────────────────────────────────────────────────────
const user_mail   = ref('');
const userInitial = computed(() => user_mail.value?.[0]?.toUpperCase() ?? '?');
onMounted(() => {
  const stored = localStorage.getItem('user_email');
  if (stored) user_mail.value = stored;
});

// ── Nav links ─────────────────────────────────────────────────
const links = computed(() => {
  const base = [
    { name: 'Home',    path: '/dashboard', icon: LayoutDashboard },
    { name: 'Map',     path: '/map',       icon: MapIcon         },
    { name: 'Reports', path: '/reports',   icon: Activity        },
    { name: 'Profile', path: '/profile',   icon: User            },
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

<style scoped>
.fade-backdrop-enter-active,
.fade-backdrop-leave-active { transition: opacity 0.28s ease; }
.fade-backdrop-enter-from,
.fade-backdrop-leave-to     { opacity: 0; }

.slide-drawer-enter-active,
.slide-drawer-leave-active  { transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-drawer-enter-from,
.slide-drawer-leave-to      { transform: translateX(-100%); }
.slide-drawer-enter-to,
.slide-drawer-leave-from    { transform: translateX(0); }
</style>
