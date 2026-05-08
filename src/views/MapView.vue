<template>
  <div class="flex-1 relative h-full w-full overflow-hidden bg-[#e4e4e0] flex items-center justify-center">
    <Map @selectEnclosure="handleSelect" />

    <!-- Karta wybranego wybiegu -->
    <Transition name="slide-up" mode="out-in">
      <div v-if="selectedData" :key="selectedAnimalId" class="absolute bottom-8 right-8 z-30">
        <div class="bg-white rounded-[2rem] p-6 w-[360px] shadow-2xl pointer-events-auto border border-gray-100">
          <!-- Card Header -->
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

          <!-- Animal Card -->
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

          <!-- Metric Cards -->
          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-[#ced3cf] rounded-[1.25rem] p-4 relative overflow-hidden">
              <p class="text-[9px] font-bold text-[#627063] uppercase tracking-widest mb-1 z-10 relative">Last Check</p>
              <p class="text-xl font-extrabold text-[#1a3b22] z-10 relative">{{ selectedData.nextCheck }}</p>
            </div>
            <div class="bg-[#fceded] rounded-[1.25rem] p-4 relative overflow-hidden">
              <p class="text-[9px] font-bold text-[#a02121] uppercase tracking-widest mb-1 z-10 relative">Temp Control</p>
              <p class="text-xl font-extrabold text-[#a02121] z-10 relative">{{ selectedData.temp }}</p>
              <div class="absolute -right-2 -bottom-2 opacity-5">
                <Thermometer class="w-16 h-16 text-[#a02121]" />
              </div>
            </div>
          </div>

          <!-- Actions -->
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

    <!-- ══════════════════════════════════════════
         PANEL MANAGERA — widoczny tylko dla roli Manager
         ══════════════════════════════════════════ -->
    <div
      v-if="authStore.hasRole('Manager')"
      class="absolute bottom-0 left-0 right-0 z-40 flex flex-col"
    >
      <!-- Pasek nagłówkowy — zawsze widoczny -->
      <button
        @click="panelOpen = !panelOpen"
        class="manager-bar w-full flex items-center justify-between px-6 py-3 cursor-pointer select-none transition-colors duration-200"
        :class="panelOpen ? 'bg-[#1a3b22]' : 'bg-[#1a3b22]/90 hover:bg-[#1a3b22]'"
      >
        <div class="flex items-center gap-3">
          <!-- Ikona tarczy managera -->
          <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-300" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </span>
          <span class="text-white text-sm font-bold tracking-wide">Tryb Managera</span>
          <span class="text-green-300/70 text-xs font-medium">— Panel wybiegów</span>
        </div>
        <!-- Chevron -->
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
        <div
          v-if="panelOpen"
          class="enclosures-panel bg-[#0f2016]/95 backdrop-blur-md overflow-y-auto"
          style="height: 33vh"
        >
          <div class="p-5">
            <!-- Legenda -->
            <div class="flex items-center gap-6 mb-4">
              <span class="text-white/40 text-xs font-semibold uppercase tracking-widest">Wybiegi</span>
              <div class="flex items-center gap-4 ml-auto">
                <span class="flex items-center gap-1.5 text-xs text-white/50">
                  <span class="w-3 h-3 rounded-sm bg-green-500/30 border border-green-500/60 inline-block"></span>
                  Wolny
                </span>
                <span class="flex items-center gap-1.5 text-xs text-white/50">
                  <span class="w-3 h-3 rounded-sm bg-amber-500/30 border border-amber-500/60 inline-block"></span>
                  Zajęty
                </span>
              </div>
            </div>

            <!-- Siatka wybiegów -->
            <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2">
              <button
                v-for="enc in enclosures"
                :key="enc.id"
                @click="selectedEnclosureId = enc.id === selectedEnclosureId ? null : enc.id"
                :title="enc.name"
                class="enclosure-tile aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border transition-all duration-200 cursor-pointer group relative"
                :class="[
                  enc.occupied
                    ? 'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/35 hover:border-amber-400'
                    : 'bg-green-500/15 border-green-500/40 hover:bg-green-500/30 hover:border-green-400',
                  selectedEnclosureId === enc.id ? 'ring-2 ring-white/50 scale-105' : ''
                ]"
              >
                <!-- Emoji ikona -->
                <span class="text-lg leading-none">{{ enc.icon }}</span>
                <!-- Nazwa (skrócona) -->
                <span
                  class="text-[9px] font-bold leading-tight text-center px-1 max-w-full truncate"
                  :class="enc.occupied ? 'text-amber-300/80' : 'text-green-300/80'"
                >{{ enc.shortName }}</span>
                <!-- Tooltip pełna nazwa -->
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {{ enc.name }}
                </span>
              </button>
            </div>

            <!-- Wybrany wybieg — info -->
            <Transition name="fade-quick">
              <div v-if="selectedEnclosure" class="mt-4 flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <span class="text-2xl">{{ selectedEnclosure.icon }}</span>
                <div>
                  <p class="text-white font-bold text-sm">{{ selectedEnclosure.name }}</p>
                  <p class="text-white/50 text-xs">
                    <span :class="selectedEnclosure.occupied ? 'text-amber-400' : 'text-green-400'" class="font-semibold">
                      {{ selectedEnclosure.occupied ? 'Zajęty' : 'Wolny' }}
                    </span>
                    · Sektor: {{ selectedEnclosure.sector }}
                  </p>
                </div>
                <button
                  @click="selectedEnclosureId = null"
                  class="ml-auto text-white/30 hover:text-white/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Map from '../components/Map.vue';
import { MapPin, X, Video, Thermometer } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

// ── Panel managera ──────────────────────────
const panelOpen         = ref(false);
const selectedEnclosureId = ref(null);

/** Statyczna lista wybiegów — wolne/zajęte */
const enclosures = [
  { id: 1,  name: 'Panda Sanctuary',    shortName: 'Panda',    icon: '🐼', sector: 'N-4', occupied: true  },
  { id: 2,  name: 'Bear Valley',         shortName: 'Niedźwiedź', icon: '🐻', sector: 'W-2', occupied: true  },
  { id: 3,  name: 'Crocodile Swamp',    shortName: 'Krokodyl',  icon: '🐊', sector: 'R-5', occupied: true  },
  { id: 4,  name: 'Gazelle Plains',     shortName: 'Gazela',    icon: '🦌', sector: 'S-1', occupied: true  },
  { id: 5,  name: 'Giraffe Savanna',    shortName: 'Żyrafa',    icon: '🦒', sector: 'S-1', occupied: true  },
  { id: 6,  name: 'Lion Rock',          shortName: 'Lew',       icon: '🦁', sector: 'S-1', occupied: true  },
  { id: 7,  name: 'Monkey Island',      shortName: 'Małpa',     icon: '🐒', sector: 'T-3', occupied: true  },
  { id: 8,  name: 'Parrot Aviary',      shortName: 'Papuga',    icon: '🦜', sector: 'T-3', occupied: true  },
  { id: 9,  name: 'Penguin Cove',       shortName: 'Pingwin',   icon: '🐧', sector: 'P-6', occupied: true  },
  { id: 10, name: 'Rhino Reserve',      shortName: 'Nosorożec', icon: '🦏', sector: 'S-1', occupied: true  },
  { id: 11, name: 'Sea Lion Pool',      shortName: 'Uchatka',   icon: '🦭', sector: 'P-6', occupied: true  },
  { id: 12, name: 'Reptile House',      shortName: 'Wąż',       icon: '🐍', sector: 'R-5', occupied: true  },
  { id: 13, name: 'Insectarium',        shortName: 'Pająk',     icon: '🕷️', sector: 'R-5', occupied: false },
  { id: 14, name: 'Tiger Habitat',      shortName: 'Tygrys',    icon: '🐅', sector: 'W-2', occupied: true  },
  { id: 15, name: 'Zebra Plains',       shortName: 'Zebra',     icon: '🦓', sector: 'S-1', occupied: true  },
  { id: 16, name: 'Flamingo Lagoon',    shortName: 'Flaming',   icon: '🦩', sector: 'T-3', occupied: false },
  { id: 17, name: 'Elephant Ground',    shortName: 'Słoń',      icon: '🐘', sector: 'S-1', occupied: false },
  { id: 18, name: 'Wolf Forest',        shortName: 'Wilk',      icon: '🐺', sector: 'W-2', occupied: false },
  { id: 19, name: 'Owl House',          shortName: 'Sowa',      icon: '🦉', sector: 'T-3', occupied: false },
  { id: 20, name: 'Aquarium',           shortName: 'Ryba',      icon: '🐠', sector: 'P-6', occupied: false },
];

const selectedEnclosure = computed(() =>
  enclosures.find(e => e.id === selectedEnclosureId.value) ?? null
);

// ── Karta wybranego wybiegu (istniejąca logika) ──
const selectedAnimalId = ref(null);

const handleSelect = (animalId) => {
  selectedAnimalId.value = animalId;
};

const closeModal = () => {
  selectedAnimalId.value = null;
};

const enclosuresInfo = {
  panda:    { name: 'Panda Sanctuary',    animal: 'Mei Lan',               img: '/animal_panda.png',      health: 98, status: 'Stable',      temp: '22.4°C', nextCheck: '08:30 AM', sector: 'Sector 4, North Garden' },
  bear:     { name: 'Bear Valley',         animal: 'Grizzly Bear',           img: '/map-icons/bear.png',    health: 92, status: 'Stable',      temp: '18.5°C', nextCheck: '10:00 AM', sector: 'Sector 2, West Woods'   },
  croco:    { name: 'Crocodile Swamp',    animal: 'Nile Crocodile',         img: '/map-icons/croco.png',   health: 88, status: 'Maintenance', temp: '26.0°C', nextCheck: '11:15 AM', sector: 'Sector 5, Reptile House' },
  gazelle:  { name: 'Gazelle Plains',     animal: 'Thomson Gazelle',        img: '/map-icons/gazelle.png', health: 100,status: 'Stable',      temp: '24.2°C', nextCheck: '07:45 AM', sector: 'Sector 1, Savannah'     },
  giraffe:  { name: 'Giraffe Savanna',    animal: 'Masai Giraffe',          img: '/map-icons/giraffe.png', health: 96, status: 'Stable',      temp: '25.5°C', nextCheck: '08:00 AM', sector: 'Sector 1, Savannah'     },
  lion:     { name: 'Lion Rock',          animal: 'Simba',                  img: '/map-icons/lion.png',    health: 99, status: 'Stable',      temp: '28.0°C', nextCheck: '09:30 AM', sector: 'Sector 1, Sahannah'     },
  monkey:   { name: 'Monkey Island',      animal: 'Macaque',                img: '/map-icons/monkey.png',  health: 94, status: 'Stable',      temp: '23.4°C', nextCheck: '10:30 AM', sector: 'Sector 3, Tropical'     },
  parrot:   { name: 'Parrot Aviary',      animal: 'Macaw',                  img: '/map-icons/parrot.png',  health: 97, status: 'Stable',      temp: '21.0°C', nextCheck: '08:15 AM', sector: 'Sector 3, Tropical'     },
  penguin:  { name: 'Penguin Cove',       animal: 'Emperor Penguin',        img: '/map-icons/penguin.png', health: 91, status: 'Stable',      temp: '4.5°C',  nextCheck: '07:30 AM', sector: 'Sector 6, Polar'        },
  rhino:    { name: 'Rhino Reserve',      animal: 'White Rhino',            img: '/map-icons/rhino.png',   health: 89, status: 'Stable',      temp: '29.1°C', nextCheck: '11:00 AM', sector: 'Sector 1, Savannah'     },
  sealion:  { name: 'Sea Lion Pool',      animal: 'California Sea Lion',    img: '/map-icons/sealion.png', health: 93, status: 'Stable',      temp: '15.2°C', nextCheck: '09:45 AM', sector: 'Sector 6, Polar'        },
  snake:    { name: 'Reptile House',      animal: 'Python',                 img: '/map-icons/snake.png',   health: 85, status: 'Stable',      temp: '30.0°C', nextCheck: '12:00 PM', sector: 'Sector 5, Reptile House' },
  spider:   { name: 'Insectarium',        animal: 'Tarantula',              img: '/map-icons/spider.png',  health: 100,status: 'Stable',      temp: '27.5°C', nextCheck: '13:00 PM', sector: 'Sector 5, Reptile House' },
  tiger:    { name: 'Tiger Habitat',      animal: 'Bengal Tiger',           img: '/map-icons/tiger.png',   health: 95, status: 'Stable',      temp: '22.0°C', nextCheck: '08:45 AM', sector: 'Sector 2, West Woods'   },
  zebra:    { name: 'Zebra Plains',       animal: 'Plains Zebra',           img: '/map-icons/zebra.png',   health: 98, status: 'Stable',      temp: '24.0°C', nextCheck: '09:15 AM', sector: 'Sector 1, Savannah'     },
};

const selectedData = computed(() =>
  selectedAnimalId.value ? enclosuresInfo[selectedAnimalId.value] : null
);
</script>

<style scoped>
/* ── Karta wybiegu ── */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

/* ── Panel managera — wysuwa się od dołu ── */
.panel-slide-enter-active {
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.3s ease;
}
.panel-slide-leave-active {
  transition: height 0.3s cubic-bezier(0.4, 0, 1, 1),
              opacity 0.2s ease;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  height: 0 !important;
  opacity: 0;
}

/* ── Fade dla info wybranego wybiegu ── */
.fade-quick-enter-active { transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-quick-leave-active { transition: opacity 0.15s ease; }
.fade-quick-enter-from   { opacity: 0; transform: translateY(6px); }
.fade-quick-leave-to     { opacity: 0; }

/* ── Płytka wybiegu ── */
.enclosure-tile {
  min-width: 60px;
  min-height: 60px;
}

/* ── Pasek scrollbar w panelu ── */
.enclosures-panel::-webkit-scrollbar { width: 4px; }
.enclosures-panel::-webkit-scrollbar-track { background: transparent; }
.enclosures-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
</style>
