import React from 'react'
import LoginForm from '../components/LoginForm'
import './Login.css'

const Login: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-hero">
          <h1>Bienvenido de nuevo</h1>
          <p>Ingresa tus credenciales para acceder al sistema</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

export default Login