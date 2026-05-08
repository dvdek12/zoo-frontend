import { defineStore } from 'pinia';
import { ref } from 'vue';

const STORAGE_KEY = 'zoo-role-colors';

// ─────────────────────────────────────────────
//  Domyślne kolory ról (hex).
//  Persystowane w localStorage pod kluczem STORAGE_KEY.
// ─────────────────────────────────────────────
const DEFAULT_ROLE_COLORS = {
  'Manager':              '#3b82f6', // blue-500
  'Kierownik':            '#3b82f6',

  'Vet':                  '#a855f7', // purple-500
  'Weterynarz':           '#a855f7',

  'Opiekun zwierząt':     '#22c55e', // green-500
  'Zookeeper':            '#22c55e',

  'Cleaner':              '#eab308', // yellow-500
  'Pracownik techniczny': '#eab308',

  'Pracownik biurowy':    '#06b6d4', // cyan-500
  'Admin':                '#06b6d4',

  'Security':             '#ef4444', // red-500
  'Ochrona':              '#ef4444',

  'Guide':                '#f97316', // orange-500
  'Przewodnik':           '#f97316',
};

const FALLBACK_COLOR = '#6b7280'; // gray-500

/** Wczytuje kolory z localStorage (z fallbackiem do domyślnych) */
function loadColors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_ROLE_COLORS, ...JSON.parse(raw) } : { ...DEFAULT_ROLE_COLORS };
  } catch {
    return { ...DEFAULT_ROLE_COLORS };
  }
}

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false);

  /**
   * Mapa: { roleName → '#rrggbb' }
   * Reaktywna i persystowana w localStorage.
   */
  const roleColors = ref(loadColors());

  /**
   * Zwraca kolor hex dla danej roli.
   * @param {string|null|undefined} roleName
   * @returns {string} '#rrggbb'
   */
  function getRoleColor(roleName) {
    if (!roleName) return FALLBACK_COLOR;
    return roleColors.value[roleName] ?? FALLBACK_COLOR;
  }

  /**
   * Ustawia kolor dla roli i zapisuje w localStorage.
   * @param {string} roleName
   * @param {string} color - wartość hex np. '#a855f7'
   */
  function setRoleColor(roleName, color) {
    roleColors.value[roleName] = color;
    // Persystuj tylko nadpisane kolory (diff z domyślnymi)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roleColors.value));
  }

  /**
   * Zwraca inline style object dla badge roli.
   * Tło = kolor z 15% alpha, tekst = kolor, obramowanie = kolor z 30% alpha.
   * @param {string|null|undefined} roleName
   * @returns {{ backgroundColor: string, color: string, borderColor: string }}
   */
  function getRoleBadgeStyle(roleName) {
    const hex = getRoleColor(roleName);
    return {
      backgroundColor: hex + '26', // ~15% opacity
      color:           hex,
      borderColor:     hex + '4d', // ~30% opacity
    };
  }

  /**
   * Resetuje kolor danej roli do wartości domyślnej.
   * @param {string} roleName
   */
  function resetRoleColor(roleName) {
    roleColors.value[roleName] = DEFAULT_ROLE_COLORS[roleName] ?? FALLBACK_COLOR;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roleColors.value));
  }

  // ── Motyw ─────────────────────────────────

  function init() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme(true);
    } else {
      setTheme(false);
    }
  }

  function toggleTheme() {
    setTheme(!isDark.value);
  }

  function setTheme(dark) {
    isDark.value = dark;
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  return {
    // motyw
    isDark,
    init,
    toggleTheme,
    setTheme,
    // kolory ról
    roleColors,
    getRoleColor,
    setRoleColor,
    resetRoleColor,
    getRoleBadgeStyle,
  };
});
