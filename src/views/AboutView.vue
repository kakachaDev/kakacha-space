<script setup lang="ts">
import StatBar from '../components/StatBar.vue'
</script>

<template>
  <section>
    <h2 class="display">Character</h2>
    <p>
      Frontend developer with a gamedev background. Currently building the frontend of a
      real-time PWA product — from architecture to release. Before that, 5+ years in gamedev:
      Unity, a custom ECS, engine tooling.
    </p>
    <p>
      Side projects live in Minecraft/Paper plugins, Godot games, a JUCE audio plugin, and
      Telegram bots — see the Quest Log for the full list.
    </p>
    <div class="stats">
      <StatBar label="Frontend" :value="90" />
      <StatBar label="Gamedev" :value="85" />
      <StatBar label="Audio/DSP" :value="55" />
      <StatBar label="Coffee" :value="100" />
    </div>
  </section>
</template>

<style scoped>
.stats {
  margin-top: 1.5rem;
  max-width: 320px;
}
</style>
