import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { pickUserData, useStore, type Theme } from '../store/useStore'

const THEMES: { id: Theme; label: string }[] = [
  { id: 'light', label: 'Claro' },
  { id: 'system', label: 'Sistema' },
  { id: 'dark', label: 'Oscuro' },
]

export function SettingsPage() {
  const navigate = useNavigate()
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const importData = useStore((s) => s.importData)
  const resetAll = useStore((s) => s.resetAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  const exportData = () => {
    const data = { app: 'cocteles', version: 1, ...pickUserData(useStore.getState()) }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `cocteles-respaldo-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('Respaldo descargado.')
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (data?.app !== 'cocteles') throw new Error('formato')
      importData(data)
      setMsg('Respaldo restaurado.')
    } catch {
      setMsg('No pude leer ese archivo. Elige un respaldo generado por la app.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <>
      <header className="topbar">
        <button type="button" className="icon-btn" aria-label="Volver" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}>
          <Icon name="back" />
        </button>
        <h1>Ajustes</h1>
      </header>
      <main className="page">
        <section className="section" style={{ marginTop: 8 }}>
          <h2>Tema</h2>
          <div className="segmented" role="radiogroup" aria-label="Tema">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={theme === t.id}
                className={theme === t.id ? 'on' : ''}
                onClick={() => setTheme(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Tus datos</h2>
          <p className="muted small" style={{ marginBottom: 12 }}>
            Todo se guarda solo en este dispositivo. Haz un respaldo si cambias de celular.
          </p>
          <div className="list">
            <button type="button" className="btn" onClick={exportData}>
              <Icon name="download" /> Descargar respaldo
            </button>
            <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
              <Icon name="upload" /> Restaurar respaldo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            {confirmReset ? (
              <>
                <p className="small">Se borrarán favoritos, calificaciones, historial y MiBar. No se puede deshacer.</p>
                <div className="row">
                  <button type="button" className="btn grow" onClick={() => setConfirmReset(false)}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn danger grow"
                    onClick={() => {
                      resetAll()
                      setConfirmReset(false)
                      setMsg('Datos borrados.')
                    }}
                  >
                    Sí, borrar todo
                  </button>
                </div>
              </>
            ) : (
              <button type="button" className="btn danger" onClick={() => setConfirmReset(true)}>
                <Icon name="trash" /> Borrar mis datos
              </button>
            )}
          </div>
          {msg && (
            <p className="small" role="status" style={{ marginTop: 12 }}>
              {msg}
            </p>
          )}
        </section>
      </main>
    </>
  )
}
