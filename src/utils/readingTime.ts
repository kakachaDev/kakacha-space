const WORDS_PER_MINUTE = 180

export function readingMinutes(text: string): number {
  const words = text
    .replace(/```[\s\S]*?```/g, ' код ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
