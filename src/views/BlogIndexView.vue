<script setup lang="ts">
import { useBlogPosts } from '../composables/useBlogPosts'
import { formatDateRu } from '../utils/formatDate'

const { posts } = useBlogPosts()
</script>

<template>
  <section>
    <h2 class="display">Chronicle <span class="sub">— блог</span></h2>
    <p v-if="posts.length === 0" class="empty-state">Хроники пока не написаны.</p>
    <ul v-else class="post-list">
      <li v-for="post in posts" :key="post.slug">
        <router-link :to="{ name: 'blog-post', params: { slug: post.slug } }" class="post-list__link">
          <h3>{{ post.title }}</h3>
          <p class="post-list__meta">
            {{ formatDateRu(post.date) }} · {{ post.readingMinutes }} мин чтения
          </p>
          <p class="post-list__excerpt">{{ post.excerpt }}</p>
          <ul v-if="post.tags.length" class="post-list__tags">
            <li v-for="tag in post.tags" :key="tag">#{{ tag }}</li>
          </ul>
        </router-link>
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

.post-list {
  list-style: none;
  padding: 0;
}

.post-list li {
  border-bottom: 1px solid var(--panel-border);
}

.post-list__link {
  display: block;
  padding: 0.9rem 0;
  text-decoration: none;
  color: inherit;
}

.post-list__link:hover h3 {
  text-decoration: underline;
}

.post-list h3 {
  margin: 0;
  color: var(--accent-gold);
  font-size: 1.05rem;
}

.post-list__meta {
  color: var(--text-dim);
  font-size: 0.8rem;
  margin: 0.25rem 0 0.4rem;
}

.post-list__excerpt {
  margin: 0;
  color: var(--text);
  font-size: 0.92rem;
}

.post-list__tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0.45rem 0 0;
}

.post-list__tags li {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.empty-state {
  color: var(--text-dim);
}
</style>
