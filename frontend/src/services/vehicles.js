import api from './api'

export const vehicleService = {
  async getAll(params = {}) {
    const response = await api.get('/vehicles', { params })
    return response.data
  },

  async getMyBikes() {
    const response = await api.get('/vehicles/my-bikes/')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/vehicles/${id}`)
    return response.data
  },

  async create(vehicleData) {
    const response = await api.post('/vehicles/', vehicleData)
    return response.data
  },

  async update(id, vehicleData) {
    const response = await api.put(`/vehicles/${id}`, vehicleData)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/vehicles/${id}`)
    return response.data
  },

  async uploadImages(vehicleId, files) {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await api.post(
      `/vehicles/${vehicleId}/upload-images`,
      formData,
      {
        headers: {
          // axios will keep Authorization header automatically
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  async getBrands() {
    const response = await api.get('/vehicles/brands/list')
    return response.data
  }
}
