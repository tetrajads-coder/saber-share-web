import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { crearCurso, crearServicio } from '../api/api'

export default function Publicar() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [tipo, setTipo]           = useState('CURSO')
  const [titulo, setTitulo]       = useState('')
  const [descripcion, setDesc]    = useState('')
  const [precio, setPrecio]       = useState('')
  const [archivo, setArchivo]     = useState('')
  const [modalidad, setModalidad] = useState('EN_LINEA')
  const [duracion, setDuracion]   = useState('')
  const [fecha, setFecha]         = useState('')
  const [hora, setHora]           = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const handlePublicar = async () => {
    setError('')
    if (!titulo.trim()) { setError('El título es obligatorio'); return }
    if (!precio || isNaN(precio)) { setError('El precio es obligatorio'); return }
    if (tipo === 'CLASE' && (!fecha || !hora)) { setError('La fecha y hora son obligatorias'); return }

    setLoading(true)
    try {
      if (tipo === 'CURSO') {
        await crearCurso({
          titulo, descripcion, precio: parseFloat(precio),
          foto: archivo, usuarioId: usuario.id, calificacion: '0',
        })
      } else {
        await crearServicio({
          titulo, descripcion, precio: parseFloat(precio),
          requisitos: modalidad, fecha, hora: hora + ':00',
          usuarioId: usuario.id,
        })
      }
      alert('¡Publicación creada exitosamente!')
      navigate('/')
    } catch {
      setError('Error al publicar. Intenta de nuevo.')
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Publicar</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Comparte tu conocimiento o servicio
      </p>

      {/* Selector tipo */}
      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.1em', marginBottom: 10 }}>
        TIPO DE PUBLICACIÓN
      </p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {[
          { value: 'CURSO', icon: '📚', label: 'Curso' },
          { value: 'CLASE', icon: '🎓', label: 'Clase 1a1' },
        ].map(t => (
          <div key={t.value} onClick={() => setTipo(t.value)}
            style={{
              flex: 1, padding: '16px 12px', borderRadius: 14,
              background: tipo === t.value ? 'rgba(163,230,53,0.15)' : 'var(--bg-card)',
              border: `2px solid ${tipo === t.value ? 'var(--accent)' : 'var(--border)'}`,
              cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
            }}>
            <p style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: tipo === t.value ? 'var(--accent)' : 'var(--text-secondary)' }}>
              {t.label}
            </p>
          </div>
        ))}
      </div>

      {/* Campos comunes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>Título *</p>
          <input placeholder="Título de la publicación" value={titulo}
            onChange={e => setTitulo(e.target.value)} maxLength={80} />
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'right', marginTop: 4 }}>
            {titulo.length}/80
          </p>
        </div>

        <div>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>Descripción</p>
          <textarea placeholder="Descripción detallada" value={descripcion}
            onChange={e => setDesc(e.target.value)} rows={4} maxLength={500} />
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'right', marginTop: 4 }}>
            {descripcion.length}/500
          </p>
        </div>

        <div>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>Precio (MXN) *</p>
          <input type="number" placeholder="0.00" value={precio}
            onChange={e => setPrecio(e.target.value)} min="0" step="0.01" />
        </div>

        {/* Sección CURSO */}
        {tipo === 'CURSO' && (
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.1em', marginBottom: 10, marginTop: 4 }}>
              CONTENIDO DEL CURSO
            </p>
            <input placeholder="URL o nombre del archivo (opcional)" value={archivo}
              onChange={e => setArchivo(e.target.value)} />
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
              Formatos: MP4, PDF, ZIP, YouTube, Drive
            </p>
          </div>
        )}

        {/* Sección CLASE */}
        {tipo === 'CLASE' && (
          <>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.1em', marginBottom: 10, marginTop: 4 }}>
                DETALLES DE LA CLASE
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8 }}>Modalidad</p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {[
                  { value: 'EN_LINEA', icon: '💻', label: 'En línea' },
                  { value: 'PRESENCIAL', icon: '📍', label: 'Presencial' },
                ].map(m => (
                  <div key={m.value} onClick={() => setModalidad(m.value)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 12,
                      background: modalidad === m.value ? 'rgba(163,230,53,0.15)' : 'var(--bg-card)',
                      border: `2px solid ${modalidad === m.value ? 'var(--accent)' : 'var(--border)'}`,
                      cursor: 'pointer', textAlign: 'center',
                    }}>
                    <p style={{ fontSize: 18, marginBottom: 2 }}>{m.icon}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: modalidad === m.value ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>Duración</p>
              <input placeholder="Ej: 60 min" value={duracion} onChange={e => setDuracion(e.target.value)} />
            </div>

            <div>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>Fecha disponible *</p>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
                min={new Date().toISOString().split('T')[0]} />
            </div>

            <div>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>Hora disponible *</p>
              <input type="time" value={hora} onChange={e => setHora(e.target.value)} />
            </div>
          </>
        )}
      </div>

      {error && <p className="error-msg" style={{ marginTop: 16 }}>{error}</p>}

      <button className="btn-primary" onClick={handlePublicar} disabled={loading}
        style={{ width: '100%', height: 52, marginTop: 24, fontSize: 15 }}>
        {loading ? 'Publicando...' : 'PUBLICAR AHORA'}
      </button>
    </div>
  )
}