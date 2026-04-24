<template>
  <div class="px-6 py-12 md:max-w-6xl md:mx-auto w-full min-h-screen">
    <div class="flex items-center gap-4 mb-10">
      <router-link to="/" class="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-[#2d6a4f] dark:text-gray-400 dark:hover:text-green-400 transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </router-link>
      <h1 class="text-3xl md:text-5xl font-extrabold text-[#1a3b22] dark:text-green-400 tracking-tight capitalize">
        Wyniki dla: {{ animalName }}
      </h1>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="i in 2" :key="i" class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-50 dark:border-gray-700/50 animate-pulse">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-6"></div>
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
        <div class="mt-8 grid grid-cols-2 gap-4">
           <div class="h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl"></div>
           <div class="h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!results || results.length === 0" class="text-center py-20 bg-white/50 dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
      <ScanSearch class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Brak wyników</h2>
      <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Niestety nie udało nam się odnaleźć zwierzęcia o podanej nazwie w naszej bazie. Spróbuj użyć innej nazwy w języku angielskim.</p>
    </div>

    <!-- Results Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div v-for="(animal, index) in results" :key="index" class="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700/60 relative overflow-hidden group">
        <!-- Decoration -->
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-[#2d6a4f]/5 dark:bg-green-400/5 rounded-full blur-3xl group-hover:bg-[#2d6a4f]/10 dark:group-hover:bg-green-400/10 transition-colors"></div>
        
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white capitalize mb-1">{{ animal.name }}</h2>
              <div v-if="animal.taxonomy?.scientific_name" class="text-sm font-medium text-[#2d6a4f] dark:text-green-400 italic">
                {{ animal.taxonomy.scientific_name }}
              </div>
            </div>
            <div class="bg-[#f0f9f4] dark:bg-green-900/30 text-[#1a3b22] dark:text-green-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <PawPrint class="w-3.5 h-3.5" />
              {{ animal.taxonomy?.class || 'Animal' }}
            </div>
          </div>

          <!-- Section: Locations -->
          <div v-if="animal.locations && animal.locations.length" class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
            <MapPin class="w-4 h-4 shrink-0 text-red-500/80" />
            <span class="font-medium text-gray-700 dark:text-gray-200">Występowanie:</span>
            <span class="truncate" :title="animal.locations.join(', ')">{{ animal.locations.join(', ') }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
             <!-- Characteristics highlights -->
             <div class="bg-gray-50 dark:bg-gray-700/20 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors">
               <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                 <Leaf class="w-4 h-4" /> Dieta
               </div>
               <p class="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2" :title="animal.characteristics?.diet">{{ animal.characteristics?.diet || 'Brak danych' }}</p>
             </div>
             
             <div class="bg-gray-50 dark:bg-gray-700/20 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors">
               <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                 <Home class="w-4 h-4" /> Środowisko
               </div>
               <p class="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2" :title="animal.characteristics?.habitat">{{ animal.characteristics?.habitat || 'Brak danych' }}</p>
             </div>

             <div class="bg-gray-50 dark:bg-gray-700/20 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors">
               <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                 <Scale class="w-4 h-4" /> Waga
               </div>
               <p class="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2" :title="animal.characteristics?.weight">{{ animal.characteristics?.weight || 'Brak danych' }}</p>
             </div>

             <div class="bg-gray-50 dark:bg-gray-700/20 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors">
               <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                 <Clock class="w-4 h-4" /> Długość życia
               </div>
               <p class="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2" :title="animal.characteristics?.lifespan">{{ animal.characteristics?.lifespan || 'Brak danych' }}</p>
             </div>
          </div>

          <!-- Extra details toggle / expanded view -->
          <div v-if="animal.characteristics?.slogan || animal.characteristics?.most_distinctive_feature" class="pt-4 border-t border-gray-100 dark:border-gray-700/80">
            <p class="text-sm text-gray-600 dark:text-gray-400 italic">
               "{{ animal.characteristics.slogan || animal.characteristics.most_distinctive_feature }}"
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { PawPrint, MapPin, Leaf, Shield, Scale, Clock, ArrowLeft, Search, ScanSearch, Home } from 'lucide-vue-next';

const route = useRoute();
const animalName = ref('');
const results = ref(null);
const loading = ref(true);

const fetchAnimalDetails = async (name) => {
  loading.value = true;
  results.value = null;
  try {
    const response = await axios.get(`https://localhost:7293/api/external-animals/${name}`);
    results.value = response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania danych o zwierzęciu:", error);
    results.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  animalName.value = route.params.animalName;
  if(animalName.value) {
    fetchAnimalDetails(animalName.value);
  }
});

// Watch for route parameter changes in case user navigates
watch(() => route.params.animalName, (newName) => {
  if (newName) {
    animalName.value = newName;
    fetchAnimalDetails(newName);
  }
});
</script>
