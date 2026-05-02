import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCursos, getServicios } from '../api/api'
import { motion } from 'framer-motion'

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
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: 100, fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        .inicio-search {
          background: #F8FAFC !important;
          border: 1.5px solid #E2E8F0 !important;
          color: #0F172A !important;
          font-family: Inter, sans-serif !important;
          transition: border-color 0.2s !important;
        }
        .inicio-search:focus {
          border-color: #2E70FF !important;
          outline: none !important;
        }
        .inicio-search::placeholder { color: #94A3B8; }
        .shimmer {
          background: linear-gradient(90deg, #F1F5F9 0%, #E2E8F0 50%, #F1F5F9 100%);
          background-size: 200% 100%;
          animation: shimmer-anim 1.4s ease-in-out infinite;
        }
        @keyframes shimmer-anim {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: '#F1F5FF',
          borderBottom: '1px solid #E2E8F0',
          padding: '32px 24px 28px',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,112,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(101,163,13,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Usuario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, position: 'relative' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2E70FF, #65A30D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#fff', fontSize: 20,
            fontFamily: 'Syne, sans-serif', flexShrink: 0,
            boxShadow: '0 4px 16px rgba(46,112,255,0.25)',
          }}>{inicial}</div>
          <div>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 2 }}>{saludo} 👋</p>
            <h1 style={{ fontSize: 22, lineHeight: 1.1, fontFamily: 'Syne, sans-serif', color: '#0F172A' }}>
              {usuario?.nombre}
            </h1>
          </div>
        </div>

        {/* Stats rápidas */}
        <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              flex: 1, background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 12, padding: '10px 8px', textAlign: 'center',
              boxShadow: '0 2px 8px rgba(15,23,42,0.05)',
            }}>
              <p style={{ fontSize: 18 }}>{s.icon}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#2E70FF', fontFamily: 'Syne' }}>{s.value}</p>
              <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div style={{ padding: '20px 20px 0', maxWidth: 1200, margin: '0 auto' }}>
        {/* Buscador */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 16, pointerEvents: 'none', zIndex: 1,
          }}>🔍</span>
          <input
            className="inicio-search"
            placeholder="Buscar cursos, clases, instructores..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ paddingLeft: 42 }}
          />
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { key: 'TODOS', label: '🌐 Todos' },
            { key: 'CURSO', label: '📚 Cursos' },
            { key: 'CLASE', label: '🎓 Clases' },
          ].map(f => (
            <motion.button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              style={{
                padding: '8px 18px', borderRadius: 20, fontSize: 13,
                border: filtro === f.key ? 'none' : '1px solid #E2E8F0',
                background: filtro === f.key
                  ? 'linear-gradient(90deg, #2E70FF, #5b9aff)'
                  : '#F1F5F9',
                color: filtro === f.key ? '#fff' : '#64748B',
                fontWeight: filtro === f.key ? 600 : 400,
                cursor: 'pointer',
                boxShadow: filtro === f.key ? '0 4px 12px rgba(46,112,255,0.3)' : 'none',
                fontFamily: 'Inter, sans-serif',
              }}
            >{f.label}</motion.button>
          ))}
          <motion.button
            onClick={cargar}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            style={{
              padding: '8px 16px', borderRadius: 20, fontSize: 13,
              background: '#F1F5F9', color: '#64748B',
              border: '1px solid #E2E8F0', marginLeft: 'auto', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >↻</motion.button>
        </div>

        {/* Grid */}
        {loading ? (
          <SkeletonGrid />
        ) : filtradas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 12, padding: '60px 20px',
              background: '#FFFFFF',
            }}
          >
            <span style={{ fontSize: 48, color: '#2E70FF' }}>📭</span>
            <p style={{ fontSize: 15, color: '#64748B' }}>No hay publicaciones</p>
          </motion.div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {filtradas.map((p, index) => (
              <PublicacionCard
                key={`${p.tipo}-${p.id}`}
                p={p}
                index={index}
                esMia={p.autorId === usuario?.id}
                onClick={() => navigate(`/detalle/${p.tipo}/${p.id}`, { state: p })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16,
    }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
        }}>
          <div className="shimmer" style={{ width: '100%', height: 140 }} />
          <div style={{ padding: 20 }}>
            <div className="shimmer" style={{ width: 70, height: 20, borderRadius: 8, marginBottom: 12 }} />
            <div className="shimmer" style={{ width: '90%', height: 18, borderRadius: 6, marginBottom: 8 }} />
            <div className="shimmer" style={{ width: '65%', height: 18, borderRadius: 6, marginBottom: 16 }} />
            <div className="shimmer" style={{ width: '100%', height: 13, borderRadius: 6, marginBottom: 6 }} />
            <div className="shimmer" style={{ width: '80%', height: 13, borderRadius: 6, marginBottom: 16 }} />
            <div style={{ height: 1, background: '#E2E8F0', marginBottom: 14 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="shimmer" style={{ width: 80, height: 14, borderRadius: 6 }} />
              <div className="shimmer" style={{ width: 50, height: 22, borderRadius: 6 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PublicacionCard({ p, esMia, onClick, index }) {
  const esCurso = p.tipo === 'CURSO'
  const accentColor = esCurso ? '#65A30D' : '#2E70FF'
  const imgSrc = esCurso
    ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80'
    : 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80'

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(15,23,42,0.10)' }}
      style={{
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: 18,
        cursor: 'pointer', position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
      }}
    >
      {/* Imagen con overlay */}
      <div style={{ position: 'relative' }}>
        <img
          src={imgSrc}
          alt={p.tipo}
          style={{
            width: '100%', height: 140, objectFit: 'cover',
            borderRadius: '10px 10px 0 0', display: 'block',
          }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%',
          background: 'linear-gradient(transparent 60%, rgba(248,250,252,0.95))',
          borderRadius: '10px 10px 0 0',
        }} />
      </div>

      <div style={{ padding: 20, marginTop: 0 }}>
        {/* Badge tuya */}
        {esMia && (
          <span style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(101,163,13,0.15)', color: '#65A30D',
            fontSize: 9, padding: '3px 8px', borderRadius: 20,
            fontWeight: 700, letterSpacing: '0.05em',
          }}>TU PUBL.</span>
        )}

        {/* Tag tipo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: esCurso ? 'rgba(101,163,13,0.12)' : 'rgba(46,112,255,0.12)',
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
          marginBottom: 8, lineHeight: 1.3, color: '#0F172A',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{p.titulo}</h3>

        {/* Descripción */}
        <p style={{
          color: '#64748B', fontSize: 13,
          lineHeight: 1.5, marginBottom: 16,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{p.descripcion}</p>

        {/* Divider */}
        <div style={{ height: 1, background: '#E2E8F0', marginBottom: 14 }} />

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: '#E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: accentColor,
              }}>
                {(p.autor || 'A').charAt(0).toUpperCase()}
              </div>
              <p style={{ color: '#94A3B8', fontSize: 12 }}>{p.autor}</p>
            </div>
            <p style={{ color: '#fbbf24', fontSize: 12 }}>
              ★ {p.calificacion || '0.0'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 9, color: '#94A3B8', letterSpacing: '0.05em' }}>PRECIO</p>
            <p style={{
              color: accentColor, fontSize: 22,
              fontWeight: 800, fontFamily: 'Syne, sans-serif', lineHeight: 1,
            }}>
              ${p.precio?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
