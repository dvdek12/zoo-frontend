<template>
  <div class="h-full min-h-full flex flex-col gap-6 overflow-hidden">
    <PageBanner
      title="Zwierzęta"
      eyebrow="Zoo Management"
      subtitle="Zarządzaj listą zwierząt przebywających na terenie obiektu."
      image="/banner_animals.png"
      image-position="center 40%"
    />

    <div class="px-8 pt-6 flex flex-col gap-6 flex-1 overflow-hidden">

    <!-- Wyszukiwarka -->
    <SearchBar
      v-model="searchQuery"
      placeholder="Wyszukaj zwierzę (po nazwie, gatunku, atrybutach) lub atrybut..."
    />

    <!-- Zwierzęta Sekcja (3/4) -->
    <section class="flex-[3] flex flex-col min-h-0">
      <SectionHeader
        title=""
        button-label="Dodaj zwierzę"
        button-id="open-add-animal-modal"
        @action="showAnimalModal = true"
      />

      <DataStateWrapper
        :loading="isLoadingAnimals"
        :error="loadError"
        :empty="false"
        loading-text="Pobieranie zwierząt…"
        @retry="fetchAnimals"
      >
        <AnimalTable
          :animals="filteredAnimals"
          :query="searchQuery"
          @delete="requestDeleteAnimal"
          @row-click="goToAnimal"
        />
      </DataStateWrapper>
    </section>

    <!-- Atrybuty Sekcja (1/4) -->
    <section class="flex-[1] flex flex-col min-h-0">
      <SectionHeader
        title="Atrybuty zwierząt"
        button-label="Dodaj"
        button-variant="outline"
        @action="showAttrModal = true"
      />
      <AttributeTable :attributes="filteredAttributes" @delete="requestDeleteAttribute" />
    </section>

    </div><!-- /px-8 content -->

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

    <!-- Dialog potwierdzenia usunięcia zwierzęcia -->
    <ConfirmDialog
      :model-value="animalShowConfirm"
      @update:model-value="animalShowConfirm = $event"
      title="Usuń zwierzę"
      :message="`Czy na pewno chcesz usunąć ${animalPendingDelete?.name ?? 'to zwierzę'}? Tej operacji nie można cofnąć.`"
      confirm-label="Usuń"
      cancel-label="Anuluj"
      :loading="animalIsDeleting"
      @confirm="animalDelete.confirmDelete"
      @cancel="animalDelete.cancelDelete"
    />

    <!-- Dialog błędu usunięcia zwierzęcia -->
    <ConfirmDialog
      v-model="showAnimalDeleteError"
      title="Błąd usuwania"
      :message="animalDeleteError ?? 'Nie udało się usunąć zwierzęcia.'"
      confirm-label="OK"
      cancel-label=""
      @confirm="showAnimalDeleteError = false"
      @cancel="showAnimalDeleteError = false"
    />

    <!-- Dialog potwierdzenia usunięcia atrybutu -->
    <ConfirmDialog
      :model-value="attrShowConfirm"
      @update:model-value="attrShowConfirm = $event"
      title="Usuń atrybut"
      :message="`Czy na pewno chcesz usunąć atrybut ${attrPendingDelete?.name ?? ''}? Tej operacji nie można cofnąć.`"
      confirm-label="Usuń"
      cancel-label="Anuluj"
      :loading="attrIsDeleting"
      @confirm="attrDelete.confirmDelete"
      @cancel="attrDelete.cancelDelete"
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
  </div><!-- /outer -->
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue';
import { useRouter } from 'vue-router';
import PageBanner        from '../../components/PageBanner.vue';
import SearchBar         from '../../components/SearchBar.vue';
import SectionHeader     from '../../components/SectionHeader.vue';
import DataStateWrapper  from '../../components/DataStateWrapper.vue';
import AnimalTable       from '../../components/animals/AnimalTable.vue';
import AttributeTable    from '../../components/animals/AttributeTable.vue';
import AddAnimalModal    from '../../components/animals/AddAnimalModal.vue';
import AddAttributeModal from '../../components/animals/AddAttributeModal.vue';
import ConfirmDialog     from '../../components/ConfirmDialog.vue';
import animalService     from '../../services/animal.service';
import { useDeleteConfirm } from '../../composables/useDeleteConfirm';

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
const animals          = ref([]);
const isLoadingAnimals = ref(false);
const loadError        = ref(null);

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
    loadError.value = err?.response?.data?.message ?? 'Nie udało się pobrać zwierząt z serwera.';
  } finally {
    isLoadingAnimals.value = false;
  }
};

const onAnimalSaved = async () => {
  showAnimalModal.value = false;
  await fetchAnimals();
};

// --- DELETE ZWIERZĘ (useDeleteConfirm) ---
const showAnimalDeleteError = ref(false);

const animalDelete = useDeleteConfirm(async (animal) => {
  await animalService.remove(animal.id);
  animals.value = animals.value.filter(a => a.id !== animal.id);
});

// Destrukturyzacja refs żeby template mógł je czytać bezpośrednio
const { showConfirm: animalShowConfirm, pendingDelete: animalPendingDelete, isDeleting: animalIsDeleting, deleteError: animalDeleteError } = animalDelete;

const requestDeleteAnimal = (id) => {
  const item = animals.value.find(a => a.id === id) ?? { id, name: '' };
  animalDelete.requestDelete(item);
};

// Obserwuj błąd usunięcia — jeśli wystąpił, pokaż dialog błędu
watch(animalDeleteError, (err) => {
  if (err) showAnimalDeleteError.value = true;
});

// --- ATRYBUTY ---
const attributes          = ref([]);
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
      id:   a.id || a.attributeId || Math.random(),
      name: a.attributeName || a.name || 'Nieznana nazwa',
      type: mapAttributeType(a.attributeType ?? a.type),
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

// --- DELETE ATRYBUT (useDeleteConfirm) ---
const showAttrDeleteError = ref(false);

const attrDelete = useDeleteConfirm(async (attr) => {
  await animalService.removeAttribute(attr.id);
  attributes.value = attributes.value.filter(a => a.id !== attr.id);
});

// Destrukturyzacja refs
const { showConfirm: attrShowConfirm, pendingDelete: attrPendingDelete, isDeleting: attrIsDeleting, deleteError: attrDeleteError } = attrDelete;

const requestDeleteAttribute = (id) => {
  const item = attributes.value.find(a => a.id === id) ?? { id, name: '' };
  attrDelete.requestDelete(item);
};

watch(attrDeleteError, (err) => {
  if (err) showAttrDeleteError.value = true;
});

// --- FILTROWANIE ---
const filteredAnimals = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return animals.value;
  return animals.value.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.species.toLowerCase().includes(q) ||
    a.status.toLowerCase().includes(q) ||
    a.attributes.some(attr =>
      attr.name.toLowerCase().includes(q) || String(attr.value ?? '').toLowerCase().includes(q)
    )
  );
});

const filteredAttributes = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return attributes.value;
  return attributes.value.filter(a =>
    a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)
  );
});

function initData() {
  fetchAnimals();
  fetchAttributes();
}
onMounted(initData);
onActivated(initData);
</script>