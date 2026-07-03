<script setup lang="ts">
import { useBlogPost } from '../composables/useBlogPost'

const props = defineProps<{ slug: string }>()
const { post } = useBlogPost(props.slug)
</script>

<template>
  <section>
    <template v-if="post">
      <h2 class="display">{{ post.title }}</h2>
      <p class="post-date">{{ post.date }}</p>
      <div class="post-body" v-html="post.html" />
    </template>
    <p v-else>Пост не найден.</p>
  </section>
</template>

<style scoped>
.post-date {
  color: var(--text-dim);
  font-size: 0.8rem;
}

.post-body :deep(h1) {
  font-family: 'Cinzel', serif;
}
</style>
