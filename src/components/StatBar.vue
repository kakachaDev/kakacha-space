<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'StatBar' })

const props = defineProps<{ label: string; value: number }>()

const clamped = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <div class="stat-bar">
    <span class="stat-bar__label">{{ label }}</span>
    <div class="stat-bar__track">
      <div class="stat-bar__fill" :style="{ width: `${clamped}%` }" />
    </div>
  </div>
</template>

<style scoped>
.stat-bar {
  margin-bottom: 0.6rem;
}

.stat-bar__label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-dim);
  margin-bottom: 0.25rem;
}

.stat-bar__track {
  height: 8px;
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-red), var(--accent-gold));
}
</style>
