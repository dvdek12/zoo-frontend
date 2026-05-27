<template>
  <!-- ═══ PAGE ═══ -->
  <div class="flex flex-col h-full bg-white dark:bg-[#111315] overflow-hidden">
    <div class="flex flex-col flex-1 min-h-0 p-8 gap-6">
      <PageHeader title="Tickets" subtitle="Manage ticket types and view all purchased tickets." />

      <!-- ── TAB SWITCHER ── -->
      <div class="shrink-0 w-full">
        <div class="relative flex bg-white dark:bg-[#1e2228] border border-gray-200 dark:border-gray-800 rounded-full p-1 shadow-sm w-full">
          <!-- animated slider -->
          <div
            class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] rounded-full shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0"
            :style="activeTab === 'all' ? 'transform:translateX(calc(100% + 8px))' : 'transform:translateX(0)'"
          ></div>

          <button
            id="tab-entry-types"
            class="relative z-10 flex-1 flex items-center justify-center gap-2 px-8 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-200"
            :class="activeTab === 'types' ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
            @click="activeTab = 'types'"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            Entry Types
          </button>
          <button
            id="tab-all-tickets"
            class="relative z-10 flex-1 flex items-center justify-center gap-2 px-8 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-200"
            :class="activeTab === 'all' ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
            @click="activeTab = 'all'"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            All Tickets
          </button>
        </div>
      </div>

      <!-- ═══ ENTRY TYPES PANEL ═══ -->
      <div v-if="activeTab === 'types'" class="flex-1 min-h-0 grid grid-cols-[380px_1fr] gap-6 items-start overflow-y-auto">

        <!-- Left: Add Form -->
        <div class="bg-white dark:bg-[#1e2228] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6 flex flex-col gap-5 sticky top-0">
          <div>
            <h2 class="text-lg font-bold text-[#1a3b22] dark:text-green-400">
              {{ editingType ? 'Edit Entry Type' : 'New Entry Type' }}
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">Define ticket categories like Regular, Kids, Senior, etc.</p>
          </div>

          <div class="flex flex-col gap-4">
            <!-- Name -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Name</label>
              <input
                v-model="typeForm.name"
                id="entry-type-name"
                type="text"
                placeholder="e.g. Regular, Kids, Senior…"
                class="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 transition-colors"
              />
            </div>

            <!-- Price -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Price (PLN)</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">zł</span>
                <input
                  v-model.number="typeForm.price"
                  id="entry-type-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  class="pl-8 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 transition-colors w-full"
                />
              </div>
            </div>

            <!-- Error -->
            <p v-if="typeFormError" class="text-xs text-red-500 font-medium">{{ typeFormError }}</p>
          </div>

          <div class="flex gap-2 pt-1">
            <button
              v-if="editingType"
              @click="cancelTypeEdit"
              class="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="submitTypeForm"
              :disabled="isTypeSubmitting"
              id="btn-save-entry-type"
              class="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-md cursor-pointer"
            >
              <span v-if="isTypeSubmitting">Saving…</span>
              <span v-else>{{ editingType ? 'Update' : 'Add Entry Type' }}</span>
            </button>
          </div>
        </div>

        <!-- Right: Entry Types List -->
        <div class="flex flex-col gap-4 min-h-0">
          <!-- Header -->
          <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm px-5 py-3.5 flex items-center justify-between shrink-0">
            <div>
              <h2 class="text-lg font-bold text-[#1a3b22] dark:text-green-400">Entry Types</h2>
              <p class="text-xs text-gray-400">{{ entryTypes.length }} type{{ entryTypes.length !== 1 ? 's' : '' }} defined</p>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="isLoadingTypes" class="flex flex-col items-center justify-center gap-3 py-20 text-gray-400 text-sm">
            <svg class="w-8 h-8 text-[#2d6a4f] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Loading…
          </div>

          <!-- Empty -->
          <div v-else-if="entryTypes.length === 0" class="flex flex-col items-center justify-center gap-2 py-20 text-gray-400">
            <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-1">
              <svg class="w-7 h-7 stroke-gray-300 dark:stroke-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">No entry types yet</p>
            <p class="text-xs text-gray-300 dark:text-gray-600">Add your first ticket category using the form on the left</p>
          </div>

          <!-- Cards Grid -->
          <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <div
              v-for="et in entryTypes"
              :key="et.id"
              class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <!-- Icon + Name -->
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d6a4f]/10 to-[#1a3b22]/10 dark:from-green-400/10 dark:to-green-600/10 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 stroke-[#2d6a4f] dark:stroke-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ et.name }}</p>
                  <p class="text-xs text-gray-400">Entry Type #{{ et.id }}</p>
                </div>
              </div>

              <!-- Price badge -->
              <div class="flex items-center justify-between">
                <span class="text-2xl font-extrabold text-[#1a3b22] dark:text-green-400">
                  {{ formatPrice(et.price) }}
                  <span class="text-sm font-medium text-gray-400 ml-1">PLN</span>
                </span>
                <div class="flex items-center gap-1">
                  <button
                    @click="deleteEntryType(et)"
                    :id="`delete-entry-type-${et.id}`"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                    title="Delete"
                  >
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ ALL TICKETS PANEL ═══ -->
      <div v-if="activeTab === 'all'" class="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto">

        <!-- Header bar -->
        <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm px-5 py-3.5 flex items-center justify-between flex-wrap gap-3 shrink-0">
          <div>
            <h2 class="text-lg font-bold text-[#1a3b22] dark:text-green-400">All Tickets</h2>
            <p class="text-xs text-gray-400">{{ tickets.length }} ticket{{ tickets.length !== 1 ? 's' : '' }} purchased</p>
          </div>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
            </svg>
            <input
              v-model="ticketSearch"
              id="ticket-search"
              type="text"
              placeholder="Search by client ID…"
              class="pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 transition-colors w-52"
            />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoadingTickets" class="flex flex-col items-center justify-center gap-3 py-20 text-gray-400 text-sm">
          <svg class="w-8 h-8 text-[#2d6a4f] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Loading tickets…
        </div>

        <!-- Error -->
        <div v-else-if="ticketsError" class="flex flex-col items-center justify-center gap-3 py-20">
          <svg class="w-10 h-10 stroke-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p class="text-sm text-red-500">{{ ticketsError }}</p>
          <button @click="fetchTickets" class="text-xs text-[#2d6a4f] underline cursor-pointer">Try again</button>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredTickets.length === 0" class="flex flex-col items-center justify-center gap-2 py-20 text-gray-400">
          <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-1">
            <svg class="w-7 h-7 stroke-gray-300 dark:stroke-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">No tickets found</p>
        </div>

        <!-- Table -->
        <div v-else class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700">
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">Ticket ID</th>
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">Client ID</th>
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">Entry Types</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="ticket in filteredTickets"
                :key="ticket.id"
                class="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td class="px-5 py-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a3b22]/5 dark:bg-green-400/10 text-[#1a3b22] dark:text-green-400 text-xs font-bold">
                    #{{ ticket.id }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <span class="text-gray-700 dark:text-gray-300 font-medium">{{ ticket.clientId }}</span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="(qty, name) in ticket.entryTypes"
                      :key="name"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      {{ name }}
                      <span class="bg-[#2d6a4f] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">{{ qty }}</span>
                    </span>
                  </div>
                </td>
                <td class="px-5 py-4 text-right">
                  <button
                    @click="deleteTicket(ticket)"
                    :id="`delete-ticket-${ticket.id}`"
                    class="w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                    title="Delete ticket"
                  >
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ═══ CONFIRM DELETE ═══ -->
    <ConfirmDialog
      v-model="showDeleteConfirm"
      :title="pendingDeleteType === 'ticket' ? 'Delete Ticket' : 'Delete Entry Type'"
      :message="pendingDeleteType === 'ticket'
        ? `Are you sure you want to delete ticket #${pendingDelete?.id}? This cannot be undone.`
        : `Are you sure you want to delete entry type &quot;${pendingDelete?.name}&quot;? This cannot be undone.`"
      confirm-label="Delete"
      cancel-label="Cancel"
      :loading="isDeleting"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />

    <!-- ═══ TOAST ═══ -->
    <transition name="toast">
      <div
        v-if="toastMsg"
        class="fixed bottom-8 right-8 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl z-[9999] pointer-events-none"
        :class="toastType === 'error' ? 'bg-red-900' : 'bg-[#1a3b22]'"
      >
        <svg v-if="toastType === 'success'" class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
        <svg v-else class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ toastMsg }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue';
import PageHeader from '../../components/PageHeader.vue';
import ConfirmDialog from '../../components/ConfirmDialog.vue';
import ticketService from '../../services/ticket.service.js';

// ── TAB ──────────────────────────────────────────────────────────
const activeTab = ref('types');

// ── ENTRY TYPES ──────────────────────────────────────────────────
const entryTypes      = ref([]);
const isLoadingTypes  = ref(false);
const editingType     = ref(null);
const isTypeSubmitting = ref(false);
const typeFormError   = ref(null);
const typeForm        = ref({ name: '', price: null });

async function fetchEntryTypes() {
  isLoadingTypes.value = true;
  try {
    const data = await ticketService.getEntryTypes();
    entryTypes.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[TicketsView] fetchEntryTypes:', err);
    showToast('Failed to load entry types.', 'error');
  } finally {
    isLoadingTypes.value = false;
  }
}

async function submitTypeForm() {
  typeFormError.value = null;
  if (!typeForm.value.name.trim()) {
    typeFormError.value = 'Name is required.';
    return;
  }
  if (typeForm.value.price === null || typeForm.value.price < 0) {
    typeFormError.value = 'Price must be 0 or greater.';
    return;
  }
  isTypeSubmitting.value = true;
  try {
    await ticketService.createEntryType({ typeName: typeForm.value.name.trim(), price: typeForm.value.price });
    showToast('Entry type added!');
    typeForm.value = { name: '', price: null };
    await fetchEntryTypes();
  } catch (err) {
    console.error('[TicketsView] submitTypeForm:', err);
    typeFormError.value = err?.response?.data?.message ?? 'Failed to save entry type.';
  } finally {
    isTypeSubmitting.value = false;
  }
}

function cancelTypeEdit() {
  editingType.value = null;
  typeForm.value    = { name: '', price: null };
  typeFormError.value = null;
}

// ── TICKETS ──────────────────────────────────────────────────────
const tickets        = ref([]);
const isLoadingTickets = ref(false);
const ticketsError   = ref(null);
const ticketSearch   = ref('');

const filteredTickets = computed(() => {
  const q = ticketSearch.value.toLowerCase().trim();
  if (!q) return tickets.value;
  return tickets.value.filter(t => String(t.clientId).includes(q) || String(t.id).includes(q));
});

async function fetchTickets() {
  isLoadingTickets.value = true;
  ticketsError.value = null;
  try {
    const data = await ticketService.getAll();
    tickets.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[TicketsView] fetchTickets:', err);
    ticketsError.value = err?.response?.data?.message ?? 'Failed to load tickets.';
  } finally {
    isLoadingTickets.value = false;
  }
}

// ── DELETE ───────────────────────────────────────────────────────
const showDeleteConfirm = ref(false);
const isDeleting        = ref(false);
const pendingDelete     = ref(null);
const pendingDeleteType = ref('ticket'); // 'ticket' | 'entryType'

function deleteEntryType(et) {
  pendingDelete.value     = et;
  pendingDeleteType.value = 'entryType';
  showDeleteConfirm.value = true;
}

function deleteTicket(ticket) {
  pendingDelete.value     = ticket;
  pendingDeleteType.value = 'ticket';
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!pendingDelete.value) return;
  isDeleting.value = true;
  try {
    if (pendingDeleteType.value === 'entryType') {
      await ticketService.deleteEntryType(pendingDelete.value.id);
      entryTypes.value = entryTypes.value.filter(e => e.id !== pendingDelete.value.id);
      showToast('Entry type deleted.');
    } else {
      await ticketService.remove(pendingDelete.value.id);
      tickets.value = tickets.value.filter(t => t.id !== pendingDelete.value.id);
      showToast('Ticket deleted.');
    }
    showDeleteConfirm.value = false;
  } catch (err) {
    showToast(err?.response?.data?.message ?? 'Failed to delete.', 'error');
    showDeleteConfirm.value = false;
  } finally {
    isDeleting.value    = false;
    pendingDelete.value = null;
  }
}

// ── HELPERS ──────────────────────────────────────────────────────
function formatPrice(price) {
  if (price == null) return '—';
  return Number(price).toFixed(2);
}

// ── TOAST ────────────────────────────────────────────────────────
const toastMsg  = ref('');
const toastType = ref('success');
let toastTimer  = null;

function showToast(msg, type = 'success') {
  toastMsg.value  = msg;
  toastType.value = type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastMsg.value = ''; }, 3000);
}

// ── INIT ─────────────────────────────────────────────────────────
async function initData() {
  await fetchEntryTypes();
  await fetchTickets();
}
onMounted(initData);
onActivated(initData);
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(1rem) scale(0.95); }
</style>
