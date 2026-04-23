<template>
  <div class="flex-1 relative h-full w-full overflow-hidden bg-[#e4e4e0] flex items-center justify-center">
    <Map @selectEnclosure="handleSelect" />

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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Map from '../components/Map.vue';
import { MapPin, X, Video, Thermometer } from 'lucide-vue-next';

const selectedAnimalId = ref(null);

const handleSelect = (animalId) => {
  selectedAnimalId.value = animalId;
};

const closeModal = () => {
  selectedAnimalId.value = null;
};

const enclosuresInfo = {
  panda: { name: 'Panda Sanctuary', animal: 'Mei Lan', img: '/animal_panda.png', health: 98, status: 'Stable', temp: '22.4°C', nextCheck: '08:30 AM', sector: 'Sector 4, North Garden' },
  bear: { name: 'Bear Valley', animal: 'Grizzly Bear', img: '/map-icons/bear.png', health: 92, status: 'Stable', temp: '18.5°C', nextCheck: '10:00 AM', sector: 'Sector 2, West Woods' },
  croco: { name: 'Crocodile Swamp', animal: 'Nile Crocodile', img: '/map-icons/croco.png', health: 88, status: 'Maintenance', temp: '26.0°C', nextCheck: '11:15 AM', sector: 'Sector 5, Reptile House' },
  gazelle: { name: 'Gazelle Plains', animal: 'Thomson Gazelle', img: '/map-icons/gazelle.png', health: 100, status: 'Stable', temp: '24.2°C', nextCheck: '07:45 AM', sector: 'Sector 1, Savannah' },
  giraffe: { name: 'Giraffe Savanna', animal: 'Masai Giraffe', img: '/map-icons/giraffe.png', health: 96, status: 'Stable', temp: '25.5°C', nextCheck: '08:00 AM', sector: 'Sector 1, Savannah' },
  lion: { name: 'Lion Rock', animal: 'Simba', img: '/map-icons/lion.png', health: 99, status: 'Stable', temp: '28.0°C', nextCheck: '09:30 AM', sector: 'Sector 1, Savannah' },
  monkey: { name: 'Monkey Island', animal: 'Macaque', img: '/map-icons/monkey.png', health: 94, status: 'Stable', temp: '23.4°C', nextCheck: '10:30 AM', sector: 'Sector 3, Tropical' },
  parrot: { name: 'Parrot Aviary', animal: 'Macaw', img: '/map-icons/parrot.png', health: 97, status: 'Stable', temp: '21.0°C', nextCheck: '08:15 AM', sector: 'Sector 3, Tropical' },
  penguin: { name: 'Penguin Cove', animal: 'Emperor Penguin', img: '/map-icons/penguin.png', health: 91, status: 'Stable', temp: '4.5°C', nextCheck: '07:30 AM', sector: 'Sector 6, Polar' },
  rhino: { name: 'Rhino Reserve', animal: 'White Rhino', img: '/map-icons/rhino.png', health: 89, status: 'Stable', temp: '29.1°C', nextCheck: '11:00 AM', sector: 'Sector 1, Savannah' },
  sealion: { name: 'Sea Lion Pool', animal: 'California Sea Lion', img: '/map-icons/sealion.png', health: 93, status: 'Stable', temp: '15.2°C', nextCheck: '09:45 AM', sector: 'Sector 6, Polar' },
  snake: { name: 'Reptile House', animal: 'Python', img: '/map-icons/snake.png', health: 85, status: 'Stable', temp: '30.0°C', nextCheck: '12:00 PM', sector: 'Sector 5, Reptile House' },
  spider: { name: 'Insectarium', animal: 'Tarantula', img: '/map-icons/spider.png', health: 100, status: 'Stable', temp: '27.5°C', nextCheck: '13:00 PM', sector: 'Sector 5, Reptile House' },
  tiger: { name: 'Tiger Habitat', animal: 'Bengal Tiger', img: '/map-icons/tiger.png', health: 95, status: 'Stable', temp: '22.0°C', nextCheck: '08:45 AM', sector: 'Sector 2, West Woods' },
  zebra: { name: 'Zebra Plains', animal: 'Plains Zebra', img: '/map-icons/zebra.png', health: 98, status: 'Stable', temp: '24.0°C', nextCheck: '09:15 AM', sector: 'Sector 1, Savannah' }
};

const selectedData = computed(() => {
  return selectedAnimalId.value ? enclosuresInfo[selectedAnimalId.value] : null;
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
</style>
