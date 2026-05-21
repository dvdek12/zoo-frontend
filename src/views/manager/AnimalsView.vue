<template>
  <div class="p-8 h-full min-h-full flex flex-col gap-6 overflow-hidden">
    <PageHeader title="Zwierzęta" subtitle="Zarządzaj listą zwierząt przebywających na terenie obiektu." />

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
      <!-- Loading state -->
      <div v-if="isLoadingAnimals" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-gray-400">
          <svg class="animate-spin h-8 w-8 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="text-sm">Pobieranie zwierząt…</span>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="loadError" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-center">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          </div>
          <p class="text-sm text-red-500">{{ loadError }}</p>
          <button @click="fetchAnimals" class="text-sm text-[#2d6a4f] hover:underline">Spróbuj ponownie</button>
        </div>
      </div>

      <!-- Table -->
      <AnimalTable v-else :animals="filteredAnimals" :query="searchQuery" @delete="deleteAnimal" @row-click="goToAnimal" />
    </section>

    <!-- Atrybuty Sekcja (1/4) -->
    <section class="flex-[1] flex flex-col min-h-0">
      <div class="flex justify-between items-center mb-4 shrink-0">
        <h2 class="text-2xl font-bold text-[#1a3b22] dark:text-green-400 tracking-tight">Atrybuty zwierząt</h2>
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
      <AttributeTable :attributes="filteredAttributes" @delete="deleteAttribute" />
    </section>

    <!-- Modals -->
    <AddAnimalModal
      v-if="showAnimalModal"
      :enclosures="enclosures"
      @save="onAnimalSaved"
      @close="showAnimalModal = false"
    />

    <AddAttributeModal
      v-if="showAttrModal"
      @save="onAttributeSaved"
      @close="showAttrModal = false"
    />

    <!-- Dialog potwierdzenia usunięcia -->
    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="Usuń zwierzę"
      :message="`Czy na pewno chcesz usunąć ${pendingDeleteAnimal?.name ?? 'to zwierzę'}? Tej operacji nie można cofnąć.`"
      confirm-label="Usuń"
      cancel-label="Anuluj"
      :loading="isDeletingAnimal"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Dialog błędu usunięcia -->
    <ConfirmDialog
      v-model="showDeleteError"
      title="Błąd usuwania"
      :message="deleteError ?? 'Nie udało się usunąć zwierzęcia.'"
      confirm-label="OK"
      cancel-label=""
      @confirm="showDeleteError = false"
      @cancel="showDeleteError = false"
    />

    <!-- Dialog potwierdzenia usunięcia atrybutu -->
    <ConfirmDialog
      v-model="showAttrDeleteConfirm"
      title="Usuń atrybut"
      :message="`Czy na pewno chcesz usunąć atrybut ${pendingDeleteAttribute?.name ?? ''}? Tej operacji nie można cofnąć.`"
      confirm-label="Usuń"
      cancel-label="Anuluj"
      :loading="isDeletingAttribute"
      @confirm="confirmAttrDelete"
      @cancel="cancelAttrDelete"
    />

    <!-- Dialog błędu usunięcia atrybutu -->
    <ConfirmDialog
      v-model="showAttrDeleteError"
      title="Błąd usuwania"
      :message="attrDeleteError ?? 'Nie udało się usunąć atrybutu.'"
      confirm-label="OK"
      cancel-label=""
      @confirm="showAttrDeleteError = false"
      @cancel="showAttrDeleteError = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader       from '../../components/PageHeader.vue';
import AnimalTable      from '../../components/animals/AnimalTable.vue';
import AttributeTable   from '../../components/animals/AttributeTable.vue';
import AddAnimalModal   from '../../components/animals/AddAnimalModal.vue';
import AddAttributeModal from '../../components/animals/AddAttributeModal.vue';
import ConfirmDialog    from '../../components/ConfirmDialog.vue';
import animalService    from '../../services/animal.service';

const router = useRouter();

// --- MODALS ---
const showAnimalModal = ref(false);
const showAttrModal   = ref(false);

// --- NAWIGACJA ---
const goToAnimal = (id) => router.push({ name: 'animalDetail', params: { id } });

// --- SEARCH ---
const searchQuery = ref('');

// --- WYBIEGI ---
const enclosures = ref([
  { id: 1, name: 'Savanna',     icon: '🦁' },
  { id: 2, name: 'Aquarium',    icon: '🐟' },
  { id: 3, name: 'Jungle',      icon: '🌿' },
  { id: 4, name: 'Arctic',      icon: '🧊' },
  { id: 5, name: 'Aviary',      icon: '🦜' },
  { id: 6, name: 'Reptile',     icon: '🦎' },
  { id: 7, name: 'Nocturnal',   icon: '🦇' },
  { id: 8, name: 'Petting Zoo', icon: '🐑' },
]);

// --- ZWIERZĘTA ---
const animals           = ref([]);
const isLoadingAnimals  = ref(false);
const loadError         = ref(null);

/**
 * Mapuje obiekt zwrocony przez backend na format uzywany w tabeli.
 * Dostosuj pola jesli backend zwroci inna strukture.
 */
const mapAnimal = (a) => ({
  id:         a.id,
  iconId:     a.iconId     ?? null,
  name:       a.name        ?? '',
  species:    a.raceName    ?? a.species ?? 'Nieznany',
  image:      a.image       ?? 'https://images.unsplash.com/photo-1564756543161-1d54eb84e4f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  status:     a.status      ?? 'W zoo',
  attributes: a.attributes  ?? [],
});

const fetchAnimals = async () => {
  isLoadingAnimals.value = true;
  loadError.value = null;
  try {
    const data = await animalService.getAll();
    animals.value = (Array.isArray(data) ? data : [data]).map(mapAnimal);
  } catch (err) {
    console.error('[AnimalsView] fetchAnimals error:', err);
    loadError.value = err?.response?.data?.message ?? 'Nie udalo sie pobrac zwierzat z serwera.';
  } finally {
    isLoadingAnimals.value = false;
  }
};

onMounted(() => {
  fetchAnimals();
  fetchAttributes();
});

const onAnimalSaved = async () => {
  showAnimalModal.value = false;
  // Odswiezamy liste z API po dodaniu nowego zwierzecia
  await fetchAnimals();
};

const isDeletingAnimal    = ref(false);
const deleteError         = ref(null);
const showDeleteConfirm   = ref(false);
const showDeleteError     = ref(false);
const pendingDeleteAnimal = ref(null);

/** Otwiera dialog potwierdzenia — zapamiętuje zwierzę do usunięcia */
const deleteAnimal = (id) => {
  pendingDeleteAnimal.value = animals.value.find(a => a.id === id) ?? { id, name: '' };
  showDeleteConfirm.value = true;
};

/** Wywoływane po kliknięciu "Usuń" w dialogu */
const confirmDelete = async () => {
  if (!pendingDeleteAnimal.value) return;
  isDeletingAnimal.value = true;
  deleteError.value = null;
  try {
    await animalService.remove(pendingDeleteAnimal.value.id);
    animals.value = animals.value.filter(a => a.id !== pendingDeleteAnimal.value.id);
    showDeleteConfirm.value = false;
    pendingDeleteAnimal.value = null;
  } catch (err) {
    console.error('[AnimalsView] deleteAnimal error:', err);
    deleteError.value = err?.response?.data?.message ?? 'Nie udało się usunąć zwierzęcia.';
    showDeleteConfirm.value = false;
    showDeleteError.value = true;
  } finally {
    isDeletingAnimal.value = false;
  }
};

/** Wywoływane po kliknięciu "Anuluj" */
const cancelDelete = () => {
  showDeleteConfirm.value = false;
  pendingDeleteAnimal.value = null;
};

// --- ATRYBUTY ---
const attributes = ref([]);
const isLoadingAttributes = ref(false);

const mapAttributeType = (typeEnum) => {
  if (typeof typeEnum === 'string') return typeEnum;
  switch (typeEnum) {
    case 0: return 'Tekst (String)';
    case 1: return 'Liczba (Number)';
    case 2: return 'Tak/Nie (Boolean)';
    case 3: return 'Data (Date)';
    default: return String(typeEnum ?? 'Nieznany typ');
  }
};

const fetchAttributes = async () => {
  isLoadingAttributes.value = true;
  try {
    const data = await animalService.getAllAttributes();
    attributes.value = (Array.isArray(data) ? data : [data]).map(a => ({
      // Zabezpieczenie na wypadek braku konkretnego pola w zwrotce z API
      id: a.id || a.attributeId || Math.random(),
      name: a.attributeName || a.name || 'Nieznana nazwa',
      type: mapAttributeType(a.attributeType ?? a.type)
    }));
  } catch (err) {
    console.error('[AnimalsView] Błąd pobierania atrybutów:', err);
  } finally {
    isLoadingAttributes.value = false;
  }
};

const onAttributeSaved = async () => {
  showAttrModal.value = false;
  await fetchAttributes();
};

const isDeletingAttribute    = ref(false);
const attrDeleteError        = ref(null);
const showAttrDeleteConfirm  = ref(false);
const showAttrDeleteError    = ref(false);
const pendingDeleteAttribute = ref(null);

const deleteAttribute = (id) => {
  pendingDeleteAttribute.value = attributes.value.find(a => a.id === id) ?? { id, name: '' };
  showAttrDeleteConfirm.value = true;
};

const confirmAttrDelete = async () => {
  if (!pendingDeleteAttribute.value) return;
  isDeletingAttribute.value = true;
  attrDeleteError.value = null;
  try {
    await animalService.removeAttribute(pendingDeleteAttribute.value.id);
    attributes.value = attributes.value.filter(a => a.id !== pendingDeleteAttribute.value.id);
    showAttrDeleteConfirm.value = false;
    pendingDeleteAttribute.value = null;
  } catch (err) {
    console.error('[AnimalsView] deleteAttribute error:', err);
    attrDeleteError.value = err?.response?.data?.message ?? err?.response?.data ?? 'Nie udało się usunąć atrybutu.';
    showAttrDeleteConfirm.value = false;
    showAttrDeleteError.value = true;
  } finally {
    isDeletingAttribute.value = false;
  }
};

const cancelAttrDelete = () => {
  showAttrDeleteConfirm.value = false;
  pendingDeleteAttribute.value = null;
};

// --- FILTROWANIE ---
const filteredAnimals = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return animals.value;
  return animals.value.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.species.toLowerCase().includes(q) ||
    a.status.toLowerCase().includes(q) ||
    a.attributes.some(attr => attr.name.toLowerCase().includes(q) || attr.value.toLowerCase().includes(q))
  );
});

const filteredAttributes = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return attributes.value;
  return attributes.value.filter(a =>
    a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)
  );
});
</script>