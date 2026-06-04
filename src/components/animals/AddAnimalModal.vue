<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <form
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]"
      @submit.prevent="handleSave"
      novalidate
    >

      <!-- Header -->
      <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Dodaj nowe zwierzę</h3>
          <p class="text-sm text-gray-400 mt-0.5">Wypełnij dane i przypisz wybieg</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto custom-scrollbar space-y-5">

        <!-- Name -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Nazwa <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
            placeholder="np. Lion, Elephant… (po angielsku)"
          />
          <p class="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            Wpisz po angielsku — gatunki zostaną załadowane automatycznie
          </p>
        </div>

        <!-- RaceName — dynamic species picker -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Gatunek (RaceName)
            <span v-if="form.raceName" class="ml-2 text-xs font-normal text-[#2d6a4f] dark:text-green-400 bg-[#f0f9f4] dark:bg-[#132a1e] px-2 py-0.5 rounded-full">
              ✓ {{ form.raceName }}
            </span>
          </label>

          <!-- Loading -->
          <div v-if="isSearching" class="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
            <svg class="animate-spin h-4 w-4 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span class="text-sm text-gray-400">Szukam gatunków dla „{{ form.name }}"…</span>
          </div>

          <!-- Error -->
          <div v-else-if="searchError" class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            {{ searchError }}
          </div>

          <!-- Results list -->
          <div v-else-if="speciesResults.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm">
            <div class="max-h-44 overflow-y-auto custom-scrollbar divide-y divide-gray-100 dark:divide-gray-600 bg-white dark:bg-gray-700">
              <button
                v-for="(species, idx) in speciesResults"
                :key="idx"
                type="button"
                @click="form.raceName = species.name || species"
                :class="[
                  'w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors duration-150',
                  form.raceName === (species.name || species)
                    ? 'bg-[#f0f9f4] dark:bg-[#132a1e]'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600/50'
                ]"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ species.name || species }}</p>
                  <p v-if="species.taxonomy?.class" class="text-xs text-gray-400 mt-0.5">
                    {{ species.taxonomy.class }}<span v-if="species.taxonomy.order"> · {{ species.taxonomy.order }}</span>
                  </p>
                </div>
                <svg v-if="form.raceName === (species.name || species)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#2d6a4f] dark:text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              </button>
            </div>
          </div>

          <!-- Fallback manual input -->
          <input
            v-if="speciesResults.length === 0 && !isSearching"
            v-model="form.raceName"
            type="text"
            :placeholder="form.name.trim().length >= 2 ? 'Brak wyników — wpisz ręcznie, np. Panthera leo' : 'Wpisz nazwę wyżej aby wyszukać gatunek…'"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Opis (Description)</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all resize-none"
            placeholder="Krótki opis zwierzęcia, jego charakteru, historii..."
          />
        </div>

        <!-- Icon Upload -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Ikonka zwierzęcia
            <span class="ml-1 text-xs font-normal text-gray-400">(opcjonalnie)</span>
          </label>
          <div
            class="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer p-5"
            :class="[
              isDraggingIcon
                ? 'border-[#2d6a4f] bg-[#f0f9f4] dark:bg-[#132a1e]'
                : 'border-gray-200 dark:border-gray-600 hover:border-[#2d6a4f]/60 bg-gray-50 dark:bg-gray-700/50'
            ]"
            @dragover.prevent="isDraggingIcon = true"
            @dragleave.prevent="isDraggingIcon = false"
            @drop.prevent="onIconDrop"
            @click="$refs.iconFileInput.click()"
          >
            <input
              ref="iconFileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onIconFileChange"
            />

            <!-- Preview -->
            <div v-if="iconPreview" class="flex flex-col items-center gap-2">
              <div class="relative">
                <img :src="iconPreview" alt="Podgląd ikonki" class="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-[#2d6a4f]/30" />
                <button
                  type="button"
                  @click.stop="removeIcon"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </button>
              </div>
              <p class="text-xs text-[#2d6a4f] dark:text-green-400 font-medium">{{ iconFile?.name }}</p>
            </div>

            <!-- Placeholder -->
            <template v-else>
              <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="text-center">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Przeciągnij plik lub <span class="text-[#2d6a4f] dark:text-green-400 underline underline-offset-2">kliknij</span></p>
                <p class="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP — maks. 5 MB</p>
              </div>
            </template>

            <!-- Upload error -->
            <p v-if="iconUploadError" class="text-xs text-red-500 flex items-center gap-1" @click.stop>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              {{ iconUploadError }}
            </p>
          </div>
        </div>

        <!-- Origin + DateOfArrival -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Pochodzenie (Origin)</label>
            <input
              v-model="form.origin"
              type="text"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
              placeholder="np. Afryka, hodowla"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Data przybycia (DateOfArrival)</label>
            <input
              v-model="form.dateOfArrival"
              type="date"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent focus:bg-white dark:focus:bg-gray-600 outline-none transition-all"
            />
          </div>
        </div>

        <!-- Animal Type Picker -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Typ zwierzęcia
            <span class="ml-1 text-xs font-normal text-gray-400">(opcjonalnie)</span>
          </label>
          <div v-if="isLoadingTypes" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400">
            <svg class="animate-spin h-4 w-4 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Ładowanie typów…
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <button
              v-for="type in animalTypes"
              :key="type.id"
              type="button"
              @click="form.animalTypeId = form.animalTypeId === type.id ? null : type.id"
              :class="[
                'relative px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200',
                form.animalTypeId === type.id
                  ? 'border-[#2d6a4f] bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 shadow-sm'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#2d6a4f]/50'
              ]"
            >
              {{ type.animalTypeName ?? type.name }}
              <svg v-if="form.animalTypeId === type.id" xmlns="http://www.w3.org/2000/svg" class="inline h-3.5 w-3.5 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </button>
            <span v-if="animalTypes.length === 0" class="text-sm text-gray-400 italic">Brak typów — dodaj je w sekcji Typy zwierząt.</span>
          </div>
        </div>
      </div>

      <!-- Save error banner -->
      <div v-if="saveError" class="mx-5 mb-0 mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
        {{ saveError }}
      </div>

      <!-- Footer -->
      <div class="p-5 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 shrink-0">
        <button type="button" :disabled="isSaving" @click="$emit('close')" class="px-5 py-2 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
          Anuluj
        </button>
        <button
          type="submit"
          :disabled="isSaving || !form.name"
          class="bg-[#2d6a4f] hover:bg-[#1a3b22] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 min-w-[150px] justify-center"
        >
          <!-- Spinner during save -->
          <svg v-if="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
          {{ isSaving ? 'Zapisywanie…' : 'Zapisz zwierzę' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import { useAnimalSearch } from '../../composables/useAnimalSearch';
import animalService from '../../services/animal.service';
import iconService from '../../services/icon.service';
import animalTypeService from '../../services/animalType.service';

const emit = defineEmits(['save', 'close']);

// --- ANIMAL TYPES ---
const animalTypes    = ref([]);
const isLoadingTypes = ref(false);

onMounted(async () => {
  isLoadingTypes.value = true;
  try {
    animalTypes.value = await animalTypeService.getAll();
  } catch {
    // cicho ignoruj
  } finally {
    isLoadingTypes.value = false;
  }
});

// --- ICON UPLOAD ---
const iconFile = ref(null);
const iconPreview = ref(null);
const isDraggingIcon = ref(false);
const iconUploadError = ref(null);
const iconFileInput = ref(null);

const onIconFileChange = (e) => {
  const file = e.target.files?.[0];
  if (file) setIconFile(file);
};

const onIconDrop = (e) => {
  isDraggingIcon.value = false;
  const file = e.dataTransfer.files?.[0];
  if (file) setIconFile(file);
};

const setIconFile = (file) => {
  iconUploadError.value = null;
  if (!file.type.startsWith('image/')) {
    iconUploadError.value = 'Dozwolone są tylko pliki graficzne (PNG, JPG, WebP).';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    iconUploadError.value = 'Plik jest zbyt duży. Maksymalny rozmiar to 5 MB.';
    return;
  }
  iconFile.value = file;
  iconPreview.value = URL.createObjectURL(file);
};

const removeIcon = () => {
  iconFile.value = null;
  iconPreview.value = null;
  iconUploadError.value = null;
  if (iconFileInput.value) iconFileInput.value.value = '';
};

const { results: speciesResults, isLoading: isSearching, error: searchError, searchAnimals, clearResults } = useAnimalSearch();

const form = reactive({
  name: '',
  raceName: '',
  description: '',
  origin: '',
  dateOfArrival: '',
  animalTypeId: null,
});

// Stan zapisu
const isSaving = ref(false);
const saveError = ref(null);

const resetForm = () => {
  Object.assign(form, { name: '', raceName: '', description: '', origin: '', dateOfArrival: '', animalTypeId: null });
  clearResults();
  saveError.value = null;
  removeIcon();
};

// Debounced species search triggered by name input
let debounceTimer = null;
watch(() => form.name, (val) => {
  clearTimeout(debounceTimer);
  const trimmed = val?.trim() ?? '';
  if (trimmed.length < 2) { clearResults(); return; }
  debounceTimer = setTimeout(() => searchAnimals(trimmed), 600);
});

const handleSave = async () => {
  if (!form.name || isSaving.value) return;

  isSaving.value = true;
  saveError.value = null;

  try {
    // Krok 1: jeśli wybrano ikonkę — wyślij ją najpierw i pobierz iconId
    let iconId = null;
    if (iconFile.value) {
      const iconResult = await iconService.upload(iconFile.value);
      // Backend zwraca obiekt z polem id lub iconId
      iconId = iconResult?.id ?? iconResult?.iconId ?? null;
      console.log('[AddAnimalModal] Icon uploaded, iconId:', iconId);
    }

    // Krok 2: utwórz zwierzę, dołączając IconId (jeśli dostępne)
    // UWAGA: EnclosureId usuniete tymczasowo — kolumna nie istnieje w DB (brakujaca migracja).
    // Przywroc po uruchomieniu: dotnet ef database update
    const dto = {
      Name: form.name,
      RaceName: form.raceName || '',
      Description: form.description || '',
      Origin: form.origin || null,
      DateOfArrival: form.dateOfArrival ? new Date(form.dateOfArrival).toISOString() : null,
      ...(iconId !== null && { IconId: iconId }),
      ...(form.animalTypeId !== null && { AnimalTypeId: form.animalTypeId }),
    };

    const saved = await animalService.create(dto);
    emit('save', saved);
    resetForm();
  } catch (err) {
    console.error('[AddAnimalModal] Save error:', err);
    saveError.value =
      err?.response?.data?.message ??
      err?.response?.data ??
      'Nie udało się zapisać zwierzęcia. Sprawdź połączenie z API.';
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 4px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; }
.dark .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #4b5563; }
</style>
