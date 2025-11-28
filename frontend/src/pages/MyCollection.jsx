import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { vehicleService } from '../services/vehicles'
import { formatPrice } from '../utils/helpers'
import { DEFAULT_BIKE_IMAGE } from '../utils/constants'

function MyCollection() {
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const fetchMyBikes = async () => {
    try {
      const data = await vehicleService.getMyBikes()
      setBikes(data.vehicles || [])
    } catch (error) {
      toast.error('Failed to load your bikes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyBikes()
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return
    
    setDeleting(id)
    try {
      await vehicleService.delete(id)
      toast.success('Bike deleted successfully')
      setBikes(bikes.filter(b => b.id !== id))
    } catch (error) {
      toast.error('Failed to delete bike')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
            <p className="text-gray-500 mt-1">Manage your bikes for sale</p>
          </div>
          <Link to="/add-bike" className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Sell New Bike
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-3xl">🏍️</span>
            </div>
            <div>
              <div className="text-3xl font-bold">{bikes.length}</div>
              <div className="text-blue-100">Active Listings</div>
            </div>
          </div>
        </motion.div>

        {/* Bikes List */}
        {bikes.length > 0 ? (
          <div className="space-y-4">
            {bikes.map((bike, index) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                    <img
                      src={bike.images?.[0] || DEFAULT_BIKE_IMAGE}
                      alt={bike.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = DEFAULT_BIKE_IMAGE }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                            {bike.brand}
                          </span>
                          <span className="text-gray-400 text-sm">{bike.year}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{bike.title}</h3>
                        <p className="text-gray-500 text-sm mb-2">{bike.model}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {bike.location}
                          </span>
                          <span>{bike.km_driven?.toLocaleString()} km</span>
                        </div>
                      </div>
                      
                      {/* Price & Actions */}
                      <div className="flex flex-col items-start lg:items-end gap-3">
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(bike.price)}<span className="text-sm font-normal text-gray-500">/day</span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/bikes/${bike.id}`}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            to={`/edit-bike/${bike.id}`}
                            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(bike.id, bike.title)}
                            disabled={deleting === bike.id}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            {deleting === bike.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl shadow-lg"
          >
            <div className="text-6xl mb-4">🏍️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No bikes yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first bike to rent</p>
            <Link to="/add-bike" className="btn-primary inline-block">
              Add Your First Bike
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MyCollection
