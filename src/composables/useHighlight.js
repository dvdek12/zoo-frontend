export function useHighlight() {
  /**
   * Escapuje znaki specjalne HTML aby zapobiec XSS.
   * @param {unknown} str
   * @returns {string}
   */
  const escapeHtml = (str) =>
    String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  /**
   * Opakowuje wszystkie dopasowania `query` w tekście tagiem <mark class="hl">.
   * Dopasowanie jest case-insensitive.
   *
   * @param {unknown} text  - surowy tekst (np. employee.firstName)
   * @param {string}  query - aktualne zapytanie wyszukiwarki
   * @returns {string}      - bezpieczny HTML gotowy do v-html
   */
  const highlight = (text, query) => {
    const safe = escapeHtml(text);
    if (!query || !query.trim()) return safe;

    // Escapuj znaki specjalne regex wewnątrz query
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safe.replace(
      new RegExp(`(${escaped})`, 'gi'),
      '<mark class="hl">$1</mark>'
    );
  };

  return { highlight, escapeHtml };
}
