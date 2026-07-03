<script setup lang="ts">
import { stackItems } from '../data/stack'
</script>

<template>
  <section>
    <h2 class="display">Inventory</h2>
    <p>What this site itself is built with.</p>
    <ul class="stack-list">
      <li v-for="item in stackItems" :key="item.name" data-testid="stack-item">
        <strong>{{ item.name }}</strong>
        <span>{{ item.note }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.stack-list {
  list-style: none;
  padding: 0;
}

.stack-list li {
  border-bottom: 1px solid var(--panel-border);
  padding: 0.6rem 0;
}

.stack-list strong {
  display: block;
  color: var(--accent-gold);
}

.stack-list span {
  display: block;
  color: var(--text-dim);
  font-size: 0.88rem;
}
</style>
