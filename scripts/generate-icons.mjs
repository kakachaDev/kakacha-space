import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(dir, '..')
const svg = readFileSync(path.join(root, 'public/icon-source.svg'), 'utf-8')

const targets = [
  { size: 192, out: 'public/icons/icon-192.png' },
  { size: 512, out: 'public/icons/icon-512.png' },
  { size: 180, out: 'public/apple-touch-icon.png' },
]

mkdirSync(path.join(root, 'public/icons'), { recursive: true })

const browser = await chromium.launch()
for (const { size, out } of targets) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(
    `<html><body style="margin:0">${svg.replace('width="512" height="512"', `width="${size}" height="${size}"`)}</body></html>`
  )
  const buffer = await page.screenshot({ omitBackground: false })
  writeFileSync(path.join(root, out), buffer)
  await page.close()
  console.log('wrote', out)
}
await browser.close()
