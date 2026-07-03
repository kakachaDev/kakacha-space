<script setup lang="ts">
import type { Project } from '../types'

defineOptions({ name: 'ProjectCard' })
defineProps<{ project: Project }>()
</script>

<template>
  <article class="project-card">
    <h3>{{ project.name }}</h3>
    <p>{{ project.description }}</p>
    <p v-if="project.archived" class="project-card__badge">on hold</p>
    <div class="project-card__links">
      <a :href="project.repoUrl" data-testid="repo-link" target="_blank" rel="noopener">GitHub</a>
      <a v-if="project.demoUrl" :href="project.demoUrl" data-testid="demo-link" target="_blank" rel="noopener">
        Play
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

.project-card h3 {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
}

.project-card p {
  margin: 0 0 0.5rem;
  color: var(--text-dim);
  font-size: 0.92rem;
}

.project-card__badge {
  display: inline-block;
  color: var(--accent-gold);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-card__links {
  display: flex;
  gap: 1rem;
}
</style>
