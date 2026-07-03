import { onMounted, onBeforeUnmount, type Ref } from 'vue'

export function nextIndex(current: number, direction: 1 | -1, length: number): number {
  return (current + direction + length) % length
}

export function useKeyboardNav(containerRef: Ref<HTMLElement | null>): void {
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const container = containerRef.value
    if (!container) return

    const links = Array.from(container.querySelectorAll('a'))
    if (links.length === 0) return

    const currentIndex = links.findIndex((link) => link === document.activeElement)
    if (currentIndex === -1) return

    event.preventDefault()
    const direction = event.key === 'ArrowDown' ? 1 : -1
    const target = links[nextIndex(currentIndex, direction, links.length)]
    ;(target as HTMLElement).focus()
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}
