<script setup lang="ts">
import { ref } from 'vue'
import { useKeyboardNav } from '../composables/useKeyboardNav'
import { useMenuSound } from '../composables/useMenuSound'

interface MenuItem {
  label: string
  sub: string
  to: { name: string }
}

const items: MenuItem[] = [
  { label: 'Character', sub: 'обо мне', to: { name: 'home' } },
  { label: 'Quest Log', sub: 'проекты', to: { name: 'projects' } },
  { label: 'Inventory', sub: 'стек', to: { name: 'stack' } },
  { label: 'Chronicle', sub: 'блог', to: { name: 'blog' } },
  { label: 'Notice Board', sub: 'контакты', to: { name: 'contact' } },
]

const containerRef = ref<HTMLElement | null>(null)
useKeyboardNav(containerRef)

const { enabled: soundEnabled, toggle: toggleSound, playHover, playSelect } = useMenuSound()
</script>

<template>
  <nav class="menu-nav" aria-label="Main menu">
    <ul ref="containerRef">
      <li v-for="item in items" :key="item.label">
        <router-link
          :to="item.to"
          class="menu-nav__link"
          active-class="menu-nav__link--active"
          @mouseenter="playHover"
          @focus="playHover"
          @click="playSelect"
        >
          {{ item.label }}
          <span class="menu-nav__sub">{{ item.sub }}</span>
        </router-link>
      </li>
    </ul>
    <button type="button" class="menu-nav__sound-toggle" @click="toggleSound">
      {{ soundEnabled ? 'Звук: вкл' : 'Звук: выкл' }}
    </button>
  </nav>
</template>

<style scoped>
.menu-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.menu-nav__link {
  display: block;
  padding: 1rem 1.25rem;
  color: var(--text-dim);
  text-decoration: none;
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  border-left: 3px solid transparent;
}

.menu-nav__sub {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  color: var(--text-dim);
  letter-spacing: 0.04em;
  margin-top: 0.1rem;
}

.menu-nav__link--active,
.menu-nav__link:hover {
  color: var(--accent-gold);
  border-left-color: var(--accent-red);
  background: rgba(138, 31, 31, 0.08);
}

.menu-nav__sound-toggle {
  margin: 0.75rem 1.25rem;
  padding: 0.4rem 0.75rem;
  background: transparent;
  border: 1px solid var(--panel-border);
  color: var(--text-dim);
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.menu-nav__sound-toggle:hover {
  color: var(--accent-gold);
  border-color: var(--accent-gold);
}
</style>
