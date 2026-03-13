import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import LandingPage from './pages/LandingPage/LandingPage'
import ContactPage from './pages/ContactPage/ContactPage'
import FAQPage from './pages/FAQPage/FAQPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import LoginPage from './pages/LoginPage/LoginPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App
