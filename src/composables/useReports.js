import { ref, computed } from 'vue';
import reportService from '../services/report.service';
import employeeService from '../services/employee.service';
import { useAuthStore } from '../stores/auth';
import { toArray, getErrorMessage } from '../utils/normalize';
import { formatDateShort, camelToWords, highlight } from '../utils/formatters';

export function useReports() {
  const auth = useAuthStore();

  const reports           = ref([]);
  const reportTypes       = ref([]);
  const employees         = ref([]);
  const searchQuery       = ref('');
  const sortOrder         = ref('desc');
  const currentAuthorId   = ref(null);

  const loadingReports    = ref(false);
  const loadingTypes      = ref(false);

  const pdfLoadingId      = ref(null);
  const previewLoadingId  = ref(null);
  const previewReport     = ref(null);
  const previewBlobUrl    = ref(null);
  const showPreview       = ref(false);

  const reportToDelete    = ref(null);
  const showDeleteModal   = ref(false);
  const deleting          = ref(false);

  const creating          = ref(false);
  const createError       = ref('');
  const form              = ref({ title: '', type: '', employeeId: null, animalId: null, enclosureId: null });

  const toast = ref({ show: false, message: '', type: 'success' });

  const filteredReports = computed(() => {
    let list = [...reports.value];
    const q  = searchQuery.value.trim().toLowerCase();
    if (q) list = list.filter(r => r.title?.toLowerCase().includes(q));
    list.sort((a, b) => {
      const diff = new Date(b.createdAt) - new Date(a.createdAt);
      return sortOrder.value === 'desc' ? diff : -diff;
    });
    return list;
  });

  function formatType(type) {
    if (type == null) return '-';
    const num   = typeof type === 'string' ? parseInt(type, 10) : type;
    const found = reportTypes.value.find(t => t.value === num);
    if (found) return found.label;
    return typeof type === 'string' ? camelToWords(type) : `Type ${type}`;
  }

  function getAuthorName(authorId) {
    if (!authorId) return '—';
    const emp = employees.value.find(e => (e.id ?? e.Id) === authorId);
    if (!emp) return `ID ${authorId}`;
    return `${emp.firstName ?? emp.FirstName ?? ''} ${emp.lastName ?? emp.LastName ?? ''}`.trim() || `ID ${authorId}`;
  }

  function highlightText(text) {
    return highlight(text ?? '', searchQuery.value.trim());
  }

  function showToast(message, type = 'success') {
    toast.value = { show: true, message, type };
    setTimeout(() => { toast.value.show = false; }, 3500);
  }

  function toggleSort() {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
  }

  function resetForm() {
    form.value     = { title: '', type: '', employeeId: null, animalId: null, enclosureId: null };
    createError.value = '';
  }

  async function fetchReports() {
    loadingReports.value = true;
    try {
      const raw       = await reportService.getAll();
      reports.value   = toArray(raw).map(r => ({
        id:        r.id        ?? r.Id,
        title:     r.title     ?? r.Title,
        type:      r.type      ?? r.Type,
        authorId:  r.authorId  ?? r.AuthorId,
        createdAt: r.createdAt ?? r.CreatedAt,
      }));
    } catch {
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
          if (typeof item === 'string') return { value: idx, label: camelToWords(item) };
          if (typeof item === 'number') return { value: item, label: `Type ${item}` };
          if (item && typeof item === 'object') {
            const val  = item.id ?? item.value ?? idx;
            const name = item.name ?? item.label ?? `Type ${val}`;
            return { value: val, label: camelToWords(String(name)) };
          }
          return { value: idx, label: String(item) };
        });
      } else if (raw && typeof raw === 'object') {
        reportTypes.value = Object.entries(raw).map(([k, v]) => ({
          value: parseInt(k, 10),
          label: camelToWords(String(v)),
        }));
      }
    } catch (e) {
      console.error('[useReports] fetchTypes:', e);
    } finally {
      loadingTypes.value = false;
    }
  }

  async function fetchEmployees() {
    try {
      employees.value = await employeeService.getAll();
    } catch {}
  }

  async function fetchCurrentAuthorId() {
    try {
      const list  = employees.value.length ? employees.value : await employeeService.getAll();
      const email = auth.userEmail?.toLowerCase() ?? '';
      const me    = list.find(e => (e.email ?? e.Email ?? '').toLowerCase() === email);
      if (me) currentAuthorId.value = me.id ?? me.Id;
    } catch {}
  }

  async function initData() {
    await Promise.all([fetchReports(), fetchTypes(), fetchEmployees()]);
    await fetchCurrentAuthorId();
  }

  async function handleCreate() {
    createError.value = '';
    creating.value    = true;
    if (!currentAuthorId.value) {
      createError.value = 'Cannot determine employee ID. Please refresh.';
      creating.value    = false;
      return;
    }
    try {
      console.log(auth.hasRole('Employee'))
      if(auth.hasRole('Manager')) {
        await reportService.createForManager({
          Title:       form.value.title,
          Type:        parseInt(form.value.type, 10),
          AuthorId:    currentAuthorId.value,
          EmployeeId:  form.value.employeeId  ? parseInt(form.value.employeeId,  10) : null,
          AnimalId:    form.value.animalId    ? parseInt(form.value.animalId,    10) : null,
          EnclosureId: form.value.enclosureId ? parseInt(form.value.enclosureId, 10) : null,
        });
      }else{
        await reportService.createForEmployee({
          Title:       form.value.title,
          Type:        parseInt(form.value.type, 10),
          AuthorId:    currentAuthorId.value,
          EmployeeId:  form.value.employeeId  ? parseInt(form.value.employeeId,  10) : null,
          AnimalId:    form.value.animalId    ? parseInt(form.value.animalId,    10) : null,
          EnclosureId: form.value.enclosureId ? parseInt(form.value.enclosureId, 10) : null,
        });
      }
      
      resetForm();
      showToast('Report created successfully!');
      await fetchReports();
    } catch (err) {
      createError.value = getErrorMessage(err, 'Failed to create report.');
    } finally {
      creating.value = false;
    }
  }

  async function handleGeneratePDF(report) {
    if (!report) return;
    pdfLoadingId.value = report.id;
    try {
      await reportService.generatePDF(report.id, `${report.title ?? 'report'}.pdf`);
      showToast('PDF downloaded!');
    } catch {
      showToast('Failed to generate PDF.', 'error');
    } finally {
      pdfLoadingId.value = null;
    }
  }

  async function handlePreviewPDF(report) {
    previewLoadingId.value = report.id;
    previewReport.value    = report;
    previewBlobUrl.value   = null;
    showPreview.value      = true;
    try {
      const blob           = await reportService.getPDFBlob(report.id);
      previewBlobUrl.value = window.URL.createObjectURL(blob);
    } catch {
      showToast('Failed to load PDF preview.', 'error');
      showPreview.value = false;
    } finally {
      previewLoadingId.value = null;
    }
  }

  function closePreview() {
    showPreview.value = false;
    if (previewBlobUrl.value) {
      window.URL.revokeObjectURL(previewBlobUrl.value);
      previewBlobUrl.value = null;
    }
    previewReport.value = null;
  }

  function confirmDelete(report) {
    reportToDelete.value  = report;
    showDeleteModal.value = true;
  }

  async function handleDelete() {
    if (!reportToDelete.value) return;
    deleting.value = true;
    try {
      await reportService.remove(reportToDelete.value.id);
      showDeleteModal.value = false;
      showToast('Report deleted.');
      await fetchReports();
    } catch {
      showToast('Failed to delete report.', 'error');
    } finally {
      deleting.value        = false;
      reportToDelete.value  = null;
    }
  }

  return {
    reports, reportTypes, searchQuery, sortOrder, loadingReports, loadingTypes,
    creating, createError, form,
    pdfLoadingId, previewLoadingId, previewReport, previewBlobUrl, showPreview,
    reportToDelete, showDeleteModal, deleting,
    toast,
    filteredReports,
    initData, fetchReports, resetForm, toggleSort,
    handleCreate, handleGeneratePDF, handlePreviewPDF, closePreview,
    confirmDelete, handleDelete,
    formatType, formatDate: formatDateShort, getAuthorName, highlightText, showToast,
  };
}
