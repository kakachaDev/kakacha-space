<script setup lang="ts">
interface MenuItem {
  label: string
  to: { name: string }
}

const items: MenuItem[] = [
  { label: 'Character', to: { name: 'home' } },
  { label: 'Quest Log', to: { name: 'projects' } },
  { label: 'Inventory', to: { name: 'stack' } },
  { label: 'Chronicle', to: { name: 'blog' } },
  { label: 'Notice Board', to: { name: 'contact' } },
]
</script>

<template>
  <nav class="menu-nav" aria-label="Main menu">
    <ul>
      <li v-for="item in items" :key="item.label">
        <router-link :to="item.to" class="menu-nav__link" active-class="menu-nav__link--active">
          {{ item.label }}
        </router-link>
      </li>
    </ul>
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

.menu-nav__link--active,
.menu-nav__link:hover {
  color: var(--accent-gold);
  border-left-color: var(--accent-red);
  background: rgba(138, 31, 31, 0.08);
}
</style>
