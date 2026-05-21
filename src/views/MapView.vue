<template>
  <div class="flex-1 relative h-full w-full overflow-hidden bg-[#e4e4e0] flex items-center justify-center">

    <!-- Page title overlay (top-left) -->
    <div class="absolute top-5 left-5 z-20 flex items-center gap-2.5 bg-white/80 dark:bg-[#1a1c1e]/80 backdrop-blur-md border border-white/40 dark:border-gray-700/60 rounded-2xl px-4 py-2.5 shadow-lg pointer-events-none">
      <svg class="w-4 h-4 stroke-[#2d6a4f] dark:stroke-green-400 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
      <span class="text-sm font-bold text-[#1a3b22] dark:text-green-400 leading-none">Mapa zoo</span>
    </div>

    <!-- Mapa -->
    <Map
      :highlighted-enclosure="hoveredEnclosureKey"
      :enclosure-data="enclosureData"
      @select-enclosure="handleSelectEnclosure"
      @enclosure-drag-enter="onEnclosureDragEnter"
      @enclosure-drag-leave="onEnclosureDragLeave"
      @enclosure-drop="onEnclosureDrop"
    />

    <!-- Loading overlay -->
    <Transition name="fade-quick">
      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
      >
        <div class="bg-white rounded-2xl px-8 py-6 flex items-center gap-4 shadow-2xl">
          <svg class="animate-spin h-6 w-6 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="text-[#1a3b22] font-semibold">Ładowanie mapy…</span>
        </div>
      </div>
    </Transition>

    <!-- ══ MODAL WYBRANEGO WYBIEGU ══ -->
    <Transition name="slide-up" mode="out-in">
      <div v-if="selectedEnclosure" :key="selectedEnclosure.id" class="absolute bottom-8 right-8 z-30">
        <div class="bg-white rounded-[2rem] shadow-2xl w-[380px] border border-gray-100 overflow-hidden">

          <!-- Header -->
          <div class="px-6 pt-6 pb-4 flex items-start justify-between">
            <div>
              <h3 class="text-[20px] font-extrabold text-[#1a3b22] tracking-tight leading-tight">
                {{ selectedEnclosure.name }}
              </h3>
              <p v-if="selectedEnclosure.type?.typeName" class="text-[11px] text-gray-500 font-bold tracking-wide flex items-center gap-1.5 mt-1 uppercase">
                <MapPin class="w-3 h-3" />
                {{ selectedEnclosure.type.typeName }}
              </p>
            </div>
            <button
              @click="selectedEnclosure = null"
              class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600 shrink-0"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Lista zwierząt -->
          <div class="px-6 pb-5">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Zwierzęta w wybiegu
              <span class="ml-1.5 px-1.5 py-0.5 bg-[#f0faf5] text-[#2d6a4f] rounded-full text-[10px]">
                {{ selectedEnclosure.animals?.length ?? 0 }}
              </span>
            </p>

            <!-- Brak zwierząt -->
            <div
              v-if="!selectedEnclosure.animals || selectedEnclosure.animals.length === 0"
              class="flex flex-col items-center justify-center py-5 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span class="text-sm font-medium">Brak zwierząt</span>
              <span class="text-xs mt-0.5">Przeciągnij zwierzę na ten wybieg</span>
            </div>

            <!-- Lista -->
            <ul v-else class="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              <li
                @click="navigateToAnimal(animal.id)"
                v-for="animal in selectedEnclosure.animals"
                :key="animal.id"
                class="flex cursor-pointer items-center gap-3 p-2.5 rounded-xl bg-[#f8faf8] hover:bg-[#f0f7f2] border border-transparent hover:border-[#c8e6d0] transition-all group"
              >
                <!-- Ikona zwierzęcia -->
                <div class="w-9 h-9 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    v-if="animalIconUrls[animal.id]"
                    :src="animalIconUrls[animal.id]"
                    :alt="animal.name"
                    class="w-full h-full object-cover"
                  />
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>

                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-[#1a3b22] truncate">{{ animal.name }}</p>
                  <p class="text-[10px] text-gray-400 truncate">{{ animal.raceName }}</p>
                </div>

                <!-- Przycisk odpięcia -->
                <button
                  v-if="authStore.hasRole('Manager')"
                  @click.stop="handleUnassign(selectedEnclosure.id, animal)"
                  :disabled="unassigningId === animal.id"
                  class="opacity-0 group-hover:opacity-100 transition-all w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 disabled:opacity-40 shrink-0"
                  title="Usuń z wybiegu"
                >
                  <svg v-if="unassigningId === animal.id" class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <X v-else class="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══ PANEL MANAGERA ══ -->
    <div
      v-if="authStore.hasRole('Manager')"
      class="absolute bottom-0 left-0 right-0 z-40 flex flex-col"
    >
      <!-- Pasek nagłówkowy -->
      <button
        @click="panelOpen = !panelOpen"
        class="w-full flex items-center justify-between px-6 py-3 cursor-pointer select-none transition-colors duration-200"
        :class="panelOpen ? 'bg-[#1a3b22]' : 'bg-[#1a3b22]/90 hover:bg-[#1a3b22]'"
      >
        <div class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-300" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </span>
          <span class="text-white text-sm font-bold tracking-wide">Tryb Managera</span>
          <span class="text-green-300/70 text-xs font-medium">— Przeciągnij zwierzę na wybieg</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-white/70 transition-transform duration-300"
          :class="panelOpen ? 'rotate-180' : ''"
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Panel wysuwany -->
      <Transition name="panel-slide">
        <div v-if="panelOpen" class="bg-[#0f2016]/95 backdrop-blur-md overflow-hidden" style="height: 33vh">
          <div class="h-full flex flex-col py-3 gap-2">

            <!-- Info o aktualnie przeciąganym -->
            <Transition name="fade-quick">
              <div v-if="draggingAnimal" class="shrink-0 mx-4 flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2">
                <img v-if="draggingAnimal.iconUrl" :src="draggingAnimal.iconUrl" class="w-6 h-6 object-contain rounded-full" draggable="false" />
                <div v-else class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs">?</div>
                <span class="text-green-300 text-xs font-semibold">{{ draggingAnimal.name }}</span>
                <span class="text-white/40 text-xs ml-auto">Upuść na wybieg na mapie…</span>
              </div>
              <div v-else class="shrink-0 mx-5 flex items-center gap-2">
                <span class="text-white/30 text-xs">Przeciągnij kafelek na wybieg</span>
              </div>
            </Transition>

            <!-- Kafelki zwierząt — poziomy scroll -->
            <div
              class="flex gap-3 overflow-x-auto flex-1 min-h-0 px-4 scrollbar-panel"
              style="scrollbar-gutter: stable"
              @dragover.prevent
            >
              <div
                v-if="isLoadingAnimals"
                class="flex-1 flex items-center justify-center text-white/30 text-sm"
              >
                Ładowanie zwierząt…
              </div>

              <div
                v-for="animal in panelAnimals"
                :key="animal.id"
                draggable="true"
                @dragstart="onAnimalDragStart($event, animal)"
                @dragend="onAnimalDragEnd"
                class="shrink-0 h-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing border-2 transition-all duration-200 relative overflow-hidden group select-none"
                :class="[
                  draggingAnimal?.id === animal.id
                    ? 'border-green-400 scale-105 shadow-[0_0_20px_rgba(74,222,128,0.5)]'
                    : 'border-white/10 hover:border-white/40 hover:bg-white/5',
                  draggingAnimal && draggingAnimal.id !== animal.id ? 'opacity-30' : 'opacity-100'
                ]"
                :title="animal.name"
              >
                <div class="absolute inset-0 bg-white/[0.03] group-hover:bg-white/[0.07] transition-colors rounded-2xl" />

                <!-- Ikona -->
                <div class="w-3/5 aspect-square relative z-10 flex items-center justify-center">
                  <img
                    v-if="animal.iconUrl"
                    :src="animal.iconUrl"
                    :alt="animal.name"
                    class="w-full h-full object-contain drop-shadow-lg pointer-events-none transition-transform duration-200 group-hover:scale-110"
                    draggable="false"
                  />
                  <div
                    v-else
                    class="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-white/30 text-2xl pointer-events-none"
                  >🐾</div>
                </div>

                <!-- Nazwa -->
                <span class="text-[11px] font-bold text-white/50 group-hover:text-white/80 transition-colors text-center leading-tight px-2 relative z-10 w-full truncate">
                  {{ animal.name }}
                </span>

                <!-- Zielona kropka jeśli przypisane -->
                <span
                  v-if="isAssigned(animal.id)"
                  class="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_6px_rgba(74,222,128,0.8)]"
                  title="Umieszczone na mapie"
                />
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import Map from '../components/Map.vue';
import { MapPin, X } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import enclosureService from '../services/enclosure.service';
import animalService from '../services/animal.service';
import iconService from '../services/icon.service';
import router from '../router';

const authStore = useAuthStore();

// ── Stan ─────────────────────────────────────────
const isLoading       = ref(false);
const isLoadingAnimals = ref(false);
const rawEnclosures   = ref([]); // lista z API (z .animals)
const allAnimals      = ref([]); // wszystkie zwierzęta z API
const animalIconUrls  = reactive({}); // animalId → blob URL

// ── Panel Managera ────────────────────────────────
const panelOpen      = ref(false);
const draggingAnimal = ref(null);
const hoveredEnclosureKey = ref(null);
const unassigningId  = ref(null);
let   _panelWasOpen  = false; // zapamiętuje stan panelu przed drag

// ── Modal wybranego wybiegu ───────────────────────
const selectedEnclosure = ref(null);

const navigateToAnimal = (animalId) => {
  router.push(`/animals/${animalId}`);
};

// ── Dane dla Map.vue ──────────────────────────────
/**
 * enclosureData: mapKey → { id, name, type, animals: [{ id, name, raceName, iconUrl }] }
 * Reaktywna — aktualizowana po D&D bez przeładowania strony.
 */
const enclosureData = computed(() => {
  const map = {};
  for (const enc of rawEnclosures.value) {
    if (!enc.mapKey) continue;
    map[enc.mapKey] = {
      id:      enc.id,
      name:    enc.name,
      type:    enc.type,
      animals: (enc.animals ?? []).map(a => ({
        id:       a.id,
        name:     a.name,
        raceName: a.raceName,
        iconUrl:  animalIconUrls[a.id] ?? null,
      })),
    };
  }
  return map;
});

// ── Zwierzęta w panelu managera (wszystkie, bez filtra) ──
const panelAnimals = computed(() =>
  allAnimals.value.map(a => ({
    id:      a.id,
    name:    a.name,
    raceName: a.raceName,
    iconUrl:  animalIconUrls[a.id] ?? null,
    enclosureId: a.enclosureId ?? null,
  }))
);

/** Sprawdza czy zwierzę jest już przypisane do jakiegoś wybiegu z mapKey */
const isAssigned = (animalId) => {
  return rawEnclosures.value
    .filter(e => e.mapKey)
    .some(e => (e.animals ?? []).some(a => a.id === animalId));
};

// ── Pobieranie danych ─────────────────────────────
const loadIconForAnimal = async (animal) => {
  if (!animal.iconId || animalIconUrls[animal.id]) return;
  try {
    const url = await iconService.getById(animal.iconId);
    animalIconUrls[animal.id] = url;
  } catch {
    // brak ikony — zostaje null
  }
};

const fetchEnclosures = async () => {
  try {
    const data = await enclosureService.getAll();
    rawEnclosures.value = Array.isArray(data) ? data : [data];

    // Załaduj ikony dla zwierząt w wybiegach
    for (const enc of rawEnclosures.value) {
      for (const animal of enc.animals ?? []) {
        loadIconForAnimal(animal);
      }
    }
  } catch (err) {
    console.error('[MapView] fetchEnclosures error:', err);
  }
};

const fetchAnimals = async () => {
  isLoadingAnimals.value = true;
  try {
    const data = await animalService.getAll();
    allAnimals.value = Array.isArray(data) ? data : [data];

    // Załaduj ikony dla wszystkich zwierząt
    for (const animal of allAnimals.value) {
      loadIconForAnimal(animal);
    }
  } catch (err) {
    console.error('[MapView] fetchAnimals error:', err);
  } finally {
    isLoadingAnimals.value = false;
  }
};

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([fetchEnclosures(), fetchAnimals()]);
  isLoading.value = false;
});

// ── Kliknięcie wybiegu na mapie ───────────────────
const handleSelectEnclosure = (mapKey) => {
  const enc = rawEnclosures.value.find(e => e.mapKey === mapKey);
  if (!enc) return;
  // Odśwież ikonki zwierząt wybranego wybiegu
  for (const animal of enc.animals ?? []) {
    loadIconForAnimal(animal);
  }
  selectedEnclosure.value = {
    ...enc,
    animals: (enc.animals ?? []).map(a => ({
      ...a,
      iconUrl: animalIconUrls[a.id] ?? null,
    })),
  };
};

// Synchronizuj modal gdy animalIconUrls się zaktualizuje
watch(animalIconUrls, () => {
  if (!selectedEnclosure.value) return;
  selectedEnclosure.value = {
    ...selectedEnclosure.value,
    animals: (selectedEnclosure.value.animals ?? []).map(a => ({
      ...a,
      iconUrl: animalIconUrls[a.id] ?? null,
    })),
  };
}, { deep: true });

// ── Drag & Drop ───────────────────────────────────
const onAnimalDragStart = (event, animal) => {
  draggingAnimal.value = animal;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', String(animal.id));
  // Chowaj panel żeby mapa była widoczna
  _panelWasOpen = panelOpen.value;
  panelOpen.value = false;
};

const onAnimalDragEnd = () => {
  draggingAnimal.value = null;
  hoveredEnclosureKey.value = null;
  // Przywróć stan panelu sprzed drag
  panelOpen.value = _panelWasOpen;
};

const onEnclosureDragEnter = (key) => {
  hoveredEnclosureKey.value = key;
};

const onEnclosureDragLeave = () => {
  hoveredEnclosureKey.value = null;
};

const onEnclosureDrop = async (mapKey) => {
  if (!draggingAnimal.value) return;
  const animal = draggingAnimal.value;
  draggingAnimal.value = null;
  hoveredEnclosureKey.value = null;

  // Znajdź wybieg po mapKey
  const enc = rawEnclosures.value.find(e => e.mapKey === mapKey);
  if (!enc) {
    console.warn('[MapView] Brak wybiegu dla mapKey:', mapKey);
    return;
  }

  // Sprawdź czy zwierzę już jest w tym wybiegu
  if ((enc.animals ?? []).some(a => a.id === animal.id)) return;

  try {
    await enclosureService.assignAnimal(enc.id, animal.id);
    // Odśwież dane — przeładuj wybiegi żeby dostać aktualną listę
    await fetchEnclosures();

    // Jeśli modal był otwarty na tym wybiegu — odśwież go
    if (selectedEnclosure.value?.mapKey === mapKey) {
      handleSelectEnclosure(mapKey);
    }
  } catch (err) {
    console.error('[MapView] Błąd przypisania zwierzęcia:', err);
  }
};

// ── Odpinanie zwierzęcia z wybiegu ───────────────
const handleUnassign = async (enclosureId, animal) => {
  unassigningId.value = animal.id;
  try {
    await enclosureService.unassignAnimal(enclosureId, animal.id);
    await fetchEnclosures();

    // Odśwież modal — usuń zwierzę z listy
    if (selectedEnclosure.value?.id === enclosureId) {
      selectedEnclosure.value = {
        ...selectedEnclosure.value,
        animals: (selectedEnclosure.value.animals ?? []).filter(a => a.id !== animal.id),
      };
    }
  } catch (err) {
    console.error('[MapView] Błąd odpięcia zwierzęcia:', err);
  } finally {
    unassigningId.value = null;
  }
};
</script>

<style scoped>
/* ── Karta wybiegu ── */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(30px); opacity: 0; }

/* ── Panel managera ── */
.panel-slide-enter-active { transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.panel-slide-leave-active { transition: height 0.3s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s ease; }
.panel-slide-enter-from, .panel-slide-leave-to { height: 0 !important; opacity: 0; }

/* ── Fade ── */
.fade-quick-enter-active { transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-quick-leave-active { transition: opacity 0.15s ease; }
.fade-quick-enter-from   { opacity: 0; transform: translateY(4px); }
.fade-quick-leave-to     { opacity: 0; }

/* ── Scrollbar panel managera ── */
.scrollbar-panel::-webkit-scrollbar { height: 4px; }
.scrollbar-panel::-webkit-scrollbar-track { background: transparent; }
.scrollbar-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

/* ── Scrollbar modal ── */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
</style>
