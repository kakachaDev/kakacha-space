export const manifestConfig = {
  name: 'kakachaDev — Portfolio',
  short_name: 'kakachaDev',
  description: 'Frontend + gamedev portfolio.',
  start_url: '/',
  display: 'standalone' as const,
  background_color: '#14100d',
  theme_color: '#14100d',
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}
