import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  // Simulamos autenticación (en producción usarías un estado global o context)
  const isAuthenticated = localStorage.getItem('token') !== null

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App