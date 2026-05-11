import './App.css'
import { Routes, Route } from "react-router-dom"
import Linije from './pages/Linije'
import Vozaci from './pages/Vozaci'
import Vozila from './pages/Vozila'
import Index from './pages/Index'
import Linija from './pages/Linija'
import NovaLinija from './pages/NovaLinija'

function App() {

  return (
    <>    
    <Routes>
      <Route path="/" element={<Index/>}/>
      <Route path="/vozaci" element={<Vozaci/>}/>
      <Route path="/vozila" element={<Vozila/>}/>
      <Route path="/linije" element={<Linije/>}/>
      <Route path="/linije/:id" element={<Linija/>}/>
      <Route path="/novaLinija" element={<NovaLinija/>}/>
    </Routes>
    </>
  )
}

export default App