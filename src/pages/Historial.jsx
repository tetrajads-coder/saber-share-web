import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHistorial } from '../api/api'

export default function Historial() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [historial, setHistorial] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    try {
      const res = await getHistorial(usuario.id)
      setHistorial(res.data || [])
    } catch {}
    finally { setLoading(false) }
  }

  const total   = historial.reduce((a, h) => a + (h.pago || 0), 0)
  const cursos  = historial.filter(h => h.cursoId != null).length
  const clases  = historial.filter(h => h.servicioId != null).length

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0d 0%, #0f1629 60%, #0a0a0d 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '32px 24px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 180, height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,112,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: 40, width: 120, height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(163,230,53,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <button onClick={() => navigate(-1)} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
          color: 'var(--text-primary)', borderRadius: 10, padding: '6px 14px',
          fontSize: 13, cursor: 'pointer', marginBottom: 20, display: 'inline-flex',
          alignItems: 'center', gap: 6,
        }}>← Volver</button>

        <h1 style={{
          fontSize: 32, fontFamily: 'Syne, sans-serif', marginBottom: 6,
          background: 'linear-gradient(90deg, #fff 0%, var(--accent-blue) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Historial</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
          Tus compras y transacciones
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Total gastado', value: `$${total.toFixed(0)}`, sub: 'MXN', color: 'var(--accent)' },
            { label: 'Cursos', value: cursos, sub: 'compras', color: 'var(--accent)' },
            { label: 'Clases', value: clases, sub: 'reservas', color: 'var(--accent-blue)' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '14px 10px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: 'Syne' }}>{s.value}</p>
              <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div style={{ padding: '20px 20px 0', maxWidth: 600, margin: '0 auto' }}>
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : historial.length === 0 ? (
          <div className="empty-state">
            <span>🧾</span>
            <p>Sin transacciones aún</p>
            <p style={{ fontSize: 13 }}>Tus compras aparecerán aquí</p>
          </div>
        ) : historial.map((h, i) => {
          const esCurso = h.cursoId != null
          const accentColor = esCurso ? 'var(--accent)' : 'var(--accent-blue)'
          return (
            <div key={i} style={{
              background: `linear-gradient(135deg, var(--bg-card) 0%, ${esCurso ? 'rgba(163,230,53,0.04)' : 'rgba(46,112,255,0.04)'} 100%)`,
              border: '1px solid var(--border)',
              borderRadius: 16, padding: 18, marginBottom: 12,
              transition: 'all 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.transform = 'translateX(4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: esCurso ? 'rgba(163,230,53,0.12)' : 'rgba(46,112,255,0.12)',
                  border: `1px solid ${esCurso ? 'rgba(163,230,53,0.2)' : 'rgba(46,112,255,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>{esCurso ? '📚' : '🎓'}</div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif' }}>
                    {esCurso ? `Curso #${h.cursoId}` : `Clase #${h.servicioId}`}
                  </p>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 12, marginTop: 3 }}>
                    📅 {h.fechapago || '---'}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontWeight: 800, fontSize: 20, fontFamily: 'Syne, sans-serif',
                    color: accentColor,
                  }}>${h.pago?.toFixed(2)}</p>
                  <span style={{
                    display: 'inline-block', marginTop: 4,
                    padding: '2px 10px', borderRadius: 20,
                    background: 'rgba(34,197,94,0.12)', color: '#22c55e',
                    fontSize: 10, fontWeight: 700,
                  }}>✓ PAGADO</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}