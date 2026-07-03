import { ref, watch, type Ref } from 'vue'
import { playHoverTick, playSelectChime } from '../audio/uiSound'

const STORAGE_KEY = 'sound-enabled'

export function useMenuSound(): {
  enabled: Ref<boolean>
  toggle: () => void
  playHover: () => void
  playSelect: () => void
} {
  const stored = localStorage.getItem(STORAGE_KEY)
  const enabled = ref(stored === 'true')

  watch(enabled, (value) => {
    localStorage.setItem(STORAGE_KEY, String(value))
  }, { flush: 'sync' })

  function toggle(): void {
    enabled.value = !enabled.value
  }

  function playHover(): void {
    if (enabled.value) playHoverTick()
  }

  function playSelect(): void {
    if (enabled.value) playSelectChime()
  }

  return { enabled, toggle, playHover, playSelect }
}
