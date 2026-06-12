import './App.css'
import { Routes, Route } from "react-router-dom"
import Linije from './pages/Linije'
import Vozaci from './pages/Vozaci'
import Vozila from './pages/Vozila'
import Linija from './pages/Linija'
import NovaLinija from './pages/NovaLinija'
import NavBar from './components/navbar'
import AdminPanel from './pages/AdminPanel'
import Promene from './pages/Promene'

function App() {

  return (
    <>
    <NavBar/>  
    <Routes>
      <Route path="/" element={<Linije/>}/>
      <Route path="/vozaci" element={<Vozaci/>}/>
      <Route path="/vozila" element={<Vozila/>}/>
      <Route path="/linije" element={<Linije/>}/>
      <Route path="/adminPanel" element={<AdminPanel/>}/>
      <Route path="/novaLinija" element={<NovaLinija/>}/>
      <Route path="/linije/:id" element={<Linija/>}/>
      <Route path="/izmene/:id" element={<Promene/>}/>
    </Routes>
    </>
  )
}

export default App