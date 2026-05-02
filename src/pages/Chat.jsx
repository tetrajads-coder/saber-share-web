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
      background: '#FFFFFF',
    }}>
      {/* Header */}
      <div style={{
        background: '#F1F5FF',
        borderBottom: '1px solid #E2E8F0',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        flexShrink: 0, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,112,255,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <button onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: '#0F172A', fontSize: 16,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
          }}>←</button>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2E70FF, #5b9aff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, color: '#fff', fontSize: 17,
          fontFamily: 'Syne, sans-serif',
          boxShadow: '0 4px 12px rgba(46,112,255,0.2)',
        }}>{nombre.charAt(0).toUpperCase()}</div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif', color: '#0F172A' }}>{nombre}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#65A30D' }} />
            <p style={{ color: '#65A30D', fontSize: 11, fontWeight: 500 }}>En línea</p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 16px',
        display: 'flex', flexDirection: 'column', gap: 12,
        background: '#FFFFFF',
      }}>
        {mensajes.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0.5,
          }}>
            <div style={{ fontSize: 48 }}>💬</div>
            <p style={{ color: '#94A3B8', fontSize: 14 }}>Inicia la conversación</p>
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
                  background: 'linear-gradient(135deg, #2E70FF, #5b9aff)',
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
                  ? 'linear-gradient(135deg, #2E70FF 0%, #5b9aff 100%)'
                  : '#FFFFFF',
                color: esMio ? '#fff' : '#0F172A',
                fontSize: 14, lineHeight: 1.5,
                boxShadow: esMio
                  ? '0 4px 16px rgba(46,112,255,0.2)'
                  : '0 2px 8px rgba(15,23,42,0.06)',
                border: esMio ? 'none' : '1px solid #E2E8F0',
              }}>
                <p style={{ fontWeight: esMio ? 500 : 400 }}>{m.contenido}</p>
                <p style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>
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
        background: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
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
          }}
        />
        <button onClick={handleEnviar} disabled={loading || !texto.trim()}
          style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: texto.trim()
              ? 'linear-gradient(135deg, #2E70FF 0%, #5b9aff 100%)'
              : '#F1F5F9',
            color: texto.trim() ? '#fff' : '#94A3B8',
            border: 'none', cursor: texto.trim() ? 'pointer' : 'default',
            fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: texto.trim() ? '0 4px 12px rgba(46,112,255,0.25)' : 'none',
            transition: 'all 0.2s',
          }}>➤</button>
      </div>
    </div>
  )
}
