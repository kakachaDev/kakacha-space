<script setup lang="ts">
import type { Project, ProjectStatus } from '../types'

defineOptions({ name: 'ProjectCard' })
defineProps<{ project: Project }>()

const statusLabels: Record<ProjectStatus, string> = {
  active: '► в разработке',
  done: '✓ завершён',
  onhold: '❄ на паузе',
}
</script>

<template>
  <article class="project-card">
    <header class="project-card__head">
      <span class="project-card__icon" aria-hidden="true">{{ project.icon }}</span>
      <h3>{{ project.name }}</h3>
      <span v-if="project.year" class="project-card__year">{{ project.year }}</span>
      <span class="project-card__status" :class="`project-card__status--${project.status}`" data-testid="status">
        {{ statusLabels[project.status] }}
      </span>
    </header>
    <p>{{ project.description }}</p>
    <p v-if="project.highlight" class="project-card__highlight" data-testid="highlight">
      ★ {{ project.highlight }}
    </p>
    <ul class="project-card__tags" data-testid="tags">
      <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
    </ul>
    <div class="project-card__links">
      <a :href="project.repoUrl" data-testid="repo-link" target="_blank" rel="noopener">GitHub</a>
      <a v-if="project.demoUrl" :href="project.demoUrl" data-testid="demo-link" target="_blank" rel="noopener">
        Демо
      </a>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.project-card__head {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.project-card__icon {
  font-size: 1.1rem;
}

.project-card h3 {
  margin: 0;
  font-size: 1.05rem;
}

.project-card__year {
  color: var(--text-dim);
  font-size: 0.8rem;
}

.project-card__status {
  margin-left: auto;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.project-card__status--active {
  color: var(--accent-gold);
}

.project-card__status--done {
  color: var(--text-dim);
}

.project-card__status--onhold {
  color: #7d93a8;
}

.project-card p {
  margin: 0.5rem 0 0;
  color: var(--text-dim);
  font-size: 0.92rem;
}

.project-card__highlight {
  color: var(--text) !important;
  font-size: 0.88rem !important;
}

.project-card__tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0;
  margin: 0.6rem 0 0;
}

.project-card__tags li {
  font-size: 0.72rem;
  color: var(--text-dim);
  border: 1px solid var(--panel-border);
  border-radius: 3px;
  padding: 0.12rem 0.45rem;
}

.project-card__links {
  display: flex;
  gap: 1rem;
  margin-top: 0.65rem;
}
</style>
