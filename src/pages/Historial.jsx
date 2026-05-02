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
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Hero */}
      <div style={{
        background: '#F1F5FF',
        borderBottom: '1px solid #E2E8F0',
        padding: '32px 24px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 180, height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,112,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: 40, width: 120, height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(101,163,13,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <button onClick={() => navigate(-1)} style={{
          background: '#FFFFFF', border: '1px solid #E2E8F0',
          color: '#0F172A', borderRadius: 10, padding: '6px 14px',
          fontSize: 13, cursor: 'pointer', marginBottom: 20, display: 'inline-flex',
          alignItems: 'center', gap: 6,
          boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
        }}>← Volver</button>

        <h1 style={{
          fontSize: 32, fontFamily: 'Syne, sans-serif', marginBottom: 6, color: '#0F172A',
        }}>Historial</h1>
        <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>
          Tus compras y transacciones
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Total gastado', value: `$${total.toFixed(0)}`, sub: 'MXN', color: '#65A30D' },
            { label: 'Cursos',        value: cursos,                  sub: 'compras',  color: '#65A30D' },
            { label: 'Clases',        value: clases,                  sub: 'reservas', color: '#2E70FF' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14, padding: '14px 10px', textAlign: 'center',
              boxShadow: '0 2px 8px rgba(15,23,42,0.05)',
            }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: 'Syne' }}>{s.value}</p>
              <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{s.label}</p>
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
          const accentColor = esCurso ? '#65A30D' : '#2E70FF'
          return (
            <div key={i} style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 16, padding: 18, marginBottom: 12,
              transition: 'all 0.2s', cursor: 'default',
              boxShadow: '0 2px 8px rgba(15,23,42,0.05)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.transform = 'translateX(4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'translateX(0)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: esCurso ? 'rgba(101,163,13,0.10)' : 'rgba(46,112,255,0.10)',
                  border: `1px solid ${esCurso ? 'rgba(101,163,13,0.18)' : 'rgba(46,112,255,0.18)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>{esCurso ? '📚' : '🎓'}</div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif', color: '#0F172A' }}>
                    {esCurso ? `Curso #${h.cursoId}` : `Clase #${h.servicioId}`}
                  </p>
                  <p style={{ color: '#94A3B8', fontSize: 12, marginTop: 3 }}>
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
                    background: 'rgba(34,197,94,0.10)', color: '#16a34a',
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
