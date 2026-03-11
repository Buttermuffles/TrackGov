import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FontFamily = 'Inter' | 'Poppins' | 'Roboto' | 'Open Sans' | 'Lato' | 'Source Sans 3'
export type FontSize = 'small' | 'default' | 'large' | 'x-large'
export type ColorTheme = 'navy' | 'emerald' | 'violet' | 'rose' | 'slate' | 'amber'
export type AppMode = 'light' | 'dark'

interface ThemeColors {
  primary: string
  primaryLight: string
  primaryDark: string
  accent: string
}

const themeColorMap: Record<ColorTheme, ThemeColors> = {
  navy:    { primary: '#1E3A5F', primaryLight: '#2a4d7a', primaryDark: '#162d4a', accent: '#1D4ED8' },
  emerald: { primary: '#065F46', primaryLight: '#047857', primaryDark: '#064E3B', accent: '#10B981' },
  violet:  { primary: '#5B21B6', primaryLight: '#6D28D9', primaryDark: '#4C1D95', accent: '#8B5CF6' },
  rose:    { primary: '#9F1239', primaryLight: '#BE123C', primaryDark: '#881337', accent: '#F43F5E' },
  slate:   { primary: '#334155', primaryLight: '#475569', primaryDark: '#1E293B', accent: '#64748B' },
  amber:   { primary: '#92400E', primaryLight: '#B45309', primaryDark: '#78350F', accent: '#F59E0B' },
}

const fontSizeScale: Record<FontSize, string> = {
  small: '14px',
  default: '16px',
  large: '18px',
  'x-large': '20px',
}

interface ThemeState {
  fontFamily: FontFamily
  fontSize: FontSize
  colorTheme: ColorTheme
  mode: AppMode
  sidebarCompact: boolean
  setFontFamily: (f: FontFamily) => void
  setFontSize: (s: FontSize) => void
  setColorTheme: (c: ColorTheme) => void
  setMode: (m: AppMode) => void
  setSidebarCompact: (v: boolean) => void
  applyTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      fontFamily: 'Inter',
      fontSize: 'default',
      colorTheme: 'navy',
      mode: 'light',
      sidebarCompact: false,
      setFontFamily: (f) => { set({ fontFamily: f }); get().applyTheme() },
      setFontSize: (s) => { set({ fontSize: s }); get().applyTheme() },
      setColorTheme: (c) => { set({ colorTheme: c }); get().applyTheme() },
      setMode: (m) => { set({ mode: m }); get().applyTheme() },
      setSidebarCompact: (v) => set({ sidebarCompact: v }),
      applyTheme: () => {
        const { fontFamily, fontSize, colorTheme, mode } = get()
        const root = document.documentElement
        const colors = themeColorMap[colorTheme]
        root.style.setProperty('--color-navy', colors.primary)
        root.style.setProperty('--color-navy-light', colors.primaryLight)
        root.style.setProperty('--color-navy-dark', colors.primaryDark)
        root.style.setProperty('--color-accent', colors.accent)
        root.style.setProperty('--font-sans', `'${fontFamily}', ui-sans-serif, system-ui, sans-serif`)
        root.style.fontSize = fontSizeScale[fontSize]
        if (mode === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      },
    }),
    { name: 'trackgov-theme' }
  )
)
