import { ref, computed } from 'vue';
import employeeService from '../../services/employee.service';
import { toArray, getErrorMessage } from '../../utils/normalize';

export function useEmployees() {
  const employees = ref([]);
  const roles     = ref([]);
  const loading   = ref(false);
  const error     = ref(null);

  function mapEmployee(e) {
    return {
      id:          e.id          ?? e.employeeId ?? null,
      iconId:      e.iconId      ?? e.IconId     ?? null,
      firstName:   e.firstName   ?? e.FirstName  ?? '',
      lastName:    e.lastName    ?? e.LastName   ?? '',
      email:       e.email       ?? e.Email      ?? '',
      phoneNumber: e.phoneNumber ?? e.PhoneNumber ?? null,
      birthDay:    e.birthDay    ?? e.BirthDay   ?? null,
      roleName:    e.roleName    ?? e.role?.name ?? e.RoleName ?? null,
    };
  }

  async function fetchEmployees() {
    loading.value = true;
    error.value   = null;
    try {
      const data    = await employeeService.getAll();
      const mapped  = toArray(data).map(mapEmployee);
      employees.value = mapped;

      const roleResults = await Promise.allSettled(mapped.map(e => employeeService.getEmployeeRole(e.id)));
      roleResults.forEach((r, i) => {
        if (r.status === 'fulfilled' && r.value) {
          employees.value[i].roleName = r.value.name ?? r.value.Name ?? null;
        }
      });
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to load employees.');
    } finally {
      loading.value = false;
    }
  }

  async function fetchRoles() {
    try {
      const data  = await employeeService.getAllRoles();
      roles.value = toArray(data);
    } catch {}
  }

  function filterEmployees(searchQuery) {
    return computed(() => {
      const q = searchQuery.value?.toLowerCase().trim();
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
  }

  return {
    employees,
    roles,
    loading,
    error,
    fetchEmployees,
    fetchRoles,
    filterEmployees,
  };
}
