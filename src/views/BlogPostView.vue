<script setup lang="ts">
import { computed } from 'vue'
import { useBlogPost } from '../composables/useBlogPost'
import { formatDateRu } from '../utils/formatDate'
import CommentsSection from '../components/CommentsSection.vue'

const props = defineProps<{ slug: string }>()
const { post } = useBlogPost(props.slug)

const metaLine = computed(() => {
  if (!post.value) return ''
  return `${formatDateRu(post.value.date)} · ${post.value.readingMinutes} мин чтения`
})
</script>

<template>
  <section>
    <template v-if="post">
      <router-link :to="{ name: 'blog' }" class="back-link">← Chronicle</router-link>
      <h2 class="display">{{ post.title }}</h2>
      <p class="post-meta">
        {{ metaLine }}
        <span v-if="post.tags.length" class="post-meta__tags">
          <span v-for="tag in post.tags" :key="tag">#{{ tag }}</span>
        </span>
      </p>
      <img v-if="post.cover" :src="post.cover" :alt="post.title" class="post-cover" />
      <div class="post-body" v-html="post.html" />
      <CommentsSection :key="post.slug" :slug="post.slug" />
    </template>
    <p v-else>Пост не найден.</p>
  </section>
</template>

<style scoped>
.back-link {
  font-size: 0.85rem;
  color: var(--text-dim);
  text-decoration: none;
}

.back-link:hover {
  color: var(--accent-gold);
}

.post-meta {
  color: var(--text-dim);
  font-size: 0.8rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.post-meta__tags {
  display: inline-flex;
  gap: 0.5rem;
}

.post-cover {
  width: 100%;
  max-width: 640px;
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  margin: 0.5rem 0 1rem;
}

.post-body :deep(h1),
.post-body :deep(h2),
.post-body :deep(h3) {
  font-family: 'Cinzel', serif;
  color: var(--accent-gold);
}

.post-body :deep(h2) {
  font-size: 1.15rem;
  margin-top: 1.8rem;
}

.post-body :deep(h3) {
  font-size: 1rem;
  margin-top: 1.4rem;
}

.post-body :deep(p) {
  line-height: 1.65;
}

.post-body :deep(img) {
  max-width: 100%;
  border: 1px solid var(--panel-border);
  border-radius: 4px;
}

.post-body :deep(code) {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 3px;
  padding: 0.1rem 0.35rem;
  font-size: 0.85em;
}

.post-body :deep(pre) {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  padding: 0.9rem 1rem;
  overflow-x: auto;
  line-height: 1.5;
}

.post-body :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
}

.post-body :deep(blockquote) {
  margin: 1rem 0;
  padding: 0.4rem 1rem;
  border-left: 3px solid var(--accent-red);
  background: rgba(138, 31, 31, 0.08);
  color: var(--text-dim);
}

.post-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.9rem;
  margin: 1rem 0;
  display: block;
  overflow-x: auto;
}

.post-body :deep(th),
.post-body :deep(td) {
  border: 1px solid var(--panel-border);
  padding: 0.4rem 0.7rem;
  text-align: left;
}

.post-body :deep(th) {
  background: var(--panel);
  color: var(--accent-gold);
}

.post-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--panel-border);
  margin: 1.6rem 0;
}

.post-body :deep(ul),
.post-body :deep(ol) {
  line-height: 1.6;
}
</style>
