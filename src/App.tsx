import { useEffect } from 'react'
import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { Icon } from './components/Icon'
import { CocktailPage } from './pages/CocktailPage'
import { ExplorePage } from './pages/ExplorePage'
import { FavoritesPage } from './pages/FavoritesPage'
import { HistoryPage } from './pages/HistoryPage'
import { IngredientPage } from './pages/IngredientPage'
import { MyBarPage } from './pages/MyBarPage'
import { RecommendedPage } from './pages/RecommendedPage'
import { SettingsPage } from './pages/SettingsPage'
import { useStore } from './store/useStore'

const TABS = [
  { to: '/', label: 'Explorar', icon: 'explore', end: true },
  { to: '/mibar', label: 'MiBar', icon: 'bar' },
  { to: '/para-ti', label: 'Para ti', icon: 'spark' },
  { to: '/favoritos', label: 'Favoritos', icon: 'heart' },
  { to: '/historial', label: 'Historial', icon: 'history' },
]

function useApplyTheme() {
  const theme = useStore((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.dataset.theme = theme

    const meta = document.querySelector('meta[name="theme-color"]')
    const paint = () => {
      const dark =
        theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      meta?.setAttribute('content', dark ? '#151412' : '#faf8f5')
    }
    paint()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', paint)
    return () => mq.removeEventListener('change', paint)
  }, [theme])
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function App() {
  useApplyTheme()
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="app">
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/c/:id" element={<CocktailPage />} />
          <Route path="/i/:id" element={<IngredientPage />} />
          <Route path="/mibar" element={<MyBarPage />} />
          <Route path="/para-ti" element={<RecommendedPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/historial" element={<HistoryPage />} />
          <Route path="/ajustes" element={<SettingsPage />} />
          <Route path="*" element={<ExplorePage />} />
        </Routes>
      </div>
      <nav className="tabbar" aria-label="Navegación principal">
        <div className="tabbar-inner">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>
              <Icon name={t.icon} />
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </HashRouter>
  )
}
