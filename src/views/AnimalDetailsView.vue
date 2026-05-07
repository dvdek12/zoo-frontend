<template>
  <div :class="['min-h-full p-6 md:p-10 transition-[filter] duration-300', showHealthModal ? 'blur-sm' : '']">

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

      <!-- Historia zdrowia -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-9 h-9 rounded-xl bg-[#f0f9f4] dark:bg-[#132a1e] flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2d6a4f] dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <h2 class="text-base font-bold text-gray-800 dark:text-white">Historia zdrowia</h2>
            <p class="text-xs text-gray-400 dark:text-gray-500">Wyniki badań i kontrole weterynaryjne</p>
          </div>
          <span class="ml-auto bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
            {{ history.length }} wpisów
          </span>
          <button
            type="button"
            @click="showHealthModal = true"
            class="ml-2 flex items-center gap-1.5 bg-[#2d6a4f] hover:bg-[#1a3b22] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
            </svg>
            Dodaj wpis
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoadingHistory" class="flex items-center gap-3 text-gray-400 py-6 justify-center">
          <svg class="animate-spin h-5 w-5 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="text-sm">Pobieranie historii zdrowia…</span>
        </div>

        <!-- Error -->
        <div v-else-if="historyError" class="flex items-center gap-2 text-red-500 text-sm py-4 bg-red-50 dark:bg-red-900/20 rounded-xl px-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ historyError }}
        </div>

        <!-- Pusta -->
        <div v-else-if="history.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p class="text-sm italic">Brak wpisów historii dla tego zwierzęcia.</p>
        </div>

        <!-- Oś czasu -->
        <ol v-else class="relative border-l-2 border-[#2d6a4f]/30 dark:border-green-900/40 ml-3">
          <li
            v-for="(entry, idx) in history"
            :key="entry.id ?? idx"
            class="relative pl-8 pb-8 last:pb-0 group"
          >
            <!-- Kółko na osi (wycentrowane na linii) -->
            <span class="absolute left-0 top-5 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#2d6a4f] dark:border-green-500 bg-white dark:bg-gray-800 group-hover:bg-[#2d6a4f] dark:group-hover:bg-green-500 transition-colors duration-200 z-10"></span>

            <!-- Karta -->
            <div class="health-card bg-gray-50 dark:bg-gray-700/40 rounded-2xl border border-gray-200 dark:border-gray-600 overflow-hidden group-hover:border-[#2d6a4f]/40 group-hover:shadow-md transition-all duration-200">

              <!-- Nagłówek karty: data + numer -->
              <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#f0f9f4] to-transparent dark:from-[#132a1e]/60 dark:to-transparent border-b border-gray-200 dark:border-gray-600">
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-[#2d6a4f] dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                  </svg>
                  <time class="text-sm font-bold text-[#2d6a4f] dark:text-green-400">
                    {{ entry.dateOfLastCheckup ? formatDateTime(entry.dateOfLastCheckup) : '—' }}
                  </time>
                </div>
                <span class="text-xs text-gray-400 font-mono">#{{ entry.id }}</span>
                <button
                  type="button"
                  @click="deleteHistory(entry.id)"
                  class="ml-2 p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Usuń wpis"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>

              <!-- Metryki zdrowia -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y sm:divide-y-0 divide-gray-200 dark:divide-gray-600 p-0">

                <!-- Temperatura -->
                <div class="flex flex-col items-center justify-center gap-1 py-4 px-3">
                  <span class="text-lg font-extrabold text-gray-800 dark:text-white leading-none">{{ entry.temperature ?? '—' }}<span class="text-xs font-normal text-gray-400 ml-0.5">°C</span></span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Temperatura</span>
                </div>

                <!-- Waga -->
                <div class="flex flex-col items-center justify-center gap-1 py-4 px-3">
                  <span class="text-lg font-extrabold text-gray-800 dark:text-white leading-none">{{ entry.weight ?? '—' }}<span class="text-xs font-normal text-gray-400 ml-0.5">kg</span></span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Waga</span>
                </div>

                <!-- Szczepienie -->
                <div class="flex flex-col items-center justify-center gap-1 py-4 px-3">
                  <span
                    class="text-sm font-bold leading-none"
                    :class="entry.isVaccinated ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'"
                  >{{ entry.isVaccinated ? 'Tak' : 'Nie' }}</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Szczepienie</span>
                </div>

                <!-- Stan przy przyjęciu -->
                <div class="flex flex-col items-center justify-center gap-1 py-4 px-3">
                  <span class="text-sm font-bold leading-none" :class="conditionColor(entry.conditionAdmission)">
                    {{ conditionLabel(entry.conditionAdmission) }}
                  </span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Stan zdrowia</span>
                </div>
              </div>
            </div>
          </li>
        </ol>
      </div>

      <!-- Modal: dodaj wpis zdrowotny -->
      <AddHealthRecordModal
        v-if="showHealthModal"
        :animal-id="route.params.id"
        @save="onHealthSaved"
        @close="showHealthModal = false"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import animalService from '../services/animal.service';
import AddHealthRecordModal from '../components/animals/AddHealthRecordModal.vue';

const route  = useRoute();
const router = useRouter();

const animal    = ref(null);
const isLoading = ref(false);
const error     = ref(null);

// --- HISTORIA ---
const history          = ref([]);
const isLoadingHistory = ref(false);
const historyError     = ref(null);
// --- MODAL HISTORII ---
const showHealthModal = ref(false);

const onHealthSaved = async () => {
  showHealthModal.value = false;
  await fetchHistory(route.params.id);
};


const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' });
};

const formatDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' })
    + ', ' + d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
};

// conditionAdmission: 0 = Dobry, 1 = Przeciętny, 2 = Zły
const conditionLabel = (v) => {
  if (v === 0) return 'Dobry';
  if (v === 1) return 'Przeciętny';
  if (v === 2) return 'Zły';
  return '—';
};
const conditionColor = (v) => {
  if (v === 0) return 'text-green-500 dark:text-green-400';
  if (v === 1) return 'text-yellow-500 dark:text-yellow-400';
  return 'text-red-500 dark:text-red-400';
};
const conditionBg = (v) => {
  if (v === 0) return 'bg-green-100 dark:bg-green-900/30';
  if (v === 1) return 'bg-yellow-100 dark:bg-yellow-900/30';
  return 'bg-red-100 dark:bg-red-900/30';
};

const deleteHistory = async (historyId) => {
  if (!confirm('Czy na pewno chcesz usunąć ten wpis historii zdrowia?')) return;
  try {
    await animalService.deleteHistory(historyId);
    history.value = history.value.filter(e => e.id !== historyId);
  } catch (err) {
    console.error('[AnimalDetailsView] deleteHistory error:', err);
    alert('Nie udało się usunąć wpisu. Sprawdź połączenie z API.');
  }
};

const fetchHistory = async (id) => {
  isLoadingHistory.value = true;
  historyError.value = null;
  try {
    const data = await animalService.getHistory(id);
    console.log(data)
    history.value = Array.isArray(data) ? data : (data ? [data] : []);
  } catch (err) {
    console.error('[AnimalDetailsView] fetchHistory error:', err);
    historyError.value = err?.response?.data?.message ?? 'Nie udało się pobrać historii zwierzęcia.';
  } finally {
    isLoadingHistory.value = false;
  }
};

onMounted(async () => {
  const id = route.params.id;
  isLoading.value = true;
  error.value = null;
  try {
    const data = await animalService.getById(id);
    animal.value = data;
  } catch (err) {
    console.error('[AnimalDetailsView] fetch error:', err);
    error.value = err?.response?.data?.message ?? 'Nie udało się pobrać danych zwierzęcia.';
  } finally {
    isLoading.value = false;
  }

  // Pobieramy historię niezależnie od wyniku głównego zapytania
  fetchHistory(id);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.health-card {
  animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
