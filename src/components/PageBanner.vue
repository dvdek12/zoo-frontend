<template>
  <div class="page-banner" :style="bannerStyle">
    <!-- Gradient overlay: mocny, wielowarstwowy -->
    <div class="page-banner__overlay" />

    <!-- Content: padding wyrównany z lewej i z góry -->
    <div class="page-banner__content">
      <div class="page-banner__text">
        <div class="page-banner__eyebrow" v-if="eyebrow">{{ eyebrow }}</div>
        <h1 class="page-banner__title">{{ title }}</h1>
        <p v-if="subtitle" class="page-banner__subtitle">{{ subtitle }}</p>
      </div>

      <!-- Stat pills (opcjonalne) -->
      <div v-if="stats && stats.length" class="page-banner__stats">
        <div v-for="stat in stats" :key="stat.label" class="page-banner__stat">
          <span class="page-banner__stat-value">{{ stat.value }}</span>
          <span class="page-banner__stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Dolne rozmycie — bardzo smooth, długi fade -->
    <div class="page-banner__fade" />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
  eyebrow: { type: String, default: null },
  image: { type: String, required: true },
  stats: { type: Array, default: () => [] },
  imagePosition: { type: String, default: 'center' },
});

const bannerStyle = computed(() => ({
  backgroundImage: `url(${props.image})`,
  backgroundPosition: props.imagePosition,
}));
</script>

<style scoped>
.page-banner {
  position: relative;
  width: 100%;
  height: 210px;
  background-size: cover;
  background-repeat: no-repeat;
  flex-shrink: 0;
  overflow: hidden;
}

/* ═══ GRADIENT OVERLAY — mocny, wielowarstwowy ═══ */
.page-banner__overlay {
  position: absolute;
  inset: 0;
  background:
    /* od góry — mocne przyciemnienie dla breadcrumba */
    linear-gradient(
      to bottom,
      rgba(5, 18, 10, 0.82) 0%,
      rgba(8, 24, 14, 0.68) 30%,
      rgba(10, 28, 16, 0.38) 60%,
      transparent 100%
    ),
    /* od lewej — dla tytułu */
    linear-gradient(
      105deg,
      rgba(5, 18, 10, 0.88) 0%,
      rgba(8, 24, 14, 0.65) 32%,
      rgba(10, 28, 16, 0.22) 62%,
      transparent 100%
    ),
    /* ogólne przyciemnienie całości */
    rgba(0, 0, 0, 0.18);
  z-index: 1;
}

/* ═══ CONTENT ═══ */
.page-banner__content {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  height: 100%;
  /* px-8 = 32px — identyczny z breadcrumbem i treścią strony */
  padding: 0 32px 36px;
}

.page-banner__text { flex: 1; min-width: 0; }

.page-banner__eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(74, 222, 128, 0.92);
  margin-bottom: 6px;
}

.page-banner__title {
  font-family: 'Oleo Script', cursive;
  font-size: 2.7rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.01em;
  color: #ffffff;
  text-shadow: 0 2px 28px rgba(0, 0, 0, 0.55);
  margin: 0 0 6px 0;
}

.page-banner__subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.62);
  margin: 0;
  font-weight: 400;
}

/* Stat pills */
.page-banner__stats {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-bottom: 4px;
  flex-shrink: 0;
}
.page-banner__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  padding: 10px 18px;
  min-width: 72px;
}
.page-banner__stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}
.page-banner__stat-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 3px;
}

/* ═══ DOLNY FADE — bardzo smooth, 100px ═══ */
.page-banner__fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: linear-gradient(
    to bottom,
    transparent                           0%,
    rgba(251, 251, 250, 0.15)            30%,
    rgba(251, 251, 250, 0.55)            60%,
    rgba(251, 251, 250, 0.90)            85%,
    rgba(251, 251, 250, 1.00)           100%
  );
  z-index: 4;
  pointer-events: none;
}

:global(.dark) .page-banner__fade {
  background: linear-gradient(
    to bottom,
    transparent                     0%,
    rgba(17, 24, 39, 0.08)         20%,
    rgba(17, 24, 39, 0.28)         40%,
    rgba(17, 24, 39, 0.60)         60%,
    rgba(17, 24, 39, 0.88)         80%,
    rgba(17, 24, 39, 1.00)        100%
  );
}
</style>
