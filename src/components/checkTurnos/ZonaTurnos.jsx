import { useEffect, useState } from "react";
import Calendario from "./Calendario";
import Prueba from "./Prueba";



const ZonaTurnos = () => {

  // ✅ ahora manejamos un array de zonas seleccionadas
  const [zonasSeleccionadas, setZonasSeleccionadas] = useState([]);
  const [ventanaReservar, setVentanaReservar] = useState(false)

  // todos los turnos de todas las zonas
  const [alumnos, setAlumnos] = useState([]) // aca traigo la base de datos con todos los alumnos y sus turnos
  const [turnoSim, setTurnoSim] = useState([]);
  const [simulacion, setSimulacion] = useState(false);


  useEffect(() => {
    fetch("/turnos.json")
      .then(res => res.json())
      .then(data => setAlumnos(data))
      .catch(err => console.error("Error cargando turnos:", err));
  }, []);

  // ✅ toggle para agregar o quitar zonas seleccionadas
  const toggleZona = (z) => {
    setZonasSeleccionadas((prev) =>
      prev.includes(z) ? prev.filter((zona) => zona !== z) : [...prev, z]
    );
  };

  const borrarTurno = (dia, hora, mes, zona) => {
    setTurnoSim(turnoSim.filter((r) => !(r.dia === dia && r.hora === hora && r.mes === mes && r.zona === zona)));
  };

  return (
    <div className="zona-turnos-container">

      <div className="zonas-section">
        <div className="seleccion-zona">
          <h2>Zonas</h2>
          <div className="zona-buttons">
            <button className="zona-btn" onClick={() => toggleZona("1")}>1</button>
            <button className="zona-btn" onClick={() => toggleZona("2")}>2</button>
            <button className="zona-btn" onClick={() => toggleZona("3")}>3</button>
          </div>
          <button onClick={() => setSimulacion(true)} className="zona-btn">+</button>
        </div>

        {/* ✅ ahora recorremos todas las zonas seleccionadas */}
        <div>
          <div style={{ display: "flex" }}>
            {zonasSeleccionadas.map((zona) => (
              <div key={zona} className="zona-selected">
                <Calendario
                  zona={zona} // 👈 se pasa la zona específica
                  turnoSim={turnoSim}
                  setTurnoSim={setTurnoSim}
                  simulacion={simulacion}
                  setSimulacion={setSimulacion}
                  borrarTurno={borrarTurno}
                  alumnos={alumnos}
                  setAlumnos={setAlumnos}
                  ventanaReservar= {ventanaReservar}
                  setVentanaReservar = {setVentanaReservar}
                />

                {/* <Prueba
                                  zona={zona} // 👈 se pasa la zona específica
                  turnos={turnos}
                  setTurnos={setTurnos}
                  simulacion={simulacion}
                  setSimulacion={setSimulacion}
                  borrarTurno={borrarTurno}
                  alumnos={alumnos}
                  setAlumnos={setAlumnos}
                /> */}
              </div>
            ))}
          </div>

          <div className="simulacion-card">
            {turnoSim.map((e, index) => {
              return (
                <div key={index} className="simulacion-container">
                  
                  <p className="simulacion-item">
                    {e.diaSemana}
                  </p>
                  <p className="simulacion-item">
                    {e.dia}/{e.mes}
                  </p>
                  <p className="simulacion-item">
                    {e.hora} hs
                  </p>
                  <p className="simulacion-item">
                    Zona {e.zona}
                  </p>
                  
                  <button className="simulacion-delete-btn" onClick={() => { borrarTurno(e.dia, e.hora, e.mes, e.zona) }}>X</button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonaTurnos;
