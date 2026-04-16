import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getConversacion, enviarMensaje } from '../api/api'

export default function Chat() {
  const { receptorId, receptorNombre } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [mensajes, setMensajes] = useState([])
  const [texto, setTexto]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { cargar() }, [receptorId])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [mensajes])

  const cargar = async () => {
    try {
      const res = await getConversacion(usuario.id, parseInt(receptorId))
      const lista = (res.data || []).sort((a, b) => a.idMensaje - b.idMensaje)
      setMensajes(lista)
    } catch {}
  }

  const handleEnviar = async () => {
    if (!texto.trim() || loading) return
    setLoading(true)
    try {
      const res = await enviarMensaje({
        emisorId: usuario.id,
        receptorId: parseInt(receptorId),
        contenido: texto,
      })
      setMensajes(prev => [...prev, res.data])
      setTexto('')
    } catch {}
    finally { setLoading(false) }
  }

  const nombre = decodeURIComponent(receptorNombre || 'Chat')
  const NAVBAR_H = 70

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: NAVBAR_H,
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)',
    }}>
      {/* Header con gradiente */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1629 0%, #111116 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        flexShrink: 0, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,112,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <button onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)', fontSize: 16,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>←</button>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-blue), #5b9aff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, color: '#fff', fontSize: 17,
          fontFamily: 'Syne, sans-serif',
          boxShadow: '0 0 16px rgba(46,112,255,0.4)',
        }}>{nombre.charAt(0).toUpperCase()}</div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif' }}>{nombre}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
            <p style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 500 }}>En línea</p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 16px',
        display: 'flex', flexDirection: 'column', gap: 12,
        background: 'linear-gradient(180deg, #0d0d14 0%, var(--bg-primary) 100%)',
      }}>
        {mensajes.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0.5,
          }}>
            <div style={{ fontSize: 48 }}>💬</div>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Inicia la conversación</p>
          </div>
        ) : mensajes.map((m, i) => {
          const esMio = m.emisorId === usuario.id
          return (
            <div key={i} style={{
              display: 'flex',
              justifyContent: esMio ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end', gap: 8,
            }}>
              {!esMio && (
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent-blue), #5b9aff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff',
                }}>{nombre.charAt(0).toUpperCase()}</div>
              )}
              <div style={{
                maxWidth: '70%',
                padding: '11px 15px',
                borderRadius: 18,
                borderBottomRightRadius: esMio ? 4 : 18,
                borderBottomLeftRadius:  esMio ? 18 : 4,
                background: esMio
                  ? 'linear-gradient(135deg, var(--accent) 0%, #84cc16 100%)'
                  : 'var(--bg-card)',
                color: esMio ? '#0a0a0d' : 'var(--text-primary)',
                fontSize: 14, lineHeight: 1.5,
                boxShadow: esMio
                  ? '0 4px 16px rgba(163,230,53,0.25)'
                  : '0 2px 8px rgba(0,0,0,0.3)',
                border: esMio ? 'none' : '1px solid var(--border)',
              }}>
                <p style={{ fontWeight: esMio ? 500 : 400 }}>{m.contenido}</p>
                <p style={{ fontSize: 10, opacity: 0.55, marginTop: 4, textAlign: 'right' }}>
                  {m.fechaEnvio
                    ? new Date(m.fechaEnvio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '12px 16px',
        display: 'flex', gap: 10, alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <textarea
          placeholder="Escribe un mensaje..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEnviar() } }}
          rows={1}
          style={{
            flex: 1, resize: 'none', borderRadius: 20,
            padding: '10px 16px', maxHeight: 100,
            background: 'var(--bg-card)',
          }}
        />
        <button onClick={handleEnviar} disabled={loading || !texto.trim()}
          style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: texto.trim()
              ? 'linear-gradient(135deg, var(--accent) 0%, #84cc16 100%)'
              : 'var(--bg-card)',
            color: texto.trim() ? '#0a0a0d' : 'var(--text-tertiary)',
            border: 'none', cursor: texto.trim() ? 'pointer' : 'default',
            fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: texto.trim() ? '0 4px 12px rgba(163,230,53,0.3)' : 'none',
            transition: 'all 0.2s',
          }}>➤</button>
      </div>
    </div>
  )
}