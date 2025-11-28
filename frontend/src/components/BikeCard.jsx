import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice } from '../utils/helpers'
import { DEFAULT_BIKE_IMAGE } from '../utils/constants'

function BikeCard({ bike }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Use smaller image size for thumbnails (400px width)
  const rawUrl = bike.images?.[0] || DEFAULT_BIKE_IMAGE
  const imageUrl = rawUrl.includes('unsplash.com') 
    ? rawUrl.replace(/w=\d+/, 'w=400').replace(/&q=\d+/, '') + '&q=75'
    : rawUrl

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="card group"
    >
      <div className="relative overflow-hidden h-48 bg-gray-200">
        {bike.is_sold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-red-600 text-white px-4 py-1 rounded-full font-bold">SOLD</span>
          </div>
        )}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse w-12 h-12 rounded-full bg-gray-300"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt={bike.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={(e) => { e.target.src = DEFAULT_BIKE_IMAGE; setImageLoaded(true) }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-green-600 font-semibold text-sm">{formatPrice(bike.price)}</span>
        </div>
        {bike.is_negotiable && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Negotiable
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {bike.brand}
          </span>
          <span className="text-xs text-gray-500">{bike.year}</span>
        </div>
        
        <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">{bike.title}</h3>
        <p className="text-gray-500 text-sm mb-3">{bike.model}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {bike.location}
          </span>
          <span>{bike.km_driven?.toLocaleString()} km</span>
        </div>
        
        <Link to={`/bikes/${bike.id}`} className="btn-primary w-full text-center block text-sm py-2">
          View Details
        </Link>
      </div>
    </motion.div>
  )
}

export default BikeCard
