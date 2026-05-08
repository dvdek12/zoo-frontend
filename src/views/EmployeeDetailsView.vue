<template>
  <div class="min-h-full p-6 md:p-10">

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-400">
      <svg class="animate-spin h-10 w-10 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <span class="text-sm">Ładowanie danych pracownika…</span>
    </div>

    <!-- Error (fetch) -->
    <div v-else-if="fetchError" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
      </div>
      <p class="text-red-500 font-semibold">{{ fetchError }}</p>
      <button @click="router.back()" class="text-sm text-[#2d6a4f] hover:underline">← Wróć</button>
    </div>

    <!-- Content -->
    <div v-else-if="employee" class="max-w-5xl mx-auto space-y-8 animate-fade-in">

      <!-- Back button -->
      <button
        @click="router.back()"
        class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#2d6a4f] dark:hover:text-green-400 transition-colors group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Wróć do listy pracowników
      </button>

      <!-- Hero card -->
      <div class="relative bg-gradient-to-br from-[#0f2a4a] to-[#1a4f8a] rounded-3xl overflow-hidden shadow-2xl">
        <!-- SVG pattern overlay -->
        <div class="absolute inset-0 opacity-10"
          style="background-image: url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.4%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
        </div>
        <div class="relative flex flex-col md:flex-row items-start md:items-center gap-6 p-8">
          <!-- Avatar -->
          <div class="shrink-0">
            <div class="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl font-extrabold shadow-xl border-2 border-white/30">
              {{ initials }}
            </div>
          </div>
          <!-- Info -->
          <div class="flex-1 text-white">
            <div class="flex items-center gap-3 mb-1">
              <span class="bg-white/20 backdrop-blur-sm text-white text-xs font-mono px-2 py-0.5 rounded-lg">#{{ employee.id }}</span>
              <span class="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-0.5 rounded-full font-semibold">
                {{ employee.roleName ?? 'Pracownik' }}
              </span>
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow mb-1">
              {{ employee.firstName }} {{ employee.lastName }}
            </h1>
            <p class="text-blue-200 text-base mt-1">{{ employee.email }}</p>
          </div>
          <!-- Date badge -->
          <div v-if="employee.birthDay" class="shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center text-white">
            <p class="text-xs text-blue-200 mb-1 uppercase tracking-wider font-semibold">Data urodzenia</p>
            <p class="text-2xl font-bold">{{ formatDate(employee.birthDay) }}</p>
          </div>
        </div>
      </div>

      <!-- Edit form card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-[#e8f4ef] dark:bg-[#132a1e] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#2d6a4f] dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-semibold text-gray-800 dark:text-white">Edytuj dane pracownika</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Wszystkie pola są opcjonalne — wypełnij tylko te, które chcesz zmienić</p>
          </div>
        </div>

        <form @submit.prevent="submitUpdate" class="px-6 py-6 flex flex-col gap-5">

          <!-- Imię + Nazwisko -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="edit-firstname" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Imię</label>
              <input
                id="edit-firstname"
                v-model="form.firstName"
                type="text"
                maxlength="50"
                placeholder="Jan"
                class="input-field"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="edit-lastname" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Nazwisko</label>
              <input
                id="edit-lastname"
                v-model="form.lastName"
                type="text"
                maxlength="50"
                placeholder="Kowalski"
                class="input-field"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label for="edit-email" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Email</label>
            <input
              id="edit-email"
              v-model="form.email"
              type="email"
              placeholder="jan.kowalski@zoo.pl"
              class="input-field"
            />
          </div>

          <!-- Data urodzenia + Telefon -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="edit-birthday" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Data urodzenia</label>
              <input
                id="edit-birthday"
                v-model="form.birthDay"
                type="date"
                class="input-field"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="edit-phone" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Telefon</label>
              <input
                id="edit-phone"
                v-model="form.phoneNumber"
                type="tel"
                placeholder="+48 600 123 456"
                class="input-field"
              />
            </div>
          </div>

          <!-- ID Roli + ID Supervisora -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="edit-role" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">ID Roli</label>
              <input
                id="edit-role"
                v-model.number="form.roleId"
                type="number"
                min="1"
                placeholder="np. 2"
                class="input-field"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="edit-supervisor" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">ID Supervisora</label>
              <input
                id="edit-supervisor"
                v-model.number="form.supervisorId"
                type="number"
                min="1"
                placeholder="np. 1"
                class="input-field"
              />
            </div>
          </div>

          <!-- Server error -->
          <div v-if="saveError" class="flex items-start gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span>{{ saveError }}</span>
          </div>

          <!-- Success -->
          <div v-if="saveSuccess" class="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Dane pracownika zostały zaktualizowane pomyślnie!
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-2">
            <button
              id="cancel-edit-employee"
              type="button"
              @click="router.back()"
              class="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Anuluj
            </button>
            <button
              id="submit-edit-employee"
              type="submit"
              :disabled="isSaving"
              class="px-5 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1a3b22] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none"
            >
              <svg v-if="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>{{ isSaving ? 'Zapisywanie…' : 'Zapisz zmiany' }}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import employeeService from '../services/employee.service';

const route  = useRoute();
const router = useRouter();

const employee  = ref(null);
const isLoading = ref(false);
const fetchError = ref(null);
const isSaving  = ref(false);
const saveError  = ref(null);
const saveSuccess = ref(false);

const form = reactive({
  firstName:   '',
  lastName:    '',
  email:       '',
  birthDay:    '',
  phoneNumber: '',
  roleId:      null,
  supervisorId: null,
});

const initials = computed(() => {
  const f = employee.value?.firstName?.[0] ?? '';
  const l = employee.value?.lastName?.[0] ?? '';
  return (f + l).toUpperCase() || '?';
});

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' });
};

const toDateInputValue = (iso) => {
  if (!iso) return '';
  return iso.substring(0, 10); // "YYYY-MM-DD"
};

const populateForm = (data) => {
  form.firstName   = data.firstName   ?? data.FirstName   ?? '';
  form.lastName    = data.lastName    ?? data.LastName    ?? '';
  form.email       = data.email       ?? data.Email       ?? '';
  form.phoneNumber = data.phoneNumber ?? data.PhoneNumber ?? '';
  form.birthDay    = toDateInputValue(data.birthDay ?? data.BirthDay ?? '');
  form.roleId      = data.roleId      ?? data.RoleId      ?? null;
  form.supervisorId = data.supervisorId ?? data.SupervisorId ?? null;
};

onMounted(async () => {
  isLoading.value = true;
  fetchError.value = null;
  try {
    const data = await employeeService.getById(route.params.id);
    employee.value = data;
    populateForm(data);
  } catch (err) {
    console.error('[EmployeeDetailsView] fetch error:', err);
    fetchError.value = err?.response?.data?.message ?? 'Nie udało się pobrać danych pracownika.';
  } finally {
    isLoading.value = false;
  }
});

const submitUpdate = async () => {
  saveError.value = null;
  saveSuccess.value = false;

  const dto = {
    id: Number(route.params.id),
  };

  if (form.firstName.trim())   dto.FirstName   = form.firstName.trim();
  if (form.lastName.trim())    dto.LastName    = form.lastName.trim();
  if (form.email.trim())       dto.Email       = form.email.trim();
  if (form.phoneNumber.trim()) dto.PhoneNumber = form.phoneNumber.trim();
  if (form.birthDay)           dto.BirthDay    = new Date(form.birthDay).toISOString();
  if (form.roleId)             dto.RoleId      = form.roleId;
  if (form.supervisorId)       dto.SupervisorId = form.supervisorId;

  isSaving.value = true;
  try {
    await employeeService.updateAsManager(route.params.id, dto);
    saveSuccess.value = true;
    // Odśwież dane z serwera, żeby hero card się zaktualizował
    const fresh = await employeeService.getById(route.params.id);
    employee.value = fresh;
    populateForm(fresh);
  } catch (err) {
    console.error('[EmployeeDetailsView] update error:', err);
    saveError.value =
      err?.response?.data?.message ??
      (typeof err?.response?.data === 'string' ? err.response.data : null) ??
      'Nie udało się zapisać zmian. Spróbuj ponownie.';
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.input-field {
  display: block;
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #ffffff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  outline: none;
}
.input-field::placeholder { color: #9ca3af; }
.input-field:focus {
  box-shadow: 0 0 0 2px #2d6a4f;
  border-color: #2d6a4f;
}
:global(.dark) .input-field {
  border-color: #374151;
  background-color: #1f2937;
  color: #ffffff;
}
</style>
