import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Explore from './Pages/Explore/Explore'
import Destination from './Pages/Destination/Destination'
import MyTrips from './Pages/MyTrips/MyTrips'
import Favorites from './Pages/Favorites/Favorites'
import Profile from './Pages/Profile/Profile'
import MainLayout from './Layout/MainLayout'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/destination/:id" element={<Destination />} />
      <Route path="/my-trips" element={<MyTrips />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
