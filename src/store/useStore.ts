import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'system' | 'dark'

export interface HistoryEntry {
  /** ISO date */
  date: string
  note?: string
}

/** Datos que el usuario puede respaldar / restaurar */
export interface UserData {
  favorites: string[]
  ratings: Record<string, number>
  history: Record<string, HistoryEntry>
  bar: string[]
  likes: string[]
}

interface State extends UserData {
  theme: Theme
  allowSubs: boolean

  setTheme: (t: Theme) => void
  setAllowSubs: (v: boolean) => void
  toggleFavorite: (id: string) => void
  /** Calificar 1-5; repetir la misma nota la quita. Calificar registra el cóctel como probado. */
  rate: (id: string, stars: number) => void
  markTried: (id: string) => void
  setNote: (id: string, note: string) => void
  removeFromHistory: (id: string) => void
  toggleBar: (id: string) => void
  clearBar: () => void
  toggleLike: (id: string) => void
  importData: (d: Partial<UserData>) => void
  resetAll: () => void
}

const DEFAULT_LIKES = ['moscow-mule', 'pina-colada', 'mojito']

const initialData = (): UserData => ({
  favorites: [],
  ratings: {},
  history: {},
  bar: [],
  likes: [...DEFAULT_LIKES],
})

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id]

const today = () => new Date().toISOString()

export const useStore = create<State>()(
  persist(
    (set) => ({
      ...initialData(),
      theme: 'system',
      allowSubs: true,

      setTheme: (theme) => set({ theme }),
      setAllowSubs: (allowSubs) => set({ allowSubs }),
      toggleFavorite: (id) => set((s) => ({ favorites: toggle(s.favorites, id) })),
      rate: (id, stars) =>
        set((s) => {
          const ratings = { ...s.ratings }
          if (ratings[id] === stars) delete ratings[id]
          else ratings[id] = stars
          const history = s.history[id] ? s.history : { ...s.history, [id]: { date: today() } }
          return { ratings, history }
        }),
      markTried: (id) =>
        set((s) => {
          if (s.history[id]) return {}
          return { history: { ...s.history, [id]: { date: today() } } }
        }),
      setNote: (id, note) =>
        set((s) =>
          s.history[id] ? { history: { ...s.history, [id]: { ...s.history[id], note } } } : {},
        ),
      removeFromHistory: (id) =>
        set((s) => {
          const history = { ...s.history }
          const ratings = { ...s.ratings }
          delete history[id]
          delete ratings[id]
          return { history, ratings }
        }),
      toggleBar: (id) => set((s) => ({ bar: toggle(s.bar, id) })),
      clearBar: () => set({ bar: [] }),
      toggleLike: (id) => set((s) => ({ likes: toggle(s.likes, id) })),
      importData: (d) =>
        set((s) => ({
          favorites: Array.isArray(d.favorites) ? d.favorites : s.favorites,
          ratings: d.ratings && typeof d.ratings === 'object' ? d.ratings : s.ratings,
          history: d.history && typeof d.history === 'object' ? d.history : s.history,
          bar: Array.isArray(d.bar) ? d.bar : s.bar,
          likes: Array.isArray(d.likes) ? d.likes : s.likes,
        })),
      resetAll: () => set({ ...initialData() }),
    }),
    { name: 'cocteles-store', version: 1 },
  ),
)

export function pickUserData(s: State): UserData {
  return {
    favorites: s.favorites,
    ratings: s.ratings,
    history: s.history,
    bar: s.bar,
    likes: s.likes,
  }
}
