<template>
  <div class="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-0">
    <!-- Tabela — widoczna tylko gdy są dane -->
    <div v-if="animals.length > 0" class="flex-1 overflow-auto custom-scrollbar">
      <table class="w-full text-left border-collapse">
        <thead class="sticky top-0 bg-gray-50 dark:bg-gray-900/95 backdrop-blur-sm z-10 shadow-sm border-b border-gray-100 dark:border-gray-700">
          <tr>
            <th class="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 w-16 text-center">Ikona</th>
            <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Nazwa</th>
            <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Gatunek</th>
            <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Status</th>
            <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Atrybuty</th>
            <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300 text-right w-24">Akcje</th>
          </tr>
        </thead>
        <TransitionGroup
          name="row"
          tag="tbody"
          class="divide-y divide-gray-100 dark:divide-gray-700"
        >
          <tr
            v-for="animal in animals"
            :key="animal.id"
            class="hover:bg-[#f0f9f4] dark:hover:bg-[#132a1e] transition-colors duration-200 group cursor-pointer hover:shadow-[inset_4px_0_0_0_#2d6a4f] dark:hover:shadow-[inset_4px_0_0_0_#4ade80]"
            @click="$emit('row-click', animal.id)"
          >
            <!-- Kolumna ikonki -->
            <td class="py-2 px-4 text-center">
              <AnimalIconCell :icon-id="animal.iconId" :name="animal.name" />
            </td>
            <td class="py-3 px-6">
              <span
                class="font-bold text-gray-900 dark:text-white text-lg"
                v-html="highlight(animal.name, query)"
              />
            </td>
            <td class="py-3 px-6">
              <span
                class="text-gray-500 dark:text-gray-400 italic text-sm"
                v-html="highlight(animal.species, query)"
              />
            </td>
            <td class="py-3 px-6">
              <span
                class="bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-full border border-[#2d6a4f]/20 shadow-sm"
                v-html="highlight(animal.status, query)"
              />
            </td>
            <td class="py-3 px-6">
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="attr in animal.attributes"
                  :key="attr.name"
                  class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded border border-gray-200 dark:border-gray-600"
                >
                  <span class="font-semibold" v-html="highlight(attr.name, query)" />:
                  <span v-html="highlight(attr.value, query)" />
                </span>
                <span v-if="animal.attributes.length === 0" class="text-xs text-gray-400">Brak atrybutów</span>
              </div>
            </td>
            <td class="py-3 px-6 text-right">
              <button
                class="text-gray-400 hover:text-red-500 transition-colors p-2"
                title="Usuń"
                @click.stop="$emit('delete', animal.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>

    <!-- Empty state -->
    <Transition name="fade">
      <div v-if="animals.length === 0" class="flex-1 flex flex-col items-center justify-center select-none overflow-hidden">
        <img
          :src="sadPandaImg"
          alt="Smutna panda"
          class="w-80 opacity-55 grayscale mb-4"
          draggable="false"
        />
        <p class="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-1">
          Brak zwierząt w zoo
        </p>
        <p class="text-sm text-gray-300 dark:text-gray-600 text-center max-w-xs">
          Nasza panda jest smutna — nie ma tu żadnych zwierząt.<br>Dodaj pierwsze, klikając przycisk powyżej.
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import sadPandaImg from '../../assets/sad_panda.png';
import { useHighlight } from '../../composables/useHighlight';
import { useIcon } from '../../composables/useIcon';
import '../../assets/table-animations.css';
import { defineComponent, h, toRef } from 'vue';

defineProps({
  animals: {
    type: Array,
    required: true,
  },
  query: {
    type: String,
    default: '',
  },
});

defineEmits(['delete', 'row-click']);

const { highlight } = useHighlight();

/**
 * Subkomponent renderujący ikonkę jednego wiersza.
 * Używa useIcon per-instancja (każdy wiersz ma własny stan ładowania).
 */
const AnimalIconCell = defineComponent({
  name: 'AnimalIconCell',
  props: {
    iconId: { type: Number, default: null },
    name:   { type: String, default: '' },
  },
  setup(props) {
    const iconIdRef = toRef(props, 'iconId');
    const { iconUrl, isLoading } = useIcon(iconIdRef);
    // Zwracamy stan jako obiekt — render() odczyta go reaktywnie
    return { iconUrl, isLoading };
  },
  render() {
    // Spinner podczas ładowania
    if (this.isLoading) {
      return h('div', {
        class: 'w-10 h-10 rounded-xl mx-auto bg-gray-100 dark:bg-gray-700 animate-pulse',
      });
    }
    // Obrazek ikonki
    if (this.iconUrl) {
      return h('img', {
        src: this.iconUrl,
        alt: this.name,
        class: 'w-10 h-10 rounded-xl object-cover mx-auto shadow-sm border border-gray-100 dark:border-gray-700 transition-transform group-hover:scale-110 duration-200',
      });
    }
    // Fallback — avatar z pierwszą literą nazwy
    return h('div', {
      class: 'w-10 h-10 rounded-xl mx-auto flex items-center justify-center bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] shadow-sm transition-transform group-hover:scale-110 duration-200',
    }, [
      h('span', {
        class: 'text-white font-bold text-sm select-none',
      }, (this.name?.[0] ?? '?').toUpperCase()),
    ]);
  },
});
</script>

<style scoped>
/* ── Fade dla empty state ── */
.fade-enter-active { transition: opacity 0.3s ease 0.1s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.1s; }
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from   { opacity: 0; transform: translateY(8px); }
.fade-leave-to     { opacity: 0; }

/* ── Scrollbar ── */
.custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; }
.dark .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #4b5563; }
</style>

