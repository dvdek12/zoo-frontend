<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden relative">

    <PageBanner
      title="Reports"
      eyebrow="Zoo Management"
      subtitle="Generate and export zoological reports for animals, employees, and enclosures."
      image="/banner_reports.png"
      image-position="center 40%"
    />

    <!-- Toolbar -->
    <header class="flex items-center px-8 py-4 shrink-0">
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
        <button v-if="searchQuery" @click="searchQuery = ''" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </header>

    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto px-10 py-4 pb-20 scroll-smooth">

      <!-- ── QUICK GENERATE ──────────────────────────────────────────────────── -->
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
            <div class="col-span-2">
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Title *</label>
              <input v-model="form.title" type="text" required placeholder="e.g. Q3 Veterinary Summary" class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition" />
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Report Type *</label>
              <div v-if="loadingTypes" class="flex items-center gap-2 text-gray-400 text-sm py-2">
                <Loader2 class="w-4 h-4 animate-spin" /> Loading types...
              </div>
              <select v-else v-model="form.type" required class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition appearance-none cursor-pointer">
                <option value="" disabled>Select a type...</option>
                <option v-for="t in reportTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Employee <span class="normal-case font-normal text-gray-400">(optional)</span></label>
              <select v-model="form.employeeId" class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition appearance-none cursor-pointer">
                <option :value="null">— none —</option>
                <option v-for="emp in employees" :key="emp.id ?? emp.Id" :value="emp.id ?? emp.Id">
                  {{ (emp.firstName ?? emp.FirstName ?? '') + ' ' + (emp.lastName ?? emp.LastName ?? '') }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Animal <span class="normal-case font-normal text-gray-400">(optional)</span></label>
              <select v-model="form.animalId" class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition appearance-none cursor-pointer">
                <option :value="null">— none —</option>
                <option v-for="animal in animals" :key="animal.id" :value="animal.id">{{ animal.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Enclosure <span class="normal-case font-normal text-gray-400">(optional)</span></label>
              <select v-model="form.enclosureId" class="w-full px-4 py-2.5 bg-[#f6f5f0] rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a3b22]/30 transition appearance-none cursor-pointer">
                <option :value="null">— none —</option>
                <option v-for="enc in enclosures" :key="enc.id" :value="enc.id">{{ enc.name }}</option>
              </select>
            </div>
          </div>

          <div v-if="createError" class="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            <AlertCircle class="w-4 h-4 shrink-0" />{{ createError }}
          </div>

          <div class="flex items-center gap-3 pt-1">
            <button type="button" @click="resetForm" class="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Reset</button>
            <button type="submit" :disabled="creating" class="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1a3b22] hover:bg-[#122a18] text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Loader2 v-if="creating" class="w-4 h-4 animate-spin" />
              <Zap v-else class="w-4 h-4" />
              {{ creating ? 'Creating...' : 'Generate Report' }}
            </button>
          </div>
        </form>
      </div>

      <!-- ── REPORTS TABLE ───────────────────────────────────────────────────── -->
      <div class="mt-2">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-[#1a3b22] text-xl">
            All Reports
            <span v-if="searchQuery" class="ml-2 text-sm font-normal text-gray-400">
              — {{ filteredReports.length }} result{{ filteredReports.length !== 1 ? 's' : '' }}
            </span>
          </h3>
          <div class="flex items-center gap-3">
            <button @click="toggleSort" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#1a3b22]/30 text-xs font-bold text-gray-600 hover:text-[#1a3b22] transition-colors">
              <ArrowUpDown class="w-3.5 h-3.5" />
              {{ sortOrder === 'desc' ? 'Newest first' : 'Oldest first' }}
            </button>
            <button @click="fetchReports" :class="['p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors', loadingReports ? 'animate-spin' : '']" title="Refresh">
              <RefreshCw class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="loadingReports" class="flex items-center justify-center py-16 text-gray-400 gap-3">
          <Loader2 class="w-5 h-5 animate-spin" /><span class="text-sm font-medium">Loading reports...</span>
        </div>

        <div v-else-if="filteredReports.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
          <FileText class="w-10 h-10" />
          <p class="text-sm font-medium">{{ searchQuery ? 'No reports match your search.' : 'No reports yet. Create one!' }}</p>
        </div>

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
              <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-8 py-5 font-bold text-[#1a3b22]">
                  <span v-html="highlightText(report.title)" />
                </td>
                <td class="px-6 py-5">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e1eae2] text-[#1a3b22] text-[9px] uppercase font-bold rounded-full tracking-wider">
                    {{ formatType(report.type) }}
                  </span>
                </td>
                <td class="px-6 py-5 text-gray-700 text-[13px] font-medium">{{ getAuthorName(report.authorId) }}</td>
                <td class="px-6 py-5 text-gray-500 text-[13px]">{{ formatDate(report.createdAt) }}</td>
                <td class="px-8 py-5 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="handleGeneratePDF(report)" :disabled="pdfLoadingId === report.id" class="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a3b22] hover:bg-[#122a18] text-white rounded-full text-[11px] font-bold transition-colors disabled:opacity-50" title="Download PDF">
                      <Loader2 v-if="pdfLoadingId === report.id" class="w-3.5 h-3.5 animate-spin" />
                      <Download v-else class="w-3.5 h-3.5" />
                      PDF
                    </button>
                    <button @click="handlePreviewPDF(report)" :disabled="previewLoadingId === report.id" class="p-2 hover:bg-[#e1eae2] text-gray-400 hover:text-[#1a3b22] rounded-full transition-colors disabled:opacity-50" title="Preview PDF">
                      <Loader2 v-if="previewLoadingId === report.id" class="w-4 h-4 animate-spin" />
                      <Eye v-else class="w-4 h-4" />
                    </button>
                    <button @click="confirmDelete(report)" class="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors" title="Delete report">
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

    <!-- PDF Preview -->
    <ReportPdfPreview
      :model-value="showPreview"
      :report="previewReport"
      :blob-url="previewBlobUrl"
      :download-loading="pdfLoadingId === previewReport?.id"
      @close="closePreview"
      @download="handleGeneratePDF"
    />

    <!-- Delete confirm -->
    <ConfirmDialog
      :model-value="showDeleteModal"
      @update:model-value="showDeleteModal = $event"
      title="Delete Report?"
      :message="`Are you sure you want to delete &quot;${reportToDelete?.title}&quot;? This action cannot be undone.`"
      confirm-label="Delete"
      cancel-label="Cancel"
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- Toast -->
    <Transition name="slide-up">
      <div
        v-if="toast.show"
        :class="['fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-full shadow-xl text-sm font-bold', toast.type === 'success' ? 'bg-[#1a3b22] text-white' : 'bg-red-500 text-white']"
      >
        <CheckCircle2 v-if="toast.type === 'success'" class="w-4 h-4" />
        <AlertCircle v-else class="w-4 h-4" />
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, onActivated, onBeforeUnmount } from 'vue';
import { Search, FileText, Zap, RefreshCw, Download, Trash2, X, Loader2, AlertCircle, CheckCircle2, Eye, ArrowUpDown } from 'lucide-vue-next';
import PageBanner       from '../components/PageBanner.vue';
import ReportPdfPreview from '../components/ReportPdfPreview.vue';
import ConfirmDialog    from '../components/ConfirmDialog.vue';
import { useReports }   from '../composables/useReports';

const {
  reports, reportTypes, employees, animals, enclosures, searchQuery, sortOrder, loadingReports, loadingTypes,
  creating, createError, form,
  pdfLoadingId, previewLoadingId, previewReport, previewBlobUrl, showPreview,
  reportToDelete, showDeleteModal, deleting,
  toast, filteredReports,
  initData, fetchReports, resetForm, toggleSort,
  handleCreate, handleGeneratePDF, handlePreviewPDF, closePreview,
  confirmDelete, handleDelete,
  formatType, formatDate, getAuthorName, highlightText,
} = useReports();

onMounted(initData);
onActivated(initData);
onBeforeUnmount(() => { if (previewBlobUrl.value) window.URL.revokeObjectURL(previewBlobUrl.value); });
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to       { opacity: 0; transform: translateX(-50%) translateY(1rem); }
</style>
