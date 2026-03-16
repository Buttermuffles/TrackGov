import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FontFamily = 'Inter' | 'Poppins' | 'Roboto' | 'Open Sans' | 'Lato' | 'Source Sans 3'
export type FontSize = 'small' | 'default' | 'large' | 'x-large'
export type AppMode = 'light' | 'dark'

const fontSizeScale: Record<FontSize, string> = {
  small: '14px',
  default: '16px',
  large: '18px',
  'x-large': '20px',
}

interface ThemeState {
  fontFamily: FontFamily
  fontSize: FontSize
  mode: AppMode
  sidebarCompact: boolean
  setFontFamily: (f: FontFamily) => void
  setFontSize: (s: FontSize) => void
  setMode: (m: AppMode) => void
  toggleMode: () => void
  setSidebarCompact: (v: boolean) => void
  applyTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      fontFamily: 'Inter',
      fontSize: 'default',
      mode: 'light',
      sidebarCompact: false,

      setFontFamily: (f) => { set({ fontFamily: f }); get().applyTheme() },
      setFontSize: (s) => { set({ fontSize: s }); get().applyTheme() },
      setMode: (m) => { set({ mode: m }); get().applyTheme() },

      // ── New: one-call toggle ──────────────────────────────────────────────
      toggleMode: () => {
        const next: AppMode = get().mode === 'light' ? 'dark' : 'light'
        set({ mode: next })
        get().applyTheme()
      },

      setSidebarCompact: (v) => set({ sidebarCompact: v }),

      applyTheme: () => {
        const { fontFamily, fontSize, mode } = get()
        const root = document.documentElement
        root.style.colorScheme = mode
        root.style.setProperty('--font-sans', `'${fontFamily}', ui-sans-serif, system-ui, sans-serif`)
        root.style.fontSize = fontSizeScale[fontSize]
        if (mode === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      },
    }),
    {
      name: 'trackgov-theme',
      partialize: (state) => ({
        fontFamily: state.fontFamily,
        fontSize: state.fontSize,
        mode: state.mode,
        sidebarCompact: state.sidebarCompact,
      }),
      // ── Fix: apply theme immediately after localStorage is read ──────────
      onRehydrateStorage: () => (state) => {
        state?.applyTheme()
      },
    }
  )
)