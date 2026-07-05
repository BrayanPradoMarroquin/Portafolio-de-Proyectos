import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

interface User {
  id: number
  name: string
  email: string
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } else {
        // Si no hay usuario, redirigir al login
        navigate('/login')
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      // Limpiar datos corruptos y redirigir al login
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [navigate])

  // Si no hay usuario, mostrar carga
  if (!user) {
    return (
      <div className="dashboard">
        <div className="dashboard-content">
          <div className="loading">
            <p>Cargando información del usuario...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Bienvenido, {user.name}!</h1>
        <p>Has iniciado sesión correctamente en el sistema.</p>
        
        <div className="dashboard-cards">
          <div className="card">
            <h3>Información del Usuario</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Rol:</strong> Usuario registrado</p>
          </div>
          
          <div className="card">
            <h3>Estado de la Cuenta</h3>
            <p>✅ Sesión activa</p>
            <p>📅 Registrado recientemente</p>
            <p>🔒 Cuenta verificada</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard