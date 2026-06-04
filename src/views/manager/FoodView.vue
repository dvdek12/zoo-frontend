<template>
  <div class="flex flex-col h-full bg-white dark:bg-[#111315] overflow-hidden">
    <PageBanner
      title="Food"
      eyebrow="Zoo Management"
      subtitle="Manage food types available for zoo animals."
      image="/banner_tasks.png"
      image-position="center 50%"
    />

    <div class="flex-1 min-h-0 px-8 pt-6 pb-8 grid grid-cols-[380px_1fr] gap-6 items-start overflow-y-auto">

      <!-- ── LEFT: Add form ── -->
      <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-7 sticky top-0">
        <div class="mb-6">
          <h2 class="text-lg font-bold text-[#1a3b22] dark:text-green-400 leading-tight">Nowy typ jedzenia</h2>
          <p class="text-xs text-gray-400 mt-0.5">Dodaj nowy typ karmy dla zwierząt</p>
        </div>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <!-- FoodName -->
          <div class="flex flex-col gap-1.5">
            <label for="food-name" class="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide uppercase">
              Nazwa *
            </label>
            <input
              v-model="form.foodName"
              id="food-name"
              type="text"
              placeholder="np. Mięso, Warzywa, Owady, Ryby…"
              required
              class="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] dark:focus:border-green-400 transition-all"
            />
          </div>

          <!-- Error -->
          <div
            v-if="formError"
            class="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-xs text-red-600 dark:text-red-400"
          >
            <svg class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ formError }}
          </div>

          <!-- Submit -->
          <div class="flex justify-end pt-1">
            <button
              type="submit"
              id="submit-food-type"
              :disabled="isSubmitting"
              class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] rounded-xl shadow-[0_2px_8px_rgba(45,106,79,0.3)] hover:shadow-[0_4px_16px_rgba(45,106,79,0.4)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all cursor-pointer"
            >
              <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <svg v-else class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Dodaj typ jedzenia
            </button>
          </div>
        </form>
      </div>

      <!-- ── RIGHT: List ── -->
      <div class="flex flex-col gap-4 min-h-0">

        <!-- Header bar -->
        <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm px-5 py-3.5 flex items-center justify-between flex-wrap gap-3 shrink-0">
          <div>
            <h2 class="text-lg font-bold text-[#1a3b22] dark:text-green-400">Typy jedzenia</h2>
            <p class="text-xs text-gray-400">
              {{ foodTypes.length }}
              {{ foodTypes.length === 1 ? 'typ' : foodTypes.length < 5 ? 'typy' : 'typów' }}
              zdefiniowanych
            </p>
          </div>

          <!-- Search -->
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
            </svg>
            <input
              v-model="searchQuery"
              id="food-search"
              type="text"
              placeholder="Szukaj…"
              class="pl-9 pr-8 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 transition-colors w-44"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- States -->
        <DataStateWrapper
          :loading="isLoading"
          :error="loadError"
          :empty="filteredFoodTypes.length === 0"
          loading-text="Pobieranie typów jedzenia…"
          @retry="fetchFoodTypes"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center gap-2 py-20 text-gray-400">
              <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-1">
                <svg class="w-7 h-7 stroke-gray-300 dark:stroke-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
              </div>
              <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {{ searchQuery ? `Brak wyników dla "${searchQuery}"` : 'Brak typów jedzenia' }}
              </p>
              <p class="text-xs text-gray-300 dark:text-gray-600 text-center">
                {{ searchQuery ? 'Zmień frazę wyszukiwania.' : 'Dodaj pierwszy typ używając formularza po lewej.' }}
              </p>
            </div>
          </template>

          <!-- Grid of food type cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            <div
              v-for="ft in filteredFoodTypes"
              :key="ft.id"
              class="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm px-5 py-4 flex items-center justify-between gap-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 text-[11px] font-bold text-gray-400 dark:text-gray-500 shrink-0">
                  #{{ ft.id }}
                </span>
                <p
                  class="text-sm font-bold text-gray-900 dark:text-white truncate"
                  v-html="highlight(ft.foodName, searchQuery)"
                ></p>
              </div>
              <button
                @click="foodDelete.requestDelete(ft)"
                :id="`delete-food-${ft.id}`"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title="Usuń"
              >
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </div>
        </DataStateWrapper>
      </div>
    </div>

    <!-- Confirm Delete -->
    <ConfirmDialog
      :model-value="showConfirm"
      @update:model-value="showConfirm = $event"
      title="Usuń typ jedzenia"
      :message="`Czy na pewno chcesz usunąć typ jedzenia &quot;${pendingDelete?.foodName ?? ''}&quot;? Tej operacji nie można cofnąć.`"
      confirm-label="Usuń"
      cancel-label="Anuluj"
      :loading="isDeleting"
      @confirm="foodDelete.confirmDelete"
      @cancel="foodDelete.cancelDelete"
    />

    <!-- Toast -->
    <AppToast :message="toastMsg" :type="toastType" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue';
import PageBanner      from '../../components/PageBanner.vue';
import DataStateWrapper from '../../components/DataStateWrapper.vue';
import ConfirmDialog   from '../../components/ConfirmDialog.vue';
import AppToast        from '../../components/AppToast.vue';
import foodService     from '../../services/food.service';
import { useDeleteConfirm } from '../../composables/useDeleteConfirm';
import { useToast }         from '../../composables/useToast';
import { useHighlight }     from '../../composables/useHighlight';

const { toastMsg, toastType, showToast } = useToast();
const { highlight } = useHighlight();

// ── State ──────────────────────────────────────────────────────────────
const foodTypes  = ref([]);
const isLoading  = ref(false);
const loadError  = ref(null);
const searchQuery = ref('');

// ── Form ───────────────────────────────────────────────────────────────
const form        = ref({ foodName: '' });
const isSubmitting = ref(false);
const formError   = ref(null);

// ── Computed ───────────────────────────────────────────────────────────
const filteredFoodTypes = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return foodTypes.value;
  return foodTypes.value.filter(ft => ft.foodName.toLowerCase().includes(q));
});

// ── Fetch ──────────────────────────────────────────────────────────────
async function fetchFoodTypes() {
  isLoading.value = true;
  loadError.value = null;
  try {
    const data = await foodService.getAllFoodTypes();
    foodTypes.value = (Array.isArray(data) ? data : []).map(ft => ({
      id:       ft.id       ?? ft.Id,
      foodName: ft.foodName ?? ft.FoodName ?? ft.name ?? ft.Name ?? '',
    }));
  } catch (err) {
    console.error('[FoodView] fetchFoodTypes:', err);
    loadError.value = err?.response?.data?.message ?? 'Nie udało się pobrać typów jedzenia.';
  } finally {
    isLoading.value = false;
  }
}

// ── Submit ─────────────────────────────────────────────────────────────
async function handleSubmit() {
  formError.value   = null;
  isSubmitting.value = true;
  try {
    await foodService.createFoodType({ FoodName: form.value.foodName.trim() });
    form.value.foodName = '';
    showToast('Typ jedzenia dodany!');
    await fetchFoodTypes();
  } catch (err) {
    console.error('[FoodView] handleSubmit:', err);
    formError.value = err?.response?.data?.message ?? 'Nie udało się dodać typu jedzenia.';
  } finally {
    isSubmitting.value = false;
  }
}

// ── Delete ─────────────────────────────────────────────────────────────
const foodDelete = useDeleteConfirm(async (ft) => {
  await foodService.deleteFoodType(ft.id);
  foodTypes.value = foodTypes.value.filter(f => f.id !== ft.id);
  showToast('Typ jedzenia usunięty.');
});

const { showConfirm, pendingDelete, isDeleting } = foodDelete;

watch(foodDelete.deleteError, (err) => {
  if (err) showToast(err, 'error');
});

// ── Init ───────────────────────────────────────────────────────────────
onMounted(fetchFoodTypes);
onActivated(fetchFoodTypes);
</script>

<style scoped>
:deep(.hl) {
  background-color: #bbf7d0;
  color: #14532d;
  border-radius: 2px;
  padding: 0 2px;
  font-weight: 700;
}
.dark :deep(.hl) {
  background-color: #166534;
  color: #bbf7d0;
}
</style>
