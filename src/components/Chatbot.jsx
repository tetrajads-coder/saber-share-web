import { useState, useRef, useEffect } from 'react'
import api from '../api/api'

const BIENVENIDA = {
  texto: '¡Hola! 👋 Soy SaberBot, el asistente de SaberShare. ¿En qué puedo ayudarte hoy?',
  esUsuario: false,
  timestamp: new Date(),
}

const estilos = {
  botonFlotante: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2E70FF, #65A30D)',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(46,112,255,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    zIndex: 9999,
    transition: 'transform 0.2s ease',
  },
  ventana: {
    position: 'fixed',
    bottom: 92,
    right: 24,
    width: 380,
    height: 500,
    borderRadius: 16,
    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 9998,
    background: '#FFFFFF',
    transformOrigin: 'bottom right',
  },
  header: {
    background: '#2E70FF',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  headerTitulo: {
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: 15,
    margin: 0,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    margin: 0,
  },
  btnCerrar: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: 8,
    color: '#FFFFFF',
    width: 30,
    height: 30,
    cursor: 'pointer',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  mensajesArea: {
    flex: 1,
    overflowY: 'auto',
    background: '#F8FAFC',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  burbujaUsuario: {
    alignSelf: 'flex-end',
    background: '#2E70FF',
    color: '#FFFFFF',
    borderRadius: '18px 18px 4px 18px',
    padding: '9px 14px',
    maxWidth: '78%',
    fontSize: 14,
    lineHeight: 1.45,
    wordBreak: 'break-word',
  },
  burbujaBot: {
    alignSelf: 'flex-start',
    background: '#FFFFFF',
    color: '#0F172A',
    border: '1px solid #E2E8F0',
    borderRadius: '18px 18px 18px 4px',
    padding: '9px 14px',
    maxWidth: '78%',
    fontSize: 14,
    lineHeight: 1.45,
    wordBreak: 'break-word',
  },
  typing: {
    alignSelf: 'flex-start',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '18px 18px 18px 4px',
    padding: '10px 16px',
    display: 'flex',
    gap: 5,
    alignItems: 'center',
  },
  inputArea: {
    background: '#FFFFFF',
    borderTop: '1px solid #E2E8F0',
    padding: '10px 12px',
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: '1px solid #E2E8F0',
    borderRadius: 22,
    padding: '9px 14px',
    fontSize: 14,
    color: '#0F172A',
    background: '#F8FAFC',
    outline: 'none',
    fontFamily: 'inherit',
  },
  btnEnviar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: '#2E70FF',
    border: 'none',
    color: '#FFFFFF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    flexShrink: 0,
    transition: 'opacity 0.15s',
  },
}

function TypingIndicator() {
  return (
    <div style={estilos.typing}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#94A3B8',
            display: 'inline-block',
            animation: 'saberbot-bounce 1.2s ease infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function Chatbot() {
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([BIENVENIDA])
  const [inputTexto, setInputTexto] = useState('')
  const [cargando, setCargando] = useState(false)
  const finRef = useRef(null)

  useEffect(() => {
    if (abierto) finRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, cargando, abierto])

  async function enviarMensaje() {
    const texto = inputTexto.trim()
    if (!texto || cargando) return

    const msgUsuario = { texto, esUsuario: true, timestamp: new Date() }
    setMensajes(prev => [...prev, msgUsuario])
    setInputTexto('')
    setCargando(true)

    try {
      console.log("Enviando a backend:", texto)
      const res = await api.post('/chat', { mensaje: texto })
      console.log("Respuesta completa:", res)
      console.log("Respuesta data:", res.data)
      setMensajes(prev => [...prev, { texto: res.data.respuesta, esUsuario: false, timestamp: new Date() }])
    } catch (error) {
      console.error("Error completo:", error)
      console.error("Error response:", error.response)
      console.error("Error message:", error.message)
      setMensajes(prev => [...prev, {
        texto: 'Lo siento, hubo un error al conectar con el servidor. Inténtalo de nuevo.',
        esUsuario: false,
        timestamp: new Date(),
      }])
    } finally {
      setCargando(false)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensaje()
    }
  }

  const ventanaStyle = {
    ...estilos.ventana,
    transition: 'opacity 0.22s ease, transform 0.22s ease',
    opacity: abierto ? 1 : 0,
    transform: abierto ? 'scale(1)' : 'scale(0.85)',
    pointerEvents: abierto ? 'all' : 'none',
  }

  return (
    <>
      <style>{`
        @keyframes saberbot-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes saberbot-pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(46,112,255,0.4); }
          50% { box-shadow: 0 4px 28px rgba(46,112,255,0.7); }
        }
        .saberbot-btn:hover { transform: scale(1.08) !important; }
        .saberbot-send:disabled { opacity: 0.45; cursor: not-allowed; }
        .saberbot-input:focus { border-color: #2E70FF !important; box-shadow: 0 0 0 3px rgba(46,112,255,0.12); }
      `}</style>

      {/* Ventana */}
      <div style={ventanaStyle} aria-hidden={!abierto}>
        <div style={estilos.header}>
          <div style={estilos.headerInfo}>
            <p style={estilos.headerTitulo}>SaberBot 🤖</p>
            <p style={estilos.headerSub}>Asistente de SaberShare</p>
          </div>
          <button style={estilos.btnCerrar} onClick={() => setAbierto(false)} aria-label="Cerrar chat">✕</button>
        </div>

        <div style={estilos.mensajesArea}>
          {mensajes.map((m, i) => (
            <div key={i} style={m.esUsuario ? estilos.burbujaUsuario : estilos.burbujaBot}>
              {m.texto}
            </div>
          ))}
          {cargando && <TypingIndicator />}
          <div ref={finRef} />
        </div>

        <div style={estilos.inputArea}>
          <input
            className="saberbot-input"
            style={estilos.input}
            value={inputTexto}
            onChange={e => setInputTexto(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe un mensaje..."
            disabled={cargando}
            aria-label="Mensaje"
          />
          <button
            className="saberbot-send"
            style={estilos.btnEnviar}
            onClick={enviarMensaje}
            disabled={!inputTexto.trim() || cargando}
            aria-label="Enviar"
          >
            ➤
          </button>
        </div>
      </div>

      {/* Botón flotante */}
      <button
        className="saberbot-btn"
        style={{
          ...estilos.botonFlotante,
          animation: abierto ? 'none' : 'saberbot-pulse 2.4s ease infinite',
        }}
        onClick={() => setAbierto(v => !v)}
        aria-label={abierto ? 'Cerrar chatbot' : 'Abrir chatbot'}
      >
        {abierto ? '✕' : '💬'}
      </button>
    </>
  )
}
