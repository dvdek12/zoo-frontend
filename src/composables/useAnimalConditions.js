import { ref } from 'vue';
import animalService from '../services/animal.service';

const CONDITION_STYLES = [
  { icon: '😊', activeBorder: 'border-green-500', activeBg: 'bg-green-50 dark:bg-green-900/20', activeText: 'text-green-600 dark:text-green-400', color: 'text-green-500 dark:text-green-400' },
  { icon: '😐', activeBorder: 'border-yellow-500', activeBg: 'bg-yellow-50 dark:bg-yellow-900/20', activeText: 'text-yellow-600 dark:text-yellow-400', color: 'text-yellow-500 dark:text-yellow-400' },
  { icon: '😟', activeBorder: 'border-red-500', activeBg: 'bg-red-50 dark:bg-red-900/20', activeText: 'text-red-600 dark:text-red-400', color: 'text-red-500 dark:text-red-400' },
  { icon: '🔵', activeBorder: 'border-blue-500', activeBg: 'bg-blue-50 dark:bg-blue-900/20', activeText: 'text-blue-600 dark:text-blue-400', color: 'text-blue-500 dark:text-blue-400' },
];

const FALLBACK_CONDITIONS = [
  { value: 1, label: 'Good' },
  { value: 2, label: 'Average' },
  { value: 3, label: 'Poor' },
];

export function parseAnimalConditions(data) {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map((item, idx) => {
      if (typeof item === 'string') return { value: idx + 1, label: item };
      if (typeof item === 'number') return { value: item, label: String(item) };
      return {
        value: item.id ?? item.Id ?? item.value ?? item.key ?? idx + 1,
        label: item.condition ?? item.Condition ?? item.name ?? item.label ?? item.displayName ?? String(idx + 1),
      };
    });
  }
  if (typeof data === 'object') {
    return Object.entries(data).map(([name, value]) => ({
      value: typeof value === 'number' ? value : Number(value),
      label: name,
    }));
  }
  return [];
}

export function withConditionStyles(items) {
  return items.map((item, idx) => ({ ...item, ...CONDITION_STYLES[idx % CONDITION_STYLES.length] }));
}

export function useAnimalConditions() {
  const conditions = ref([]);
  const isLoading  = ref(false);
  const loadError  = ref(null);

  const load = async () => {
    isLoading.value = true;
    loadError.value = null;
    try {
      const data = await animalService.getAnimalConditions();
      let parsed = parseAnimalConditions(data);
      if (parsed.length === 0) throw new Error('Empty API response');
      conditions.value = withConditionStyles(parsed);
    } catch (err) {
      console.error('[useAnimalConditions] load error:', err);
      loadError.value  = 'Failed to load health conditions.';
      conditions.value = withConditionStyles(FALLBACK_CONDITIONS);
    } finally {
      isLoading.value = false;
    }
  };

  const findById    = (id)    => conditions.value.find((c) => c.value === id);
  const findByLabel = (label) => {
    if (!label) return null;
    const normalized = String(label).toLowerCase();
    return conditions.value.find((c) => String(c.label).toLowerCase() === normalized);
  };
  const labelFor = (entry) => {
    if (!entry) return '—';
    if (entry.condition ?? entry.Condition) return entry.condition ?? entry.Condition;
    const id = entry.conditionId ?? entry.ConditionId ?? entry.conditionAdmission;
    return findById(id)?.label ?? '—';
  };
  const colorFor = (entry) => {
    const label = labelFor(entry);
    const match = findByLabel(label);
    return match?.color ?? 'text-gray-600 dark:text-gray-300';
  };

  return { conditions, isLoading, loadError, load, labelFor, colorFor };
}
