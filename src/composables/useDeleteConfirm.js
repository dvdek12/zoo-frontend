import { ref } from 'vue';

/**
 * Composable obsługujący logikę potwierdzenia usunięcia rekordu.
 *
 * @param {(item: any) => Promise<void>} deleteFn - Async funkcja wykonująca usunięcie.
 *   Powinna rzucić wyjątek w przypadku błędu.
 *
 * @example
 * const { pendingDelete, showConfirm, isDeleting, requestDelete, confirmDelete, cancelDelete }
 *   = useDeleteConfirm(async (animal) => {
 *       await animalService.remove(animal.id);
 *       animals.value = animals.value.filter(a => a.id !== animal.id);
 *   });
 *
 * // W template:
 * // @delete="requestDelete(item)"
 * // <ConfirmDialog v-model="showConfirm" :loading="isDeleting" @confirm="confirmDelete" @cancel="cancelDelete" />
 */
export function useDeleteConfirm(deleteFn) {
  const pendingDelete = ref(null);
  const showConfirm   = ref(false);
  const isDeleting    = ref(false);
  const deleteError   = ref(null);

  /**
   * Otwiera dialog potwierdzenia dla podanego elementu.
   * @param {any} item - element do usunięcia (musi mieć pole `id`)
   */
  function requestDelete(item) {
    pendingDelete.value = item;
    showConfirm.value   = true;
    deleteError.value   = null;
  }

  /** Wywoływane po kliknięciu "Usuń" w dialogu — wykonuje faktyczne usunięcie. */
  async function confirmDelete() {
    if (!pendingDelete.value) return;
    isDeleting.value  = true;
    deleteError.value = null;
    try {
      await deleteFn(pendingDelete.value);
      showConfirm.value   = false;
      pendingDelete.value = null;
    } catch (err) {
      deleteError.value = err?.response?.data?.message ?? err?.message ?? 'Nie udało się usunąć rekordu.';
      showConfirm.value = false;
    } finally {
      isDeleting.value = false;
    }
  }

  /** Wywoływane po kliknięciu "Anuluj" — zamyka dialog bez usuwania. */
  function cancelDelete() {
    showConfirm.value   = false;
    pendingDelete.value = null;
    deleteError.value   = null;
  }

  return {
    pendingDelete,
    showConfirm,
    isDeleting,
    deleteError,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
