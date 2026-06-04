import { ref, computed, watch } from 'vue';
import taskService from '../../services/task.service';
import { useDeleteConfirm } from '../useDeleteConfirm';
import { useToast } from '../useToast';
import { toArray, getErrorMessage } from '../../utils/normalize';
import { isOverdue } from '../../utils/formatters';

export function useTasks(employees) {
  const { showToast } = useToast();

  const tasks   = ref([]);
  const loading = ref(false);
  const error   = ref(null);

  const searchQuery    = ref('');
  const filterStatus   = ref('all');
  const filterCategory = ref('');

  function mapTask(t) {
    const emp = employees?.value?.find(e => e.id === (t.assignedEmployeeId ?? t.AssignedEmployeeId));
    return {
      id:                   t.id,
      name:                 t.name                ?? t.Name                ?? '',
      description:          t.description         ?? t.Description         ?? '',
      deadline:             t.deadline            ?? t.Deadline            ?? null,
      isCompleted:          t.isCompleted         ?? t.IsCompleted         ?? false,
      categoryId:           t.categoryId          ?? t.CategoryId          ?? null,
      assignedEmployeeId:   t.assignedEmployeeId  ?? t.AssignedEmployeeId  ?? null,
      roleId:               t.roleId              ?? t.RoleId              ?? null,
      assignedEmployeeName: emp
        ? `${emp.firstName} ${emp.lastName}`
        : (t.assignedEmployeeName ?? null),
    };
  }

  const filteredTasks = computed(() => {
    const q = searchQuery.value.toLowerCase().trim();
    return tasks.value.filter(t => {
      if (q && !t.name.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
      if (filterStatus.value === 'active'    && (t.isCompleted || isOverdue(t.deadline))) return false;
      if (filterStatus.value === 'completed' && !t.isCompleted) return false;
      if (filterStatus.value === 'overdue'   && (!isOverdue(t.deadline) || t.isCompleted)) return false;
      if (filterCategory.value !== ''        && t.categoryId !== Number(filterCategory.value)) return false;
      return true;
    });
  });

  async function fetchTasks() {
    loading.value = true;
    error.value   = null;
    try {
      const data  = await taskService.getAll();
      tasks.value = toArray(data).map(mapTask);
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to load tasks.');
    } finally {
      loading.value = false;
    }
  }

  async function saveTask(formData, editingId = null) {
    const dto = {
      Name:               formData.name,
      Description:        formData.description,
      Deadline:           formData.deadline ? new Date(formData.deadline).toISOString() : null,
      IsCompleted:        formData.isCompleted,
      CategoryId:         formData.categoryId         || null,
      AssignedEmployeeId: formData.assignedEmployeeId || null,
      RoleId:             formData.roleId             || null,
    };
    if (editingId) {
      await taskService.update(editingId, dto);
      showToast('Task updated!');
    } else {
      await taskService.create(dto);
      showToast('Task created!');
    }
    await fetchTasks();
  }

  const taskDelete = useDeleteConfirm(async (task) => {
    await taskService.remove(task.id);
    tasks.value = tasks.value.filter(t => t.id !== task.id);
    showToast('Task deleted.');
  });

  watch(() => taskDelete.deleteError.value, (err) => {
    if (err) showToast(err, 'error');
  });

  // Remapuj nazwy pracowników po załadowaniu listy
  if (employees) {
    watch(employees, () => {
      tasks.value = tasks.value.map(t => {
        const emp = employees.value.find(e => e.id === t.assignedEmployeeId);
        return { ...t, assignedEmployeeName: emp ? `${emp.firstName} ${emp.lastName}` : t.assignedEmployeeName };
      });
    });
  }

  return {
    tasks,
    loading,
    error,
    searchQuery,
    filterStatus,
    filterCategory,
    filteredTasks,
    fetchTasks,
    saveTask,
    taskDelete,
  };
}
