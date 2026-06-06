<template>
  <div class="h-full min-h-full flex flex-col overflow-hidden">
    <PageBanner
      title="Enclosures"
      eyebrow="Zoo Management"
      subtitle="Manage animal enclosures at the zoo."
      image="/banner_enclosures.png"
      image-position="center 60%"
    />

    <div class="px-8 pt-6 flex gap-6 flex-1 overflow-hidden">

      <!-- Enclosures Section (3/4 width) -->
      <section class="flex-[3] flex flex-col min-h-0">
        <SectionHeader
          title=""
          button-label="Add enclosure"
          @action="openAddEnclosure"
        />

        <DataStateWrapper
          :loading="isLoadingEnclosures"
          :empty="enclosures.length === 0"
          loading-text="Loading enclosures…"
          :retryable="false"
        >
          <template #empty>
            <div class="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl py-16">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              </svg>
              <p class="text-gray-500 font-medium">No enclosures</p>
              <p class="text-sm text-gray-400 mt-1">Add the first enclosure using the button above.</p>
            </div>
          </template>

          <!-- Filter bar -->
          <div v-if="enclosures.length > 0 || selectedFilterType !== null" class="mb-4 flex flex-wrap gap-2">
            <button
              @click="selectedFilterType = null"
              :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                selectedFilterType === null
                  ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700']"
            >
              All
            </button>
            <button
              v-for="t in enclosureTypes"
              :key="'filter-' + t.id"
              @click="selectedFilterType = t.id"
              :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                selectedFilterType === t.id
                  ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700']"
            >
              {{ t.typeName }}
            </button>
          </div>

          <!-- Enclosures grid -->
          <div class="flex-1 overflow-y-auto custom-scrollbar pr-4">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
              <EnclosureCard
                v-for="enc in filteredEnclosures"
                :key="enc.id"
                :enclosure="enc"
                :type-name="getTypeName(enc.typeId)"
                @edit="openEditEnclosure"
                @delete="deleteEnclosure"
              />
            </div>
          </div>
        </DataStateWrapper>
      </section>

      <!-- Types Section (1/4 width) -->
      <section class="flex-[1] flex flex-col min-h-0 border-l border-gray-100 dark:border-gray-800 pl-6">
        <SectionHeader
          title="Enclosure Types"
          button-label="Add"
          button-variant="outline"
          @action="openAddType"
        />

        <div v-if="isLoadingTypes" class="py-4 text-center text-sm text-gray-400">
          Loading types...
        </div>

        <div v-else class="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <ul class="space-y-2">
            <li
              v-for="t in enclosureTypes"
              :key="t.id"
              class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm group"
            >
              <span class="font-medium text-sm text-gray-800 dark:text-gray-200">{{ t.typeName }}</span>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openEditType(t)" class="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded text-xs transition-colors" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button @click="deleteType(t.id)" class="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-xs transition-colors" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </li>
          </ul>
          <div v-if="enclosureTypes.length === 0" class="text-sm text-gray-400 text-center py-4">
            No types defined.
          </div>
        </div>
      </section>

    </div>

    <!-- Modals -->
    <EnclosureModal
      v-if="showEnclosureModal"
      :enclosure="selectedEnclosure"
      :enclosure-types="enclosureTypes"
      :taken-keys="takenMapKeys"
      @save="onEnclosureSaved"
      @close="showEnclosureModal = false"
    />

    <EnclosureTypeModal
      v-if="showTypeModal"
      :enclosure-type="selectedType"
      @save="onTypeSaved"
      @close="showTypeModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue';
import PageBanner         from '../../components/PageBanner.vue';
import SectionHeader      from '../../components/SectionHeader.vue';
import DataStateWrapper   from '../../components/DataStateWrapper.vue';
import enclosureService   from '../../services/enclosure.service';
import EnclosureModal     from '../../components/enclosures/EnclosureModal.vue';
import EnclosureTypeModal from '../../components/enclosures/EnclosureTypeModal.vue';
import EnclosureCard      from '../../components/enclosures/EnclosureCard.vue';

const enclosures          = ref([]);
const enclosureTypes      = ref([]);
const isLoadingEnclosures = ref(false);
const isLoadingTypes      = ref(false);

const showEnclosureModal = ref(false);
const showTypeModal      = ref(false);
const selectedEnclosure  = ref(null);
const selectedType       = ref(null);
const selectedFilterType = ref(null);

const filteredEnclosures = computed(() => {
  if (selectedFilterType.value === null) return enclosures.value;
  return enclosures.value.filter(enc => enc.typeId === selectedFilterType.value);
});

const takenMapKeys = computed(() =>
  enclosures.value
    .filter(e => e.mapKey && e.id !== selectedEnclosure.value?.id)
    .map(e => e.mapKey)
);

const fetchData = async () => { await fetchTypes(); await fetchEnclosures(); };

const fetchEnclosures = async () => {
  isLoadingEnclosures.value = true;
  try {
    const data = await enclosureService.getAll();
    enclosures.value = Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Failed to fetch enclosures', error);
  } finally {
    isLoadingEnclosures.value = false;
  }
};

const fetchTypes = async () => {
  isLoadingTypes.value = true;
  try {
    const data = await enclosureService.getAllTypes();
    enclosureTypes.value = Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Failed to fetch enclosure types', error);
  } finally {
    isLoadingTypes.value = false;
  }
};

onMounted(fetchData);
onActivated(fetchData);

const getTypeName = (id) => {
  if (!id) return 'No type';
  const type = enclosureTypes.value.find(t => t.id === id);
  return type ? type.typeName : 'Unknown type';
};

const openAddEnclosure  = () => { selectedEnclosure.value = null; showEnclosureModal.value = true; };
const openEditEnclosure = (enc) => { selectedEnclosure.value = enc; showEnclosureModal.value = true; };

const deleteEnclosure = async (id) => {
  if (!confirm('Are you sure you want to delete this enclosure?')) return;
  try {
    await enclosureService.remove(id);
    await fetchEnclosures();
  } catch (error) {
    console.error('Failed to delete enclosure', error);
    alert('Failed to delete enclosure.');
  }
};

const onEnclosureSaved = () => { showEnclosureModal.value = false; fetchEnclosures(); };

const openAddType  = () => { selectedType.value = null; showTypeModal.value = true; };
const openEditType = (type) => { selectedType.value = type; showTypeModal.value = true; };

const deleteType = async (id) => {
  if (!confirm('Are you sure you want to delete this type? Warning: it may be assigned to enclosures.')) return;
  try {
    await enclosureService.removeType(id);
    await fetchTypes();
  } catch (error) {
    console.error('Failed to delete type', error);
    alert('Failed to delete type.');
  }
};

const onTypeSaved = () => { showTypeModal.value = false; fetchTypes(); };
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 3px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; }
.dark .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #4b5563; }
</style>
