import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUsuario } from '../api/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username || !password) { setError('Completa todos los campos'); return }
    setLoading(true); setError('')
    try {
      const res = await loginUsuario(username)
      const lista = res.data
      if (!lista || lista.length === 0) { setError('Usuario no encontrado'); return }
      const user = lista[0]
      if (user.password !== password) { setError('Contraseña incorrecta'); return }
      login(user)
      navigate('/')
    } catch {
      setError('Error de conexión con el servidor')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* Glows de fondo */}
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46,112,255,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, right: -80,
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(163,230,53,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -60,
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46,112,255,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
            boxShadow: '0 0 30px rgba(46,112,255,0.35), 0 0 60px rgba(163,230,53,0.1)',
          }}>📚</div>
          <h1 style={{
            fontSize: 38, fontFamily: 'Syne, sans-serif', marginBottom: 8, lineHeight: 1,
          }}>
            <span style={{
              background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Saber</span>
            <span style={{
              background: 'linear-gradient(90deg, var(--accent) 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Share</span>
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
            Comparte conocimiento · Aprende · Crece
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(46,112,255,0.04) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 24, padding: 32,
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}>
          <h2 style={{ fontSize: 20, fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>
            Bienvenido de vuelta
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 13, marginBottom: 24 }}>
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Usuario */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6, display: 'block' }}>
                USUARIO
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 16, pointerEvents: 'none',
                }}>👤</span>
                <input
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6, display: 'block' }}>
                CONTRASEÑA
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 16, pointerEvents: 'none',
                }}>🔒</span>
                <input
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 10, padding: '10px 14px',
                color: 'var(--error)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                marginTop: 8, height: 52, borderRadius: 14, border: 'none',
                background: loading
                  ? 'var(--bg-card)'
                  : 'linear-gradient(135deg, var(--accent-blue) 0%, #5b9aff 100%)',
                color: '#fff', fontWeight: 700, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(46,112,255,0.35)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              {loading ? (
                <>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Entrando...
                </>
              ) : '🚀 Iniciar sesión'}
            </button>
          </form>
        </div>

        {/* Registro */}
        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-tertiary)', fontSize: 14 }}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={{
            color: 'var(--accent)', fontWeight: 700,
            textDecoration: 'none',
          }}>Regístrate gratis →</Link>
        </p>
      </div>
    </div>
  )
}