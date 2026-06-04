/**
 * Normalizuje pole obiektu API przyjmując camelCase lub PascalCase.
 * Np. n(obj, 'name') zwróci obj.name ?? obj.Name ?? fallback
 */
export function n(obj, key, fallback = '') {
  if (!obj) return fallback;
  const pascal = key.charAt(0).toUpperCase() + key.slice(1);
  const val = obj[key] ?? obj[pascal];
  return val ?? fallback;
}

/**
 * Normalizuje tablicę obiektów API — konwertuje PascalCase na camelCase
 * dla podanych kluczy.
 *
 * @param {object} obj - surowy obiekt z API
 * @param {string[]} keys - lista pól do znormalizowania (camelCase)
 * @param {object} [defaults={}] - wartości domyślne dla brakujących pól
 * @returns {object}
 */
export function normalizeKeys(obj, keys, defaults = {}) {
  const result = {};
  for (const key of keys) {
    result[key] = n(obj, key, defaults[key] ?? null);
  }
  return result;
}

/**
 * Zwraca tablicę — jeśli data jest pojedynczym obiektem, opakuje go.
 */
export function toArray(data) {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

/**
 * Pobiera komunikat błędu z odpowiedzi Axios.
 */
export function getErrorMessage(err, fallback = 'Wystąpił nieoczekiwany błąd.') {
  const d = err?.response?.data;
  if (!d) return fallback;
  if (d.errors) return Object.values(d.errors).flat().join(' ');
  return d.message ?? d.title ?? fallback;
}
