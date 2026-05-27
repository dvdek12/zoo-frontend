import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Store przechowujący dynamiczny tytuł dla breadcrumba aktualnej strony.
 * Widoki detali (np. AnimalDetailsView) ustawiają go po załadowaniu danych,
 * dzięki czemu breadcrumb pokazuje imię/nazwę zamiast "Animal #4".
 *
 * Router czyści go automatycznie przy każdej nawigacji (beforeEach).
 */
export const useBreadcrumbStore = defineStore('breadcrumb', () => {
  const dynamicLabel = ref(null);

  function setLabel(label) {
    dynamicLabel.value = label;
  }

  function clearLabel() {
    dynamicLabel.value = null;
  }

  return { dynamicLabel, setLabel, clearLabel };
});
