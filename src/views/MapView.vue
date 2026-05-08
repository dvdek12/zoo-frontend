<template>
  <div class="flex-1 relative h-full w-full overflow-hidden bg-[#e4e4e0] flex items-center justify-center">
    <Map
      :highlighted-enclosure="hoveredEnclosureKey"
      :animal-assignments="animalAssignments"
      @select-enclosure="handleSelect"
      @enclosure-drag-enter="onEnclosureDragEnter"
      @enclosure-drag-leave="onEnclosureDragLeave"
      @enclosure-drop="onEnclosureDrop"
    />

    <!-- Karta wybranego wybiegu -->
    <Transition name="slide-up" mode="out-in">
      <div v-if="selectedData" :key="selectedAnimalId" class="absolute bottom-8 right-8 z-30">
        <div class="bg-white rounded-[2rem] p-6 w-[360px] shadow-2xl pointer-events-auto border border-gray-100">
          <div class="flex items-start justify-between mb-4 mt-2">
            <div>
              <h3 class="text-[22px] font-extrabold text-[#1a3b22] tracking-tight">{{ selectedData.name }}</h3>
              <p class="text-[11px] text-gray-500 font-bold tracking-wide flex items-center gap-1.5 mt-1.5 uppercase">
                <MapPin class="w-3 h-3" /> {{ selectedData.sector }}
              </p>
            </div>
            <button @click="closeModal" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600">
              <X class="w-4 h-4" />
            </button>
          </div>
          <div class="bg-[#f4f3ea] rounded-[1.5rem] p-4 flex items-center gap-4 mb-5">
            <img :src="selectedData.img" :alt="selectedData.animal" class="w-14 h-14 rounded-full object-cover shadow-sm bg-white" />
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1.5">
                <h4 class="font-extrabold text-[#1a3b22] text-[15px]">{{ selectedData.animal }}</h4>
                <span class="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      :class="selectedData.status === 'Stable' ? 'text-[#55695b] bg-[#e1e2da]' : 'text-[#a02121] bg-[#fceded]'">
                  {{ selectedData.status }}
                </span>
              </div>
              <div class="h-1.5 w-full bg-[#d6d8d1] rounded-full overflow-hidden mb-1">
                <div class="h-full rounded-full"
                     :class="selectedData.health > 90 ? 'bg-[#1a3b22]' : 'bg-[#ba2a2a]'"
                     :style="{ width: selectedData.health + '%' }"></div>
              </div>
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{{ selectedData.health }}% Health Index</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-[#ced3cf] rounded-[1.25rem] p-4">
              <p class="text-[9px] font-bold text-[#627063] uppercase tracking-widest mb-1">Last Check</p>
              <p class="text-xl font-extrabold text-[#1a3b22]">{{ selectedData.nextCheck }}</p>
            </div>
            <div class="bg-[#fceded] rounded-[1.25rem] p-4 relative overflow-hidden">
              <p class="text-[9px] font-bold text-[#a02121] uppercase tracking-widest mb-1">Temp Control</p>
              <p class="text-xl font-extrabold text-[#a02121]">{{ selectedData.temp }}</p>
              <div class="absolute -right-2 -bottom-2 opacity-5">
                <Thermometer class="w-16 h-16 text-[#a02121]" />
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="flex-1 bg-[#1a3b22] hover:bg-[#112a17] text-white py-4 rounded-full text-xs font-bold transition-colors">
              View Medical Records
            </button>
            <button class="w-12 h-12 bg-[#e8e7de] hover:bg-[#d8d7cd] text-[#425043] rounded-full flex items-center justify-center transition-colors">
              <Video class="w-5 h-5" />
            </button>
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
        <svg xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-white/70 transition-transform duration-300"
          :class="panelOpen ? 'rotate-180' : ''"
          viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Panel wysuwany -->
      <Transition name="panel-slide">
        <div v-if="panelOpen" class="bg-[#0f2016]/95 backdrop-blur-md overflow-hidden" style="height: 33vh">
          <div class="h-full flex flex-col py-3 gap-2">

            <!-- Info o aktualnie przeciąganym (góra) -->
            <Transition name="fade-quick">
              <div v-if="draggingAnimal" class="shrink-0 mx-4 flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2">
                <img :src="draggingAnimal.img" class="w-6 h-6 object-contain" draggable="false" />
                <span class="text-green-300 text-xs font-semibold">{{ draggingAnimal.name }}</span>
                <span class="text-white/40 text-xs ml-auto">Upuść na wybieg na mapie…</span>
              </div>
              <div v-else class="shrink-0 mx-5 flex items-center gap-2">
                <span class="text-white/30 text-xs">Przeciągnij kafelek na wybieg</span>
              </div>
            </Transition>

            <!-- Kafelki — pełna wysokość, poziomy scroll -->
            <div
              class="flex gap-3 overflow-x-auto flex-1 min-h-0 px-4 scrollbar-panel"
              style="scrollbar-gutter: stable"
              @dragover.prevent
            >
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
                <div class="absolute inset-0 bg-white/[0.03] group-hover:bg-white/[0.07] transition-colors rounded-2xl"></div>

                <!-- Zdjęcie — duże, na środku -->
                <img
                  :src="animal.img"
                  :alt="animal.name"
                  class="w-3/5 aspect-square object-contain drop-shadow-lg relative z-10 pointer-events-none transition-transform duration-200 group-hover:scale-110"
                  draggable="false"
                />

                <!-- Nazwa -->
                <span class="text-[11px] font-bold text-white/50 group-hover:text-white/80 transition-colors text-center leading-tight px-2 relative z-10 w-full truncate text-center">
                  {{ animal.shortName }}
                </span>

                <!-- Zielona kropka jeśli na mapie -->
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
import { ref, reactive, computed } from 'vue';
import Map from '../components/Map.vue';
import { MapPin, X, Video, Thermometer } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

// ── Panel managera ───────────────────────────
const panelOpen       = ref(false);
const draggingAnimal  = ref(null);
const hoveredEnclosureKey = ref(null);

/**
 * Przypisania: enclosureKey → { id, name, img }
 * Domyślnie puste — ikony na mapie pokazują defaulty z Map.vue
 */
const animalAssignments = reactive({});

/** Lista kafelków zwierząt w panelu */
const panelAnimals = [
  { id: 'panda',   name: 'Mei Lan',          shortName: 'Panda',     img: '/animal_panda.png'      },
  { id: 'bear',    name: 'Grizzly Bear',      shortName: 'Niedźwiedź',img: '/map-icons/bear.png'    },
  { id: 'croco',   name: 'Nile Crocodile',    shortName: 'Krokodyl',  img: '/map-icons/croco.png'   },
  { id: 'gazelle', name: 'Thomson Gazelle',   shortName: 'Gazela',    img: '/map-icons/gazelle.png' },
  { id: 'giraffe', name: 'Masai Giraffe',     shortName: 'Żyrafa',    img: '/map-icons/giraffe.png' },
  { id: 'lion',    name: 'Simba',             shortName: 'Lew',       img: '/map-icons/lion.png'    },
  { id: 'monkey',  name: 'Macaque',           shortName: 'Małpa',     img: '/map-icons/monkey.png'  },
  { id: 'parrot',  name: 'Macaw',             shortName: 'Papuga',    img: '/map-icons/parrot.png'  },
  { id: 'penguin', name: 'Emperor Penguin',   shortName: 'Pingwin',   img: '/map-icons/penguin.png' },
  { id: 'rhino',   name: 'White Rhino',       shortName: 'Nosorożec', img: '/map-icons/rhino.png'   },
  { id: 'sealion', name: 'California Sea Lion',shortName: 'Uchatka',  img: '/map-icons/sealion.png' },
  { id: 'snake',   name: 'Python',            shortName: 'Wąż',       img: '/map-icons/snake.png'   },
  { id: 'spider',  name: 'Tarantula',         shortName: 'Pająk',     img: '/map-icons/spider.png'  },
  { id: 'tiger',   name: 'Bengal Tiger',      shortName: 'Tygrys',    img: '/map-icons/tiger.png'   },
  { id: 'zebra',   name: 'Plains Zebra',      shortName: 'Zebra',     img: '/map-icons/zebra.png'   },
];

/** Sprawdza czy dane zwierzę jest już przypisane do jakiegoś wybiegu */
const isAssigned = (animalId) =>
  Object.values(animalAssignments).some(a => a?.id === animalId);

// ── Handlery Drag & Drop ─────────────────────

const onAnimalDragStart = (event, animal) => {
  draggingAnimal.value = animal;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', animal.id);
};

const onAnimalDragEnd = () => {
  draggingAnimal.value   = null;
  hoveredEnclosureKey.value = null;
};

const onEnclosureDragEnter = (key) => {
  hoveredEnclosureKey.value = key;
};

const onEnclosureDragLeave = () => {
  hoveredEnclosureKey.value = null;
};

/**
 * Upuszczenie zwierzęcia na wybieg.
 * TODO: zastąp setTimeout prawdziwym wywołaniem API gdy backend będzie gotowy.
 *   await animalService.assignToEnclosure(enclosureKey, draggingAnimal.value.id)
 */
const onEnclosureDrop = async (enclosureKey) => {
  if (!draggingAnimal.value) return;
  const animal = draggingAnimal.value;

  draggingAnimal.value      = null;
  hoveredEnclosureKey.value = null;

  // Symulacja wywołania API (hardcode — backend TODO)
  console.log(`[API TODO] PUT /enclosure/${enclosureKey}/animal/${animal.id}`);
  await new Promise(r => setTimeout(r, 150)); // fake latency

  animalAssignments[enclosureKey] = { id: animal.id, img: animal.img };
};

// ── Karta wybranego wybiegu (istniejąca logika) ──
const selectedAnimalId = ref(null);

const handleSelect = (animalId) => { selectedAnimalId.value = animalId; };
const closeModal = () => { selectedAnimalId.value = null; };

const enclosuresInfo = {
  panda:   { name: 'Panda Sanctuary',     animal: 'Mei Lan',              img: '/animal_panda.png',      health: 98,  status: 'Stable',      temp: '22.4°C', nextCheck: '08:30 AM', sector: 'Sector 4, North Garden'  },
  bear:    { name: 'Bear Valley',          animal: 'Grizzly Bear',         img: '/map-icons/bear.png',    health: 92,  status: 'Stable',      temp: '18.5°C', nextCheck: '10:00 AM', sector: 'Sector 2, West Woods'    },
  croco:   { name: 'Crocodile Swamp',     animal: 'Nile Crocodile',       img: '/map-icons/croco.png',   health: 88,  status: 'Maintenance', temp: '26.0°C', nextCheck: '11:15 AM', sector: 'Sector 5, Reptile House'  },
  gazelle: { name: 'Gazelle Plains',      animal: 'Thomson Gazelle',      img: '/map-icons/gazelle.png', health: 100, status: 'Stable',      temp: '24.2°C', nextCheck: '07:45 AM', sector: 'Sector 1, Savannah'      },
  giraffe: { name: 'Giraffe Savanna',     animal: 'Masai Giraffe',        img: '/map-icons/giraffe.png', health: 96,  status: 'Stable',      temp: '25.5°C', nextCheck: '08:00 AM', sector: 'Sector 1, Savannah'      },
  lion:    { name: 'Lion Rock',           animal: 'Simba',                img: '/map-icons/lion.png',    health: 99,  status: 'Stable',      temp: '28.0°C', nextCheck: '09:30 AM', sector: 'Sector 1, Savannah'      },
  monkey:  { name: 'Monkey Island',       animal: 'Macaque',              img: '/map-icons/monkey.png',  health: 94,  status: 'Stable',      temp: '23.4°C', nextCheck: '10:30 AM', sector: 'Sector 3, Tropical'      },
  parrot:  { name: 'Parrot Aviary',       animal: 'Macaw',                img: '/map-icons/parrot.png',  health: 97,  status: 'Stable',      temp: '21.0°C', nextCheck: '08:15 AM', sector: 'Sector 3, Tropical'      },
  penguin: { name: 'Penguin Cove',        animal: 'Emperor Penguin',      img: '/map-icons/penguin.png', health: 91,  status: 'Stable',      temp: '4.5°C',  nextCheck: '07:30 AM', sector: 'Sector 6, Polar'         },
  rhino:   { name: 'Rhino Reserve',       animal: 'White Rhino',          img: '/map-icons/rhino.png',   health: 89,  status: 'Stable',      temp: '29.1°C', nextCheck: '11:00 AM', sector: 'Sector 1, Savannah'      },
  sealion: { name: 'Sea Lion Pool',       animal: 'California Sea Lion',  img: '/map-icons/sealion.png', health: 93,  status: 'Stable',      temp: '15.2°C', nextCheck: '09:45 AM', sector: 'Sector 6, Polar'         },
  snake:   { name: 'Reptile House',       animal: 'Python',               img: '/map-icons/snake.png',   health: 85,  status: 'Stable',      temp: '30.0°C', nextCheck: '12:00 PM', sector: 'Sector 5, Reptile House'  },
  spider:  { name: 'Insectarium',         animal: 'Tarantula',            img: '/map-icons/spider.png',  health: 100, status: 'Stable',      temp: '27.5°C', nextCheck: '13:00 PM', sector: 'Sector 5, Reptile House'  },
  tiger:   { name: 'Tiger Habitat',       animal: 'Bengal Tiger',         img: '/map-icons/tiger.png',   health: 95,  status: 'Stable',      temp: '22.0°C', nextCheck: '08:45 AM', sector: 'Sector 2, West Woods'    },
  zebra:   { name: 'Zebra Plains',        animal: 'Plains Zebra',         img: '/map-icons/zebra.png',   health: 98,  status: 'Stable',      temp: '24.0°C', nextCheck: '09:15 AM', sector: 'Sector 1, Savannah'      },
};

const selectedData = computed(() =>
  selectedAnimalId.value ? enclosuresInfo[selectedAnimalId.value] : null
);
</script>

<style scoped>
/* ── Karta wybiegu ── */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(30px); opacity: 0; }

/* ── Panel managera ── */
.panel-slide-enter-active { transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.panel-slide-leave-active { transition: height 0.3s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s ease; }
.panel-slide-enter-from, .panel-slide-leave-to { height: 0 !important; opacity: 0; }

/* ── Fade info D&D ── */
.fade-quick-enter-active { transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-quick-leave-active { transition: opacity 0.15s ease; }
.fade-quick-enter-from   { opacity: 0; transform: translateY(4px); }
.fade-quick-leave-to     { opacity: 0; }

/* ── Scrollbar w panelu ── */
.scrollbar-panel::-webkit-scrollbar { height: 4px; }
.scrollbar-panel::-webkit-scrollbar-track { background: transparent; }
.scrollbar-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
</style>
