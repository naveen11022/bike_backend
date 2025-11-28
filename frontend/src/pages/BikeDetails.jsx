import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { vehicleService } from '../services/vehicles'
import { authService } from '../services/auth'
import { formatPrice } from '../utils/helpers'
import { DEFAULT_BIKE_IMAGE, OWNER_TYPES } from '../utils/constants'

function BikeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bike, setBike] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [deleting, setDeleting] = useState(false)
  
  const isAuth = authService.isAuthenticated()
  const user = authService.getCurrentUser()

  const getOwnerLabel = (value) => {
    const owner = OWNER_TYPES.find(o => o.value === value)
    return owner ? owner.label : value
  }

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const data = await vehicleService.getById(id)
        setBike(data)
      } catch (error) {
        toast.error('Bike not found')
        navigate('/bikes')
      } finally {
        setLoading(false)
      }
    }
    fetchBike()
  }, [id, navigate])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    
    setDeleting(true)
    try {
      await vehicleService.delete(id)
      toast.success('Listing deleted successfully')
      navigate('/bikes')
    } catch (error) {
      toast.error('Failed to delete listing')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!bike) return null

  // Optimize image URLs for faster loading
  const optimizeImageUrl = (url, width = 800) => {
    if (url?.includes('unsplash.com')) {
      return url.replace(/w=\d+/, `w=${width}`).replace(/&q=\d+/, '') + '&q=80'
    }
    return url
  }
  
  const images = bike.images?.length > 0 
    ? bike.images.map(img => optimizeImageUrl(img)) 
    : [DEFAULT_BIKE_IMAGE]

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/bikes" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Listings
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="aspect-video relative">
                {bike.is_sold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <span className="bg-red-600 text-white px-6 py-3 rounded-full text-xl font-bold">SOLD</span>
                  </div>
                )}
                <img
                  src={images[selectedImage]}
                  alt={bike.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = DEFAULT_BIKE_IMAGE }}
                />
              </div>
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={optimizeImageUrl(img, 100)}
                        alt={`${bike.title} ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = DEFAULT_BIKE_IMAGE }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Vehicle Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">Brand</div>
                  <div className="font-semibold text-gray-800">{bike.brand}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">Model</div>
                  <div className="font-semibold text-gray-800">{bike.model}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">Year</div>
                  <div className="font-semibold text-gray-800">{bike.year}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">KM Driven</div>
                  <div className="font-semibold text-gray-800">{bike.km_driven?.toLocaleString()} km</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">Fuel Type</div>
                  <div className="font-semibold text-gray-800">{bike.fuel_type}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">Owner</div>
                  <div className="font-semibold text-gray-800">{getOwnerLabel(bike.owner_type)}</div>
                </div>
                {bike.engine_cc && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500">Engine</div>
                    <div className="font-semibold text-gray-800">{bike.engine_cc} CC</div>
                  </div>
                )}
                {bike.mileage && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500">Mileage</div>
                    <div className="font-semibold text-gray-800">{bike.mileage} km/l</div>
                  </div>
                )}
                {bike.color && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500">Color</div>
                    <div className="font-semibold text-gray-800">{bike.color}</div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-semibold text-gray-800">{bike.location}</div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            {bike.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{bike.description}</p>
              </motion.div>
            )}
          </div>

          {/* Right Column - Price & Contact */}
          <div className="space-y-6">
            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h1 className="text-xl font-bold text-gray-800 mb-2">{bike.title}</h1>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                <div className="text-sm text-gray-500 mb-1">Selling Price</div>
                <div className="text-3xl font-bold text-green-600">
                  {formatPrice(bike.price)}
                </div>
                {bike.is_negotiable && (
                  <span className="text-sm text-green-600 font-medium">Negotiable</span>
                )}
              </div>

              {/* Owner Contact Info */}
              {bike.owner && (
                <div className="border-t pt-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Seller Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{bike.owner.name?.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{bike.owner.name}</span>
                    </div>
                    {bike.owner.phone && (
                      <a href={`tel:${bike.owner.phone}`} className="flex items-center gap-3 bg-green-50 text-green-700 p-3 rounded-xl hover:bg-green-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium">{bike.owner.phone}</span>
                      </a>
                    )}
                    {bike.owner.email && (
                      <a href={`mailto:${bike.owner.email}`} className="flex items-center gap-3 bg-blue-50 text-blue-700 p-3 rounded-xl hover:bg-blue-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-sm">{bike.owner.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {isAuth && user?.id === bike.owner_id && (
                <div className="border-t pt-4 space-y-3">
                  <Link to={`/edit-bike/${bike.id}`} className="btn-secondary w-full text-center block">
                    Edit Listing
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full bg-red-50 text-red-600 px-6 py-3 rounded-xl font-medium border-2 border-red-200 hover:bg-red-100 transition-all disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete Listing'}
                  </button>
                </div>
              )}

              {!isAuth && (
                <Link to="/login" className="btn-primary w-full text-center block">
                  Login to Contact Seller
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BikeDetails
