import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Sistema de Práctica</h2>
        </div>
        <div className="navbar-menu">
          <Link to="/" className="nav-link">Inicio</Link>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar