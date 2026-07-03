export interface ParsedMarkdown {
  data: Record<string, string>
  content: string
}

export function parseFrontmatter(raw: string): ParsedMarkdown {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { data: {}, content: raw }
  }

  const [, block, content] = match
  const data: Record<string, string> = {}

  for (const line of block.split(/\r?\n/)) {
    const lineMatch = line.match(/^([^:]+):\s*(.*)$/)
    if (!lineMatch) continue
    const [, key, value] = lineMatch
    data[key.trim()] = value.trim()
  }

  return { data, content }
}

export function slugFromPath(path: string): string {
  const file = path.split('/').pop() ?? path
  return file.replace(/\.md$/, '')
}
