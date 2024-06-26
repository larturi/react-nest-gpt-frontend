import { Navigate } from 'react-router-dom'

interface RequireAuthProps {
  children: React.ReactNode
}

const isAuthenticated = () => {
  const token = localStorage.getItem('userToken')
  if (!token) return false

  const parts = token.split('.')
  if (parts.length !== 3) {
    localStorage.removeItem('userToken')
    return false
  }

  try {
    const payload = JSON.parse(window.atob(parts[1]))
    const now = Date.now() / 1000
    if (payload.exp < now) {
      // El token ha caducado
      localStorage.removeItem('userToken')
      return false
    }
  } catch (e) {
    // Error al decodificar el token, podría no ser válido
    localStorage.removeItem('userToken')
    return false
  }

  return true
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  if (!isAuthenticated()) {
    // Usuario no autenticado, redirigir a la página de login
    return <Navigate to='/login' />
  }

  return children
}
