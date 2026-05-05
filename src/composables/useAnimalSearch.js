import { ref } from 'vue';
import axios from 'axios';

const API_BASE = 'https://localhost:7293/api/external-animals';

/**
 * Composable do wyszukiwania gatunków zwierząt przez zewnętrzne API (.NET proxy → Ninja API).
 * Zwraca listę pasujących gatunków dla podanej nazwy.
 */
export function useAnimalSearch() {
  const results = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * @param {string} query - nazwa zwierzęcia, np. "Lion"
   */
  const searchAnimals = async (query) => {
    const trimmed = query?.trim();
    if (!trimmed) {
      results.value = [];
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${API_BASE}/${encodeURIComponent(trimmed)}`);
      // API może zwracać tablicę lub pojedynczy obiekt – normalizujemy do tablicy
      const data = response.data;
      results.value = Array.isArray(data) ? data : [data];
    } catch (err) {
      console.error('[useAnimalSearch] Błąd:', err);
      error.value = err?.response?.data?.message ?? 'Nie udało się pobrać gatunków.';
      results.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const clearResults = () => {
    results.value = [];
    error.value = null;
  };

  return {
    results,
    isLoading,
    error,
    searchAnimals,
    clearResults,
  };
}
