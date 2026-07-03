export const theme = {
  colors: {
    bg: '#14100d',
    panel: '#1f1912',
    panelBorder: '#3a2f22',
    accentRed: '#8a1f1f',
    accentGold: '#c9a15a',
    text: '#e8dfd0',
    textDim: '#a89a82',
  },
} as const

export type ThemeColors = typeof theme.colors
