import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Registro from './pages/Registro'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Inicio from './pages/Inicio'
import Detalle from './pages/Detalle'
import Comprar from './pages/Comprar'
import Chat from './pages/Chat'
import Inbox from './pages/Inbox'
import Historial from './pages/Historial'
import Perfil from './pages/Perfil'
import Publicar from './pages/Publicar'
import MisPublicaciones from './pages/MisPublicaciones'
import Navbar from './components/Navbar'

function PrivateRoute({ children }) {
  const { usuario } = useAuth()
  return usuario ? children : <Navigate to="/login" />
}

// Página de retorno de PayPal
function PaypalReturn() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div className="spinner" />
      <p style={{ color:'var(--text-secondary)' }}>Procesando tu pago...</p>
    </div>
  )
}

export default function App() {
  const { usuario } = useAuth()
  return (
    <>
      {usuario && <Navbar />}
      <Routes>
        <Route path="/login"           element={<Login />} />
        <Route path="/registro"        element={<Registro />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/" element={<PrivateRoute><Inicio /></PrivateRoute>} />
        <Route path="/detalle/:tipo/:id" element={<PrivateRoute><Detalle /></PrivateRoute>} />
        <Route path="/comprar/:tipo/:id" element={<PrivateRoute><Comprar /></PrivateRoute>} />
        <Route path="/paypal-return" element={<PrivateRoute><Comprar /></PrivateRoute>} />
        <Route path="/paypal-cancel" element={<PrivateRoute><Inicio /></PrivateRoute>} />
        <Route path="/chat/:receptorId/:receptorNombre" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/mensajes" element={<PrivateRoute><Inbox /></PrivateRoute>} />
        <Route path="/historial" element={<PrivateRoute><Historial /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/publicar" element={<PrivateRoute><Publicar /></PrivateRoute>} />
        <Route path="/mis-publicaciones" element={<PrivateRoute><MisPublicaciones /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}