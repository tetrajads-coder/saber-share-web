import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getInbox } from '../api/api'

export default function Inbox() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [conversaciones, setConversaciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    try {
      const res = await getInbox(usuario.id)
      setConversaciones(res.data || [])
    } catch {}
    finally { setLoading(false) }
  }

  return (
    <div className="page">
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Mensajes</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Tus conversaciones activas
      </p>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : conversaciones.length === 0 ? (
        <div className="empty-state">
          <span>💬</span>
          <p>No hay conversaciones aún</p>
          <p style={{ fontSize: 13 }}>Compra un contenido para chatear con el vendedor</p>
        </div>
      ) : conversaciones.map((c, i) => (
        <div key={i} className="card"
          onClick={() => navigate(`/chat/${c.otroId}/${encodeURIComponent(c.otroNombre || 'Usuario')}`)}
          style={{ cursor: 'pointer', marginBottom: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%',
                background: 'var(--bg-secondary)', border: '2px solid var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: 'var(--accent)', fontSize: 18, flexShrink: 0,
              }}>
                {(c.otroNombre || 'U').charAt(0).toUpperCase()}
              </div>
              {c.noLeidos > 0 && (
                <div style={{
                  position: 'absolute', top: -2, right: -2,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--accent)', color: '#0d0d0f',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{c.noLeidos}</div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <p style={{ fontWeight: 600, fontSize: 15 }}>{c.otroNombre || 'Usuario'}</p>
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{c.fechaUltimo || ''}</p>
              </div>
              <p style={{
                color: 'var(--text-secondary)', fontSize: 13,
                overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
              }}>{c.ultimoMensaje || 'Sin mensajes'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}