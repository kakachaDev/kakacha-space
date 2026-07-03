<script setup lang="ts">
import { siteStack, skillCategories } from '../data/stack'
</script>

<template>
  <section>
    <h2 class="display">Inventory <span class="sub">— стек</span></h2>
    <p class="lead">
      Каждый предмет — с пометкой, где он был в деле. Ничего «знаком по туториалам» здесь нет.
    </p>

    <div v-for="category in skillCategories" :key="category.id" class="skill-group">
      <h3 class="skill-group__title">{{ category.title }}</h3>
      <ul class="stack-list">
        <li v-for="item in category.items" :key="item.name" data-testid="stack-item">
          <strong>{{ item.name }}</strong>
          <span>{{ item.note }}</span>
        </li>
      </ul>
    </div>

    <h3 class="skill-group__title site-title">Из чего сделан этот сайт</h3>
    <p class="lead">
      Подробный разбор —
      <router-link :to="{ name: 'blog-post', params: { slug: '2026-07-03-kak-ustroen-etot-sayt' } }">
        в блоге</router-link
      >, исходники —
      <a href="https://github.com/kakachaDev/kakacha-space" target="_blank" rel="noopener">на GitHub</a>.
    </p>
    <ul class="stack-list">
      <li v-for="item in siteStack" :key="item.name" data-testid="site-stack-item">
        <strong>{{ item.name }}</strong>
        <span>{{ item.note }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.sub {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: var(--text-dim);
  letter-spacing: 0;
}

.lead {
  color: var(--text-dim);
  font-size: 0.92rem;
}

.skill-group__title {
  margin-top: 1.6rem;
  color: var(--accent-gold);
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--panel-border);
  padding-bottom: 0.3rem;
}

.site-title {
  margin-top: 2.2rem;
}

.stack-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stack-list li {
  border-bottom: 1px solid var(--panel-border);
  padding: 0.6rem 0;
}

.stack-list strong {
  display: block;
  color: var(--text);
}

.stack-list span {
  display: block;
  color: var(--text-dim);
  font-size: 0.88rem;
}
</style>
