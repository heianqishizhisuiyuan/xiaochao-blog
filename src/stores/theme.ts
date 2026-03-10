import { defineStore } from 'pinia'

export type ThemeName = 'warm' | 'cool' | 'dark'

const STORAGE_KEY = 'xc_blog_theme'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'cool' as ThemeName
  }),
  actions: {
    init() {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null
        if (saved === 'warm' || saved === 'cool' || saved === 'dark') {
          this.theme = saved
        }
      } catch {
        // ignore
      }
      this.applyToDom()
    },
    setTheme(theme: ThemeName) {
      this.theme = theme
      try {
        window.localStorage.setItem(STORAGE_KEY, theme)
      } catch {
        // ignore
      }
      this.applyToDom()
    },
    applyToDom() {
      if (typeof document === 'undefined') return
      const root = document.documentElement
      root.dataset.theme = this.theme
    }
  }
})
