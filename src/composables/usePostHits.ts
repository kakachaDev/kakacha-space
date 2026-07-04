import { ref, type Ref } from 'vue'

const defaultEndpoint = (import.meta.env.VITE_HITS_ENDPOINT as string | undefined) ?? ''

/**
 * Счётчик просмотров поста через внешний сервис tiny-hits.
 * Если endpoint не задан или сервис недоступен — hits остаётся null и UI ничего не показывает.
 * Инкремент — один раз за сессию на пост (sessionStorage), дальше только чтение.
 */
export function usePostHits(slug: string, endpoint: string = defaultEndpoint): { hits: Ref<number | null> } {
  const hits = ref<number | null>(null)
  if (!endpoint) return { hits }

  const seenKey = `hits-seen:${slug}`
  let method: 'GET' | 'POST' = 'POST'
  try {
    if (sessionStorage.getItem(seenKey)) method = 'GET'
  } catch {
    method = 'GET'
  }

  fetch(`${endpoint}/api/hits?slug=${encodeURIComponent(slug)}`, { method })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
    .then((data: { hits?: unknown }) => {
      if (typeof data.hits === 'number') {
        hits.value = data.hits
        if (method === 'POST') {
          try {
            sessionStorage.setItem(seenKey, '1')
          } catch {
            /* приватный режим — просто не дедупим */
          }
        }
      }
    })
    .catch(() => {
      hits.value = null
    })

  return { hits }
}
