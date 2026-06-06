<template>
  <div class="min-h-full flex flex-col gap-6">
    <PageBanner
      title="Animals"
      eyebrow="Zoo Management"
      subtitle="Manage the list of animals at the facility."
      image="/banner_animals.png"
      image-position="center 40%"
    />

    <div class="px-8 pt-6 pb-8 flex flex-col gap-6">

      <SearchBar
        v-model="searchQuery"
        placeholder="Search animal (by name, species, attributes)..."
      />

      <!-- Animals Section -->
      <section class="flex-[3] flex flex-col min-h-0">
        <SectionHeader
          title=""
          button-label="Add animal"
          button-id="open-add-animal-modal"
          @action="showAnimalModal = true"
        />
        <DataStateWrapper
          :loading="isLoadingAnimals"
          :error="loadError"
          :empty="false"
          loading-text="Loading animals…"
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

      <!-- Attributes Section -->
      <section class="flex flex-col min-h-[320px]">
        <SectionHeader
          title="Animal Attributes"
          button-label="Add"
          button-variant="outline"
          @action="showAttrModal = true"
        />
        <AttributeTable :attributes="filteredAttributes" @delete="requestDeleteAttribute" />
      </section>

      <!-- Animal Types Section -->
      <section class="flex flex-col min-h-[320px]">
        <SectionHeader
          title="Animal Types"
          button-label="Add"
          button-variant="outline"
          @action="showAnimalTypeModal = true"
        />
        <AnimalTypeTable :animal-types="filteredAnimalTypes" @delete="requestDeleteAnimalType" />
      </section>
    </div>

    <!-- Modals -->
    <AddAnimalModal     v-if="showAnimalModal"     @save="onAnimalSaved"     @close="showAnimalModal = false" />
    <AddAttributeModal  v-if="showAttrModal"       @save="onAttributeSaved"  @close="showAttrModal = false" />
    <AddAnimalTypeModal v-if="showAnimalTypeModal" @save="onAnimalTypeSaved" @close="showAnimalTypeModal = false" />

    <!-- Delete dialogs -->
    <ConfirmDialog
      :model-value="animalShowConfirm"
      @update:model-value="animalShowConfirm = $event"
      title="Delete animal"
      :message="`Are you sure you want to delete ${animalPendingDelete?.name ?? 'this animal'}? This action cannot be undone.`"
      confirm-label="Delete"
      cancel-label="Cancel"
      :loading="animalIsDeleting"
      @confirm="animalDelete.confirmDelete"
      @cancel="animalDelete.cancelDelete"
    />
    <ConfirmDialog
      v-model="showAnimalDeleteError"
      title="Delete error"
      :message="animalDeleteError ?? 'Failed to delete animal.'"
      confirm-label="OK"
      cancel-label=""
      @confirm="showAnimalDeleteError = false"
      @cancel="showAnimalDeleteError = false"
    />

    <ConfirmDialog
      :model-value="attrShowConfirm"
      @update:model-value="attrShowConfirm = $event"
      title="Delete attribute"
      :message="`Are you sure you want to delete attribute ${attrPendingDelete?.name ?? ''}? This action cannot be undone.`"
      confirm-label="Delete"
      cancel-label="Cancel"
      :loading="attrIsDeleting"
      @confirm="attrDelete.confirmDelete"
      @cancel="attrDelete.cancelDelete"
    />
    <ConfirmDialog
      v-model="showAttrDeleteError"
      title="Delete error"
      :message="attrDeleteError ?? 'Failed to delete attribute.'"
      confirm-label="OK"
      cancel-label=""
      @confirm="showAttrDeleteError = false"
      @cancel="showAttrDeleteError = false"
    />

    <ConfirmDialog
      :model-value="animalTypeShowConfirm"
      @update:model-value="animalTypeShowConfirm = $event"
      title="Delete animal type"
      :message="`Are you sure you want to delete type ${animalTypePendingDelete?.animalTypeName ?? ''}? This action cannot be undone.`"
      confirm-label="Delete"
      cancel-label="Cancel"
      :loading="animalTypeIsDeleting"
      @confirm="animalTypeDelete.confirmDelete"
      @cancel="animalTypeDelete.cancelDelete"
    />
    <ConfirmDialog
      v-model="showAnimalTypeDeleteError"
      title="Delete error"
      :message="animalTypeDeleteError ?? 'Failed to delete type.'"
      confirm-label="OK"
      cancel-label=""
      @confirm="showAnimalTypeDeleteError = false"
      @cancel="showAnimalTypeDeleteError = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue';
import { useRouter } from 'vue-router';
import PageBanner         from '../../components/PageBanner.vue';
import SearchBar          from '../../components/SearchBar.vue';
import SectionHeader      from '../../components/SectionHeader.vue';
import DataStateWrapper   from '../../components/DataStateWrapper.vue';
import AnimalTable        from '../../components/animals/AnimalTable.vue';
import AttributeTable     from '../../components/animals/AttributeTable.vue';
import AnimalTypeTable    from '../../components/animals/AnimalTypeTable.vue';
import AddAnimalModal     from '../../components/animals/AddAnimalModal.vue';
import AddAttributeModal  from '../../components/animals/AddAttributeModal.vue';
import AddAnimalTypeModal from '../../components/animals/AddAnimalTypeModal.vue';
import ConfirmDialog      from '../../components/ConfirmDialog.vue';
import animalService      from '../../services/animal.service';
import animalTypeService  from '../../services/animalType.service';
import { useDeleteConfirm } from '../../composables/useDeleteConfirm';
import { toArray, getErrorMessage } from '../../utils/normalize';

const router = useRouter();

const showAnimalModal     = ref(false);
const showAttrModal       = ref(false);
const showAnimalTypeModal = ref(false);
const searchQuery         = ref('');

const goToAnimal = (id) => router.push({ name: 'animalDetail', params: { id } });

// --- ANIMALS ---
const animals          = ref([]);
const isLoadingAnimals = ref(false);
const loadError        = ref(null);

const ATTRIBUTE_TYPE_LABELS = { 0: 'Text (String)', 1: 'Number', 2: 'Yes/No (Boolean)', 3: 'Date' };

function mapAnimal(a) {
  return {
    id:         a.id,
    iconId:     a.iconId   ?? null,
    name:       a.name     ?? '',
    species:    a.raceName ?? a.species ?? 'Unknown',
    image:      a.image    ?? 'https://images.unsplash.com/photo-1564756543161-1d54eb84e4f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status:     a.status   ?? 'In zoo',
    attributes: a.attributes ?? [],
  };
}

async function fetchAnimals() {
  isLoadingAnimals.value = true;
  loadError.value        = null;
  try {
    const data   = await animalService.getAll();
    const mapped = toArray(data).map(mapAnimal);

    const attrResults = await Promise.allSettled(mapped.map(a => animalService.getAssignedAttributes(a.id)));
    attrResults.forEach((result, i) => {
      if (result.status === 'fulfilled') mapped[i].attributes = result.value;
    });

    animals.value = mapped;
  } catch (err) {
    loadError.value = getErrorMessage(err, 'Failed to load animals.');
  } finally {
    isLoadingAnimals.value = false;
  }
}

const onAnimalSaved = async () => { showAnimalModal.value = false; await fetchAnimals(); };

const showAnimalDeleteError = ref(false);
const animalDelete = useDeleteConfirm(async (animal) => {
  await animalService.remove(animal.id);
  animals.value = animals.value.filter(a => a.id !== animal.id);
});
const { showConfirm: animalShowConfirm, pendingDelete: animalPendingDelete, isDeleting: animalIsDeleting, deleteError: animalDeleteError } = animalDelete;
const requestDeleteAnimal = (id) => animalDelete.requestDelete(animals.value.find(a => a.id === id) ?? { id, name: '' });
watch(animalDeleteError, (err) => { if (err) showAnimalDeleteError.value = true; });

// --- ATTRIBUTES ---
const attributes = ref([]);

async function fetchAttributes() {
  try {
    const data      = await animalService.getAllAttributes();
    attributes.value = toArray(data).map(a => ({
      id:         a.id || a.attributeId || Math.random(),
      name:       a.attributeName || a.name || 'Unknown',
      type:       ATTRIBUTE_TYPE_LABELS[a.attributeType ?? a.type] ?? String(a.attributeType ?? a.type ?? 'Unknown type'),
      animalType: (a.animalType && a.animalType !== 'Unknown') ? a.animalType : null,
    }));
  } catch {}
}

const onAttributeSaved = async () => { showAttrModal.value = false; await fetchAttributes(); };

const showAttrDeleteError = ref(false);
const attrDelete = useDeleteConfirm(async (attr) => {
  await animalService.removeAttribute(attr.id);
  attributes.value = attributes.value.filter(a => a.id !== attr.id);
});
const { showConfirm: attrShowConfirm, pendingDelete: attrPendingDelete, isDeleting: attrIsDeleting, deleteError: attrDeleteError } = attrDelete;
const requestDeleteAttribute = (id) => attrDelete.requestDelete(attributes.value.find(a => a.id === id) ?? { id, name: '' });
watch(attrDeleteError, (err) => { if (err) showAttrDeleteError.value = true; });

// --- ANIMAL TYPES ---
const animalTypes = ref([]);

async function fetchAnimalTypes() {
  try {
    const data       = await animalTypeService.getAll();
    animalTypes.value = Array.isArray(data) ? data : [];
  } catch {}
}

const onAnimalTypeSaved = async () => { showAnimalTypeModal.value = false; await fetchAnimalTypes(); };

const showAnimalTypeDeleteError = ref(false);
const animalTypeDelete = useDeleteConfirm(async (type) => {
  await animalTypeService.remove(type.id);
  const deletedName = type.animalTypeName ?? type.name;
  animalTypes.value = animalTypes.value.filter(t => t.id !== type.id);
  attributes.value = attributes.value.filter(a => a.animalType !== deletedName);
});
const { showConfirm: animalTypeShowConfirm, pendingDelete: animalTypePendingDelete, isDeleting: animalTypeIsDeleting, deleteError: animalTypeDeleteError } = animalTypeDelete;
const requestDeleteAnimalType = (id) => animalTypeDelete.requestDelete(animalTypes.value.find(t => t.id === id) ?? { id, animalTypeName: '' });
watch(animalTypeDeleteError, (err) => { if (err) showAnimalTypeDeleteError.value = true; });

// --- FILTERS ---
const filteredAnimals = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return animals.value;
  return animals.value.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.species.toLowerCase().includes(q) ||
    a.status.toLowerCase().includes(q) ||
    a.attributes.some(attr => attr.name.toLowerCase().includes(q) || String(attr.value ?? '').toLowerCase().includes(q))
  );
});

const filteredAttributes = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return attributes.value;
  return attributes.value.filter(a => a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q));
});

const filteredAnimalTypes = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return animalTypes.value;
  return animalTypes.value.filter(t => (t.animalTypeName ?? t.name ?? '').toLowerCase().includes(q));
});

function initData() {
  fetchAnimals();
  fetchAttributes();
  fetchAnimalTypes();
}
onMounted(initData);
onActivated(initData);
</script>
