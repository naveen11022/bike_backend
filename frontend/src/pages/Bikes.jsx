import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import BikeCard from '../components/BikeCard'
import { vehicleService } from '../services/vehicles'
import { BIKE_BRANDS, BRAND_LOGOS } from '../utils/constants'

function Bikes() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    min_price: '',
    max_price: '',
    search: ''
  })
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  const fetchBikes = async (page = 1) => {
    setLoading(true)
    try {
      const params = { page, limit: 12 }
      if (filters.brand) params.brand = filters.brand
      if (filters.min_price) params.min_price = filters.min_price
      if (filters.max_price) params.max_price = filters.max_price
      if (filters.search) params.search = filters.search

      const data = await vehicleService.getAll(params)
      setBikes(data.vehicles || [])
      setPagination({ page: data.page, pages: data.pages, total: data.total })
    } catch (error) {
      console.error('Error fetching bikes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBikes()
  }, [filters.brand])

  const handleFilter = (e) => {
    e.preventDefault()
    fetchBikes(1)
  }

  const clearFilters = async () => {
    const clearedFilters = { brand: '', min_price: '', max_price: '', search: '' }
    setFilters(clearedFilters)
    
    // Fetch with cleared filters directly
    setLoading(true)
    try {
      const data = await vehicleService.getAll({ page: 1, limit: 12 })
      setBikes(data.vehicles || [])
      setPagination({ page: data.page, pages: data.pages, total: data.total })
    } catch (error) {
      console.error('Error fetching bikes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Browse Bikes</h1>
          <p className="text-gray-500">Find your perfect ride from our collection</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Search model..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field"
            />
            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              className="input-field"
            >
              <option value="">All Brands</option>
              {BIKE_BRANDS.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.min_price}
              onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.max_price}
              onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
              className="input-field"
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">Search</button>
              <button type="button" onClick={clearFilters} className="btn-secondary px-4">Clear</button>
            </div>
          </form>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : bikes.length > 0 ? (
          <>
            <p className="text-gray-500 mb-6">{pagination.total} bikes found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bikes.map((bike, index) => (
                <motion.div
                  key={bike.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BikeCard bike={bike} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchBikes(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      pagination.page === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏍️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No bikes found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bikes
