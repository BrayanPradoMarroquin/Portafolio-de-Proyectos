import React from 'react'
import RegisterForm from '../components/RegisterForm'
import './Register.css'

const Register: React.FC = () => {
  return (
    <div className="register-page">
      <div className="register-content">
        <div className="register-hero">
          <h1>Únete a nosotros</h1>
          <p>Crea tu cuenta y comienza a usar el sistema</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register