<script setup lang="ts">
import { useIsWidePane } from '../composables/useIsWidePane'
import MenuNav from '../components/MenuNav.vue'

const { isWide } = useIsWidePane()
</script>

<template>
  <div class="menu-layout" :class="{ 'menu-layout--wide': isWide }">
    <aside class="menu-layout__rail">
      <MenuNav />
    </aside>
    <main class="menu-layout__content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.menu-layout {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.menu-layout__rail {
  background: var(--panel);
  border-bottom: 1px solid var(--panel-border);
}

.menu-layout__content {
  padding: 1.25rem;
}

.menu-layout--wide {
  display: grid;
  grid-template-columns: 260px 1fr;
}

.menu-layout--wide .menu-layout__rail {
  border-bottom: none;
  border-right: 1px solid var(--panel-border);
  min-height: 100vh;
}
</style>
