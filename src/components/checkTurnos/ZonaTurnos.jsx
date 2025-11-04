import { useEffect, useState } from "react";
import Simulacion from "./Simulacion";
import Reservar from "./Reservar";
import { db } from "../../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useAlumnos } from "../../helpers/useAlumnos";
import { useFechas } from "../../helpers/useFechas";
import EditarAlumno from "../alumnos/EditarAlumno";
import TurnoData from "../alumnos/TurnoData";
import AlumnoData from "../alumnos/AlumnoData";
import ZonasSection from "./ZonasSection";


const ZonaTurnos = () => {
  const [zonasSeleccionadas, setZonasSeleccionadas] = useState([]);
  const [ventanaReservar, setVentanaReservar] = useState(false)
  const [reserva, setReserva] = useState({});
  const [turnoSim, setTurnoSim] = useState([]);
  const [simulacion, setSimulacion] = useState(false);
  const [inputAgregarTurno, setInputAgregarTurno] = useState(false)
  const [nuevoTurno, setNuevoTurno] = useState({ dia: "", mes: "", hora: "", zona: "", anio: "" })
  const [editarTurnoAlumno, setEditarTurnoAlumno] = useState(false)
  const [editarTurnos, setEditarTurnos] = useState(null);
  const [turnosEditables, setTurnosEditables] = useState([]);
  const [warningReserva, setWarningReserva] = useState(false);
  const [botonReserva, setBotonReserva] = useState(true);


  const { alumnos, setAlumnos, alumnosFiltrados,
    setAlumnosFiltrados, ventanaAlumno,
    setVentanaAlumno, busquedaAlumno,
    modoEdicion,
    setModoEdicion, alumnoSeleccionado,
    setAlumnoSeleccionado,
    toggleAlumno, handleEditar,
    editarAlumno,
    borrarAlumno, turnoModificandose, setTurnoModificandose,
    todosLosTurnos,
    setRefresh, handleBusqueda, renderBusqueda, setRenderBusqueda, dataAlumno, setDataAlumno, capturarAlumno
  } = useAlumnos()

  const { obtenerDiasDelMes, obtenerHorarios, horariosMañana, horariosTarde, horarios } = useFechas()

  // ✅ toggle para agregar o quitar zonas seleccionadas
  const toggleZona = (z) => {
    setZonasSeleccionadas((prev) =>
      prev.includes(z) ? prev.filter((zona) => zona !== z) : [...prev, z]
    );
  };

  const borrarTurnoSimulado = (dia, hora, mes, zona, anio) => {
    setTurnoSim(turnoSim.filter((r) => !(r.dia === dia && r.hora === hora && r.mes === mes && r.zona === zona && r.anio === anio)));
  };

  const borrarTurnoReservado = async (dia, hora, mes, zona, anio, idAlumno, confirmacion) => {
    const turnoBorrado = alumnoSeleccionado.turnos.filter((turno) => turno.dia !== dia || turno.hora !== hora || turno.mes !== mes || turno.zona !== zona || turno.anio !== anio);

    try {
      if (confirmacion === "si") {
        await updateDoc(doc(db, "alumnos", idAlumno), { turnos: turnoBorrado })
        alert("turno borrado con exito")
        setRefresh(prev => !prev)
        setAlumnoSeleccionado((prev) => ({ ...prev, turnos: turnoBorrado, }));
      }

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
      setNuevoTurno({ dia: "", mes: "", hora: "", anio: "", zona: "" });
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

    const turnosAlumnos = alumnos.map((alumno) => alumno.turnos).flat()
    const nuevosTurnos = [...turnosEditables];
    const turnoEditado = { ...nuevosTurnos[index], [campo]: valor };

    // --- Validación de duplicados ---
    const existeDuplicado = turnosAlumnos.some((t, i) =>
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

      <ZonasSection
        handleBusqueda={handleBusqueda}
        renderBusqueda={renderBusqueda}
        alumnosFiltrados={alumnosFiltrados}
        capturarAlumno={capturarAlumno}
        setAlumnosFiltrados={setAlumnosFiltrados}
        setRenderBusqueda={setRenderBusqueda}
        toggleZona={toggleZona}
        setSimulacion={setSimulacion}
        simulacion={simulacion}
        ventanaReservar={ventanaReservar}
        setVentanaReservar={setVentanaReservar}
        setWarningReserva={setWarningReserva}
        busquedaAlumno={busquedaAlumno}
        turnoSim={turnoSim}
        setTurnoSim={setTurnoSim}
        borrarTurnoSimulado={borrarTurnoSimulado}
        zonasSeleccionadas={zonasSeleccionadas}
        alumnos={alumnos}
        setAlumnos={setAlumnos}
        reserva={reserva}
        setReserva={setReserva}
        horariosMañana={horariosMañana}
        horariosTarde={horariosTarde}
        obtenerHorarios={obtenerHorarios}
        horarios={horarios}
      />

      {dataAlumno && (
        <div className="alumno-modal">
          {!modoEdicion ? (
            alumnoSeleccionado && (
              <div className="alumno-modal-content">
                <AlumnoData
                  setVentanaAlumno={setVentanaAlumno}
                  toggleAlumno={toggleAlumno}
                  alumnos={alumnos}
                  ventanaAlumno={ventanaAlumno}
                  modoEdicion={modoEdicion}
                  setModoEdicion={setModoEdicion}
                  alumnoSeleccionado={alumnoSeleccionado}
                  handleEditar={handleEditar}
                  editarAlumno={editarAlumno}
                  borrarAlumno={borrarAlumno}
                  borrarTurnoReservado={borrarTurnoReservado}
                  setAlumnoSeleccionado={setAlumnoSeleccionado}
                  nuevoTurno={nuevoTurno}
                  setNuevoTurno={setNuevoTurno}
                  agregarTurno={agregarTurno}
                  inputAgregarTurno={inputAgregarTurno}
                  setInputAgregarTurno={setInputAgregarTurno}
                  turnoModificandose={turnoModificandose}
                  setTurnoModificandose={setTurnoModificandose}
                  todosLosTurnos={todosLosTurnos}
                  capturarAlumno={capturarAlumno}
                  alumnosFiltrados={alumnosFiltrados}
                  editarTurnoAlumno={editarTurnoAlumno}
                  setEditarTurnoAlumno={setEditarTurnoAlumno}
                  dataAlumno={dataAlumno}
                  setDataAlumno={setDataAlumno}
                />

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
                  <button className="btn-cerrar" onClick={() => { setSimulacion(true); setTurnoSim([alumnoSeleccionado.turnos]); setWarningReserva(false) }}>Imprimir</button>
                </div>
              </div>
            )
          ) : (
            alumnoSeleccionado && (
              <div className="alumno-modal-content">
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
                  <button className="btn-cerrar" onClick={() => { setSimulacion(true) }}>Imprimir</button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Render de simulación */}
      {simulacion && (
        <Simulacion
          setSimulacion={setSimulacion}
          setTurnoSim={setTurnoSim}
          turnoSim={turnoSim}
          setVentanaReservar={setVentanaReservar}
          warningReserva={warningReserva}
          setWarningReserva={setWarningReserva}
          botonReserva={botonReserva}
        />
      )}

      {/* Render de ventana de reservar */}
      {ventanaReservar && (
        <div className="reserva-modal-backdrop">
          <Reservar
            setVentanaReservar={setVentanaReservar}
            setSimulacion={setSimulacion}
            turnoSim={turnoSim}
            setReserva={setReserva}
            setRefresh={setRefresh}
            setWarningReserva={setWarningReserva}
            setBotonReserva={setBotonReserva}
          />
        </div>
      )}

    </div>
  );
};

export default ZonaTurnos;
