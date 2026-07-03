<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineOptions({ name: 'CommentsSection' })

const props = defineProps<{ slug: string }>()

interface Remark42Global {
  destroy?: () => void
  createInstance?: (config: Record<string, unknown>) => void
}

const remarkHost = (import.meta.env.VITE_REMARK42_HOST as string | undefined) ?? ''
const remarkSiteId = (import.meta.env.VITE_REMARK42_SITE_ID as string | undefined) ?? 'kakacha-space'

const giscusRepo = (import.meta.env.VITE_GISCUS_REPO as string | undefined) ?? ''
const giscusRepoId = (import.meta.env.VITE_GISCUS_REPO_ID as string | undefined) ?? ''
const giscusCategory = (import.meta.env.VITE_GISCUS_CATEGORY as string | undefined) ?? 'Blog'
const giscusCategoryId = (import.meta.env.VITE_GISCUS_CATEGORY_ID as string | undefined) ?? ''

const backend = remarkHost ? 'remark42' : giscusRepo && giscusRepoId && giscusCategoryId ? 'giscus' : 'none'

const giscusContainer = ref<HTMLElement | null>(null)

function mountRemark42(): void {
  const config = {
    host: remarkHost,
    site_id: remarkSiteId,
    url: `https://kakacha.space/blog/${props.slug}`,
    theme: 'dark',
    locale: 'ru',
  }
  const w = window as unknown as { remark_config?: unknown; REMARK42?: Remark42Global }
  w.remark_config = config

  if (w.REMARK42?.createInstance) {
    w.REMARK42.destroy?.()
    w.REMARK42.createInstance(config)
    return
  }

  const script = document.createElement('script')
  script.src = `${remarkHost}/web/embed.js`
  script.defer = true
  document.body.appendChild(script)
}

function mountGiscus(): void {
  if (!giscusContainer.value) return
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', giscusRepo)
  script.setAttribute('data-repo-id', giscusRepoId)
  script.setAttribute('data-category', giscusCategory)
  script.setAttribute('data-category-id', giscusCategoryId)
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', 'dark')
  script.setAttribute('data-lang', 'ru')
  giscusContainer.value.appendChild(script)
}

onMounted(() => {
  if (backend === 'remark42') mountRemark42()
  if (backend === 'giscus') mountGiscus()
})
</script>

<template>
  <aside v-if="backend !== 'none'" class="comments" data-testid="comments">
    <h3 class="comments__title">Комментарии</h3>
    <div v-if="backend === 'remark42'" id="remark42" />
    <div v-else ref="giscusContainer" />
  </aside>
</template>

<style scoped>
.comments {
  margin-top: 2.5rem;
  border-top: 1px solid var(--panel-border);
  padding-top: 1rem;
}

.comments__title {
  color: var(--accent-gold);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
