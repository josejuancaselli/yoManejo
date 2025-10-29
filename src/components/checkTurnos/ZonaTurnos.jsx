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
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import TurnoData from "../alumnos/TurnoData";


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
  const [editarTurnoAlumno, setEditarTurnoAlumno] = useState(false)
  const [editarTurnos, setEditarTurnos] = useState(null);
  const [turnosEditables, setTurnosEditables] = useState([]);


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
    refresh, setRefresh, validacion,
  } = useAlumnos()

  const { obtenerDiasDelMes, obtenerHorarios, horariosMañana, horariosTarde, horarios } = useFechas()

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

    const turnoBorrado = alumnoSeleccionado.turnos.filter((turno) => turno.dia !== dia || turno.hora !== hora || turno.mes !== mes || turno.zona !== zona || turno.anio !== anio);
    try {
      await updateDoc(doc(db, "alumnos", idAlumno), { turnos: turnoBorrado })
      alert("turno borrado con exito")
      setRefresh(prev => !prev)
      setAlumnoSeleccionado((prev) => ({ ...prev, turnos: turnoBorrado, }));
    } catch (error) {
      console.error("Error borrando turno:", error);
    }
  }

  const agregarTurno = async (idAlumno) => {
    const todosLosTurnos = alumnos.map((alumno) => alumno.turnos).flat();

    const validacion = todosLosTurnos.some((turno) =>
      turno.dia === Number(nuevoTurno.dia) &&
      turno.hora === nuevoTurno.hora &&
      turno.mes === Number(nuevoTurno.mes) &&
      turno.zona === nuevoTurno.zona &&
      turno.anio === Number(nuevoTurno.anio)
    );

    if (validacion) {
      alert("Turno ya existente");
      setInputAgregarTurno(false);
      return;
    }

    try {
      const id = alumnoSeleccionado.turnos.length + 1;
      const turnoActualizado = { ...alumnoSeleccionado, turnos: [...alumnoSeleccionado.turnos, { id, ...nuevoTurno }] };

      await updateDoc(doc(db, "alumnos", idAlumno), turnoActualizado);
      setAlumnoSeleccionado(turnoActualizado);
      setNuevoTurno({ dia: "", mes: "0", hora: "", anio: new Date().getFullYear(), zona: "" });
    } catch (error) {
      console.error("Error agregando turno:", error);
    }
  };


  // Cargamos los turnos al entrar en modo edición o al cambiar el alumno seleccionado
  useEffect(() => {
    if (alumnoSeleccionado.turnos) {
      setTurnosEditables(alumnoSeleccionado.turnos.map((t) => ({ ...t })));
    }
  }, [alumnoSeleccionado]);

  // Función para actualizar un turno editable
  const handleEditarTurno = (e, index, campo) => {
    const valor = ["dia", "mes", "anio"].includes(campo)
      ? Number(e.target.value)
      : e.target.value;

    const nuevosTurnos = [...turnosEditables];
    const turnoEditado = { ...nuevosTurnos[index], [campo]: valor };

    // --- Validación de duplicados ---
    const existeDuplicado = nuevosTurnos.some((t, i) =>
      i !== index &&
      t.dia === turnoEditado.dia &&
      t.mes === turnoEditado.mes &&
      t.anio === turnoEditado.anio &&
      t.hora === turnoEditado.hora &&
      t.zona === turnoEditado.zona
    );
    if (existeDuplicado) {
      alert("Ya existe un turno con esa fecha, hora y zona.");
      return; // Salimos sin guardar el cambio
    }
    // --- Si no hay duplicado, actualizamos ---
    nuevosTurnos[index] = turnoEditado;
    setTurnosEditables(nuevosTurnos);

    // Mantener sincronizado con alumnoSeleccionado
    handleEditar(e, index, campo);
  };



  return (
    <div className="zona-turnos-container">
      <div className="zonas-section">
        <div className="seleccion-zona">
          <div className="searchbar-wrapper">
            <input className="searchbar" type="text" value={busquedaAlumno} onChange={handleBusqueda} placeholder="Buscar alumno..." />
            {renderBusqueda && (
              <div className="alumnos-search-wrapper">
                <ul className="alumnos-list">
                  {alumnosFiltrados.map((alumno) => (
                    <li key={alumno.id} className="alumno-item" onClick={() => { { capturarAlumno(alumno.id) } }}>
                      {alumno.nombre}
                    </li>
                  ))}

                </ul>
                <button className="turno-btn-cerrar" onClick={() => { setAlumnosFiltrados([]), setRenderBusqueda(false) }}><IoIosClose /></button>
              </div>
            )}
          </div>
          <div className="zona-buttons-wrapper">
            <h2>Zonas</h2>
            <div className="zona-buttons">
              <button className="zona-btn" onClick={() => toggleZona("1")}>1</button>
              <button className="zona-btn" onClick={() => toggleZona("2")}>2</button>
              <button className="zona-btn" onClick={() => toggleZona("3")}>3</button>
              <button onClick={() => setSimulacion(true)} className="zona-btn" style={{ borderRadius: "10px", backgroundColor: "#333433" }}>+</button>
            </div>
          </div>


          {turnoSim.length > 0 && (
            <>
              <ul className="simulacion-card">
                {turnoSim.map((e, index) => {
                  return (
                    <li key={index} className="simulacion-container">
                      <p className="simulacion-item">
                        {String(e.dia).padStart(2, "0")}/{String(e.mes + 1).padStart(2, "0")} - {e.hora} hs - Zona {e.zona}
                      </p>
                      <button className="simulacion-delete-btn" onClick={() => { borrarTurnoSimulado(e.dia, e.hora, e.mes, e.zona, e.anio) }}><IoIosClose /></button>
                    </li>
                  )
                })}
              </ul>
            </>
          )}

        </div>



        <div className="zonas">
          <>
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
                  horariosMañana={horariosMañana}
                  horariosTarde={horariosTarde}
                  obtenerHorarios={obtenerHorarios}
                  horarios={horarios}
                />
              </div>
            ))}
          </>

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

      {dataAlumno && (
        <div className="alumno-modal">

          {!modoEdicion ? (
            <>
              {alumnoSeleccionado && (
                <div className="alumno-modal-content">
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: "3px solid #54b198", paddingBottom: "10px" }}>
                    <div style={{ display: "flex" }}>
                      <h3>{alumnoSeleccionado.nombre}</h3>
                    </div>
                    <button className="turno-btn-cerrar" style={{ marginBottom: "40px" }} onClick={() => { setDataAlumno(false) }}><IoIosClose /></button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="editar-alumno-modal">
                      <div>
                        <p>Direccion:</p>
                        <p>{alumnoSeleccionado.direccion}</p>
                      </div>
                      <div>
                        <p>DNI: </p>
                        <p>{alumnoSeleccionado.dni}</p>
                      </div>
                      <div>
                        <p>Telefono: </p>
                        <p>{alumnoSeleccionado.telefono}</p>
                      </div>
                      <div>
                        <p>Correo: </p>
                        <p>{alumnoSeleccionado.correo}</p>
                      </div>
                      <div>
                        <p>Observaciones: </p>
                        <p style={{height: "70px"}}>{alumnoSeleccionado.observaciones}</p>
                      </div>
                    </div>
                    <button className="turnos-btn-editar" onClick={() => setModoEdicion(true)}><FaEdit /></button>
                  </div>
                  <div className="turnos-editables">
                    <h3>Turnos:</h3>
                    <TurnoData
                      nuevoTurno={nuevoTurno}
                      setNuevoTurno={setNuevoTurno}
                      alumnoSeleccionado={alumnoSeleccionado}
                      handleEditar={handleEditar}
                      obtenerDiasDelMes={obtenerDiasDelMes}
                      obtenerHorarios={obtenerHorarios}
                      borrarTurnoReservado={borrarTurnoReservado}
                      editarAlumno={editarAlumno}
                      setModoEdicion={setModoEdicion}
                      modoEdicion={modoEdicion}
                      setInputAgregarTurno={setInputAgregarTurno}
                      inputAgregarTurno={inputAgregarTurno}
                      agregarTurno={agregarTurno}
                      editarTurnoAlumno={editarTurnoAlumno}
                      setEditarTurnoAlumno={setEditarTurnoAlumno}
                      handleEditarTurno={handleEditarTurno}
                      turnosEditables={turnosEditables}
                      setTurnosEditables={setTurnosEditables}
                      editarTurnos={editarTurnos}
                      setEditarTurnos={setEditarTurnos}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button className="btn-guardar" onClick={() => { editarAlumno(alumnoSeleccionado.id); setDataAlumno(false); setEditarTurnos(null) }}>Guardar cambios</button>
                    <button className="btn-cerrar" onClick={() => { setDataAlumno(false) }}>Cerrar</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="alumno-modal-content">
              < >
                {alumnoSeleccionado && (
                  <>
                    < >
                      {/* className="editar-alumno-modal"  */}
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
                        modoEdicion={modoEdicion}
                        setInputAgregarTurno={setInputAgregarTurno}
                        inputAgregarTurno={inputAgregarTurno}
                        agregarTurno={agregarTurno}
                        editarTurnoAlumno={editarTurnoAlumno}
                        setEditarTurnoAlumno={setEditarTurnoAlumno}
                      />
                    </>
                    <div className="turnos-editables">
                      <h3>Turnos:</h3>
                      <TurnoData
                        nuevoTurno={nuevoTurno}
                        setNuevoTurno={setNuevoTurno}
                        alumnoSeleccionado={alumnoSeleccionado}
                        handleEditar={handleEditar}
                        obtenerDiasDelMes={obtenerDiasDelMes}
                        obtenerHorarios={obtenerHorarios}
                        borrarTurnoReservado={borrarTurnoReservado}
                        editarAlumno={editarAlumno}
                        setModoEdicion={setModoEdicion}
                        modoEdicion={modoEdicion}
                        setInputAgregarTurno={setInputAgregarTurno}
                        inputAgregarTurno={inputAgregarTurno}
                        agregarTurno={agregarTurno}
                        editarTurnoAlumno={editarTurnoAlumno}
                        setEditarTurnoAlumno={setEditarTurnoAlumno}
                        handleEditarTurno={handleEditarTurno}
                        turnosEditables={turnosEditables}
                        setTurnosEditables={setTurnosEditables}
                        editarTurnos={editarTurnos}
                        setEditarTurnos={setEditarTurnos}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <button className="btn-guardar" onClick={() => { editarAlumno(alumnoSeleccionado.id); setDataAlumno(false) }}>Guardar cambios</button>
                      <button className="btn-cerrar" onClick={() => { setDataAlumno(false) }}>Cerrar</button>
                    </div>
                  </>
                )}
              </>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ZonaTurnos;
