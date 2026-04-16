import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCursos, getServicios, actualizarCurso, actualizarServicio } from '../api/api'

export default function MisPublicaciones() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [publicaciones, setPublicaciones] = useState([])
  const [loading, setLoading]             = useState(true)
  const [editando, setEditando]           = useState(null)
  const [form, setForm]                   = useState({})
  const [saving, setSaving]               = useState(false)

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    try {
      const [cursos, servicios] = await Promise.all([getCursos(), getServicios()])
      const lista = [
        ...(cursos.data || [])
          .filter(c => c.usuarioId === usuario.id)
          .map(c => ({ tipo: 'CURSO', id: c.idCurso, titulo: c.titulo, descripcion: c.descripcion, precio: c.precio, extra: c.foto })),
        ...(servicios.data || [])
          .filter(s => s.usuarioId === usuario.id)
          .map(s => ({ tipo: 'CLASE', id: s.servicioId, titulo: s.titulo, descripcion: s.descripcion, precio: s.precio, extra: s.requisitos })),
      ]
      setPublicaciones(lista)
    } catch {}
    finally { setLoading(false) }
  }

  const abrirEditar = (p) => {
    setEditando(p)
    setForm({ titulo: p.titulo, descripcion: p.descripcion, precio: p.precio, extra: p.extra || '' })
  }

  const guardar = async () => {
    setSaving(true)
    try {
      if (editando.tipo === 'CURSO') {
        await actualizarCurso(editando.id, {
          titulo: form.titulo, descripcion: form.descripcion,
          precio: parseFloat(form.precio), foto: form.extra,
          usuarioId: usuario.id, calificacion: '0',
        })
      } else {
        await actualizarServicio(editando.id, {
          titulo: form.titulo, descripcion: form.descripcion,
          precio: parseFloat(form.precio), requisitos: form.extra,
          usuarioId: usuario.id, fecha: '2026-01-01', hora: '00:00:00',
        })
      }
      alert('¡Actualizado!')
      setEditando(null)
      cargar()
    } catch { alert('Error al guardar') }
    finally { setSaving(false) }
  }

  return (
    <div className="page">
      <button onClick={() => navigate(-1)} className="btn-ghost"
        style={{ marginBottom: 16, padding: '8px 0' }}>← Volver</button>

      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Mis publicaciones</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Gestiona tu contenido
      </p>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : publicaciones.length === 0 ? (
        <div className="empty-state">
          <span>📭</span>
          <p>No tienes publicaciones aún</p>
          <button className="btn-primary" onClick={() => navigate('/publicar')}
            style={{ marginTop: 16, padding: '10px 24px' }}>
            + Crear publicación
          </button>
        </div>
      ) : publicaciones.map((p, i) => (
        <div key={i} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <span className={`tag tag-${p.tipo === 'CURSO' ? 'curso' : 'clase'}`} style={{ marginBottom: 8, display: 'inline-block' }}>
                {p.tipo === 'CURSO' ? '📚 CURSO' : '🎓 CLASE'}
              </span>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{p.titulo}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {p.descripcion}
              </p>
              <p style={{ color: 'var(--accent)', fontWeight: 700 }}>${p.precio?.toFixed(2)}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button className="btn-secondary" onClick={() => abrirEditar(p)}
              style={{ flex: 1, height: 38, fontSize: 13 }}>✏️ Editar</button>
            {p.tipo === 'CLASE' && (
              <button className="btn-ghost" onClick={() => navigate(`/detalle/CLASE/${p.id}`, { state: { ...p, autorId: usuario.id, autor: usuario.nombre } })}
                style={{ flex: 1, height: 38, fontSize: 13, border: '1px solid var(--border)' }}>
                📅 Agenda
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Modal editar */}
      {editando && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 200, padding: '0 0 0 0',
        }} onClick={e => e.target === e.currentTarget && setEditando(null)}>
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: '20px 20px 0 0',
            padding: 24, width: '100%', maxWidth: 480,
            border: '1px solid var(--border)', borderBottom: 'none',
          }}>
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>Editar publicación</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Título" value={form.titulo}
                onChange={e => setForm({ ...form, titulo: e.target.value })} />
              <textarea placeholder="Descripción" value={form.descripcion} rows={3}
                onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              <input type="number" placeholder="Precio" value={form.precio}
                onChange={e => setForm({ ...form, precio: e.target.value })} />
              <input placeholder={editando.tipo === 'CURSO' ? 'Archivo/URL' : 'Modalidad'}
                value={form.extra} onChange={e => setForm({ ...form, extra: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn-primary" onClick={guardar} disabled={saving}
                style={{ flex: 1, height: 46 }}>
                {saving ? 'Guardando...' : 'Guardar'}   
              </button>
              <button className="btn-secondary" onClick={() => setEditando(null)}
                style={{ flex: 1, height: 46 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}