import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Contact from './pages/Contact.jsx'
import FAQ from './pages/Faq.jsx'

function App() {
  return (
    <>
      <nav style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <Link to="/">Home</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/faq">FAQ</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </>
  )
}

export default App