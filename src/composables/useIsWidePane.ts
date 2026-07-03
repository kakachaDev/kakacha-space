import { onBeforeUnmount, ref, type Ref } from 'vue'

export function useIsWidePane(breakpointPx = 768): { isWide: Ref<boolean> } {
  const query = window.matchMedia(`(min-width: ${breakpointPx}px)`)
  const isWide = ref(query.matches)

  const listener = (e: MediaQueryListEvent) => {
    isWide.value = e.matches
  }
  query.addEventListener('change', listener)

  onBeforeUnmount(() => {
    query.removeEventListener('change', listener)
  })

  return { isWide }
}
