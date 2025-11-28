import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { authService } from '../services/auth'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const isAuth = authService.isAuthenticated()

  const handleLogout = () => {
    authService.logout()
    navigate('/')
    window.location.reload()
  }

  return (
    <nav className="glass sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🏍️</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              BikeMarket
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</Link>
            <Link to="/bikes" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Bikes</Link>
            {isAuth && (
              <>
                <Link to="/my-collection" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">My Listings</Link>
                <Link to="/add-bike" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Sell Bike</Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuth ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Hi, {user?.name}</span>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Login</Link>
                <Link to="/signup" className="btn-primary text-sm py-2">Sign Up</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-3">
              <Link to="/" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/bikes" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Bikes</Link>
              {isAuth && (
                <>
                  <Link to="/my-collection" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>My Collection</Link>
                  <Link to="/add-bike" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Add Bike</Link>
                </>
              )}
              {isAuth ? (
                <button onClick={handleLogout} className="block text-red-600">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="block text-gray-700" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/signup" className="block text-blue-600 font-medium" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
