<template>
  <div class="p-8 h-full flex flex-col gap-6 overflow-hidden">

    <!-- Wyszukiwarka -->
    <div class="shrink-0 relative w-full mb-2">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>
      <input
        v-model="searchQuery"
        id="employees-search"
        type="text"
        placeholder="Wyszukaj pracownika (imię, nazwisko, email)..."
        class="block w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] shadow-sm transition-colors text-base"
      >
    </div>

    <!-- Sekcja pracowników -->
    <section class="flex-1 flex flex-col min-h-0">
      <div class="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h2 class="text-3xl font-bold text-[#1a3b22] dark:text-green-400 tracking-tight">Pracownicy</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Zarządzaj listą pracowników zoo.</p>
        </div>
        <button
          id="open-register-employee-modal"
          @click="showModal = true"
          class="bg-[#2d6a4f] hover:bg-[#1a3b22] text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Dodaj pracownika
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-gray-400">
          <svg class="animate-spin h-8 w-8 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="text-sm">Pobieranie pracowników…</span>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="loadError" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-center">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <p class="text-sm text-red-500">{{ loadError }}</p>
          <button @click="fetchEmployees" class="text-sm text-[#2d6a4f] hover:underline">Spróbuj ponownie</button>
        </div>
      </div>

      <!-- Table -->
      <EmployeeTable v-else :employees="filteredEmployees" />
    </section>

    <!-- Modal rejestracji -->
    <RegisterEmployeeModal
      v-if="showModal"
      @save="onSaved"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import EmployeeTable from '../components/employees/EmployeeTable.vue';
import RegisterEmployeeModal from '../components/employees/RegisterEmployeeModal.vue';
import employeeService from '../services/employee.service';

const showModal = ref(false);
const searchQuery = ref('');

// --- DANE ---
const employees = ref([]);
const isLoading = ref(false);
const loadError = ref(null);

/**
 * Mapuje odpowiedź backendu na format wyświetlany w tabeli.
 * Dostosuj pola jeśli backend zwróci inną strukturę.
 */
const mapEmployee = (e) => ({
  id:          e.id          ?? e.employeeId ?? Math.random(),
  firstName:   e.firstName   ?? e.FirstName  ?? '',
  lastName:    e.lastName    ?? e.LastName   ?? '',
  email:       e.email       ?? e.Email      ?? '',
  phoneNumber: e.phoneNumber ?? e.PhoneNumber ?? null,
  birthDay:    e.birthDay    ?? e.BirthDay   ?? null,
  roleName:    e.roleName    ?? e.role?.name ?? e.RoleName ?? null,
});

const fetchEmployees = async () => {
  isLoading.value = true;
  loadError.value = null;
  try {
    const data = await employeeService.getAll();
    employees.value = (Array.isArray(data) ? data : [data]).map(mapEmployee);
  } catch (err) {
    console.error('[EmployeesView] fetchEmployees error:', err);
    loadError.value = err?.response?.data?.message ?? 'Nie udało się pobrać pracowników z serwera.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchEmployees);

const onSaved = async () => {
  showModal.value = false;
  await fetchEmployees();
};

// --- FILTROWANIE ---
const filteredEmployees = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return employees.value;
  return employees.value.filter(e =>
    e.firstName.toLowerCase().includes(q) ||
    e.lastName.toLowerCase().includes(q) ||
    e.email.toLowerCase().includes(q)
  );
});
</script>
