<template>
  <div class="w-full flex flex-col relative scroll-smooth">
    
    <!-- Hero Section -->
    <section id="home" class="relative w-full h-[85vh] flex items-center justify-center">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img src="/panda_bg.png" alt="Panda Background" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-[#0a1a0f]/90 via-[#0a1a0f]/60 to-[#0a1a0f]/80"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 text-center px-6 max-w-4xl text-white">
        <h1 class="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight drop-shadow-xl text-white">
          Odkryj Dziki Świat <br/><span class="text-green-400">Natury</span>
        </h1>
        <p class="text-lg md:text-xl font-light leading-relaxed text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
          ZooNe to miejsce, w którym rytm natury spotyka się z dbałością o każdy detal.
          Zaplanuj swoją wizytę, kup bilet online i przeżyj niezapomnianą przygodę pełną wiedzy, relaksu i fascynujących odkryć.
        </p>
        <div class="flex items-center justify-center gap-4">
          <a href="#tickets" class="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 duration-200">
            Kup Bilet
          </a>
          <a href="#contact" class="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-200">
            Jak dojechać?
          </a>
        </div>
      </div>
    </section>

    <!-- Tickets Section -->
    <section id="tickets" class="py-24 bg-[#fbfbfa] dark:bg-[#111315]">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-extrabold text-[#1a3b22] dark:text-green-400 mb-4">Cennik Biletów</h2>
          <p class="text-gray-500 dark:text-gray-400">Kupując online unikasz stania w kolejkach do kas. Bilety zachowują ważność 30 dni.</p>
        </div>

        <!-- Loading state -->
        <div v-if="isLoadingTypes" class="flex flex-col items-center justify-center gap-4 py-20">
          <svg class="w-10 h-10 text-[#2d6a4f] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p class="text-gray-400 text-sm">Ładowanie biletów…</p>
        </div>

        <!-- Error state -->
        <div v-else-if="fetchError" class="flex flex-col items-center justify-center gap-4 py-20">
          <div class="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <svg class="w-8 h-8 stroke-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p class="text-gray-600 dark:text-gray-300 font-semibold">Nie udało się załadować cennika</p>
          <p class="text-gray-400 text-sm text-center max-w-xs">{{ fetchError }}</p>
          <button
            @click="fetchEntryTypes"
            class="mt-2 px-6 py-2.5 bg-[#1a3b22] hover:bg-[#112918] text-white font-bold rounded-full text-sm transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>

        <!-- No types yet -->
        <div v-else-if="entryTypes.length === 0" class="flex flex-col items-center justify-center gap-3 py-20">
          <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg class="w-8 h-8 stroke-gray-300 dark:stroke-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </div>
          <p class="text-gray-500 font-semibold">Brak dostępnych biletów</p>
          <p class="text-gray-400 text-sm text-center">Aktualnie nie ma dostępnych typów biletów. Sprawdź wkrótce!</p>
        </div>

        <!-- Ticket Cards Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(et, index) in entryTypes"
            :key="et.id"
            class="rounded-3xl p-8 flex flex-col transition-transform duration-300 hover:-translate-y-2 relative"
            :class="index === featuredIndex
              ? 'bg-[#1a3b22] shadow-[0_12px_40px_rgb(26,59,34,0.25)] border border-[#234c2c] text-white md:-translate-y-4 hover:md:-translate-y-6'
              : 'bg-white dark:bg-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-gray-700'"
          >
            <!-- Popular badge -->
            <div
              v-if="index === featuredIndex"
              class="absolute top-0 right-8 transform -translate-y-1/2 bg-green-400 text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
            >
              Najpopularniejszy
            </div>

            <h3 class="text-xl font-bold mb-2" :class="index === featuredIndex ? 'text-white' : 'text-gray-800 dark:text-gray-100'">
              {{ et.name }}
            </h3>
            <p class="text-sm mb-6" :class="index === featuredIndex ? 'text-green-200' : 'text-gray-500 dark:text-gray-400'">
              Bilet wstępu — {{ et.name }}
            </p>

            <div class="mb-8">
              <span class="text-5xl font-extrabold" :class="index === featuredIndex ? 'text-white' : 'text-[#1a3b22] dark:text-green-400'">
                {{ formatPrice(et.price) }}
              </span>
              <span class="text-xl font-medium ml-1" :class="index === featuredIndex ? 'text-green-300' : 'text-gray-400'">PLN</span>
            </div>

            <ul class="text-sm space-y-3 mb-8 flex-1" :class="index === featuredIndex ? 'text-green-100' : 'text-gray-600 dark:text-gray-300'">
              <li class="flex items-center gap-2">
                <span :class="index === featuredIndex ? 'text-green-400' : 'text-green-500'">✔</span>
                Ważny cały dzień
              </li>
              <li class="flex items-center gap-2">
                <span :class="index === featuredIndex ? 'text-green-400' : 'text-green-500'">✔</span>
                Dostęp do wszystkich stref
              </li>
              <li class="flex items-center gap-2">
                <span :class="index === featuredIndex ? 'text-green-400' : 'text-green-500'">✔</span>
                Darmowy audioprzewodnik (app)
              </li>
            </ul>

            <button
              @click="openPurchase(et)"
              :id="`buy-ticket-${et.id}`"
              class="w-full py-3 rounded-xl font-bold transition-colors shadow-md cursor-pointer"
              :class="index === featuredIndex
                ? 'bg-green-500 hover:bg-green-400 text-black'
                : 'bg-[#1a3b22] hover:bg-[#112918] dark:bg-green-600 dark:hover:bg-green-500 text-white'"
            >
              {{ auth.isLoggedIn ? 'Kup bilet' : 'Zaloguj się aby kupić' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Info/Contact Section -->
    <section id="contact" class="py-24 bg-white dark:bg-[#0d0f10] border-t border-gray-100 dark:border-gray-800">
      <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 class="text-4xl font-extrabold text-[#1a3b22] dark:text-green-400 mb-6">Odwiedź nas</h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            ZooNe znajduje się na obrzeżach miasta, z doskonałym dojazdem komunikacją miejską. Ogród jest otwarty przez cały rok, a my dbamy o najwyższy standard życia naszych zwierząt i wspaniałe doświadczenia dla naszych gości.
          </p>
          
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                <MapPin class="w-6 h-6 text-green-700 dark:text-green-400" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900 dark:text-gray-100">Adres</h4>
                <p class="text-gray-500 dark:text-gray-400 text-sm">ul. Przyrodnicza 15<br/>45-000 Zielone Miasto</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                <Clock class="w-6 h-6 text-green-700 dark:text-green-400" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900 dark:text-gray-100">Godziny otwarcia</h4>
                <p class="text-gray-500 dark:text-gray-400 text-sm">Codziennie: 9:00 - 18:00<br/>Kasy czynne do 17:00</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                <Phone class="w-6 h-6 text-green-700 dark:text-green-400" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900 dark:text-gray-100">Kontakt</h4>
                <p class="text-gray-500 dark:text-gray-400 text-sm">+48 123 456 789<br/>kontakt@zoone.pl</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Fake Map Placeholder -->
        <div class="w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden relative group">
          <div class="absolute inset-0 bg-[#e8eedd] dark:bg-[#1e2a1e] flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <MapIcon class="w-16 h-16 text-[#8ea785] dark:text-green-600 mb-4 drop-shadow-sm" />
            <span class="font-bold text-[#5c7255] dark:text-green-500">Mapa Dojazdu</span>
          </div>
        </div>
      </div>
    </section>

  </div>

  <!-- ═══ PURCHASE MODAL ═══ -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showPurchaseModal"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        id="purchase-modal-backdrop"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closePurchaseModal"></div>

        <!-- Modal card -->
        <div class="relative bg-white dark:bg-[#1e2228] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

          <!-- Header -->
          <div class="bg-gradient-to-br from-[#1a3b22] to-[#2d6a4f] px-8 py-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-extrabold">Kup Bilet</h2>
                <p class="text-green-200 text-sm mt-1">Wybierz ilości i potwierdź zamówienie</p>
              </div>
              <button @click="closePurchaseModal" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="px-8 py-6 flex flex-col gap-5">

            <!-- Ticket quantities -->
            <div class="flex flex-col gap-3">
              <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Typy biletów</h3>
              <div
                v-for="et in entryTypes"
                :key="et.id"
                class="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
              >
                <div>
                  <p class="font-semibold text-gray-800 dark:text-gray-100 text-sm">{{ et.name }}</p>
                  <p class="text-[#2d6a4f] dark:text-green-400 font-bold text-sm">{{ formatPrice(et.price) }} PLN / szt.</p>
                </div>
                <!-- Quantity stepper -->
                <div class="flex items-center gap-3">
                  <button
                    @click="decQty(et.id)"
                    class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:border-[#2d6a4f] hover:text-[#2d6a4f] dark:hover:border-green-400 dark:hover:text-green-400 transition-colors cursor-pointer font-bold text-lg leading-none"
                  >−</button>
                  <span class="w-6 text-center font-bold text-gray-800 dark:text-gray-100 text-sm tabular-nums">
                    {{ quantities[et.id] ?? 0 }}
                  </span>
                  <button
                    @click="incQty(et.id)"
                    class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:border-[#2d6a4f] hover:text-[#2d6a4f] dark:hover:border-green-400 dark:hover:text-green-400 transition-colors cursor-pointer font-bold text-lg leading-none"
                  >+</button>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#1a3b22]/5 dark:bg-green-400/5 border border-[#1a3b22]/10 dark:border-green-400/10">
              <span class="font-semibold text-gray-700 dark:text-gray-300 text-sm">Suma</span>
              <span class="text-2xl font-extrabold text-[#1a3b22] dark:text-green-400">
                {{ formatPrice(totalPrice) }} <span class="text-sm font-medium text-gray-400">PLN</span>
              </span>
            </div>

            <!-- Error -->
            <p v-if="purchaseError" class="text-sm text-red-500 font-medium text-center">{{ purchaseError }}</p>

            <!-- Confirm button -->
            <button
              @click="confirmPurchase"
              :disabled="isPurchasing || totalItems === 0"
              id="btn-confirm-purchase"
              class="w-full py-4 rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] text-white font-bold text-base shadow-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span v-if="isPurchasing" class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Przetwarzanie…
              </span>
              <span v-else>
                {{ totalItems === 0 ? 'Wybierz co najmniej 1 bilet' : `Potwierdź zakup — ${formatPrice(totalPrice)} PLN` }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ═══ SUCCESS MODAL ═══ -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 z-[1001] flex items-center justify-center p-4"
        id="success-modal-backdrop"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showSuccessModal = false"></div>

        <div class="relative bg-white dark:bg-[#1e2228] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-center">
          <!-- Green success header -->
          <div class="bg-gradient-to-br from-[#1a3b22] to-[#2d6a4f] px-8 py-8 text-white flex flex-col items-center gap-3">
            <div class="w-16 h-16 rounded-full bg-green-400/20 border-2 border-green-400/40 flex items-center justify-center">
              <svg class="w-8 h-8 stroke-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold">Bilet zakupiony!</h2>
            <p class="text-green-200 text-sm">Dziękujemy za zakup. Miłej wizyty!</p>
          </div>

          <!-- Details -->
          <div class="px-8 py-6 flex flex-col gap-4">
            <div v-if="purchaseResult" class="flex flex-col gap-3">
              <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Numer biletu</span>
                <span class="font-bold text-[#1a3b22] dark:text-green-400">#{{ purchaseResult.id ?? '—' }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Data zakupu</span>
                <span class="font-semibold text-gray-700 dark:text-gray-200 text-sm">{{ formatDateTime(purchaseResult.purchaseDate) }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Ważny do</span>
                <span class="font-semibold text-gray-700 dark:text-gray-200 text-sm">{{ formatDateTime(purchaseResult.validUntil) }}</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Łączna kwota</span>
                <span class="text-xl font-extrabold text-[#1a3b22] dark:text-green-400">{{ formatPrice(purchaseResult.price) }} PLN</span>
              </div>
            </div>

            <button
              @click="showSuccessModal = false"
              id="btn-close-success"
              class="w-full py-3 rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] text-white font-bold hover:opacity-90 transition-all cursor-pointer mt-2"
            >
              Gotowe
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MapPin, Clock, Phone, Map as MapIcon } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import ticketService from '../services/ticket.service.js';
import { jwtDecode } from 'jwt-decode';

const router = useRouter();
const auth   = useAuthStore();

// ── Entry Types ────────────────────────────────────────────────
const entryTypes     = ref([]);
const isLoadingTypes = ref(false);
const fetchError     = ref(null);

// The "featured" (most popular) card — always the middle one if ≥3, else index 0
const featuredIndex = computed(() => {
  const len = entryTypes.value.length;
  if (len === 0) return -1;
  if (len >= 3) return Math.floor(len / 2);
  return 0;
});

async function fetchEntryTypes() {
  isLoadingTypes.value = true;
  fetchError.value = null;
  try {
    const data = await ticketService.getEntryTypes();
    entryTypes.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[ClientHomeView] fetchEntryTypes:', err);
    fetchError.value = err?.response?.data?.message
      ?? err?.message
      ?? 'Nie można połączyć się z serwerem. Sprawdź połączenie i spróbuj ponownie.';
  } finally {
    isLoadingTypes.value = false;
  }
}

// ── Purchase flow ─────────────────────────────────────────────
const showPurchaseModal = ref(false);
const showSuccessModal  = ref(false);
const quantities        = ref({});   // { [entryTypeId]: number }
const isPurchasing      = ref(false);
const purchaseError     = ref(null);
const purchaseResult    = ref(null);

const totalItems = computed(() =>
  Object.values(quantities.value).reduce((sum, q) => sum + q, 0)
);

const totalPrice = computed(() => {
  return entryTypes.value.reduce((sum, et) => {
    const qty = quantities.value[et.id] ?? 0;
    return sum + qty * (et.price ?? 0);
  }, 0);
});

function openPurchase(et) {
  // If not logged in → redirect to login
  if (!auth.isLoggedIn) {
    router.push('/login');
    return;
  }
  // Reset quantities with the clicked type pre-set to 1
  const qMap = {};
  entryTypes.value.forEach(e => { qMap[e.id] = 0; });
  qMap[et.id] = 1;
  quantities.value  = qMap;
  purchaseError.value = null;
  showPurchaseModal.value = true;
}

function closePurchaseModal() {
  showPurchaseModal.value = false;
  purchaseError.value = null;
}

function incQty(id) { quantities.value[id] = (quantities.value[id] ?? 0) + 1; }
function decQty(id) { quantities.value[id] = Math.max(0, (quantities.value[id] ?? 0) - 1); }

/**
 * Wyciąga clientId z JWT (custom claim: "clientId" — int z tabeli Clients).
 */
function getClientIdFromToken() {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    const decoded = jwtDecode(token);
    // Custom claim dodany przez backend podczas logowania klienta
    const id = decoded['clientId'];
    return id ? Number(id) : null;
  } catch {
    return null;
  }
}

async function confirmPurchase() {
  purchaseError.value = null;
  if (totalItems.value === 0) return;

  const clientId = getClientIdFromToken();
  if (!clientId) {
    purchaseError.value = 'Nie można określić ID klienta. Spróbuj zalogować się ponownie.';
    return;
  }

  // Build entryTypeIds: { id: qty } — only non-zero
  const entryTypeIds = {};
  Object.entries(quantities.value).forEach(([id, qty]) => {
    if (qty > 0) entryTypeIds[Number(id)] = qty;
  });

  isPurchasing.value = true;
  try {
    const result = await ticketService.purchase({ clientId, entryTypeIds });
    purchaseResult.value    = result;
    showPurchaseModal.value = false;
    showSuccessModal.value  = true;
  } catch (err) {
    console.error('[ClientHomeView] confirmPurchase:', err);
    purchaseError.value = err?.response?.data?.message ?? 'Nie udało się zakupić biletu. Spróbuj ponownie.';
  } finally {
    isPurchasing.value = false;
  }
}

// ── Helpers ────────────────────────────────────────────────────
function formatPrice(price) {
  if (price == null) return '0.00';
  return Number(price).toFixed(2);
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

// ── Init ───────────────────────────────────────────────────────
onMounted(fetchEntryTypes);
</script>

<style>
html {
  scroll-behavior: smooth;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
