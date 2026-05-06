<template>
  <div class="min-h-full p-6 md:p-10">

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-400">
      <svg class="animate-spin h-10 w-10 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <span class="text-sm">Ładowanie danych zwierzęcia…</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
      </div>
      <p class="text-red-500 font-semibold">{{ error }}</p>
      <button @click="router.back()" class="text-sm text-[#2d6a4f] hover:underline">← Wróć</button>
    </div>

    <!-- Content -->
    <div v-else-if="animal" class="max-w-5xl mx-auto space-y-8 animate-fade-in">

      <!-- Back button -->
      <button
        @click="router.back()"
        class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#2d6a4f] dark:hover:text-green-400 transition-colors group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Wróć do listy zwierząt
      </button>

      <!-- Hero card -->
      <div class="relative bg-gradient-to-br from-[#1a3b22] to-[#2d6a4f] rounded-3xl overflow-hidden shadow-2xl">
        <div class="absolute inset-0 opacity-10"
          style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
        </div>
        <div class="relative flex flex-col md:flex-row items-start md:items-center gap-6 p-8">
          <!-- Avatar / Image -->
          <div class="shrink-0">
            <!-- <img
              :src="animal.image ?? 'https://images.unsplash.com/photo-1564756543161-1d54eb84e4f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'"
              :alt="animal.name"
              class="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-xl border-4 border-white/20"
            /> -->
          </div>
          <!-- Info -->
          <div class="flex-1 text-white">
            <div class="flex items-center gap-3 mb-1">
              <span class="bg-white/20 backdrop-blur-sm text-white text-xs font-mono px-2 py-0.5 rounded-lg">#{{ animal.id }}</span>
              <span class="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-0.5 rounded-full font-semibold">{{ animal.status ?? 'W zoo' }}</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow mb-1">{{ animal.name }}</h1>
            <p class="text-green-200 italic text-lg">{{ animal.raceName ?? animal.species ?? 'Nieznany gatunek' }}</p>
            <p v-if="animal.origin" class="text-green-100/70 text-sm mt-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              {{ animal.origin }}
            </p>
          </div>
          <!-- Date badge -->
          <div v-if="animal.dateOfArrival" class="shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center text-white">
            <p class="text-xs text-green-200 mb-1 uppercase tracking-wider font-semibold">Data przybycia</p>
            <p class="text-2xl font-bold">{{ formatDate(animal.dateOfArrival) }}</p>
          </div>
        </div>
      </div>

      <!-- Info grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Description -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Opis</h2>
          <p v-if="animal.description" class="text-gray-700 dark:text-gray-200 leading-relaxed">{{ animal.description }}</p>
          <p v-else class="text-gray-400 italic text-sm">Brak opisu.</p>
        </div>

        <!-- Details -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Szczegóły</h2>
          <dl class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Gatunek</dt>
              <dd class="text-sm font-semibold text-gray-800 dark:text-white">{{ animal.raceName ?? animal.species ?? '—' }}</dd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Pochodzenie</dt>
              <dd class="text-sm font-semibold text-gray-800 dark:text-white">{{ animal.origin ?? '—' }}</dd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Data przybycia</dt>
              <dd class="text-sm font-semibold text-gray-800 dark:text-white">{{ animal.dateOfArrival ? formatDate(animal.dateOfArrival) : '—' }}</dd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Wybieg (ID)</dt>
              <dd class="text-sm font-semibold text-gray-800 dark:text-white">{{ animal.enclosureId ?? '—' }}</dd>
            </div>
            <div class="flex justify-between items-center py-2">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Status</dt>
              <dd>
                <span class="bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-full border border-[#2d6a4f]/20">
                  {{ animal.status ?? 'W zoo' }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Attributes -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Atrybuty</h2>
        <div v-if="animal.attributes && animal.attributes.length > 0" class="flex flex-wrap gap-3">
          <div
            v-for="attr in animal.attributes"
            :key="attr.name ?? attr.attributeName"
            class="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/60 rounded-xl px-4 py-2.5 border border-gray-200 dark:border-gray-600"
          >
            <span class="text-xs text-gray-500 dark:text-gray-400 font-semibold">{{ attr.name ?? attr.attributeName }}</span>
            <span class="text-[#2d6a4f] dark:text-green-400 font-bold text-sm">{{ attr.value ?? attr.attributeValue ?? '—' }}</span>
          </div>
        </div>
        <p v-else class="text-gray-400 italic text-sm">To zwierzę nie ma przypisanych atrybutów.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import animalService from '../services/animal.service';

const route  = useRoute();
const router = useRouter();

const animal    = ref(null);
const isLoading = ref(false);
const error     = ref(null);

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' });
};

onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const data = await animalService.getById(route.params.id);
    animal.value = data;
  } catch (err) {
    console.error('[AnimalDetailsView] fetch error:', err);
    error.value = err?.response?.data?.message ?? 'Nie udało się pobrać danych zwierzęcia.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
