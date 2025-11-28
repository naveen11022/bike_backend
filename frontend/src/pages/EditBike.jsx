import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { vehicleService } from '../services/vehicles'
import { authService } from '../services/auth'
import { BIKE_BRANDS, FUEL_TYPES } from '../utils/constants'

function EditBike() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState([])
  const [form, setForm] = useState({
    title: '',
    brand: '',
    model: '',
    price: '',
    year: '',
    km_driven: '',
    fuel_type: 'Petrol',
    location: '',
    description: ''
  })

  const user = authService.getCurrentUser()

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const bike = await vehicleService.getById(id)
        
        // Check if current user is the owner
        if (bike.owner_id !== user?.id) {
          toast.error('You can only edit your own bikes')
          navigate('/bikes')
          return
        }
        
        setForm({
          title: bike.title || '',
          brand: bike.brand || '',
          model: bike.model || '',
          price: bike.price || '',
          year: bike.year || '',
          km_driven: bike.km_driven || '',
          fuel_type: bike.fuel_type || 'Petrol',
          location: bike.location || '',
          description: bike.description || ''
        })
      } catch (error) {
        toast.error('Bike not found')
        navigate('/bikes')
      } finally {
        setLoading(false)
      }
    }
    fetchBike()
  }, [id, navigate, user?.id])

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

    setSaving(true)
    try {
      const vehicleData = {
        ...form,
        price: parseFloat(form.price),
        year: parseInt(form.year),
        km_driven: parseInt(form.km_driven) || 0
      }

      await vehicleService.update(id, vehicleData)
      
      if (images.length > 0) {
        await vehicleService.uploadImages(id, images)
      }

      toast.success('Bike updated successfully!')
      navigate(`/bikes/${id}`)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update bike')
    } finally {
      setSaving(false)
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Bike</h1>
          <p className="text-gray-500 mb-8">Update your bike listing</p>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Royal Enfield Classic 350"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day (₹) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="input-field"
                  min="1990"
                  max={new Date().getFullYear()}
                />
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Mumbai"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field min-h-[100px]"
                  placeholder="Describe your bike..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add More Images (Max 5)</label>
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
                    <p className="text-gray-500">Click to upload new images</p>
                    {images.length > 0 && (
                      <p className="text-blue-600 mt-2">{images.length} file(s) selected</p>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default EditBike
