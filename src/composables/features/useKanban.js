import taskService from '../../services/task.service';
import { useToast } from '../useToast';

export function useKanban(tasks, employees) {
  const { showToast } = useToast();

  async function handleAssign({ taskId, empId }) {
    const task = tasks.value.find(t => t.id === taskId);
    if (!task) return;

    const oldEmpId = task.assignedEmployeeId;
    const emp      = employees.value.find(e => e.id === empId);

    task.assignedEmployeeId   = empId;
    task.assignedEmployeeName = emp ? `${emp.firstName} ${emp.lastName}` : null;

    try {
      await taskService.update(taskId, { AssignedEmployeeId: empId });
      showToast(`Task assigned to ${emp?.firstName ?? ''}!`);
    } catch {
      const oldEmp = employees.value.find(e => e.id === oldEmpId);
      task.assignedEmployeeId   = oldEmpId;
      task.assignedEmployeeName = oldEmp ? `${oldEmp.firstName} ${oldEmp.lastName}` : null;
      showToast('Failed to assign the task.', 'error');
    }
  }

  async function handleUnassign(task) {
    const oldEmpId = task.assignedEmployeeId;
    task.assignedEmployeeId   = null;
    task.assignedEmployeeName = null;

    try {
      await taskService.update(task.id, { AssignedEmployeeId: null });
      showToast('Task unassigned from employee.');
    } catch {
      const oldEmp = employees.value.find(e => e.id === oldEmpId);
      task.assignedEmployeeId   = oldEmpId;
      task.assignedEmployeeName = oldEmp ? `${oldEmp.firstName} ${oldEmp.lastName}` : null;
      showToast('Failed to unassign the task.', 'error');
    }
  }

  return { handleAssign, handleUnassign };
}
