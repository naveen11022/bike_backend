import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { vehicleService } from '../services/vehicles'
import { BIKE_BRANDS, FUEL_TYPES, OWNER_TYPES, BIKE_COLORS } from '../utils/constants'

function AddBike() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [form, setForm] = useState({
    title: '',
    brand: '',
    model: '',
    price: '',
    year: new Date().getFullYear(),
    km_driven: '',
    fuel_type: 'Petrol',
    location: '',
    description: '',
    owner_type: 'first_owner',
    engine_cc: '',
    mileage: '',
    color: '',

    is_negotiable: true
  })

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }
    setImages(files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.title || !form.brand || !form.model || !form.price) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const vehicleData = {
        ...form,
        price: parseFloat(form.price),
        year: parseInt(form.year),
        km_driven: parseInt(form.km_driven) || 0,
        engine_cc: form.engine_cc ? parseInt(form.engine_cc) : null,
        mileage: form.mileage ? parseFloat(form.mileage) : null
      }

      const response = await vehicleService.create(vehicleData)
      
      if (images.length > 0 && response.id) {
        await vehicleService.uploadImages(response.id, images)
      }

      toast.success('Bike listed for sale!')
      navigate('/bikes')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add bike')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sell Your Bike</h1>
          <p className="text-gray-500 mb-8">List your bike for sale on our marketplace</p>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            {/* Basic Info */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Royal Enfield Classic 350 - Well Maintained"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                <select
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Brand</option>
                  {BIKE_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Classic 350"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 150000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year of Purchase</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="input-field"
                  min="1990"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            {/* Vehicle Details */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">KM Driven</label>
                <input
                  type="number"
                  value={form.km_driven}
                  onChange={(e) => setForm({ ...form, km_driven: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 15000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                <select
                  value={form.fuel_type}
                  onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}
                  className="input-field"
                >
                  {FUEL_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Type</label>
                <select
                  value={form.owner_type}
                  onChange={(e) => setForm({ ...form, owner_type: e.target.value })}
                  className="input-field"
                >
                  {OWNER_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Engine (CC)</label>
                <input
                  type="number"
                  value={form.engine_cc}
                  onChange={(e) => setForm({ ...form, engine_cc: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 350"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km/l)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.mileage}
                  onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 35"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Color</option>
                  {BIKE_COLORS.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Mumbai"
                />
              </div>
            </div>

            {/* Additional Options */}
            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_negotiable}
                  onChange={(e) => setForm({ ...form, is_negotiable: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Price is negotiable</span>
              </label>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field min-h-[120px]"
                placeholder="Describe your bike's condition, features, reason for selling, etc."
              />
            </div>

            {/* Images */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Max 5)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="images"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-500">Click to upload photos of your bike</p>
                  <p className="text-gray-400 text-sm mt-1">Good photos increase your chances of selling</p>
                  {images.length > 0 && (
                    <p className="text-blue-600 mt-2 font-medium">{images.length} photo(s) selected</p>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Ad'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AddBike
