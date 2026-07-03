<script setup lang="ts">
import { computed } from 'vue'
import { projects } from '../data/projects'
import type { ProjectCategory } from '../types'
import ProjectCard from '../components/ProjectCard.vue'

const categoryOrder: ProjectCategory[] = ['platform', 'games', 'minecraft', 'audio', 'tools']

const categoryTitles: Record<ProjectCategory, string> = {
  platform: 'Платформы и веб',
  games: 'Игры',
  minecraft: 'Minecraft-плагины',
  audio: 'Аудио',
  tools: 'Инструменты',
}

const grouped = computed(() =>
  categoryOrder
    .map((category) => ({ category, items: projects.filter((p) => p.category === category) }))
    .filter((group) => group.items.length > 0)
)
</script>

<template>
  <section>
    <h2 class="display">Quest Log <span class="sub">— проекты</span></h2>
    <p class="lead">
      Пет-проекты и эксперименты. Всё с исходниками на GitHub — можно открыть код любого.
    </p>
    <div v-for="group in grouped" :key="group.category" class="projects-group">
      <h3 class="projects-group__title">{{ categoryTitles[group.category] }}</h3>
      <ProjectCard v-for="project in group.items" :key="project.slug" :project="project" />
    </div>
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

.projects-group {
  margin-bottom: 1.5rem;
}

.projects-group__title {
  color: var(--text-dim);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--panel-border);
  padding-bottom: 0.3rem;
}
</style>
