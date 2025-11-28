import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Bikes from '../pages/Bikes'
import BikeDetails from '../pages/BikeDetails'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import AddBike from '../pages/AddBike'
import EditBike from '../pages/EditBike'
import MyCollection from '../pages/MyCollection'
import ProtectedRoute from '../components/ProtectedRoute'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bikes" element={<Bikes />} />
      <Route path="/bikes/:id" element={<BikeDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/add-bike" element={
        <ProtectedRoute>
          <AddBike />
        </ProtectedRoute>
      } />
      <Route path="/edit-bike/:id" element={
        <ProtectedRoute>
          <EditBike />
        </ProtectedRoute>
      } />
      <Route path="/my-collection" element={
        <ProtectedRoute>
          <MyCollection />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default AppRouter
