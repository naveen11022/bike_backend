import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BikeCard from '../components/BikeCard'
import { vehicleService } from '../services/vehicles'
import { BIKE_BRANDS, BRAND_LOGOS } from '../utils/constants'

function Home() {
  const [featuredBikes, setFeaturedBikes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const data = await vehicleService.getAll({ limit: 6 })
        setFeaturedBikes(data.vehicles || [])
      } catch (error) {
        console.error('Error fetching bikes:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBikes()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&q=75')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Buy & Sell
              <span className="block text-yellow-400">Pre-Owned Bikes</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              India's trusted marketplace for buying and selling used bikes. 
              Find verified sellers and great deals near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/bikes" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Browse Bikes
              </Link>
              <Link to="/add-bike" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
                Sell Your Bike
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Bikes Listed' },
              { number: '10K+', label: 'Happy Buyers' },
              { number: '50+', label: 'Cities' },
              { number: '100%', label: 'Verified Sellers' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.number}</div>
                <div className="text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bikes */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Latest Listings</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Check out the newest bikes listed for sale on our marketplace
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : featuredBikes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBikes.map((bike, index) => (
                <motion.div
                  key={bike.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BikeCard bike={bike} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No bikes available yet. Be the first to add one!
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/bikes" className="btn-primary inline-block">
              View All Bikes →
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Browse by Brand</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Find bikes from your favorite manufacturers
            </p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {BIKE_BRANDS.map((brand, index) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/bikes?brand=${encodeURIComponent(brand)}`}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-3 group"
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img
                      src={BRAND_LOGOS[brand]}
                      alt={brand}
                      loading="lazy"
                      decoding="async"
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                    <div className="hidden w-full h-full items-center justify-center text-2xl font-bold text-gray-400">
                      {brand.charAt(0)}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">{brand}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Want to Sell Your Bike?
            </h2>
            <p className="text-green-100 mb-8 text-lg">
              List your bike for free and reach thousands of potential buyers
            </p>
            <Link to="/add-bike" className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all inline-block shadow-lg">
              Post Free Ad
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl">🏍️</span>
              <span className="text-xl font-bold text-white">BikeMarket</span>
            </div>
            <p className="text-sm">© 2024 BikeMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
