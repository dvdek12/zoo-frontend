<template>
  <div class="p-8 h-full flex flex-col gap-6 overflow-hidden">
    <!-- Wyszukiwarka -->
    <div class="shrink-0 relative w-full mb-2">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Wyszukaj zwierzę (po nazwie, gatunku, atrybutach) lub atrybut..." 
        class="block w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] shadow-sm transition-colors text-base"
      >
    </div>

    <!-- Zwierzęta Sekcja (3/4) -->
    <section class="flex-[3] flex flex-col min-h-0">
      <div class="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h2 class="text-3xl font-bold text-[#1a3b22] dark:text-green-400 tracking-tight">Zwierzęta w zoo</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Zarządzaj listą zwierząt przebywających obecnie na terenie obiektu.</p>
        </div>
        <button 
          @click="showAnimalModal = true"
          class="bg-[#2d6a4f] hover:bg-[#1a3b22] text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Dodaj zwierzę
        </button>
      </div>

      <!-- Tabela Zwierząt z przewijaniem -->
      <div class="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-0">
        <div class="flex-1 overflow-auto custom-scrollbar">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 bg-gray-50 dark:bg-gray-900/95 backdrop-blur-sm z-10 shadow-sm border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300 w-16">Foto</th>
                <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Nazwa</th>
                <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Gatunek</th>
                <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">Atrybuty</th>
                <th class="py-3 px-6 font-semibold text-gray-700 dark:text-gray-300 text-right w-24">Akcje</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="animal in filteredAnimals" :key="animal.id" class="hover:bg-[#f0f9f4] dark:hover:bg-[#132a1e] transition-all duration-200 group cursor-pointer hover:shadow-[inset_4px_0_0_0_#2d6a4f] dark:hover:shadow-[inset_4px_0_0_0_#4ade80]">
                <td class="py-3 px-6">
                  <div class="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                    <img :src="animal.image" :alt="animal.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </td>
                <td class="py-3 px-6">
                  <span class="font-bold text-gray-900 dark:text-white text-lg">{{ animal.name }}</span>
                </td>
                <td class="py-3 px-6">
                  <span class="text-gray-500 dark:text-gray-400 italic text-sm">{{ animal.species }}</span>
                </td>
                <td class="py-3 px-6">
                  <span class="bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-full border border-[#2d6a4f]/20 shadow-sm">
                    {{ animal.status }}
                  </span>
                </td>
                <td class="py-3 px-6">
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="attr in animal.attributes" :key="attr.name" class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded border border-gray-200 dark:border-gray-600">
                      <span class="font-semibold">{{ attr.name }}:</span> {{ attr.value }}
                    </span>
                    <span v-if="animal.attributes.length === 0" class="text-xs text-gray-400">Brak atrybutów</span>
                  </div>
                </td>
                <td class="py-3 px-6 text-right">
                  <button class="text-gray-400 hover:text-red-500 transition-colors p-2" title="Usuń">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredAnimals.length === 0">
                <td colspan="6" class="py-8 text-center text-gray-500">Brak zwierząt pasujących do wyszukiwania.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Atrybuty Sekcja (1/4) -->
    <section class="flex-[1] flex flex-col min-h-0">
      <div class="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h2 class="text-2xl font-bold text-[#1a3b22] dark:text-green-400 tracking-tight">Atrybuty zwierząt</h2>
        </div>
        <button 
          @click="showAttrModal = true"
          class="bg-white dark:bg-gray-800 text-[#2d6a4f] dark:text-green-400 border border-[#2d6a4f] dark:border-green-400 hover:bg-[#2d6a4f] hover:text-white dark:hover:bg-green-400 dark:hover:text-gray-900 font-semibold py-1.5 px-4 rounded-xl transition-all duration-300 shadow-sm text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Dodaj
        </button>
      </div>

      <!-- Tabela Atrybutów z przewijaniem -->
      <div class="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-0">
        <div class="flex-1 overflow-auto custom-scrollbar">
          <table class="w-full text-left border-collapse text-sm">
            <thead class="sticky top-0 bg-gray-50 dark:bg-gray-900/95 backdrop-blur-sm z-10 shadow-sm border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th class="py-2.5 px-6 font-semibold text-gray-700 dark:text-gray-300">Nazwa atrybutu</th>
                <th class="py-2.5 px-6 font-semibold text-gray-700 dark:text-gray-300">Typ danych</th>
                <th class="py-2.5 px-6 font-semibold text-gray-700 dark:text-gray-300 text-right w-24">Akcje</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="attr in filteredAttributes" :key="attr.id" class="hover:bg-[#f0f9f4] dark:hover:bg-[#132a1e] transition-all duration-200 cursor-pointer hover:shadow-[inset_4px_0_0_0_#2d6a4f] dark:hover:shadow-[inset_4px_0_0_0_#4ade80]">
                <td class="py-2 px-6">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-md bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 flex items-center justify-center font-bold text-xs">
                      {{ attr.name.charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ attr.name }}</span>
                  </div>
                </td>
                <td class="py-2 px-6 text-gray-500 dark:text-gray-400">
                  <span class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                    {{ attr.type }}
                  </span>
                </td>
                <td class="py-2 px-6 text-right">
                  <button class="text-gray-400 hover:text-red-500 transition-colors p-1" title="Usuń">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredAttributes.length === 0">
                <td colspan="3" class="py-4 text-center text-gray-500">Brak atrybutów pasujących do wyszukiwania.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Modal: Dodaj Zwierzę -->
    <div v-if="showAnimalModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Dodaj nowe zwierzę</h3>
          <button @click="closeAnimalModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nazwa</label>
            <input v-model="newAnimal.name" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all" placeholder="np. Lew" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gatunek łaciński</label>
            <input v-model="newAnimal.species" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all" placeholder="np. Panthera leo" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL zdjęcia (zostaw puste dla domyślnego)</label>
            <input v-model="newAnimal.image" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all" placeholder="https://..." />
          </div>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
          <button @click="closeAnimalModal" class="px-5 py-2 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Anuluj
          </button>
          <button @click="addAnimal" class="bg-[#2d6a4f] hover:bg-[#1a3b22] text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-sm">
            Zapisz zwierzę
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Dodaj Atrybut -->
    <div v-if="showAttrModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Dodaj atrybut</h3>
          <button @click="closeAttrModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nazwa atrybutu</label>
            <input v-model="newAttribute.name" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all" placeholder="np. Czy lata" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Typ danych</label>
            <select v-model="newAttribute.type" class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all appearance-none">
              <option value="Boolean (Tak/Nie)">Boolean (Tak/Nie)</option>
              <option value="Tekst">Tekst</option>
              <option value="Liczba">Liczba</option>
              <option value="Wybór z listy">Wybór z listy</option>
            </select>
          </div>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
          <button @click="closeAttrModal" class="px-5 py-2 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Anuluj
          </button>
          <button @click="addAttribute" class="bg-[#2d6a4f] hover:bg-[#1a3b22] text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-sm">
            Zapisz atrybut
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// --- STAN MODALI ---
const showAnimalModal = ref(false);
const showAttrModal = ref(false);

const searchQuery = ref('');

const closeAnimalModal = () => {
  showAnimalModal.value = false;
  newAnimal.value = { name: '', species: '', image: '' };
};

const closeAttrModal = () => {
  showAttrModal.value = false;
  newAttribute.value = { name: '', type: 'Boolean (Tak/Nie)' };
};

// --- DANE: ZWIERZĘTA ---
const animals = ref([
  { 
    id: 1, 
    name: 'Lew', 
    species: 'Panthera leo', 
    image: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    status: 'W zoo',
    attributes: [
      { name: 'Dieta', value: 'Mięsożerne' },
      { name: 'Czy lata', value: 'Nie' }
    ]
  },
  { 
    id: 2, 
    name: 'Słoń afrykański', 
    species: 'Loxodonta africana', 
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    status: 'W zoo',
    attributes: [
      { name: 'Dieta', value: 'Roślinożerne' },
      { name: 'Czy pływa', value: 'Tak' }
    ]
  },
  { 
    id: 3, 
    name: 'Pingwin przylądkowy', 
    species: 'Spheniscus demersus', 
    image: 'https://images.unsplash.com/photo-1551415923-31d2072bc248?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    status: 'Kwarantanna',
    attributes: [
      { name: 'Dieta', value: 'Rybożerne' },
      { name: 'Czy lata', value: 'Nie' },
      { name: 'Czy pływa', value: 'Tak' }
    ]
  },
  { 
    id: 4, 
    name: 'Żyrafa', 
    species: 'Giraffa camelopardalis', 
    image: 'https://images.unsplash.com/photo-1547471080-7fc2caa62636?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    status: 'W zoo',
    attributes: [
      { name: 'Dieta', value: 'Roślinożerne' }
    ]
  },
  { 
    id: 5, 
    name: 'Tygrys syberyjski', 
    species: 'Panthera tigris tigris', 
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    status: 'W zoo',
    attributes: [
      { name: 'Dieta', value: 'Mięsożerne' },
      { name: 'Czy pływa', value: 'Tak' }
    ]
  },
  { 
    id: 6, 
    name: 'Goryl zachodni', 
    species: 'Gorilla gorilla', 
    image: 'https://images.unsplash.com/photo-1580975618491-b3b3a0e6b5c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    status: 'W zoo',
    attributes: [
      { name: 'Dieta', value: 'Roślinożerne' }
    ]
  },
  { 
    id: 7, 
    name: 'Panda wielka', 
    species: 'Ailuropoda melanoleuca', 
    image: 'https://images.unsplash.com/photo-1564349683136-5efa1ca04007?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    status: 'Leczenie',
    attributes: [
      { name: 'Dieta', value: 'Roślinożerne' }
    ]
  },
]);

const newAnimal = ref({
  name: '',
  species: '',
  image: ''
});

const addAnimal = () => {
  if (!newAnimal.value.name) return;
  animals.value.push({
    id: Date.now(),
    name: newAnimal.value.name,
    species: newAnimal.value.species || 'Nieznany',
    image: newAnimal.value.image || 'https://images.unsplash.com/photo-1564756543161-1d54eb84e4f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Domyślny obrazek
    status: 'W zoo',
    attributes: []
  });
  closeAnimalModal();
};

// --- DANE: ATRYBUTY ---
const attributes = ref([
  { id: 1, name: 'Czy lata', type: 'Boolean (Tak/Nie)' },
  { id: 2, name: 'Czy pływa', type: 'Boolean (Tak/Nie)' },
  { id: 3, name: 'Dieta', type: 'Wybór z listy' },
  { id: 4, name: 'Waga dorosłego osobnika', type: 'Liczba' },
]);

const newAttribute = ref({
  name: '',
  type: 'Boolean (Tak/Nie)'
});

const addAttribute = () => {
  if (!newAttribute.value.name) return;
  attributes.value.push({
    id: Date.now(),
    name: newAttribute.value.name,
    type: newAttribute.value.type
  });
  closeAttrModal();
};

// --- WYSZUKIWANIE ---
const filteredAnimals = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return animals.value;
  return animals.value.filter(animal => 
    animal.name.toLowerCase().includes(query) ||
    animal.species.toLowerCase().includes(query) ||
    animal.status.toLowerCase().includes(query) ||
    animal.attributes.some(attr => 
      attr.name.toLowerCase().includes(query) || 
      attr.value.toLowerCase().includes(query)
    )
  );
});

const filteredAttributes = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return attributes.value;
  return attributes.value.filter(attr => 
    attr.name.toLowerCase().includes(query) ||
    attr.type.toLowerCase().includes(query)
  );
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Własny scrollbar wewnątrz tabel */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #374151;
}
.dark .custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
</style>