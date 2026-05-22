<template>
  <Transition name="npb-fade">
    <div v-if="visible" class="npb-wrap" aria-hidden="true">
      <div class="npb-bar" :style="{ width: progress + '%' }" />
      <!-- glow tip -->
      <div class="npb-tip" :style="{ left: progress + '%' }" />
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router  = useRouter();
const visible = ref(false);
const progress = ref(0);

let rafId   = null;
let timer   = null;

function start() {
  clearInterval(timer);
  cancelAnimationFrame(rafId);
  progress.value = 0;
  visible.value  = true;

  // Quickly jump to 15 %, then slow down toward 90 %
  let current = 0;
  timer = setInterval(() => {
    if (current < 15)      current += 3;
    else if (current < 50) current += 1.5;
    else if (current < 80) current += 0.6;
    else if (current < 90) current += 0.2;
    progress.value = Math.min(current, 90);
  }, 30);
}

function finish() {
  clearInterval(timer);
  progress.value = 100;
  setTimeout(() => {
    visible.value  = false;
    progress.value = 0;
  }, 350);
}

let removeStart  = null;
let removeFinish = null;

onMounted(() => {
  removeStart  = router.beforeEach(() => start());
  removeFinish = router.afterEach(()  => finish());
});

onBeforeUnmount(() => {
  removeStart?.();
  removeFinish?.();
  clearInterval(timer);
});
</script>

<style scoped>
.npb-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 99999;
  pointer-events: none;
}

.npb-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #2d6a4f, #52b788, #74c69d);
  border-radius: 0 9999px 9999px 0;
  transition: width 0.25s ease;
  box-shadow: 0 0 8px rgba(45, 106, 79, 0.6), 0 0 20px rgba(45, 106, 79, 0.3);
}

.npb-tip {
  position: absolute;
  top: -2px;
  width: 80px;
  height: 7px;
  background: radial-gradient(ellipse at center, rgba(116, 198, 157, 0.8) 0%, transparent 70%);
  transform: translateX(-50%);
  transition: left 0.25s ease;
  pointer-events: none;
}

/* Fade out on finish */
.npb-fade-leave-active { transition: opacity 0.3s ease 0.05s; }
.npb-fade-leave-to     { opacity: 0; }
</style>
