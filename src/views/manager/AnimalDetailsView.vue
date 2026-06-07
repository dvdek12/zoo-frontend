<template>
  <div :class="['min-h-full p-6 md:p-10 transition-[filter] duration-300', showHealthModal ? 'blur-sm' : '']">

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-400">
      <svg class="animate-spin h-10 w-10 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <span class="text-sm">Loading animal data…</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
      </div>
      <p class="text-red-500 font-semibold">{{ error }}</p>
      <button @click="router.back()" class="text-sm text-[#2d6a4f] hover:underline">← Go back</button>
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
        Back to animal list
      </button>

      <!-- Hero card -->
      <div class="relative bg-gradient-to-br from-[#1a3b22] to-[#2d6a4f] dark:from-[#0a1628] dark:to-[#0d3b6e] rounded-3xl overflow-hidden shadow-2xl dark:shadow-[0_0_40px_rgba(0,153,255,0.25)]">
        <div class="absolute inset-0 opacity-10"
          style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
        </div>
        <div class="relative flex flex-col md:flex-row items-start md:items-center gap-6 p-8">
          <!-- Avatar / Ikonka z możliwością edycji -->
          <div class="shrink-0">
            <div
              class="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl cursor-pointer group"
              @click="iconFileInput?.click()"
              title="Click to change icon"
            >
              <!-- Aktualna ikonka lub placeholder -->
              <img
                v-if="iconPreviewUrl"
                :src="iconPreviewUrl"
                :alt="animal.name"
                class="w-full h-full rounded-2xl object-cover shadow-xl border-4 border-white/20"
              />
              <div
                v-else
                class="w-full h-full rounded-2xl bg-white/10 border-4 border-white/20 flex items-center justify-center shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <!-- Overlay: aparat -->
              <div class="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-white text-xs font-semibold drop-shadow">Change</span>
                </div>
              </div>
              <!-- Spinner podczas uploadu -->
              <div v-if="isIconUploading" class="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center">
                <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </div>
            </div>
            <!-- Ukryty input -->
            <input ref="iconFileInput" type="file" accept="image/*" class="hidden" @change="onIconChange" />
            <!-- Błąd uploadu -->
            <p v-if="iconUploadError" class="text-red-300 text-xs mt-2 text-center max-w-[9rem]">{{ iconUploadError }}</p>
          </div>
          <!-- Info -->
          <div class="flex-1 text-white">
            <div class="flex items-center gap-3 mb-1">
              <span class="bg-white/20 backdrop-blur-sm text-white text-xs font-mono px-2 py-0.5 rounded-lg">#{{ animal.id }}</span>
              <span class="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-0.5 rounded-full font-semibold">{{ animal.status ?? 'In zoo' }}</span>
            </div>
            <!-- Name inline edit -->
            <h1
              :contenteditable="true"
              spellcheck="false"
              @blur="onFieldBlur('name', $event)"
              @keydown.enter.prevent="$event.target.blur()"
              class="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow mb-1 outline-none rounded-lg px-1 -mx-1 cursor-text hover:bg-white/10 focus:bg-white/20 transition-colors"
            >{{ animal.name }}</h1>
            <!-- RaceName inline edit -->
            <p
              :contenteditable="true"
              spellcheck="false"
              @blur="onFieldBlur('raceName', $event)"
              @keydown.enter.prevent="$event.target.blur()"
              class="text-green-200 dark:text-cyan-300 italic text-lg outline-none rounded-lg px-1 -mx-1 cursor-text hover:bg-white/10 focus:bg-white/20 transition-colors"
            >{{ animal.raceName ?? animal.species ?? 'Unknown species' }}</p>
            <!-- Origin inline edit -->
            <p
              :contenteditable="true"
              spellcheck="false"
              @blur="onFieldBlur('origin', $event)"
              @keydown.enter.prevent="$event.target.blur()"
              class="text-green-100/70 text-sm mt-1 outline-none rounded-lg px-1 -mx-1 cursor-text hover:bg-white/10 focus:bg-white/20 transition-colors min-w-[80px]"
            >{{ animal.origin ?? '' }}</p>
          </div>
          <!-- Date badge -->
          <div class="shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center text-white">
            <p class="text-xs text-green-200 dark:text-cyan-300 mb-1 uppercase tracking-wider font-semibold">Date of arrival</p>
            <input
              type="date"
              :value="animal.dateOfArrival ? animal.dateOfArrival.slice(0,10) : ''"
              @change="onFieldBlur('dateOfArrival', $event)"
              class="text-xl font-bold bg-transparent text-white text-center outline-none cursor-pointer hover:bg-white/10 rounded-lg px-2 py-0.5 transition-colors w-full"
            />
          </div>
        </div>
      </div>

      <!-- Info grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Description -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Description</h2>
          <p
            :contenteditable="true"
            spellcheck="false"
            @blur="onFieldBlur('description', $event)"
            class="text-gray-700 dark:text-gray-200 leading-relaxed outline-none rounded-lg px-2 py-1 -mx-2 cursor-text hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:bg-gray-50 dark:focus:bg-gray-700/50 transition-colors min-h-[2rem] empty:before:content-['Click_to_add_description…'] empty:before:text-gray-400 empty:before:italic empty:before:text-sm"
          >{{ animal.description ?? '' }}</p>
        </div>

        <!-- Details -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Details</h2>
          <dl class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Species</dt>
              <dd
                :contenteditable="true"
                spellcheck="false"
                @blur="onFieldBlur('raceName', $event)"
                @keydown.enter.prevent="$event.target.blur()"
                class="text-sm font-semibold text-gray-800 dark:text-white outline-none rounded px-1 cursor-text hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors"
              >{{ animal.raceName ?? animal.species ?? '' }}</dd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Origin</dt>
              <dd
                :contenteditable="true"
                spellcheck="false"
                @blur="onFieldBlur('origin', $event)"
                @keydown.enter.prevent="$event.target.blur()"
                class="text-sm font-semibold text-gray-800 dark:text-white outline-none rounded px-1 cursor-text hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors"
              >{{ animal.origin ?? '' }}</dd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Date of arrival</dt>
              <dd class="text-sm font-semibold text-gray-800 dark:text-white">
                <input
                  type="date"
                  :value="animal.dateOfArrival ? animal.dateOfArrival.slice(0,10) : ''"
                  @change="onFieldBlur('dateOfArrival', $event)"
                  class="bg-transparent text-sm font-semibold text-gray-800 dark:text-white outline-none rounded px-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                />
              </dd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Enclosure (ID)</dt>
              <dd class="text-sm font-semibold text-gray-800 dark:text-white">{{ animal.enclosureId ?? '—' }}</dd>
            </div>
            <div class="flex justify-between items-center py-2">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Status</dt>
              <dd>
                <span class="bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-full border border-[#2d6a4f]/20">
                  {{ animal.status ?? 'In zoo' }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Attributes -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Attributes</h2>

        <!-- Assign control -->
        <div class="flex items-center gap-3 mb-5 flex-wrap">
          <!-- Filter by AnimalType -->
          <select
            v-model="selectedAnimalTypeFilter"
            class="w-44 px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 transition-colors"
          >
            <option :value="null">All types</option>
            <option v-for="type in animalTypes" :key="type.id" :value="type.id">
              {{ type.animalTypeName ?? type.name }}
            </option>
          </select>

          <select
            v-model="selectedAttributeId"
            id="attr-select"
            class="flex-1 min-w-[200px] px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 transition-colors"
          >
            <option value="">Select an attribute to assign…</option>
            <option
              v-for="attr in availableAttributes"
              :key="attr.id"
              :value="attr.id"
            >
              {{ attr.attributeName ?? attr.name ?? attr.AttributeName }}
            </option>
          </select>
          <input
            v-model="selectedAttributeValue"
            type="text"
            placeholder="Value (optional)"
            :disabled="!selectedAttributeId"
            class="w-44 px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#2d6a4f] dark:focus:border-green-400 disabled:opacity-40 transition-colors"
          />
          <button
            @click="assignAttr"
            :disabled="!selectedAttributeId || isAssigning"
            id="assign-attribute-btn"
            class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2d6a4f] hover:bg-[#1a3b22] rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg v-if="isAssigning" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <svg v-else class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Assign
          </button>
        </div>

        <!-- Error msg -->
        <p v-if="attrError" class="text-xs text-red-500 mb-3">{{ attrError }}</p>

        <!-- Attribute chips -->
        <div v-if="assignedAttributes.length > 0" class="flex flex-wrap gap-2">
          <div
            v-for="attr in assignedAttributes"
            :key="attr.id ?? attr.attributeId"
            class="group flex items-center gap-2 bg-[#f0f9f4] dark:bg-[#132a1e] border border-[#2d6a4f]/20 dark:border-green-700/40 rounded-xl px-3.5 py-2 transition-all hover:shadow-sm"
          >
            <span class="text-sm font-semibold text-[#1a3b22] dark:text-green-300">
              {{ attr.attributeName ?? attr.name ?? attr.AttributeName ?? '—' }}
            </span>
            <span v-if="attr.attributeValue ?? attr.value" class="text-xs text-[#2d6a4f] dark:text-green-400 opacity-70">
              {{ attr.attributeValue ?? attr.value }}
            </span>
            <button
              @click="unassignAttr(attr)"
              :id="`remove-attr-${attr.id ?? attr.attributeId}`"
              class="w-4 h-4 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-all ml-1 cursor-pointer"
              title="Unassign attribute"
            >
              <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        <p v-else class="text-gray-400 italic text-sm">This animal has no assigned attributes.</p>
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
            <h2 class="text-base font-bold text-gray-800 dark:text-white">Health history</h2>
            <p class="text-xs text-gray-400 dark:text-gray-500">Test results and veterinary checkups</p>
          </div>
          <span class="ml-auto bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
            {{ history.length }} entries
          </span>
          <button
            type="button"
            @click="showHealthModal = true"
            class="ml-2 flex items-center gap-1.5 bg-[#2d6a4f] hover:bg-[#1a3b22] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
            </svg>
            Add entry
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoadingHistory" class="flex items-center gap-3 text-gray-400 py-6 justify-center">
          <svg class="animate-spin h-5 w-5 text-[#2d6a4f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="text-sm">Loading health history…</span>
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
          <p class="text-sm italic">No history entries for this animal.</p>
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
                    {{ formatDateTime(entry.dateOfLastCheckup ?? entry.DateOfLastCheckup) }}
                  </time>
                </div>
                <span class="text-xs text-gray-400 font-mono">#{{ entry.id ?? entry.Id }}</span>
              </div>

              <!-- Metryki zdrowia -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y sm:divide-y-0 divide-gray-200 dark:divide-gray-600 p-0">

                <!-- Temperatura -->
                <div class="flex flex-col items-center justify-center gap-1 py-4 px-3">
                  <span class="text-lg font-extrabold text-gray-800 dark:text-white leading-none">{{ entry.temperature ?? entry.Temperature ?? '—' }}<span class="text-xs font-normal text-gray-400 ml-0.5">°C</span></span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Temperature</span>
                </div>

                <!-- Waga -->
                <div class="flex flex-col items-center justify-center gap-1 py-4 px-3">
                  <span class="text-lg font-extrabold text-gray-800 dark:text-white leading-none">{{ entry.weight ?? entry.Weight ?? '—' }}<span class="text-xs font-normal text-gray-400 ml-0.5">kg</span></span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Weight</span>
                </div>

                <!-- Szczepienie -->
                <div class="flex flex-col items-center justify-center gap-1 py-4 px-3">
                  <span
                    class="text-sm font-bold leading-none"
                    :class="isVacinated(entry) ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'"
                  >{{ isVacinated(entry) ? 'Yes' : 'No' }}</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Vaccination</span>
                </div>

                <!-- Stan zdrowia -->
                <div class="flex flex-col items-center justify-center gap-1 py-4 px-3">
                  <span class="text-sm font-bold leading-none" :class="conditionColor(entry)">
                    {{ conditionLabel(entry) }}
                  </span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Health status</span>
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
import { ref, watch, computed } from 'vue';
import { useTitle } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import animalService from '../../services/animal.service';
import animalTypeService from '../../services/animalType.service';
import iconService from '../../services/icon.service';
import { invalidateIcon } from '../../composables/useIcon';
import { useAnimalConditions } from '../../composables/useAnimalConditions';
import { useBreadcrumbStore } from '../../stores/breadcrumb';
import AddHealthRecordModal from '../../components/animals/AddHealthRecordModal.vue';

const { load: loadConditions, labelFor: conditionLabel, colorFor: conditionColor } = useAnimalConditions();

const route           = useRoute();
const router          = useRouter();
const breadcrumbStore = useBreadcrumbStore();
const title           = useTitle();

const animal    = ref(null);
const isLoading = ref(false);
const error     = ref(null);

// ─── ATRYBUTY ───────────────────────────────────────────────────────────────
const allAttributes       = ref([]);   // wszystkie dostępne atrybuty z /attributes
const assignedAttributes  = ref([]);   // atrybuty przypisane do tego zwierzęcia
const selectedAttributeId = ref('');
const selectedAttributeValue = ref('');
const selectedAnimalTypeFilter = ref(null);
const isAssigning         = ref(false);
const attrError           = ref(null);

const animalTypes = ref([]);

async function fetchAnimalTypes() {
  try {
    const data = await animalTypeService.getAll();
    animalTypes.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[AnimalDetailsView] fetchAnimalTypes:', e);
  }
}

// tylko te atrybuty, które nie są jeszcze przypisane
const availableAttributes = computed(() => {
  const assignedIds = new Set(assignedAttributes.value.map(a => a.id ?? a.attributeId));
  let filtered = allAttributes.value.filter(a => !assignedIds.has(a.id));

  if (selectedAnimalTypeFilter.value === 'global') {
    filtered = filtered.filter(a => !a.animalType || a.animalType === 'Unknown');
  } else if (selectedAnimalTypeFilter.value !== null) {
    const selectedType = animalTypes.value.find(t => t.id === selectedAnimalTypeFilter.value);
    const selectedName = selectedType?.animalTypeName ?? selectedType?.name;
    filtered = filtered.filter(a => a.animalType === selectedName);
  }

  return filtered;
});

async function fetchAllAttributes() {
  try {
    const data = await animalService.getAllAttributes();
    allAttributes.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[AnimalDetailsView] fetchAllAttributes:', e);
  }
}

async function fetchAssignedAttributes(animalId) {
  try {
    const data = await animalService.getAssignedAttributes(animalId);
    assignedAttributes.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[AnimalDetailsView] fetchAssignedAttributes:', e);
  }
}

async function assignAttr() {
  if (!selectedAttributeId.value || isAssigning.value) return;
  attrError.value = null;
  isAssigning.value = true;
  try {
    await animalService.assignAttribute(route.params.id, selectedAttributeId.value, selectedAttributeValue.value);
    selectedAttributeId.value = '';
    selectedAttributeValue.value = '';
    await fetchAssignedAttributes(route.params.id);
  } catch (e) {
    attrError.value = e?.response?.data?.message ?? 'Failed to assign attribute.';
  } finally {
    isAssigning.value = false;
  }
}

async function unassignAttr(attr) {
  const attrId = attr.id ?? attr.attributeId;
  try {
    await animalService.unassignAttribute(route.params.id, attrId);
    assignedAttributes.value = assignedAttributes.value.filter(
      a => (a.id ?? a.attributeId) !== attrId
    );
  } catch (e) {
    attrError.value = e?.response?.data?.message ?? 'Failed to unassign attribute.';
  }
}

// --- IKONKA ---
const iconFileInput    = ref(null);
const iconPreviewUrl   = ref(null);
const isIconUploading  = ref(false);
const iconUploadError  = ref(null);

const onIconChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  iconUploadError.value = null;

  const existingIconId = animal.value?.iconId ?? animal.value?.IconId ?? null;

  isIconUploading.value = true;
  try {
    if (existingIconId) {
      // Aktualizuj istniejącą ikonkę
      await iconService.update(existingIconId, file);
      // Unieważnij cache — tabela załaduje świeże zdjęcie przy następnym renderze
      invalidateIcon(existingIconId);
    } else {
      // Uploaduj nową ikonkę (brak wcześniejszej)
      await iconService.upload(file);
    }
    // Odśwież podgląd z nowego pliku lokalnie (bez ponownego fetch)
    if (iconPreviewUrl.value) URL.revokeObjectURL(iconPreviewUrl.value);
    iconPreviewUrl.value = URL.createObjectURL(file);
  } catch (err) {
    console.error('[AnimalDetailsView] icon update error:', err);
    iconUploadError.value = 'Failed to save icon.';
  } finally {
    isIconUploading.value = false;
    if (iconFileInput.value) iconFileInput.value.value = '';
  }
};

// --- EDYCJA INLINE ---
async function onFieldBlur(field, event) {
  const newValue = field === 'dateOfArrival'
    ? event.target.value
    : event.target.innerText.trim();

  const current = field === 'dateOfArrival'
    ? (animal.value.dateOfArrival ? animal.value.dateOfArrival.slice(0, 10) : '')
    : (animal.value[field] ?? '');

  if (newValue === current) return;
  if (field === 'name' && !newValue) {
    event.target.innerText = animal.value.name;
    return;
  }

  try {
    await animalService.update(route.params.id, {
      Name:          field === 'name'          ? newValue : (animal.value.name ?? ''),
      RaceName:      field === 'raceName'       ? newValue : (animal.value.raceName ?? null),
      Origin:        field === 'origin'         ? newValue : (animal.value.origin ?? null),
      DateOfArrival: field === 'dateOfArrival'  ? newValue : (animal.value.dateOfArrival ?? null),
      Description:   field === 'description'   ? newValue : (animal.value.description ?? null),
    });
    animal.value = { ...animal.value, [field]: newValue || null };
    if (field === 'name') breadcrumbStore.setLabel(newValue);
  } catch (err) {
    console.error('[AnimalDetailsView] inline save error:', err);
    if (field !== 'dateOfArrival') event.target.innerText = animal.value[field] ?? '';
  }
}

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
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};

const formatDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const isVacinated = (entry) => entry.isVacinated ?? entry.IsVacinated ?? false;

const fetchHistory = async (id) => {
  isLoadingHistory.value = true;
  historyError.value = null;
  try {
    const data = await animalService.getHistory(id);
    history.value = Array.isArray(data) ? data : (data ? [data] : []);
  } catch (err) {
    if (err?.response?.status === 404) {
      history.value = [];
      return;
    }
    console.error('[AnimalDetailsView] fetchHistory error:', err);
    historyError.value = err?.response?.data?.message ?? 'Failed to load animal history.';
  } finally {
    isLoadingHistory.value = false;
  }
};

// watch na ID — obsługuje zarówno pierwsze wejście jak i keep-alive reuse
// (np. przejście z /animals/1 na /animals/2 przy tym samym komponencie w cache)
watch(
  () => route.params.id,
  async (id) => {
    if (!id) return;
    isLoading.value = true;
    error.value = null;
    animal.value = null;
    iconPreviewUrl.value = null;
    assignedAttributes.value = [];
    selectedAttributeId.value = '';
    attrError.value = null;
    try {
      const data = await animalService.getById(id);
      animal.value = data;
      breadcrumbStore.setLabel(data?.name ?? `Animal #${id}`);
      title.value = data?.name ? `${data.name} | ZooNe` : `Animal #${id} | ZooNe`;

      const iconId = data?.iconId ?? data?.IconId ?? null;
      if (iconId) {
        try {
          iconPreviewUrl.value = await iconService.getById(iconId);
        } catch {
          // cicho ignoruj
        }
      }
    } catch (err) {
      console.error('[AnimalDetailsView] fetch error:', err);
      error.value = err?.response?.data?.message ?? 'Failed to load animal data.';
    } finally {
      isLoading.value = false;
    }
    fetchHistory(id);
    fetchAllAttributes();
    fetchAssignedAttributes(id);
    fetchAnimalTypes();
  },
  { immediate: true }
);
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
