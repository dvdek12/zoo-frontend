<template>
  <div class="h-full flex flex-col">
    <PageBanner
      title="Dashboard"
      eyebrow="Zoo Management"
      :subtitle="`Witaj z powrotem, ${auth.userEmail}!`"
      image="/banner_dashboard.png"
      image-position="center 55%"
    />

    <div class="px-8 pt-6 pb-8 flex flex-col flex-1 overflow-hidden">

      <!-- ── TOOLBAR: searchbar + filtry ── -->
      <div class="flex items-center gap-3 mb-5 flex-wrap shrink-0">

        <!-- Search -->
        <div class="relative flex-1 min-w-[220px] max-w-md">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input
            v-model="searchQuery"
            id="dashboard-search"
            type="text"
            placeholder="Szukaj zadania..."
            class="w-full pl-10 pr-9 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 transition-colors shadow-sm"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Filter pills -->
        <div class="flex items-center gap-2 flex-wrap">
          <button
            v-for="f in filters"
            :key="f.key"
            @click="activeFilter = f.key"
            :class="[
              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border',
              activeFilter === f.key
                ? 'bg-[#2d6a4f] text-white border-[#2d6a4f] shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-[#2d6a4f] dark:hover:border-green-400 hover:text-[#2d6a4f] dark:hover:text-green-400'
            ]"
          >
            {{ f.label }}
            <span
              :class="[
                'inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-extrabold',
                activeFilter === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
              ]"
            >{{ f.count }}</span>
          </button>
        </div>

        <!-- Result count (when searching) -->
        <p v-if="searchQuery" class="text-xs text-gray-400 ml-auto shrink-0">
          {{ filteredTasks.length }} wynik{{ filteredTasks.length === 1 ? '' : filteredTasks.length < 5 ? 'i' : 'ów' }}
        </p>
      </div>

      <!-- ── CONTENT ── -->

      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center flex-1 gap-4">
        <div class="w-10 h-10 rounded-full border-[3px] border-[#2d6a4f]/20 border-t-[#2d6a4f] animate-spin"></div>
        <p class="text-sm text-gray-400 font-medium">Pobieranie zadań…</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex flex-col items-center justify-center flex-1 gap-3">
        <div class="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <svg class="w-7 h-7 stroke-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Błąd ładowania zadań</p>
        <p class="text-xs text-gray-400 text-center max-w-xs">{{ error }}</p>
        <button @click="fetchTasks" class="px-4 py-2 text-xs font-bold bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1a3b22] transition-colors">
          Spróbuj ponownie
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredTasks.length === 0" class="flex flex-col items-center justify-center flex-1 gap-3">
        <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg class="w-7 h-7 stroke-gray-300 dark:stroke-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {{ searchQuery ? 'Brak wyników dla: "' + searchQuery + '"' : tasks.length === 0 ? 'Brak przypisanych zadań' : 'Brak zadań w tej kategorii' }}
        </p>
        <p class="text-xs text-gray-300 dark:text-gray-600 text-center">
          {{ searchQuery ? 'Sprawdź pisownię lub wyczyść wyszukiwanie.' : tasks.length === 0 ? 'Manager nie przypisał Ci jeszcze żadnych zadań.' : 'Zmień filtr lub wyszukiwanie.' }}
        </p>
      </div>

      <!-- ── GRID ── -->
      <div v-else class="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            @click="goToTask(task.id)"
            :class="[
              'group relative flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
              task.isCompleted
                ? 'opacity-55 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                : isOverdue(task.deadline)
                  ? 'bg-red-50/70 dark:bg-red-900/10 border-red-200 dark:border-red-800 border-l-[3px] border-l-red-400'
                  : isToday(task.deadline)
                    ? 'bg-[#f0f9f4] dark:bg-[#132a1e] border-[#2d6a4f]/40 dark:border-green-700 border-l-[3px] border-l-[#2d6a4f] dark:border-l-green-500 shadow-sm'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#2d6a4f]/30 dark:hover:border-green-700'
            ]"
          >
            <!-- Top row: dot + title + badges -->
            <div class="flex items-start gap-2.5">
              <span
                class="mt-1 inline-block w-2 h-2 rounded-full shrink-0"
                :class="{
                  'bg-green-500': task.isCompleted,
                  'bg-red-500 animate-pulse': isOverdue(task.deadline) && !task.isCompleted,
                  'bg-amber-400': !task.isCompleted && !isOverdue(task.deadline),
                }"
              ></span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap mb-0.5">
                  <h4
                    :class="[
                      'font-bold text-sm leading-snug',
                      task.isCompleted ? 'text-gray-400 dark:text-gray-500 line-through' :
                      isToday(task.deadline) ? 'text-[#1a3b22] dark:text-green-300' :
                      'text-gray-800 dark:text-gray-100'
                    ]"
                    v-html="highlight(task.name, searchQuery)"
                  ></h4>
                  <span v-if="isToday(task.deadline) && !task.isCompleted"
                    class="bg-[#2d6a4f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                    Dzisiaj
                  </span>
                  <span v-if="isOverdue(task.deadline) && !task.isCompleted"
                    class="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                    Przeterminowane
                  </span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p
              v-if="task.description"
              class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed pl-[18px]"
              v-html="highlight(task.description, searchQuery)"
            ></p>

            <!-- Footer: deadline + status badge -->
            <div class="flex items-center justify-between mt-auto pl-[18px] flex-wrap gap-2">
              <span class="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {{ formatDate(task.deadline) }}
              </span>
              <span
                :class="[
                  'px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase',
                  task.isCompleted
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    : isOverdue(task.deadline)
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                ]"
              >
                {{ task.isCompleted ? 'Zakończone' : isOverdue(task.deadline) ? 'Przeterminowane' : 'W toku' }}
              </span>
            </div>

            <!-- Arrow hint on hover -->
            <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 dark:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, onActivated } from 'vue';
import PageBanner from '../components/PageBanner.vue';
import taskService from '../services/task.service';
import employeeService from '../services/employee.service';
import { useHighlight } from '../composables/useHighlight';

const auth   = useAuthStore();
const router = useRouter();
const { highlight } = useHighlight();

// ── State ─────────────────────────────────────────────────────────────
const tasks        = ref([]);
const isLoading    = ref(false);
const error        = ref(null);
const activeFilter = ref('all');
const searchQuery  = ref('');

// ── Date helpers ──────────────────────────────────────────────────────
const todayStr = new Date().toISOString().slice(0, 10);
const isToday   = (d) => !!d && d.slice(0, 10) === todayStr;
const isOverdue = (d) => !!d && new Date(d) < new Date() && !isToday(d);

// ── Filters + search ──────────────────────────────────────────────────
const searchedTasks = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return tasks.value;
  return tasks.value.filter(t =>
    t.name.toLowerCase().includes(q) ||
    (t.description && t.description.toLowerCase().includes(q))
  );
});

const filters = computed(() => [
  { key: 'all',       label: 'Wszystkie',      count: searchedTasks.value.length },
  { key: 'active',    label: 'Aktywne',         count: searchedTasks.value.filter(t => !t.isCompleted && !isOverdue(t.deadline)).length },
  { key: 'overdue',   label: 'Przeterminowane', count: searchedTasks.value.filter(t => !t.isCompleted && isOverdue(t.deadline)).length },
  { key: 'completed', label: 'Zakończone',      count: searchedTasks.value.filter(t => t.isCompleted).length },
]);

const filteredTasks = computed(() => {
  let list = searchedTasks.value;
  switch (activeFilter.value) {
    case 'active':    list = list.filter(t => !t.isCompleted && !isOverdue(t.deadline)); break;
    case 'overdue':   list = list.filter(t => !t.isCompleted && isOverdue(t.deadline)); break;
    case 'completed': list = list.filter(t => t.isCompleted); break;
  }
  return list;
});

// ── Helpers ───────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
}

// ── Navigation ────────────────────────────────────────────────────────
const goToTask = (id) => router.push(`/dashboard/${id}`);

// ── Fetch ─────────────────────────────────────────────────────────────
async function fetchTasks() {
  isLoading.value = true;
  error.value     = null;
  try {
    const email    = auth.userEmail;
    const employee = await employeeService.findByEmail(email);

    if (!employee) {
      error.value = `Nie znaleziono pracownika dla konta: ${email}`;
      return;
    }

    const employeeId = employee.id ?? employee.employeeId;
    const data = await taskService.getForEmployee(employeeId);

    tasks.value = (Array.isArray(data) ? data : []).map(t => ({
      id:          t.id          ?? t.Id,
      name:        t.name        ?? t.Name        ?? '(bez tytułu)',
      description: t.description ?? t.Description ?? '',
      deadline:    t.deadline    ?? t.Deadline     ?? null,
      isCompleted: t.isCompleted ?? t.IsCompleted  ?? false,
    }));

    // Sortuj: dzisiejsze i aktywne pierwsze wg deadline, zakończone na końcu
    tasks.value.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  } catch (err) {
    console.error('[DashboardView] fetchTasks:', err);
    error.value = err?.response?.data?.message ?? 'Nie udało się pobrać zadań.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchTasks);
onActivated(fetchTasks);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 20px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #9ca3af; }
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }

/* Highlight styl z useHighlight */
:deep(.hl) {
  background-color: #bbf7d0;
  color: #14532d;
  border-radius: 2px;
  padding: 0 2px;
  font-weight: 700;
}
.dark :deep(.hl) {
  background-color: #166534;
  color: #bbf7d0;
}
</style>
