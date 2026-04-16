import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCursos, getServicios } from '../api/api'

export default function Inicio() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [publicaciones, setPublicaciones] = useState([])
  const [filtradas, setFiltradas]         = useState([])
  const [filtro, setFiltro]               = useState('TODOS')
  const [busqueda, setBusqueda]           = useState('')
  const [loading, setLoading]             = useState(true)

  useEffect(() => { cargar() }, [])
  useEffect(() => {
    let lista = publicaciones
    if (filtro === 'CURSO') lista = lista.filter(p => p.tipo === 'CURSO')
    if (filtro === 'CLASE') lista = lista.filter(p => p.tipo === 'CLASE')
    if (busqueda) lista = lista.filter(p => p.titulo?.toLowerCase().includes(busqueda.toLowerCase()))
    setFiltradas(lista)
  }, [filtro, busqueda, publicaciones])

  const cargar = async () => {
    setLoading(true)
    try {
      const [cursos, servicios] = await Promise.all([getCursos(), getServicios()])
      const lista = [
        ...(cursos.data || []).map(c => ({
          tipo: 'CURSO', id: c.idCurso, titulo: c.titulo,
          descripcion: c.descripcion, precio: c.precio,
          autor: c.nombreUsuario, autorId: c.usuarioId,
          calificacion: c.calificacion || '0',
        })),
        ...(servicios.data || []).map(s => ({
          tipo: 'CLASE', id: s.servicioId, titulo: s.titulo,
          descripcion: s.descripcion, precio: s.precio,
          autor: s.nombreUsuario, autorId: s.usuarioId,
          calificacion: '0',
        })),
      ]
      setPublicaciones(lista)
    } catch {}
    finally { setLoading(false) }
  }

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'
  const inicial = usuario?.nombre?.charAt(0).toUpperCase() || 'U'

  const stats = [
    { label: 'Publicaciones', value: filtradas.length, icon: '📚' },
    { label: 'Cursos', value: publicaciones.filter(p => p.tipo === 'CURSO').length, icon: '🎓' },
    { label: 'Clases', value: publicaciones.filter(p => p.tipo === 'CLASE').length, icon: '✨' },
  ]

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0d 0%, #0f1629 50%, #0a0a0d 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '32px 24px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decoración fondo */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,112,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(163,230,53,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Usuario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, position: 'relative' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#0a0a0d', fontSize: 20,
            fontFamily: 'Syne, sans-serif', flexShrink: 0,
            boxShadow: '0 0 20px rgba(46,112,255,0.4)',
          }}>{inicial}</div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 2 }}>{saludo} 👋</p>
            <h1 style={{ fontSize: 22, lineHeight: 1.1 }}>
              <span style={{
                background: 'linear-gradient(90deg, #fff 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{usuario?.nombre}</span>
            </h1>
          </div>
        </div>

        {/* Stats rápidas */}
        <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              flex: 1, background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '10px 8px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 18 }}>{s.icon}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', fontFamily: 'Syne' }}>{s.value}</p>
              <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 20px 0', maxWidth: 1200, margin: '0 auto' }}>
        {/* Buscador */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 16, pointerEvents: 'none',
          }}>🔍</span>
          <input placeholder="Buscar cursos, clases, instructores..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ paddingLeft: 42 }} />
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { key: 'TODOS', label: '🌐 Todos' },
            { key: 'CURSO', label: '📚 Cursos' },
            { key: 'CLASE', label: '🎓 Clases' },
          ].map(f => (
            <button key={f.key} onClick={() => setFiltro(f.key)} style={{
              padding: '8px 18px', borderRadius: 20, fontSize: 13, border: 'none',
              background: filtro === f.key
                ? 'linear-gradient(90deg, var(--accent-blue), #5b9aff)'
                : 'var(--bg-card)',
              color: filtro === f.key ? '#fff' : 'var(--text-secondary)',
              fontWeight: filtro === f.key ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: filtro === f.key ? '0 4px 12px rgba(46,112,255,0.3)' : 'none',
            }}>{f.label}</button>
          ))}
          <button onClick={cargar} style={{
            padding: '8px 16px', borderRadius: 20, fontSize: 13,
            background: 'var(--bg-card)', color: 'var(--text-secondary)',
            border: '1px solid var(--border)', marginLeft: 'auto', cursor: 'pointer',
          }}>↻</button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : filtradas.length === 0 ? (
          <div className="empty-state">
            <span>📭</span>
            <p>No hay publicaciones</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {filtradas.map(p => (
              <PublicacionCard key={`${p.tipo}-${p.id}`} p={p}
                esMia={p.autorId === usuario?.id}
                onClick={() => navigate(`/detalle/${p.tipo}/${p.id}`, { state: p })} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PublicacionCard({ p, esMia, onClick }) {
  const esCurso = p.tipo === 'CURSO'

  // Color de acento según tipo
  const accentColor = esCurso ? 'var(--accent)' : 'var(--accent-blue)'
  const bgGlow = esCurso
    ? 'rgba(163,230,53,0.06)'
    : 'rgba(46,112,255,0.06)'

  return (
    <div onClick={onClick} style={{
      background: `linear-gradient(135deg, var(--bg-card) 0%, ${bgGlow} 100%)`,
      border: `1px solid var(--border)`,
      borderRadius: 18, padding: 20,
      cursor: 'pointer', position: 'relative',
      transition: 'all 0.25s',
      overflow: 'hidden',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.border = `1px solid ${accentColor}`
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 12px 32px ${esCurso ? 'rgba(163,230,53,0.12)' : 'rgba(46,112,255,0.15)'}`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Decoración esquina */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${esCurso ? 'rgba(163,230,53,0.08)' : 'rgba(46,112,255,0.08)'}, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Badge tuya */}
      {esMia && (
        <span style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(163,230,53,0.2)', color: 'var(--accent)',
          fontSize: 9, padding: '3px 8px', borderRadius: 20,
          fontWeight: 700, letterSpacing: '0.05em',
        }}>TU PUBL.</span>
      )}

      {/* Tag tipo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: esCurso ? 'rgba(163,230,53,0.15)' : 'rgba(46,112,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
        }}>
          {esCurso ? '📚' : '🎓'}
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
          color: accentColor,
        }}>
          {esCurso ? 'CURSO' : 'CLASE 1A1'}
        </span>
      </div>

      {/* Título */}
      <h3 style={{
        fontSize: 16, fontFamily: 'Syne, sans-serif',
        marginBottom: 8, lineHeight: 1.3,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{p.titulo}</h3>

      {/* Descripción */}
      <p style={{
        color: 'var(--text-secondary)', fontSize: 13,
        lineHeight: 1.5, marginBottom: 16,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{p.descripcion}</p>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          {/* Avatar + nombre */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: accentColor,
            }}>
              {(p.autor || 'A').charAt(0).toUpperCase()}
            </div>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>{p.autor}</p>
          </div>
          <p style={{ color: 'var(--star)', fontSize: 12 }}>
            ★ {p.calificacion || '0.0'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 9, color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>PRECIO</p>
          <p style={{
            color: accentColor, fontSize: 22,
            fontWeight: 800, fontFamily: 'Syne, sans-serif', lineHeight: 1,
          }}>
            ${p.precio?.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}