<template>
  <div class="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-0">
    <!-- Tabela — widoczna tylko gdy są dane -->
    <div v-if="employees.length > 0" class="flex-1 overflow-auto custom-scrollbar">
      <table class="w-full text-left border-collapse">
        <thead class="sticky top-0 bg-gray-50 dark:bg-gray-900/95 backdrop-blur-sm z-10 shadow-sm border-b border-gray-100 dark:border-gray-700">
          <tr>
            <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300 w-20">ID</th>
            <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Imię i Nazwisko</th>
            <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Email</th>
            <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Telefon</th>
            <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Data urodzenia</th>
            <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Rola</th>
          </tr>
        </thead>
        <!-- TransitionGroup animuje wiersze przy filtracji -->
        <TransitionGroup
          name="row"
          tag="tbody"
          class="divide-y divide-gray-100 dark:divide-gray-700"
        >
          <tr
            v-for="employee in employees"
            :key="employee.id"
            @click="router.push({ name: 'employeeDetail', params: { id: employee.id } })"
            class="hover:bg-[#f0f9f4] dark:hover:bg-[#132a1e] transition-colors duration-200 group hover:shadow-[inset_4px_0_0_0_#2d6a4f] dark:hover:shadow-[inset_4px_0_0_0_#4ade80] cursor-pointer"
          >
            <td class="py-3 px-6">
              <span class="inline-block px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-mono font-semibold">#{{ employee.id }}</span>
            </td>
            <td class="py-3 px-6">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#40916c] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                  {{ initials(employee) }}
                </div>
                <span
                  class="font-bold text-gray-900 dark:text-white"
                  v-html="highlight(employee.firstName + ' ' + employee.lastName, query)"
                />
              </div>
            </td>
            <td class="py-3 px-6">
              <span
                class="text-gray-600 dark:text-gray-300 text-sm"
                v-html="highlight(employee.email, query)"
              />
            </td>
            <td class="py-3 px-6">
              <span
                class="text-gray-500 dark:text-gray-400 text-sm"
                v-html="highlight(employee.phoneNumber ?? '—', query)"
              />
            </td>
            <td class="py-3 px-6">
              <span class="text-gray-500 dark:text-gray-400 text-sm">{{ formatDate(employee.birthDay) }}</span>
            </td>
            <td class="py-3 px-6">
              <span
                class="bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-full border border-[#2d6a4f]/20 shadow-sm"
                v-html="highlight(employee.roleName ?? 'Pracownik', query)"
              />
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>

    <!-- Empty state -->
    <Transition name="fade">
      <div v-if="employees.length === 0" class="flex-1 flex flex-col items-center justify-center select-none overflow-hidden py-12">
        <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p class="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-1">Brak pracowników</p>
        <p class="text-sm text-gray-300 dark:text-gray-600 text-center max-w-xs">
          Nie znaleziono żadnych pracowników.<br>Zarejestruj pierwszego, klikając przycisk powyżej.
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useHighlight } from '../../composables/useHighlight';
import '../../assets/table-animations.css';

const router = useRouter();
const { highlight } = useHighlight();

defineProps({
  employees: {
    type: Array,
    required: true,
  },
  query: {
    type: String,
    default: '',
  },
});

const initials = (emp) => {
  const f = emp.firstName?.[0] ?? '';
  const l = emp.lastName?.[0] ?? '';
  return (f + l).toUpperCase() || '?';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
};
</script>

<style scoped>
/* ── Fade dla empty state ── */
.fade-enter-active { transition: opacity 0.3s ease 0.1s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.1s; }
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from   { opacity: 0; transform: translateY(8px); }
.fade-leave-to     { opacity: 0; }

/* ── Scrollbar ── */
.custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; }
.dark .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #4b5563; }
</style>
