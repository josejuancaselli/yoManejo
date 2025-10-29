import { BrowserRouter, Route, Routes } from "react-router-dom"
import ZonaTurnos from "./components/checkTurnos/ZonaTurnos"
import Inicio from "./components/Inicio"
import "./components/styles.css"
import Prueba from "./components/checkTurnos/Prueba"
import Alumnos from "./components/alumnos/Alumnos"
import Profesores from "./components/profesores/Profesores"




function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<Inicio/>} />
          <Route path="/inicio" element = {<ZonaTurnos/>} />
          <Route path="/alumnos" element = {<Alumnos/>} />
          <Route path="/profesores" element={<Profesores/>}/>
          {/* <Route path="/turnos" element = {<TusPaski/>}/> */}
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
