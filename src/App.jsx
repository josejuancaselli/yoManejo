import { BrowserRouter, Route, Routes } from "react-router-dom"
import ZonaTurnos from "./components/checkTurnos/ZonaTurnos"
import Inicio from "./components/Inicio"
import "./components/styles.css"
import Alumnos from "./components/alumnos/Alumnos"
import Profesores from "./components/profesores/Profesores"
import PruebaProfesores from "./components/profesores/PruebaProfesores"




function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<Inicio/>} />
          <Route path="/inicio" element = {<ZonaTurnos/>} />
          <Route path="/alumnos" element = {<Alumnos/>} />
          <Route path="/profesores" element={<Profesores/>}/>
          {/* <Route path="/profesores" element={<PruebaProfesores/>}/> */}
          {/* <Route path="/turnos" element = {<TusPaski/>}/> */}
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
