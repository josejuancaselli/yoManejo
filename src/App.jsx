import { BrowserRouter, Route, Routes } from "react-router-dom"
import ZonaTurnos from "./components/checkTurnos/ZonaTurnos"
import Inicio from "./components/Inicio"
import "./components/styles.css"
import TusPaski from "./components/TusPaski"
import Prueba from "./components/checkTurnos/Prueba"




function App() {
  

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<Inicio/>} />
          <Route path="/turnos" element = {<ZonaTurnos/>} />
          {/* <Route path="/turnos" element = {<TusPaski/>}/> */}
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
