import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registrarUsuario } from '../api/api'

export default function Registro() {
  const [form, setForm]       = useState({ user:'', nombre:'', apellido:'', correo:'', telefono:'', password:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.user || !form.nombre || !form.correo || !form.password) {
      setError('Completa los campos obligatorios'); return
    }
    setLoading(true); setError('')
    try {
      await registrarUsuario(form)
      navigate('/login')
    } catch { setError('Error al registrar. Intenta con otro usuario.') }
    finally { setLoading(false) }
  }

  const campos = [
    { name:'user',     placeholder:'Nombre de usuario', icon:'👤', type:'text',     required: true },
    { name:'nombre',   placeholder:'Nombre',            icon:'✏️', type:'text',     required: true },
    { name:'apellido', placeholder:'Apellido',          icon:'✏️', type:'text',     required: false },
    { name:'correo',   placeholder:'Correo electrónico',icon:'📧', type:'email',    required: true },
    { name:'telefono', placeholder:'Teléfono',          icon:'📱', type:'tel',      required: false },
    { name:'password', placeholder:'Contraseña',        icon:'🔒', type:'password', required: true },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* Glows */}
      <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(163,230,53,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(46,112,255,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:420, position:'relative' }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{
            width:56, height:56, borderRadius:16, margin:'0 auto 14px',
            background:'linear-gradient(135deg, var(--accent) 0%, var(--accent-blue) 100%)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:24,
            boxShadow:'0 0 24px rgba(163,230,53,0.25)',
          }}>🎓</div>
          <h1 style={{ fontSize:32, fontFamily:'Syne, sans-serif', marginBottom:6 }}>
            <span style={{ background:'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Saber</span>
            <span style={{ background:'linear-gradient(90deg, var(--accent) 0%, #84cc16 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Share</span>
          </h1>
          <p style={{ color:'var(--text-tertiary)', fontSize:13 }}>Crea tu cuenta y empieza a aprender</p>
        </div>

        {/* Card */}
        <div style={{
          background:'linear-gradient(135deg, var(--bg-card) 0%, rgba(163,230,53,0.03) 100%)',
          border:'1px solid var(--border)', borderRadius:24, padding:28,
          boxShadow:'0 24px 64px rgba(0,0,0,0.4)',
        }}>
          <h2 style={{ fontSize:18, fontFamily:'Syne, sans-serif', marginBottom:4 }}>Crear cuenta</h2>
          <p style={{ color:'var(--text-tertiary)', fontSize:12, marginBottom:20 }}>
            * Campos obligatorios
          </p>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {campos.map(c => (
              <div key={c.name}>
                <div style={{ position:'relative' }}>
                  <span style={{
                    position:'absolute', left:13, top:'50%', transform:'translateY(-50%)',
                    fontSize:15, pointerEvents:'none',
                  }}>{c.icon}</span>
                  <input
                    name={c.name} type={c.type}
                    placeholder={c.placeholder + (c.required ? ' *' : '')}
                    value={form[c.name]} onChange={handleChange}
                    style={{ paddingLeft:40, fontSize:13 }}
                  />
                </div>
              </div>
            ))}

            {error && (
              <div style={{
                background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)',
                borderRadius:10, padding:'10px 14px',
                color:'var(--error)', fontSize:13, display:'flex', alignItems:'center', gap:8,
              }}>⚠️ {error}</div>
            )}

            <button type="submit" disabled={loading}
              style={{
                marginTop:6, height:50, borderRadius:14, border:'none',
                background: loading
                  ? 'var(--bg-card)'
                  : 'linear-gradient(135deg, var(--accent) 0%, #84cc16 100%)',
                color: '#0a0a0d', fontWeight:700, fontSize:14,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(163,230,53,0.25)',
                transition:'all 0.2s',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              }}>
              {loading ? 'Creando cuenta...' : '✨ Crear cuenta'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', marginTop:20, color:'var(--text-tertiary)', fontSize:14 }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color:'var(--accent-blue)', fontWeight:700 }}>
            Iniciar sesión →
          </Link>
        </p>
      </div>
    </div>
  )
}