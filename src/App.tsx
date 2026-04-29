import './App.css'
import { Routes, Route } from "react-router-dom"
import Linije from './pages/Linije'
import Vozaci from './pages/Vozaci'
import Vozila from './pages/Vozila'
import Index from './pages/Index'

function App() {

  return (
    <>    
    <Routes>
      <Route path="/" element={<Index/>}/>
      <Route path="/linije" element={<Linije/>}/>
      <Route path="/vozaci" element={<Vozaci/>}/>
      <Route path="/vozila" element={<Vozila/>}/>
    </Routes>
    </>
  )
}

export default App