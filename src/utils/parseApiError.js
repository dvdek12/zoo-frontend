/**
 * Parsuje błąd z odpowiedzi API i zwraca wartość gotową do przekazania do <FormError :error="..." />.
 *
 * Obsługiwane formaty backendu:
 *   - Fluent Validation: { errors: [{ errorMessage: "..." }, ...] }
 *   - ProblemDetails:    { errors: { Field: ["msg"] } }
 *   - ASP.NET Identity:  [{ code, description }] lub { errors: [{ description }] }
 *   - Zwykły obiekt:     { message: "..." }
 *   - String
 *
 * Jeśli odpowiedź zawiera tablicę błędów walidacji — zwraca tę tablicę obiektów
 * (FormError wyciągnie z nich .errorMessage).
 * W przeciwnym razie zwraca string fallback.
 *
 * @param {unknown} err - obiekt błędu z catch
 * @param {string} [fallback] - domyślny komunikat gdy nie można odczytać błędu
 * @returns {string | Array<{errorMessage: string}>}
 */
export function parseApiError(err, fallback = 'An unexpected error occurred. Please try again.') {
  const data = err?.response?.data;

  if (!data) return fallback;

  // Fluent Validation: { errors: [{ errorMessage: "..." }] }
  if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    const hasErrorMessage = data.errors.some(e => e?.errorMessage);
    if (hasErrorMessage) return data.errors;

    // ProblemDetails: { errors: { Field: ["msg", ...] } }
    if (typeof data.errors === 'object' && !Array.isArray(data.errors)) {
      const msgs = Object.values(data.errors).flat().filter(Boolean).map(String);
      if (msgs.length) return msgs.map(m => ({ errorMessage: m }));
    }
  }

  // Root-level array: [{ errorMessage }] lub [{ description }] (ASP.NET Identity)
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }

  // Prosty string lub { message }
  if (data.message) return String(data.message);
  if (typeof data === 'string' && data.trim()) return data.trim();

  return fallback;
}
