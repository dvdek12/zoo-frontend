import { ref } from 'vue';
import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE}/api/external-animals`;

export function useAnimalSearch() {
  const results   = ref([]);
  const isLoading = ref(false);
  const error     = ref(null);

  const searchAnimals = async (query) => {
    const trimmed = query?.trim();
    if (!trimmed) {
      results.value = [];
      return;
    }
    isLoading.value = true;
    error.value     = null;
    try {
      const response  = await axios.get(`${API_BASE}/${encodeURIComponent(trimmed)}`);
      const data      = response.data;
      results.value   = Array.isArray(data) ? data : [data];
    } catch (err) {
      error.value   = err?.response?.data?.message ?? 'Could not fetch species.';
      results.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const clearResults = () => {
    results.value = [];
    error.value   = null;
  };

  return { results, isLoading, error, searchAnimals, clearResults };
}
