<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden" style="height: 88vh;">

          <!-- Header -->
          <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#e1eae2] flex items-center justify-center">
                <FileText class="w-4 h-4 text-[#1a3b22]" />
              </div>
              <div>
                <p class="font-extrabold text-[#1a3b22] text-sm leading-none">{{ report?.title }}</p>
                <p class="text-gray-400 text-xs mt-0.5">PDF Preview</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="$emit('download', report)"
                :disabled="downloadLoading"
                class="flex items-center gap-1.5 px-4 py-2 bg-[#1a3b22] hover:bg-[#122a18] text-white rounded-full text-xs font-bold transition-colors disabled:opacity-50"
              >
                <Loader2 v-if="downloadLoading" class="w-3.5 h-3.5 animate-spin" />
                <Download v-else class="w-3.5 h-3.5" />
                Download
              </button>
              <button
                @click="$emit('close')"
                class="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Body: iframe lub loading -->
          <div class="flex-1 overflow-hidden bg-gray-100">
            <iframe
              v-if="blobUrl"
              :src="blobUrl"
              class="w-full h-full border-none"
              title="PDF Preview"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400 gap-3">
              <Loader2 class="w-5 h-5 animate-spin" />
              <span class="text-sm font-medium">Loading preview...</span>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { FileText, Download, X, Loader2 } from 'lucide-vue-next';

defineProps({
  modelValue:      { type: Boolean, required: true },
  report:          { type: Object,  default: null  },
  blobUrl:         { type: String,  default: null  },
  downloadLoading: { type: Boolean, default: false },
});

defineEmits(['close', 'download']);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
