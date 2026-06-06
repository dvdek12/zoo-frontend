<template>
  <div class="flex-1 min-h-0 flex gap-5">

    <!-- ── Kanban board ── full height, horizontal scroll, grid background -->
    <div
      class="flex-1 min-w-0 min-h-0 rounded-2xl border border-[#e8ede9] dark:border-gray-700 overflow-x-auto overflow-y-hidden"
      style="
        background-color: #fff;
        background-image: linear-gradient(rgba(45,106,79,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(45,106,79,0.045) 1px, transparent 1px);
        background-size: 32px 32px;
        box-shadow: 0 2px 12px rgba(45,106,79,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
      "
    >
      <!-- Inner row — w-max + min-w-full enables proper horizontal scroll -->
      <div class="flex gap-4 h-full p-5 w-max min-w-full items-start">

        <!-- Loading -->
        <div v-if="isLoadingEmployees" class="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 text-sm">
          <svg class="w-8 h-8 text-[#2d6a4f] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Fetching employees...
        </div>

        <!-- Employee columns -->
        <div
          v-for="emp in employees"
          :key="emp.id"
          class="flex flex-col shrink-0 w-60 rounded-2xl bg-white/95 dark:bg-[#1e2228]/95 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm overflow-y-auto max-h-full transition-all duration-200"
          :class="{ 'border-[#2d6a4f] dark:border-green-400 shadow-[0_0_0_2px_rgba(45,106,79,0.15)] -translate-y-0.5': dragOverEmployee === emp.id }"
          @dragover.prevent
          @drop="onDrop($event, emp.id)"
          @dragenter="dragOverEmployee = emp.id"
          @dragleave="onDragLeave($event, emp.id)"
        >
          <!-- Column header -->
          <div class="flex items-center gap-2 p-3.5 pb-3 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white/95 dark:bg-[#1e2228]/95 backdrop-blur-sm z-10">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-sm"
              :style="{ background: getEmployeeColor(emp.id) }"
            >
              {{ getInitials(emp.firstName, emp.lastName) }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate leading-tight">
                {{ emp.firstName }} {{ emp.lastName }}
              </h3>
              <p class="text-[11px] text-gray-400 leading-tight">{{ emp.roleName ?? 'Employee' }}</p>
            </div>
            <span class="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[11px] font-bold flex items-center justify-center shrink-0">
              {{ getEmpTasks(emp.id).length }}
            </span>
          </div>

          <!-- Tasks in column -->
          <div class="flex flex-col gap-2 p-2.5">
            <div
              v-for="task in getEmpTasks(emp.id)"
              :key="task.id"
              draggable="true"
              @dragstart="onDragStart($event, task)"
              class="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-sm hover:-translate-y-0.5 select-none"
              :class="{
                'opacity-55': task.isCompleted,
                '!border-l-2 !border-l-red-400': isOverdue(task) && !task.isCompleted
              }"
            >
              <div class="flex items-center gap-1.5 mb-1">
                <div
                  class="w-1.5 h-1.5 rounded-full shrink-0"
                  :class="{
                    'bg-green-500': task.isCompleted,
                    'bg-red-500 animate-pulse': isOverdue(task) && !task.isCompleted,
                    'bg-amber-400': !task.isCompleted && !isOverdue(task)
                  }"
                ></div>
                <span class="text-xs font-semibold text-gray-800 dark:text-gray-100 flex-1 min-w-0 truncate">
                  {{ task.name }}
                </span>
                <button
                  @click="$emit('unassign', task)"
                  :id="`unassign-task-${task.id}`"
                  class="w-4 h-4 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer transition-colors shrink-0"
                  title="Unassign task"
                >
                  <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <p class="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mb-1.5">{{ task.description }}</p>
              <div
                class="flex items-center gap-1 text-[10px]"
                :class="isOverdue(task) && !task.isCompleted ? 'text-red-400' : 'text-gray-400'"
              >
                <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                </svg>
                {{ formatDate(task.deadline) }}
              </div>
            </div>

            <!-- Drop hint when empty -->
            <div
              v-if="getEmpTasks(emp.id).length === 0"
              class="flex flex-col items-center gap-1.5 py-8 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl text-gray-300 dark:text-gray-600 text-xs text-center"
            >
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
              Drag task here
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Task Pool (right sidebar) ── -->
    <div class="w-68 shrink-0 flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">

      <!-- Pool header -->
      <div class="p-4 pb-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-xl bg-[#2d6a4f]/10 dark:bg-green-400/10 border border-[#2d6a4f]/20 dark:border-green-400/20 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 stroke-[#2d6a4f] dark:stroke-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-[#1a3b22] dark:text-green-400">Task pool</h3>
            <p class="text-xs text-gray-400">{{ unassignedCount }} unassigned</p>
          </div>
        </div>
        <!-- Pool search -->
        <div class="relative">
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input
            v-model="poolSearchInternal"
            id="pool-search"
            type="text"
            placeholder="Search tasks..."
            class="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 transition-colors"
          />
        </div>
      </div>

      <!-- Pool list -->
      <div class="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2 custom-scrollbar">

        <!-- Loading -->
        <div v-if="isLoadingTasks" class="flex justify-center py-8">
          <svg class="w-5 h-5 text-[#2d6a4f] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>

        <template v-else>
          <div
            v-for="task in filteredPoolTasks"
            :key="task.id"
            draggable="true"
            @dragstart="onDragStart($event, task)"
            @dragend="onDragEnd"
            class="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 cursor-grab active:cursor-grabbing hover:border-[#2d6a4f] dark:hover:border-green-400 hover:shadow-sm hover:-translate-y-0.5 transition-all select-none"
            :class="{
              '!border-l-2 !border-l-red-400': isOverdue(task),
              'opacity-50 scale-95': draggingTaskId === task.id
            }"
          >
            <div class="flex items-center gap-1.5 mb-1">
              <div
                class="w-1.5 h-1.5 rounded-full shrink-0"
                :class="isOverdue(task) ? 'bg-red-500 animate-pulse' : 'bg-amber-400'"
              ></div>
              <span class="text-xs font-semibold text-gray-800 dark:text-gray-100 flex-1 min-w-0 truncate">{{ task.name }}</span>
            </div>
            <p class="text-[11px] text-gray-400 line-clamp-1 mb-1.5">{{ task.description }}</p>
            <div class="flex items-center justify-between">
              <div
                class="flex items-center gap-1 text-[10px]"
                :class="isOverdue(task) ? 'text-red-400' : 'text-gray-400'"
              >
                <svg class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                </svg>
                {{ formatDate(task.deadline) }}
              </div>
              <div class="flex items-center gap-0.5 text-[10px] text-gray-300 dark:text-gray-600">
                <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/>
                  <circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>
                </svg>
                Drag
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div
            v-if="filteredPoolTasks.length === 0"
            class="flex flex-col items-center justify-center gap-2 py-12 text-gray-300 dark:text-gray-600 text-xs text-center"
          >
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            {{ poolSearchInternal ? 'No results' : 'All tasks are assigned' }}
          </div>
        </template>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  /** List of all tasks (with assignedEmployeeId) */
  tasks: {
    type: Array,
    default: () => [],
  },
  employees: {
    type: Array,
    default: () => [],
  },
  isLoadingTasks: {
    type: Boolean,
    default: false,
  },
  isLoadingEmployees: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  /** { taskId, empId } — assign task to employee */
  'assign',
  /** task — unassign from employee */
  'unassign',
]);

// ─── Internal search ─────────────────────────────────────────
const poolSearchInternal = ref('');

// ─── Drag state ───────────────────────────────────────────────
const draggingTaskId   = ref(null);
const dragOverEmployee = ref(null);

// ─── Computed ─────────────────────────────────────────────────
const unassignedTasks = computed(() =>
  props.tasks.filter(t => !t.assignedEmployeeId && !t.isCompleted)
);

const unassignedCount = computed(() => unassignedTasks.value.length);

const filteredPoolTasks = computed(() => {
  const q = poolSearchInternal.value.toLowerCase().trim();
  if (!q) return unassignedTasks.value;
  return unassignedTasks.value.filter(t =>
    t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
  );
});

// ─── Helpers ──────────────────────────────────────────────────
function isOverdue(task) {
  if (!task.deadline) return false;
  return new Date(task.deadline) < new Date();
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function getInitials(first, last) {
  return `${(first ?? '?')[0]}${(last ?? '?')[0]}`.toUpperCase();
}

const AVATAR_COLORS = ['#2d6a4f','#1a3b22','#b5451b','#6b3fa0','#1565c0','#d4a017','#37474f','#c62828'];
function getEmployeeColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }

function getEmpTasks(empId) {
  return props.tasks.filter(t => t.assignedEmployeeId === empId);
}

// ─── Drag & Drop ──────────────────────────────────────────────
function onDragStart(event, task) {
  draggingTaskId.value = task.id;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('taskId', String(task.id));
}

function onDragEnd() {
  draggingTaskId.value   = null;
  dragOverEmployee.value = null;
}

function onDragLeave(event, empId) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    if (dragOverEmployee.value === empId) dragOverEmployee.value = null;
  }
}

function onDrop(event, empId) {
  dragOverEmployee.value = null;
  const taskId = parseInt(event.dataTransfer.getData('taskId'));
  if (!taskId) return;
  const task = props.tasks.find(t => t.id === taskId);
  if (!task || task.assignedEmployeeId === empId) return;
  emit('assign', { taskId, empId });
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; }

/* Dark mode grid pattern override */
.dark div[style*="background-image"] {
  background-image:
    linear-gradient(rgba(74,222,128,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(74,222,128,0.035) 1px, transparent 1px) !important;
  background-color: #111315 !important;
  border-color: #1f2937 !important;
}
</style>
