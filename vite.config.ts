/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { manifestConfig } from './src/pwa/manifestConfig.ts'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: manifestConfig,
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
