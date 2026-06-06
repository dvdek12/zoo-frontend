import { ref } from 'vue';

export function useDeleteConfirm(deleteFn) {
  const pendingDelete = ref(null);
  const showConfirm   = ref(false);
  const isDeleting    = ref(false);
  const deleteError   = ref(null);

  function requestDelete(item) {
    pendingDelete.value = item;
    showConfirm.value   = true;
    deleteError.value   = null;
  }

  async function confirmDelete() {
    if (!pendingDelete.value) return;
    isDeleting.value  = true;
    deleteError.value = null;
    try {
      await deleteFn(pendingDelete.value);
      showConfirm.value   = false;
      pendingDelete.value = null;
    } catch (err) {
      deleteError.value = err?.response?.data?.message ?? err?.message ?? 'Failed to delete record.';
      showConfirm.value = false;
    } finally {
      isDeleting.value = false;
    }
  }

  function cancelDelete() {
    showConfirm.value   = false;
    pendingDelete.value = null;
    deleteError.value   = null;
  }

  return { pendingDelete, showConfirm, isDeleting, deleteError, requestDelete, confirmDelete, cancelDelete };
}
