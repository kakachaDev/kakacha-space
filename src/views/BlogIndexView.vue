<script setup lang="ts">
import { useBlogPosts } from '../composables/useBlogPosts'

const { posts } = useBlogPosts()
</script>

<template>
  <section>
    <h2 class="display">Chronicle</h2>
    <p v-if="posts.length === 0" class="empty-state">Хроники пока не написаны.</p>
    <ul v-else class="post-list">
      <li v-for="post in posts" :key="post.slug">
        <router-link :to="{ name: 'blog-post', params: { slug: post.slug } }">
          <h3>{{ post.title }}</h3>
        </router-link>
        <p class="post-list__date">{{ post.date }}</p>
        <p>{{ post.excerpt }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.post-list {
  list-style: none;
  padding: 0;
}

.post-list li {
  border-bottom: 1px solid var(--panel-border);
  padding: 0.75rem 0;
}

.post-list h3 {
  margin: 0;
  color: var(--accent-gold);
}

.post-list__date {
  color: var(--text-dim);
  font-size: 0.8rem;
  margin: 0.2rem 0 0.4rem;
}

.empty-state {
  color: var(--text-dim);
}
</style>
