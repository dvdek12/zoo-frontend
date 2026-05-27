import { ref } from 'vue';

/**
 * Composable do wyświetlania tymczasowych powiadomień toast.
 *
 * @param {number} [duration=3000] - Czas wyświetlenia toastu w ms.
 *
 * @example
 * const { toastMsg, toastType, showToast } = useToast();
 *
 * showToast('Zapisano pomyślnie!');
 * showToast('Coś poszło nie tak.', 'error');
 *
 * // W template:
 * // <AppToast :message="toastMsg" :type="toastType" />
 */
export function useToast(duration = 3000) {
  const toastMsg  = ref('');
  const toastType = ref('success');
  let   toastTimer = null;

  /**
   * Wyświetla toast z podaną wiadomością.
   * @param {string} msg - Treść powiadomienia
   * @param {'success'|'error'} [type='success'] - Typ powiadomienia
   */
  function showToast(msg, type = 'success') {
    toastMsg.value  = msg;
    toastType.value = type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastMsg.value = ''; }, duration);
  }

  return { toastMsg, toastType, showToast };
}
