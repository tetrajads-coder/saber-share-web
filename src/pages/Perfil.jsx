import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getSaldo, actualizarCorreoPaypal, getCursos, getServicios } from '../api/api'

export default function Perfil() {
  const { usuario, logout, esVendedor } = useAuth()
  const navigate = useNavigate()
  const [saldo, setSaldo]               = useState(null)
  const [correoPaypal, setCorreoPaypal] = useState('')
  const [editPaypal, setEditPaypal]     = useState(false)
  const [nuevoCorreo, setNuevoCorreo]   = useState('')
  const [nPublicaciones, setNPublicaciones] = useState(0)
  const [loading, setLoading]           = useState(false)

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    try {
      if (esVendedor) {
        const res = await getSaldo(usuario.id)
        setSaldo(res.data.saldoPendiente || 0)
        setCorreoPaypal(res.data.correoPaypal || '')
        setNuevoCorreo(res.data.correoPaypal || '')
      }
      const [cursos, servicios] = await Promise.all([getCursos(), getServicios()])
      const mios = (cursos.data || []).filter(c => c.usuarioId === usuario.id).length
              + (servicios.data || []).filter(s => s.usuarioId === usuario.id).length
      setNPublicaciones(mios)
    } catch {}
  }

  const handleGuardarPaypal = async () => {
    if (!nuevoCorreo) return
    setLoading(true)
    try {
      await actualizarCorreoPaypal(usuario.id, { correoPaypal: nuevoCorreo })
      setCorreoPaypal(nuevoCorreo)
      setEditPaypal(false)
    } catch { alert('Error al guardar') }
    finally { setLoading(false) }
  }

  const inicial = usuario?.nombre?.charAt(0).toUpperCase() || 'U'

  const menuItems = [
    { icon: '📋', label: 'Historial de compras', sub: 'Tus transacciones', path: '/historial', color: 'var(--accent-blue)' },
    ...(esVendedor ? [
      { icon: '📁', label: 'Mis publicaciones', sub: 'Edita tu contenido', path: '/mis-publicaciones', color: 'var(--accent)' },
    ] : []),
  ]

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0d 0%, #0f1629 60%, #0a0a0d 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 24px 32px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Glows */}
        <div style={{ position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(46,112,255,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, right:20, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(163,230,53,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />

        {/* Avatar */}
        <div style={{
          width: 86, height: 86, borderRadius: '50%', margin: '0 auto 16px',
          background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 34, fontWeight: 800, color: '#0a0a0d',
          fontFamily: 'Syne, sans-serif',
          boxShadow: '0 0 30px rgba(46,112,255,0.35), 0 0 60px rgba(163,230,53,0.1)',
          position: 'relative',
        }}>
          {inicial}
          <div style={{
            position:'absolute', bottom:2, right:2,
            width:18, height:18, borderRadius:'50%',
            background:'var(--accent)', border:'2px solid var(--bg-primary)',
          }} />
        </div>

        <h1 style={{
          fontSize: 26, fontFamily: 'Syne, sans-serif', marginBottom: 4,
          background: 'linear-gradient(90deg, #fff 30%, var(--accent-blue) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>{usuario?.nombre} {usuario?.apellido}</h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 12 }}>{usuario?.correo}</p>

        <span style={{
          display: 'inline-block', padding: '5px 14px', borderRadius: 20,
          background: 'rgba(46,112,255,0.15)',
          border: '1px solid rgba(46,112,255,0.3)',
          color: 'var(--accent-blue)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
        }}>{usuario?.rol || 'USUARIO'}</span>

        {/* Stats */}
        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'center' }}>
          {[
            { label:'Publicaciones', value: nPublicaciones, color:'var(--accent)' },
            { label:'Reputación', value:'★ 0.0', color:'var(--star)' },
          ].map((s,i) => (
            <div key={i} style={{
              flex:1, maxWidth:140,
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:14, padding:'12px 8px', textAlign:'center',
            }}>
              <p style={{ fontSize:22, fontWeight:800, color:s.color, fontFamily:'Syne' }}>{s.value}</p>
              <p style={{ fontSize:11, color:'var(--text-tertiary)', marginTop:3 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'20px', maxWidth:480, margin:'0 auto' }}>

        {/* Saldo vendedor */}
        {esVendedor && saldo !== null && (
          <div style={{
            background:'linear-gradient(135deg, rgba(46,112,255,0.1) 0%, rgba(163,230,53,0.06) 100%)',
            border:'1px solid rgba(46,112,255,0.25)',
            borderRadius:18, padding:20, marginBottom:16,
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <p style={{ fontSize:11, color:'var(--text-tertiary)', letterSpacing:'0.1em', marginBottom:4 }}>💰 SALDO PENDIENTE</p>
                <p style={{ fontSize:32, fontWeight:800, color:'var(--accent)', fontFamily:'Syne' }}>
                  ${saldo?.toFixed(2)} <span style={{ fontSize:14, color:'var(--text-tertiary)' }}>USD</span>
                </p>
                <p style={{ fontSize:12, color:'var(--text-tertiary)', marginTop:4 }}>90% de tus ventas acumuladas</p>
              </div>
              <div style={{ fontSize:32 }}>💸</div>
            </div>

            {editPaypal ? (
              <div>
                <input placeholder="tu@paypal.com" value={nuevoCorreo}
                  onChange={e => setNuevoCorreo(e.target.value)}
                  style={{ marginBottom:10 }} />
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={handleGuardarPaypal} disabled={loading}
                    style={{ flex:1, height:40, background:'var(--accent-blue)', color:'#fff', border:'none', borderRadius:10, fontWeight:600, cursor:'pointer' }}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button onClick={() => setEditPaypal(false)}
                    style={{ flex:1, height:40, background:'var(--bg-card)', color:'var(--text-secondary)', border:'1px solid var(--border)', borderRadius:10, cursor:'pointer' }}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize:13, color:'var(--text-secondary)' }}>
                  {correoPaypal || '⚠️ Sin correo PayPal'}
                </p>
                <button onClick={() => setEditPaypal(true)}
                  style={{ background:'rgba(46,112,255,0.15)', border:'1px solid rgba(46,112,255,0.3)', color:'var(--accent-blue)', borderRadius:8, padding:'4px 12px', fontSize:12, cursor:'pointer', fontWeight:600 }}>
                  ✏️ Editar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Menú */}
        {menuItems.map((item, i) => (
          <div key={i} onClick={() => navigate(item.path)}
            style={{
              background:'var(--bg-card)', border:'1px solid var(--border)',
              borderRadius:16, padding:'16px 20px', marginBottom:10,
              cursor:'pointer', display:'flex', alignItems:'center', gap:14,
              transition:'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.transform = 'translateX(4px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)' }}
          >
            <div style={{
              width:42, height:42, borderRadius:12, flexShrink:0,
              background: i === 0 ? 'rgba(46,112,255,0.12)' : 'rgba(163,230,53,0.12)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
            }}>{item.icon}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:600, fontSize:14 }}>{item.label}</p>
              <p style={{ color:'var(--text-tertiary)', fontSize:12, marginTop:2 }}>{item.sub}</p>
            </div>
            <span style={{ color:'var(--text-tertiary)', fontSize:18 }}>›</span>
          </div>
        ))}

        {/* Cerrar sesión */}
        <button onClick={() => { logout(); navigate('/login') }}
          style={{
            width:'100%', height:50, marginTop:8, borderRadius:14,
            background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)',
            color:'var(--error)', fontWeight:700, cursor:'pointer', fontSize:14,
            transition:'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}