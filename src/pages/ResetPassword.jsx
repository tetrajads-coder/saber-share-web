import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { resetPassword } from '../api/api'
import logo from '../assets/logo_sabershare.png'

export default function ResetPassword() {
  const [searchParams]          = useSearchParams()
  const token                   = searchParams.get('token')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmar, setConfirmar]         = useState('')
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState('')
  const navigate                          = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nuevaPassword || !confirmar) { setError('Completa todos los campos'); return }
    if (nuevaPassword.length < 6)    { setError('La contraseña debe tener al menos 6 caracteres'); return }
    if (nuevaPassword !== confirmar)  { setError('Las contraseñas no coinciden'); return }
    if (!token)                       { setError('Token inválido o expirado'); return }
    setLoading(true); setError('')
    try {
      await resetPassword(token, nuevaPassword)
      navigate('/login', { state: { mensaje: 'Contraseña actualizada. Inicia sesión.' } })
    } catch {
      setError('El enlace es inválido o ha expirado. Solicita uno nuevo.')
    } finally { setLoading(false) }
  }

  if (!token) {
    return (
      <div style={{
        minHeight: '100vh', background: '#F8FAFC',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 24, padding: 32,
          boxShadow: '0 8px 32px rgba(15,23,42,0.08)', maxWidth: 420, width: '100%', textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontFamily: 'Syne, sans-serif', marginBottom: 10, color: '#0F172A' }}>
            Enlace inválido
          </h2>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>
            Este enlace de recuperación no es válido o ha expirado.
          </p>
          <Link to="/forgot-password" style={{
            display: 'inline-block', padding: '12px 24px', borderRadius: 12,
            background: 'linear-gradient(135deg, #2E70FF 0%, #5b9aff 100%)',
            color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
          }}>
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46,112,255,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, right: -80,
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(101,163,13,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img
            src={logo}
            alt="SaberShare"
            style={{ width: '140px', marginBottom: '24px' }}
          />
          <h1 style={{ fontSize: 38, fontFamily: 'Syne, sans-serif', marginBottom: 8, lineHeight: 1 }}>
            <span style={{ color: '#2E70FF' }}>Saber</span>
            <span style={{ color: '#65A30D' }}>Share</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 14 }}>
            Comparte conocimiento · Aprende · Crece
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 24, padding: 32,
          boxShadow: '0 8px 32px rgba(15,23,42,0.08)',
        }}>
          <h2 style={{ fontSize: 20, fontFamily: 'Syne, sans-serif', marginBottom: 6, color: '#0F172A' }}>
            Nueva contraseña
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 24 }}>
            Elige una contraseña segura para tu cuenta
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, display: 'block', fontWeight: 600, letterSpacing: '0.06em' }}>
                NUEVA CONTRASEÑA
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 16, pointerEvents: 'none',
                }}>🔒</span>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={nuevaPassword}
                  onChange={e => setNuevaPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, display: 'block', fontWeight: 600, letterSpacing: '0.06em' }}>
                CONFIRMAR CONTRASEÑA
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 16, pointerEvents: 'none',
                }}>🔑</span>
                <input
                  type="password"
                  placeholder="Repite la contraseña"
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 10, padding: '10px 14px',
                color: '#ef4444', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                marginTop: 8, height: 52, borderRadius: 14, border: 'none',
                background: loading
                  ? '#F1F5F9'
                  : 'linear-gradient(135deg, #2E70FF 0%, #5b9aff 100%)',
                color: loading ? '#94A3B8' : '#fff', fontWeight: 700, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(46,112,255,0.28)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              {loading ? (
                <>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: '2px solid #E2E8F0',
                    borderTopColor: '#94A3B8',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Guardando...
                </>
              ) : '✅ Cambiar contraseña'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#94A3B8', fontSize: 14 }}>
          <Link to="/login" style={{ color: '#2E70FF', fontWeight: 700, textDecoration: 'none' }}>
            ← Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
