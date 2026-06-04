/**
 * Formatuje datę do czytelnego stringa.
 * @param {string|Date|null} dateStr
 * @param {'pl-PL'|'en-GB'} [locale='pl-PL']
 * @param {boolean} [withTime=true]
 */
export function formatDate(dateStr, locale = 'pl-PL', withTime = true) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  const datePart = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
  if (!withTime) return datePart;
  const timePart = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  return `${datePart}, ${timePart}`;
}

/**
 * Formatuje datę w stylu "12 Jun 2025 · 14:30" (angielski, krótki miesiąc).
 */
export function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return (
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
}

/**
 * Zwraca true jeśli deadline minął.
 * @param {string|Date|null} deadline
 */
export function isOverdue(deadline) {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

/**
 * Zwraca tekst statusu zadania.
 * @param {{ isCompleted: boolean, deadline: string|null }} task
 */
export function taskStatusLabel(task) {
  if (task.isCompleted) return 'Completed';
  if (isOverdue(task.deadline)) return 'Overdue';
  return 'Active';
}

/**
 * Zamienia CamelCase na słowa z odstępami, np. "AnimalReport" → "Animal Report".
 */
export function camelToWords(str) {
  if (!str) return '';
  return String(str).replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Escapes special HTML characters to prevent XSS.
 */
export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Podświetla dopasowania query w tekście — zwraca bezpieczny HTML.
 * @param {string} text
 * @param {string} query
 */
export function highlight(text, query) {
  const safe = escapeHtml(text);
  if (!query?.trim()) return safe;
  const escaped = escapeHtml(query.trim()).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="hl">$1</mark>',
  );
}
