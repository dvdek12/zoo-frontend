<template>
  <div class="p-8 h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar">

    <!-- Wyszukiwarka -->
    <div class="shrink-0 relative w-full">
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

    <!-- ═══ SEKCJA: PRACOWNICY ═══ -->
    <section class="flex flex-col gap-4">
      <div class="flex justify-between items-center shrink-0">
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

      <!-- Loading pracownicy -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <div class="flex flex-col items-center gap-3 text-gray-400">
          <svg class="animate-spin h-8 w-8 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="text-sm">Pobieranie pracowników…</span>
        </div>
      </div>

      <!-- Error pracownicy -->
      <div v-else-if="loadError" class="flex items-center justify-center py-16">
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
      <EmployeeTable v-else :employees="filteredEmployees" :query="searchQuery" />
    </section>

    <!-- ═══ SEKCJA: ROLE ═══ -->
    <section class="flex flex-col gap-4 pb-8">
      <div class="flex justify-between items-center shrink-0">
        <div>
          <h2 class="text-3xl font-bold text-[#1a3b22] dark:text-green-400 tracking-tight">Role</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Przeglądaj i dodawaj role pracownicze.</p>
        </div>
        <button
          id="open-add-role-modal"
          @click="showRoleModal = true"
          class="bg-[#2d6a4f] hover:bg-[#1a3b22] text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Dodaj rolę
        </button>
      </div>

      <!-- Loading role -->
      <div v-if="rolesLoading" class="flex items-center justify-center py-16">
        <div class="flex flex-col items-center gap-3 text-gray-400">
          <svg class="animate-spin h-8 w-8 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="text-sm">Pobieranie ról…</span>
        </div>
      </div>

      <!-- Error role -->
      <div v-else-if="rolesError" class="flex items-center justify-center py-8">
        <p class="text-sm text-red-500">{{ rolesError }}</p>
      </div>

      <!-- Roles cards -->
      <div v-else-if="roles.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 dark:bg-gray-900/95 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300 w-24">Kolor</th>
                <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Nazwa</th>
                <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Opis</th>
                <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300 text-center">Menedżerska</th>
                <th class="py-3 px-6 w-16"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr
                v-for="role in roles"
                :key="role.id"
                class="hover:bg-[#f0f9f4] dark:hover:bg-[#132a1e] transition-all duration-200 hover:shadow-[inset_4px_0_0_0_#2d6a4f] dark:hover:shadow-[inset_4px_0_0_0_#4ade80]"
              >
                <td class="p-0 w-16 relative">
                  <input
                    type="color"
                    :value="themeStore.getRoleColor(role.name)"
                    @input="themeStore.setRoleColor(role.name, $event.target.value)"
                    class="absolute inset-0 w-full h-full cursor-pointer border-0 p-0 m-0"
                    :title="`Zmień kolor roli: ${role.name}`"
                  />
                </td>
                <td class="py-3 px-6">
                  <span class="font-semibold text-gray-900 dark:text-white">{{ role.name }}</span>
                </td>
                <td class="py-3 px-6">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">{{ role.description ?? '—' }}</span>
                </td>
                <td class="py-3 px-6 text-center">
                  <span
                    v-if="role.isManagerial"
                    class="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    Tak
                  </span>
                  <span v-else class="text-gray-400 text-xs">Nie</span>
                </td>
                <!-- Akcje: usuwanie -->
                <td class="py-3 px-4 text-right">
                  <button
                    @click.stop="deleteRole(role)"
                    :disabled="deletingRoleId === role.id"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Usuń rolę"
                  >
                    <!-- Spinner podczas usuwania -->
                    <svg v-if="deletingRoleId === role.id" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <!-- Ikona koszyczka -->
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty roles -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center py-12 gap-3">
        <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-400 dark:text-gray-500">Brak zdefiniowanych ról</p>
        <p class="text-xs text-gray-300 dark:text-gray-600">Dodaj pierwszą rolę, klikając przycisk powyżej.</p>
      </div>
    </section>

    <!-- Modal rejestracji pracownika -->
    <RegisterEmployeeModal
      v-if="showModal"
      @save="onSaved"
      @close="showModal = false"
    />

    <!-- Modal dodania roli -->
    <AddRoleModal
      v-if="showRoleModal"
      @save="onRoleSaved"
      @close="showRoleModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import EmployeeTable from '../components/employees/EmployeeTable.vue';
import RegisterEmployeeModal from '../components/employees/RegisterEmployeeModal.vue';
import AddRoleModal from '../components/employees/AddRoleModal.vue';
import employeeService from '../services/employee.service';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();

const showModal     = ref(false);
const showRoleModal = ref(false);
const searchQuery   = ref('');

// --- PRACOWNICY ---
const employees = ref([]);
const isLoading = ref(false);
const loadError = ref(null);

const mapEmployee = (e) => ({
  id:          e.id          ?? e.employeeId ?? Math.random(),
  iconId:      e.iconId      ?? e.IconId     ?? e.icon_id ?? null,
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
    const mapped = (Array.isArray(data) ? data : [data]).map(mapEmployee);
    employees.value = mapped;

    // Pobierz role równolegle dla każdego pracownika
    const roleResults = await Promise.allSettled(
      mapped.map(e => employeeService.getEmployeeRole(e.id))
    );
    roleResults.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value) {
        const roleName = result.value.name ?? result.value.Name ?? null;
        if (roleName) employees.value[idx].roleName = roleName;
      }
    });
  } catch (err) {
    console.error('[EmployeesView] fetchEmployees error:', err);
    loadError.value = err?.response?.data?.message ?? 'Nie udało się pobrać pracowników z serwera.';
  } finally {
    isLoading.value = false;
  }
};

const onSaved = async () => {
  showModal.value = false;
  await fetchEmployees();
};

const filteredEmployees = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return employees.value;
  return employees.value.filter(e => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    return (
      fullName.includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.roleName ?? '').toLowerCase().includes(q) ||
      (e.phoneNumber ?? '').toLowerCase().includes(q)
    );
  });
});

// --- ROLE ---
const roles       = ref([]);
const rolesLoading = ref(false);
const rolesError   = ref(null);

const fetchRoles = async () => {
  rolesLoading.value = true;
  rolesError.value   = null;
  try {
    const data = await employeeService.getAllRoles();
    roles.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[EmployeesView] fetchRoles error:', err);
    rolesError.value = err?.response?.data?.message ?? 'Nie udało się pobrać ról.';
  } finally {
    rolesLoading.value = false;
  }
};

const onRoleSaved = async () => {
  showRoleModal.value = false;
  await fetchRoles();
};

// --- USUWANIE ROLI ---
const deletingRoleId = ref(null);
const deleteRoleError = ref(null);

const deleteRole = async (role) => {
  if (!confirm(`Czy na pewno chcesz usunąć rolę "${role.name}"? Tej operacji nie można cofnąć.`)) return;
  deletingRoleId.value = role.id;
  deleteRoleError.value = null;
  try {
    await employeeService.deleteRole(role.id);
    // Optymistyczne usunięcie z listy
    roles.value = roles.value.filter(r => r.id !== role.id);
  } catch (err) {
    console.error('[EmployeesView] deleteRole error:', err);
    deleteRoleError.value = err?.response?.data?.message ?? 'Nie udało się usunąć roli.';
    alert(deleteRoleError.value);
  } finally {
    deletingRoleId.value = null;
  }
};

onMounted(() => {
  fetchEmployees();
  fetchRoles();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; }
</style>
