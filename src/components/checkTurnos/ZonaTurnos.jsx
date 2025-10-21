import { useEffect, useState } from "react";
import Calendario from "./Calendario";
import Prueba from "./Prueba";
import Simulacion from "./Simulacion";
import Reservar from "./Reservar";
import { db } from "../../firebase/firebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useAlumnos } from "../../helpers/useAlumnos";
import { useFechas } from "../../helpers/useFechas";
import EditarAlumno from "../alumnos/EditarAlumno";


const ZonaTurnos = () => {
  const [zonasSeleccionadas, setZonasSeleccionadas] = useState([]);
  const [ventanaReservar, setVentanaReservar] = useState(false)
  const [reserva, setReserva] = useState({});
  const [turnoSim, setTurnoSim] = useState([]);
  const [simulacion, setSimulacion] = useState(false);
  const [dataAlumno, setDataAlumno] = useState(false)
  const [renderBusqueda, setRenderBusqueda] = useState(false)
  const [inputAgregarTurno, setInputAgregarTurno] = useState(false)
  const [nuevoTurno, setNuevoTurno] = useState({ dia: "", mes: "", hora: "", zona: "", anio: "" })

  const { alumnos, setAlumnos, alumnosFiltrados,
    setAlumnosFiltrados, ventanaAlumno,
    setVentanaAlumno, busquedaAlumno,
    setBusquedaAlumno, modoEdicion,
    setModoEdicion, alumnoSeleccionado,
    setAlumnoSeleccionado,
    toggleAlumno, handleEditar,
    editarAlumno, normalizar, handleBusquedaAlumno,
    borrarAlumno, turnoModificandose, setTurnoModificandose,
    todosLosTurnos,
  } = useAlumnos()

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

  const capturarAlumno = (id) => { // funcion que setea el alumnoSeleccionado a partir del Id
    const almn = alumnosFiltrados.filter((e) => e.id === id)
    const alumnoCopiaProfunda = { ...almn[0], turnos: almn[0].turnos ? almn[0].turnos.map(t => ({ ...t })) : [] }
    setAlumnoSeleccionado(alumnoCopiaProfunda)
    setDataAlumno(true)
    setRenderBusqueda(false)
  }

  const borrarTurnoReservado = async (dia, hora, mes, zona, anio, idAlumno) => {
    const arrayTurnosAlumno = alumnoSeleccionado.turnos;
    const turnoBorrado = arrayTurnosAlumno.filter((turno) => turno.dia !== dia || turno.hora !== hora || turno.mes !== mes || turno.zona !== zona || turno.anio !== anio);
    try {
      await updateDoc(doc(db, "alumnos", idAlumno), { turnos: turnoBorrado })
      alert("turno borrado con exito")
    } catch (error) {
      console.error("Error borrando turno:", error);
    }
  }

  const agregarTurno = async (idAlumno) => {
    const id = alumnoSeleccionado.turnos.length + 1
    try {
      const turnoActualizado = { ...alumnoSeleccionado, turnos: [...alumnoSeleccionado.turnos, { id, ...nuevoTurno }] }
      // 1️⃣ Actualiza en Firebase con el nuevo objeto
      await updateDoc(doc(db, "alumnos", idAlumno), turnoActualizado);
      // 2️⃣ Actualiza el estado local
      setAlumnoSeleccionado(turnoActualizado);
      // 3️⃣ Limpia el formulario
      setNuevoTurno({ dia: "", mes: "", hora: "", zona: "" });
    } catch (error) {
      console.error("Error agregando turno:", error);
    }
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
          <div className="searchbar-wrapper">
            <input className="searchbar" type="text" value={busquedaAlumno} onChange={handleBusqueda} /> {/* BUSCADOR*/}
            {renderBusqueda && (
              <ul className="alumnos-list">
                {alumnosFiltrados.map((alumno) => (
                  <li key={alumno.id} className="alumno-item">
                    <div onClick={() => { { capturarAlumno(alumno.id) } }}>{alumno.nombre}</div>
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
                    <EditarAlumno
                      nuevoTurno={nuevoTurno}
                      setNuevoTurno={setNuevoTurno}
                      alumnoSeleccionado={alumnoSeleccionado}
                      handleEditar={handleEditar}
                      obtenerDiasDelMes={obtenerDiasDelMes}
                      obtenerHorarios={obtenerHorarios}
                      borrarTurnoReservado={borrarTurnoReservado}
                      editarAlumno={editarAlumno}
                      setModoEdicion={setModoEdicion}
                      setInputAgregarTurno={setInputAgregarTurno}
                      inputAgregarTurno={inputAgregarTurno}
                      agregarTurno={agregarTurno}
                    />
                  </>
                )}
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
