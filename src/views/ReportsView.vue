<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden relative">
    <!-- TOP HEADER -->
    <header class="flex items-center px-8 py-5 shrink-0">
      <!-- Search -->
      <div class="relative w-[32rem]">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search class="w-4 h-4" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search reports by title..."
          class="w-full pl-11 pr-10 py-2 bg-[#e4e3d9]/50 hover:bg-[#e4e3d9] focus:bg-[#e4e3d9] rounded-full text-sm font-medium text-gray-700 placeholder-gray-500 focus:outline-none transition-colors border-none"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </header>

    <!-- SCROLLABLE CONTENT -->
    <div class="flex-1 overflow-y-auto px-10 py-6 pb-20 relative scroll-smooth h-full">
      <!-- Page header -->
      <PageHeader title="Raporty" subtitle="Generuj i eksportuj raporty zoologiczne dla twoich zwierząt, pracowników i wybiegów." />

      <!-- ── QUICK GENERATE FORM ─────────────────────────────────────────── -->
      <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 mb-10 max-w-2xl mx-auto">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-9 h-9 rounded-xl bg-[#e1eae2] flex items-center justify-center">
            <Zap class="w-4 h-4 text-[#1a3b22]" />
          </div>
          <div>
            <h3 class="font-extrabold text-[#1a3b22] text-base leading-none">Quick Generate</h3>
            <p class="text-gray-400 text-xs mt-0.5">Create a new report instantly</p>
          </div>
        </div>

        <form @submit.prevent="handleCreate" class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <!-- Title -->
            <div class="col-span-2">
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Title *</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="e.g. Q3 Veterinary Summary"
                class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition"
              />
            </div>

            <!-- Report Type -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Report Type *</label>
              <div v-if="loadingTypes" class="flex items-center gap-2 text-gray-400 text-sm py-2">
                <Loader2 class="w-4 h-4 animate-spin" /> Loading types...
              </div>
              <select
                v-else
                v-model="form.type"
                required
                class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a type...</option>
                <option v-for="t in reportTypes" :key="t.value" :value="t.value">
                  {{ t.label }}
                </option>
              </select>
            </div>

            <!-- Employee ID -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Employee ID <span class="normal-case font-normal text-gray-400">(optional)</span></label>
              <input
                v-model.number="form.employeeId"
                type="number"
                min="1"
                placeholder="optional"
                class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition"
              />
            </div>

            <!-- Animal ID + Enclosure ID -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Animal ID <span class="normal-case font-normal text-gray-400">(optional)</span></label>
              <input
                v-model.number="form.animalId"
                type="number"
                min="1"
                placeholder="optional"
                class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Enclosure ID <span class="normal-case font-normal text-gray-400">(optional)</span></label>
              <input
                v-model.number="form.enclosureId"
                type="number"
                min="1"
                placeholder="optional"
                class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition"
              />
            </div>
          </div>

          <!-- Error -->
          <div v-if="createError" class="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            <AlertCircle class="w-4 h-4 shrink-0" />
            {{ createError }}
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 pt-1">
            <button
              type="button"
              @click="resetForm"
              class="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1a3b22] hover:bg-[#122a18] text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="creating" class="w-4 h-4 animate-spin" />
              <Zap v-else class="w-4 h-4" />
              {{ creating ? 'Creating...' : 'Generate Report' }}
            </button>
          </div>
        </form>
      </div>

      <!-- ── REPORTS TABLE ───────────────────────────────────────────────── -->
      <div class="mt-2">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-[#1a3b22] text-xl">
            All Reports
            <span v-if="searchQuery" class="ml-2 text-sm font-normal text-gray-400">
              — {{ filteredReports.length }} result{{ filteredReports.length !== 1 ? 's' : '' }}
            </span>
          </h3>
          <div class="flex items-center gap-3">
            <!-- Sort toggle -->
            <button
              @click="toggleSort"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#1a3b22]/30 text-xs font-bold text-gray-600 hover:text-[#1a3b22] transition-colors"
              :title="sortOrder === 'desc' ? 'Showing newest first' : 'Showing oldest first'"
            >
              <ArrowUpDown class="w-3.5 h-3.5" />
              {{ sortOrder === 'desc' ? 'Newest first' : 'Oldest first' }}
            </button>

            <!-- Refresh -->
            <button
              @click="fetchReports"
              :class="['p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors', loadingReports ? 'animate-spin' : '']"
              title="Refresh"
            >
              <RefreshCw class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loadingReports" class="flex items-center justify-center py-16 text-gray-400 gap-3">
          <Loader2 class="w-5 h-5 animate-spin" />
          <span class="text-sm font-medium">Loading reports...</span>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredReports.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
          <FileText class="w-10 h-10" />
          <p class="text-sm font-medium">{{ searchQuery ? 'No reports match your search.' : 'No reports yet. Create one!' }}</p>
        </div>

        <!-- Table -->
        <div v-else class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden text-sm">
          <table class="w-full text-left">
            <thead class="bg-[#f0efea]">
              <tr>
                <th class="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Title</th>
                <th class="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Type</th>
                <th class="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Author</th>
                <th class="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Created</th>
                <th class="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/60">
              <tr
                v-for="report in filteredReports"
                :key="report.id"
                class="hover:bg-gray-50/50 transition-colors"
              >
                <!-- Title with highlight -->
                <td class="px-8 py-5 font-bold text-[#1a3b22]">
                  <span v-html="highlightText(report.title)"></span>
                </td>

                <!-- Type badge -->
                <td class="px-6 py-5">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e1eae2] text-[#1a3b22] text-[9px] uppercase font-bold rounded-full tracking-wider">
                    {{ formatType(report.type) }}
                  </span>
                </td>

                <!-- Author name -->
                <td class="px-6 py-5 text-gray-700 text-[13px] font-medium">
                  {{ getAuthorName(report.authorId) }}
                </td>

                <!-- Date -->
                <td class="px-6 py-5 text-gray-500 text-[13px]">{{ formatDate(report.createdAt) }}</td>

                <!-- Actions -->
                <td class="px-8 py-5 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <!-- PDF download -->
                    <button
                      @click="handleGeneratePDF(report)"
                      :disabled="pdfLoadingId === report.id"
                      class="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a3b22] hover:bg-[#122a18] text-white rounded-full text-[11px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download PDF"
                    >
                      <Loader2 v-if="pdfLoadingId === report.id" class="w-3.5 h-3.5 animate-spin" />
                      <Download v-else class="w-3.5 h-3.5" />
                      PDF
                    </button>

                    <!-- Preview PDF -->
                    <button
                      @click="handlePreviewPDF(report)"
                      :disabled="previewLoadingId === report.id"
                      class="p-2 hover:bg-[#e1eae2] text-gray-400 hover:text-[#1a3b22] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Preview PDF"
                    >
                      <Loader2 v-if="previewLoadingId === report.id" class="w-4 h-4 animate-spin" />
                      <Eye v-else class="w-4 h-4" />
                    </button>

                    <!-- Delete -->
                    <button
                      @click="confirmDelete(report)"
                      class="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                      title="Delete report"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- CREATE REPORT MODAL                                          -->
    <!-- ============================================================ -->
    <Transition name="fade">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeCreateModal"
      >
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 relative">
          <button
            @click="closeCreateModal"
            class="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>

          <h3 class="text-2xl font-extrabold text-[#1a3b22] mb-1">New Report</h3>
          <p class="text-gray-500 text-sm mb-7">Fill in the details to generate a zoological report.</p>

          <form @submit.prevent="handleCreate" class="flex flex-col gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Title *</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="e.g. Q3 Veterinary Summary"
                class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Report Type *</label>
              <div v-if="loadingTypes" class="flex items-center gap-2 text-gray-400 text-sm py-2">
                <Loader2 class="w-4 h-4 animate-spin" /> Loading types...
              </div>
              <select
                v-else
                v-model="form.type"
                required
                class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a type...</option>
                <option v-for="t in reportTypes" :key="t.value" :value="t.value">
                  {{ t.label }}
                </option>
              </select>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Employee ID</label>
                <input v-model.number="form.employeeId" type="number" min="1" placeholder="optional" class="w-full px-3 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Animal ID</label>
                <input v-model.number="form.animalId" type="number" min="1" placeholder="optional" class="w-full px-3 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Enclosure ID</label>
                <input v-model.number="form.enclosureId" type="number" min="1" placeholder="optional" class="w-full px-3 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition" />
              </div>
            </div>
            <div v-if="createError" class="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              <AlertCircle class="w-4 h-4 shrink-0" />
              {{ createError }}
            </div>
            <div class="flex items-center gap-3 mt-2">
              <button type="button" @click="closeCreateModal" class="flex-1 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[#1a3b22] hover:bg-[#122a18] text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="creating" class="w-4 h-4 animate-spin" />
                <Zap v-else class="w-4 h-4" />
                {{ creating ? 'Creating...' : 'Create Report' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- ============================================================ -->
    <!-- PDF PREVIEW MODAL                                            -->
    <!-- ============================================================ -->
    <Transition name="fade">
      <div
        v-if="showPreviewModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closePreviewModal"
      >
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden" style="height: 88vh;">
          <!-- Modal header -->
          <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#e1eae2] flex items-center justify-center">
                <FileText class="w-4 h-4 text-[#1a3b22]" />
              </div>
              <div>
                <p class="font-extrabold text-[#1a3b22] text-sm leading-none">{{ previewReport?.title }}</p>
                <p class="text-gray-400 text-xs mt-0.5">PDF Preview</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="handleGeneratePDF(previewReport)"
                :disabled="pdfLoadingId === previewReport?.id"
                class="flex items-center gap-1.5 px-4 py-2 bg-[#1a3b22] hover:bg-[#122a18] text-white rounded-full text-xs font-bold transition-colors"
              >
                <Loader2 v-if="pdfLoadingId === previewReport?.id" class="w-3.5 h-3.5 animate-spin" />
                <Download v-else class="w-3.5 h-3.5" />
                Download
              </button>
              <button
                @click="closePreviewModal"
                class="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>
          <!-- iframe PDF viewer -->
          <div class="flex-1 overflow-hidden bg-gray-100">
            <iframe
              v-if="previewBlobUrl"
              :src="previewBlobUrl"
              class="w-full h-full border-none"
              title="PDF Preview"
            ></iframe>
            <div v-else class="flex items-center justify-center h-full text-gray-400 gap-3">
              <Loader2 class="w-5 h-5 animate-spin" />
              <span class="text-sm font-medium">Loading preview...</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ============================================================ -->
    <!-- DELETE CONFIRM MODAL                                         -->
    <!-- ============================================================ -->
    <Transition name="fade">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center">
          <div class="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Trash2 class="w-7 h-7 text-red-500" />
          </div>
          <h3 class="text-xl font-extrabold text-gray-800 mb-2">Delete Report?</h3>
          <p class="text-gray-500 text-sm mb-7">
            Are you sure you want to delete <strong class="text-gray-700">"{{ reportToDelete?.title }}"</strong>? This action cannot be undone.
          </p>
          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="deleting" class="w-4 h-4 animate-spin" />
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast notification -->
    <Transition name="slide-up">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-full shadow-xl text-sm font-bold',
          toast.type === 'success' ? 'bg-[#1a3b22] text-white' : 'bg-red-500 text-white'
        ]"
      >
        <CheckCircle2 v-if="toast.type === 'success'" class="w-4 h-4" />
        <AlertCircle v-else class="w-4 h-4" />
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  Search,
  FileText, Zap, RefreshCw, Download,
  Trash2, X, Loader2, AlertCircle, CheckCircle2,
  Eye, ArrowUpDown
} from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import reportService from '../services/report.service';
import employeeService from '../services/employee.service';
import PageHeader from '../components/PageHeader.vue';

// ── Auth ──────────────────────────────────────────────────────────────────────
const auth = useAuthStore();

// ── State ─────────────────────────────────────────────────────────────────────
const reports = ref([]);
const reportTypes = ref([]);
const employees = ref([]);
const searchQuery = ref('');
const loadingReports = ref(false);
const loadingTypes = ref(false);
const pdfLoadingId = ref(null);
const currentAuthorId = ref(null);
const sortOrder = ref('desc'); // 'desc' = newest first, 'asc' = oldest first

// Create modal
const showCreateModal = ref(false);
const creating = ref(false);
const createError = ref('');
const form = ref({
  title: '',
  type: '',
  employeeId: null,
  animalId: null,
  enclosureId: null,
});

// Delete modal
const showDeleteModal = ref(false);
const deleting = ref(false);
const reportToDelete = ref(null);

// PDF Preview modal
const showPreviewModal = ref(false);
const previewReport = ref(null);
const previewBlobUrl = ref(null);
const previewLoadingId = ref(null);

// Toast
const toast = ref({ show: false, message: '', type: 'success' });

// ── Computed ──────────────────────────────────────────────────────────────────
const filteredReports = computed(() => {
  let list = [...reports.value];

  // Filter by search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(r => r.title?.toLowerCase().includes(q));
  }

  // Sort
  list.sort((a, b) => {
    const da = new Date(a.createdAt).getTime();
    const db = new Date(b.createdAt).getTime();
    return sortOrder.value === 'desc' ? db - da : da - db;
  });

  return list;
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function getAuthorName(authorId) {
  if (!authorId) return '—';
  const emp = employees.value.find(
    e => (e.id ?? e.Id) === authorId
  );
  if (!emp) return `ID ${authorId}`;
  const first = emp.firstName ?? emp.FirstName ?? '';
  const last  = emp.lastName  ?? emp.LastName  ?? '';
  return `${first} ${last}`.trim() || `ID ${authorId}`;
}

function highlightText(text) {
  if (!searchQuery.value.trim() || !text) return escapeHtml(text ?? '');
  const q = searchQuery.value.trim();
  const escaped = escapeHtml(text);
  const escapedQ = escapeHtml(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQ})`, 'gi');
  return escaped.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 rounded px-0.5">$1</mark>');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toggleSort() {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
}

function formatType(type) {
  if (type === null || type === undefined) return '-';
  if (typeof type === 'number') {
    const found = reportTypes.value.find(t => t.value === type);
    return found ? found.label : `Type ${type}`;
  }
  if (typeof type === 'string') {
    const asNum = parseInt(type, 10);
    if (!isNaN(asNum)) {
      const found = reportTypes.value.find(t => t.value === asNum);
      return found ? found.label : `Type ${asNum}`;
    }
    return type.replace(/([A-Z])/g, ' $1').trim();
  }
  return String(type);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3500);
}

function resetForm() {
  form.value = { title: '', type: '', employeeId: null, animalId: null, enclosureId: null };
  createError.value = '';
}

// ── API calls ─────────────────────────────────────────────────────────────────
async function fetchReports() {
  loadingReports.value = true;
  try {
    const raw = await reportService.getAll();
    reports.value = raw.map(r => ({
      id:        r.id        ?? r.Id        ?? r.reportId ?? r.ReportId,
      title:     r.title     ?? r.Title,
      type:      r.type      ?? r.Type,
      authorId:  r.authorId  ?? r.AuthorId,
      createdAt: r.createdAt ?? r.CreatedAt,
    }));
  } catch (e) {
    console.error(e);
    showToast('Failed to load reports.', 'error');
  } finally {
    loadingReports.value = false;
  }
}

async function fetchTypes() {
  loadingTypes.value = true;
  try {
    const raw = await reportService.getTypes();
    if (Array.isArray(raw)) {
      reportTypes.value = raw.map((item, idx) => {
        if (typeof item === 'string') return { value: idx, label: item.replace(/([A-Z])/g, ' $1').trim() };
        if (typeof item === 'number') return { value: item, label: `Type ${item}` };
        if (typeof item === 'object' && item !== null) {
          const val = item.id ?? item.Id ?? item.value ?? item.Value ?? idx;
          const name = item.name ?? item.Name ?? item.label ?? item.Label ?? `Type ${val}`;
          return { value: val, label: String(name).replace(/([A-Z])/g, ' $1').trim() };
        }
        return { value: idx, label: String(item) };
      });
    } else if (typeof raw === 'object' && raw !== null) {
      reportTypes.value = Object.entries(raw).map(([k, v]) => ({
        value: parseInt(k, 10),
        label: String(v).replace(/([A-Z])/g, ' $1').trim(),
      }));
    }
  } catch (e) {
    console.error('[ReportsView] fetchTypes error:', e);
  } finally {
    loadingTypes.value = false;
  }
}

async function fetchEmployees() {
  try {
    const raw = await employeeService.getAll();
    employees.value = raw;
  } catch (e) {
    console.error('[ReportsView] fetchEmployees error:', e);
  }
}

// ── Create ────────────────────────────────────────────────────────────────────
function openCreateModal() {
  resetForm();
  showCreateModal.value = true;
}

function closeCreateModal() {
  showCreateModal.value = false;
}

async function handleCreate() {
  createError.value = '';
  creating.value = true;

  if (!currentAuthorId.value) {
    createError.value = 'Nie można ustalić ID pracownika. Odśwież stronę lub zaloguj się ponownie.';
    creating.value = false;
    return;
  }

  const dto = {
    Title: form.value.title,
    Type: parseInt(form.value.type, 10),
    AuthorId: currentAuthorId.value,
    EmployeeId: form.value.employeeId ? parseInt(form.value.employeeId, 10) : null,
    AnimalId: form.value.animalId ? parseInt(form.value.animalId, 10) : null,
    EnclosureId: form.value.enclosureId ? parseInt(form.value.enclosureId, 10) : null,
  };

  try {
    await reportService.create(dto);
    closeCreateModal();
    resetForm();
    showToast('Report created successfully!', 'success');
    await fetchReports();
  } catch (err) {
    const errData = err?.response?.data;
    const errMsg = errData?.errors
      ? Object.values(errData.errors).flat().join(' ')
      : errData?.message ?? errData?.title ?? 'Failed to create report.';
    createError.value = errMsg;
  } finally {
    creating.value = false;
  }
}

// ── Generate PDF (download) ───────────────────────────────────────────────────
async function handleGeneratePDF(report) {
  if (!report) return;
  pdfLoadingId.value = report.id;
  try {
    const fileName = `${report.title ?? 'report'}.pdf`;
    await reportService.generatePDF(report.id, fileName);
    showToast('PDF downloaded!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Failed to generate PDF.', 'error');
  } finally {
    pdfLoadingId.value = null;
  }
}

// ── Preview PDF (modal) ───────────────────────────────────────────────────────
async function handlePreviewPDF(report) {
  previewLoadingId.value = report.id;
  previewReport.value = report;
  previewBlobUrl.value = null;
  showPreviewModal.value = true;

  try {
    const blob = await reportService.getPDFBlob(report.id);
    previewBlobUrl.value = window.URL.createObjectURL(blob);
  } catch (err) {
    console.error(err);
    showToast('Failed to load PDF preview.', 'error');
    showPreviewModal.value = false;
  } finally {
    previewLoadingId.value = null;
  }
}

function closePreviewModal() {
  showPreviewModal.value = false;
  if (previewBlobUrl.value) {
    window.URL.revokeObjectURL(previewBlobUrl.value);
    previewBlobUrl.value = null;
  }
  previewReport.value = null;
}

// ── Delete ────────────────────────────────────────────────────────────────────
function confirmDelete(report) {
  reportToDelete.value = report;
  showDeleteModal.value = true;
}

async function handleDelete() {
  if (!reportToDelete.value) return;
  deleting.value = true;
  try {
    await reportService.remove(reportToDelete.value.id);
    showDeleteModal.value = false;
    showToast('Report deleted.', 'success');
    await fetchReports();
  } catch (err) {
    console.error(err);
    showToast('Failed to delete report.', 'error');
  } finally {
    deleting.value = false;
    reportToDelete.value = null;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function fetchCurrentAuthorId() {
  try {
    const emps = employees.value.length ? employees.value : await employeeService.getAll();
    const email = auth.userEmail;
    const me = emps.find(
      e => (e.email ?? e.Email ?? '').toLowerCase() === (email ?? '').toLowerCase()
    );
    if (me) {
      currentAuthorId.value = me.id ?? me.Id;
    } else {
      console.warn('[ReportsView] Employee not found for email:', email);
    }
  } catch (e) {
    console.error('[ReportsView] fetchCurrentAuthorId error:', e);
  }
}

onMounted(async () => {
  await Promise.all([fetchReports(), fetchTypes(), fetchEmployees()]);
  await fetchCurrentAuthorId();
});

onBeforeUnmount(() => {
  if (previewBlobUrl.value) {
    window.URL.revokeObjectURL(previewBlobUrl.value);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}
</style>
