import { ref, watch } from 'vue';
import iconService from '../services/icon.service';

/**
 * Globalny cache: iconId → url (unikamy wielokrotnych zapytań dla tego samego ID)
 * Współdzielony między wszystkimi instancjami composable.
 */
const cache = new Map();

/**
 * Composable pobierający URL ikonki dla podanego iconId.
 *
 * @param {import('vue').Ref<number|null>|number|null} iconId
 * @returns {{ iconUrl: import('vue').Ref<string|null>, isLoading: import('vue').Ref<boolean> }}
 */
/**
 * Usuwa ikonkę z cache — wywołaj po udanej zmianie ikonki (PUT /Icon/{id}),
 * żeby kolejne użycie useIcon pobrało świeże dane z serwera.
 * @param {number} id
 */
export function invalidateIcon(id) {
  if (cache.has(id)) {
    const oldUrl = cache.get(id);
    // Zwolnij pamięć przeglądarki zajmowaną przez stary blob
    if (oldUrl && oldUrl.startsWith('blob:')) {
      URL.revokeObjectURL(oldUrl);
    }
    cache.delete(id);
  }
}

export function useIcon(iconId) {
  const iconUrl = ref(null);
  const isLoading = ref(false);

  const load = async (id) => {
    if (id === null || id === undefined) {
      iconUrl.value = null;
      return;
    }

    // Zwróć z cache jeśli już pobrano
    if (cache.has(id)) {
      iconUrl.value = cache.get(id);
      return;
    }

    isLoading.value = true;
    try {
      // getById zwraca gotowy objectURL (blob:http://...)
      const objectUrl = await iconService.getById(id);
      cache.set(id, objectUrl);
      iconUrl.value = objectUrl;
    } catch (err) {
      console.warn(`[useIcon] Nie udało się pobrać ikonki id=${id}:`, err);
      iconUrl.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  // Obsługa zarówno zwykłej wartości, jak i ref-a
  if (typeof iconId === 'object' && iconId !== null && 'value' in iconId) {
    watch(iconId, (val) => load(val), { immediate: true });
  } else {
    load(iconId);
  }

  return { iconUrl, isLoading };
}
