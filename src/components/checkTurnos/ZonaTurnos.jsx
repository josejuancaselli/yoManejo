import { useEffect, useState } from "react";
import Calendario from "./Calendario";
import Prueba from "./Prueba";
import Simulacion from "./Simulacion";
import Reservar from "./Reservar";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useAlumnos } from "../../helpers/useAlumnos";
import { useFechas } from "../../helpers/useFechas";


const ZonaTurnos = () => {
  const [zonasSeleccionadas, setZonasSeleccionadas] = useState([]);
  const [ventanaReservar, setVentanaReservar] = useState(false)
  const [reserva, setReserva] = useState({});
  const [turnoSim, setTurnoSim] = useState([]);
  const [simulacion, setSimulacion] = useState(false);
  const [dataAlumno, setDataAlumno] = useState(false)
  const [renderBusqueda, setRenderBusqueda] = useState(false)


  const { alumnos, setAlumnos, alumnosFiltrados, setAlumnosFiltrados, busquedaAlumno, setBusquedaAlumno, normalizar, modoEdicion, editarAlumno, setModoEdicion, setAlumnoSeleccionado, alumnoSeleccionado,
    handleEditar } = useAlumnos()
  const { obtenerDiasDelMes, obtenerHorarios } = useFechas()

  const handleBusqueda = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusquedaAlumno(valor);
    if (valor === "") {
      // Si el input está vacío, dejamos el array vacío
      setAlumnosFiltrados([]);
      setRenderBusqueda(false); // opcional, si depende de que haya resultados
      return;
    }
    // Filtramos los alumnos
    const filtrados = alumnos.filter((alumno) => normalizar(alumno.nombre).includes(valor));
    setAlumnosFiltrados(filtrados);
    setRenderBusqueda(true); //  se activa solo si hay algo escrito
  };


  // ✅ toggle para agregar o quitar zonas seleccionadas
  const toggleZona = (z) => {
    setZonasSeleccionadas((prev) =>
      prev.includes(z) ? prev.filter((zona) => zona !== z) : [...prev, z]
    );
  };

  const borrarTurnoSimulado = (dia, hora, mes, zona, anio) => {
    setTurnoSim(turnoSim.filter((r) => !(r.dia === dia && r.hora === hora && r.mes === mes && r.zona === zona && r.anio === anio)));
  };

  const capturarId = (id) => { // funcion que setea el alumnoSeleccionado a partir del Id
    const almn = alumnosFiltrados.filter((e) => e.id === id)
    setAlumnoSeleccionado(almn[0])
  }


  return (
    <div className="zona-turnos-container">
{console.log(alumnosFiltrados)}
      <div className="zonas-section">
        <div className="seleccion-zona">
          <h2>Zonas</h2>
          <div className="zona-buttons">
            <button className="zona-btn" onClick={() => toggleZona("1")}>1</button>
            <button className="zona-btn" onClick={() => toggleZona("2")}>2</button>
            <button className="zona-btn" onClick={() => toggleZona("3")}>3</button>
          </div>
          <button onClick={() => setSimulacion(true)} className="zona-btn">+</button>
          <div className="searchbar-wrapper">
            <input className="searchbar" type="text" value={busquedaAlumno} onChange={handleBusqueda} /> {/* BUSCADOR*/}
            {renderBusqueda && (
              <ul className="alumnos-list">
                {alumnosFiltrados.map((alumno) => (
                  <li key={alumno.id} className="alumno-item">
                    <div onClick={() => { {capturarId(alumno.id), setDataAlumno(true), setRenderBusqueda(false)} }}>{alumno.nombre}</div>
                  </li>
                ))}
                <button onClick={() => setAlumnosFiltrados([])}>X</button>
              </ul>
            )}
          </div>
        </div>

        {dataAlumno && (
          <div>
            {!modoEdicion ? (
              <>
                {alumnoSeleccionado && (
                  <div>
                    <h3>{alumnoSeleccionado.nombre}</h3>
                    <p>Direccion: {alumnoSeleccionado.direccion}</p>
                    <p>DNI: {alumnoSeleccionado.dni}</p>
                    <p>Telefono: {alumnoSeleccionado.telefono}</p>
                    <p>Correo: {alumnoSeleccionado.correo}</p>
                    <p>Observaciones: {alumnoSeleccionado.observaciones}</p>
                    <h3>Turnos:</h3>
                    <ul>
                      {alumnoSeleccionado.turnos.map((turno, index) => {
                        return (
                          <li key={index}>
                            {turno.dia}/{turno.mes + 1} - {turno.hora} hs - Zona {turno.zona}
                          </li>
                        )
                      })}
                    </ul>
                    <button onClick={() => setModoEdicion(true)}>Editar</button>
                    <button onClick={() => { setDataAlumno(false); setAlumnoSeleccionado(null) }}>Cerrar</button>
                  </div>
                )}
              </>
            ) : (
              <>
                {alumnoSeleccionado && (
                  <>
                    <p> Nombre</p>
                    <input name="nombre" value={alumnoSeleccionado.nombre} onChange={handleEditar} />
                    <p> DNI</p>
                    <input name="dni" value={alumnoSeleccionado.dni} onChange={handleEditar} />
                    <p> Direccion</p>
                    <input name="direccion" value={alumnoSeleccionado.direccion} onChange={handleEditar} />
                    <p> E-mail</p>
                    <input name="correo" value={alumnoSeleccionado.correo} onChange={handleEditar} />
                    <p> Telefono</p>
                    <input name="telefono" value={alumnoSeleccionado.telefono} onChange={handleEditar} />
                    <p> Observaciones</p>
                    <input name="observaciones" value={alumnoSeleccionado.observaciones} onChange={handleEditar} />
                    <ul>
                      {alumnoSeleccionado.turnos.map((turno, idx) => {
                        return (
                          <li key={idx}>
                            <label>Dia</label>
                            <select name="dia" value={turno.dia} onChange={(e) => handleEditar(e, idx, "dia")}>
                              {obtenerDiasDelMes(turno.mes, turno.anio).map((dia, index) => {
                                return (
                                  <option key={index} value={dia}>{dia}</option>
                                )
                              })}
                            </select>
                            <label>Mes</label>
                            <select name="mes" value={turno.mes} onChange={(e) => { handleEditar(e, idx, "mes") }}>
                              {[...Array.from({ length: 12 }, (_, i) => i + 0)].map((mes) => {
                                return (
                                  <option key={mes} value={mes}>{mes + 1}</option> // mostramos 1-12, pero value sigue 0-11
                                )
                              })}
                            </select>
                            <label>Año</label>
                            <input name="anio" value={turno.anio} onChange={(e) => handleEditar(e, idx, "anio")} />
                            <label>Hora</label>
                            <select name="hora" value={turno.hora} onChange={(e) => handleEditar(e, idx, "hora")}>
                              {obtenerHorarios().map((hora, index) => {
                                return (
                                  <option key={index} value={hora}>{hora}</option>
                                )
                              })}
                            </select>
                            <label>Zona</label>
                            <select name="zona" value={turno.zona} onChange={(e) => handleEditar(e, idx, "zona")}>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                            </select>
                            <button onClick={() => { borrarTurnoReservado(turno.dia, turno.hora, turno.mes, turno.zona, turno.anio, alumno.id) }}>Borrar turno</button>
                          </li>
                        )
                      })}
                    </ul>
                  </>
                )}
                <button type="submit" onClick={() => { editarAlumno(alumnoSeleccionado.id), setModoEdicion(false) }}>Guardar</button>
                <button type="button" onClick={() => { setModoEdicion(false) }}>Cancelar</button>
              </>
            )}
          </div>
        )}

        {/* ✅ ahora recorremos todas las zonas seleccionadas */}
        <div className="zonas">
          <div style={{ display: "flex" }}>
            {zonasSeleccionadas.map((zona) => (
              <div key={zona} className="zona-selected">
                <Calendario
                  zona={zona} // 👈 se pasa la zona específica
                  turnoSim={turnoSim}
                  setTurnoSim={setTurnoSim}
                  simulacion={simulacion}
                  setSimulacion={setSimulacion}
                  alumnos={alumnos}
                  reserva={reserva}
                  setReserva={setReserva}
                  setAlumnos={setAlumnos}
                  ventanaReservar={ventanaReservar}
                  setVentanaReservar={setVentanaReservar}
                />
              </div>
            ))}

          </div>
          <div className="simulacion-card">
            {turnoSim.map((e, index) => {
              return (
                <div key={index} className="simulacion-container">
                  <p className="simulacion-item"> {e.dia}/{e.mes} </p>
                  <p className="simulacion-item"> {e.hora} hs </p>
                  <p className="simulacion-item"> Zona {e.zona} </p>
                  <button className="simulacion-delete-btn" onClick={() => { borrarTurnoSimulado(e.dia, e.hora, e.mes, e.zona, e.anio) }}>X</button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Render de simulación */}
      {simulacion && (<Simulacion setSimulacion={setSimulacion} setTurnoSim={setTurnoSim} turnoSim={turnoSim} setVentanaReservar={setVentanaReservar} />)}

      {/* Render de ventana de reservar */}
      {ventanaReservar && (
        <div className="reserva-modal-backdrop">
          <Reservar turnoSim={turnoSim} setTurnoSim={setTurnoSim} setVentanaReservar={setVentanaReservar} reserva={reserva} setReserva={setReserva} />
        </div>
      )}
    </div>
  );
};

export default ZonaTurnos;
