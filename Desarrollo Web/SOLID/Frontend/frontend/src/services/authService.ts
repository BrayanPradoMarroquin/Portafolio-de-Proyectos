import axios from 'axios'

const API_URL = 'http://localhost:3000/api' // Cambia esto por tu backend

// Simulación de API para desarrollo
const simulateApi = true

export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  token?: string
  user?: User
}

// Función para login
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    })
    console.log('Login response:', response.data)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error en el servidor'
    }
  }
}

// Función para registro
export const register = async (userData: {
  name: string
  email: string
  password: string
}): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData)
    console.log('Respuesta del registro:', response.data)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error en el servidor'
    }
  }
}

// Función para logout
export const logout = (): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Función para verificar token
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token')
  return token !== null
}