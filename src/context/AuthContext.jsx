import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('ss_usuario');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    localStorage.setItem('ss_usuario', JSON.stringify(userData));
    setUsuario(userData);
  };

  const logout = () => {
    localStorage.removeItem('ss_usuario');
    setUsuario(null);
  };

  const esVendedor = usuario?.rol === 'CHALAN' || usuario?.rol === 'ADMIN';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, esVendedor }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);