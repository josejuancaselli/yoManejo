import { BrowserRouter, Route, Routes } from "react-router-dom"
import ZonaTurnos from "./components/checkTurnos/ZonaTurnos"
import Inicio from "./components/Inicio"
import "./components/styles.css"
import Alumnos from "./components/alumnos/Alumnos"
import Profesores from "./components/profesores/Profesores"
import Contabilidad from "./components/contabilidad/Contabilidad"
import Admin from "./components/admin/Admin"



function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Inicio />} /> */}
          <Route path="/" element={<ZonaTurnos />} />
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/profesores" element={<Profesores />} />
          <Route path="/contabilidad" element={<Contabilidad />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
