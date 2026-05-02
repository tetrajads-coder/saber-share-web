import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const links = [
  { to: '/',          emoji: '🏠', label: 'Inicio' },
  { to: '/mensajes',  emoji: '💬', label: 'Mensajes' },
  { to: '/publicar',  emoji: '➕', label: 'Publicar' },
  { to: '/historial', emoji: '📋', label: 'Historial' },
  { to: '/perfil',    emoji: '👤', label: 'Perfil' },
]

export default function Navbar() {
  const location = useLocation()
  const navRef   = useRef(null)
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const [mounted, setMounted] = useState(false)

  // Animate the sliding indicator under the active link
  useEffect(() => {
    if (!navRef.current) return
    const activeIndex = links.findIndex(l => l.to === location.pathname)
    if (activeIndex < 0) return
    const items = navRef.current.querySelectorAll('.nav-item')
    const el = items[activeIndex]
    if (!el) return
    const { offsetLeft, offsetWidth } = el
    setIndicatorStyle({
      left: offsetLeft + offsetWidth / 2 - 16,
      width: 32,
      opacity: 1,
    })
    if (!mounted) setMounted(true)
  }, [location.pathname])

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 -2px 16px rgba(15,23,42,0.06)',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 100,
        // Slide up on mount
        animation: 'slideUp 0.4s cubic-bezier(0.4,0,0.2,1) both',
      }}
    >
      {/* Sliding top indicator */}
      <div style={{
        position: 'absolute',
        top: 0,
        height: 2,
        borderRadius: '0 0 4px 4px',
        background: 'var(--accent-blue)',
        boxShadow: '0 0 12px var(--accent-glow)',
        transition: mounted
          ? 'left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1)'
          : 'none',
        ...indicatorStyle,
      }} />

      {links.map((l, i) => {
        const activo = location.pathname === l.to
        return (
          <Link
            key={l.to}
            to={l.to}
            className="nav-item"
            title={l.label}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              textDecoration: 'none',
              position: 'relative',
              // Stagger each item on mount
              animation: `fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) ${0.05 + i * 0.06}s both`,
            }}
          >
            {/* Emoji icon with bounce on active */}
            <span style={{
              fontSize: 22,
              lineHeight: 1,
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s',
              transform: activo ? 'scale(1.25) translateY(-2px)' : 'scale(1)',
              opacity: activo ? 1 : 0.45,
              display: 'block',
            }}>
              {l.emoji}
            </span>

            {/* Label */}
            <span style={{
              fontSize: 10,
              fontFamily: 'var(--font-display)',
              fontWeight: activo ? 700 : 400,
              letterSpacing: '0.04em',
              color: activo ? 'var(--accent-blue)' : 'var(--text-tertiary)',
              transition: 'color 0.2s, font-weight 0.2s',
            }}>
              {l.label}
            </span>

            {/* Ripple background on active */}
            {activo && (
              <div style={{
                position: 'absolute',
                inset: '4px 8px',
                borderRadius: 10,
                background: 'var(--accent-blue-bg)',
                zIndex: -1,
                animation: 'scaleIn 0.25s cubic-bezier(0.4,0,0.2,1) both',
              }} />
            )}
          </Link>
        )
      })}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </nav>
  )
}{}