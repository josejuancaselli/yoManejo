import { useEffect, useState } from "react";
import Simulacion from "./Simulacion";
import Reservar from "./Reservar";
import { db } from "../../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useAlumnos } from "../../helpers/useAlumnos";
import { useFechas } from "../../helpers/useFechas";
import ZonasSection from "./ZonasSection";
import AlumnoModalZona from "./AlumnoModalZona";
import { Link } from "react-router-dom";


const ZonaTurnos = () => {
  const [zonasSeleccionadas, setZonasSeleccionadas] = useState([]);
  const [ventanaReservar, setVentanaReservar] = useState(false)
  const [reserva, setReserva] = useState({});
  const [turnoSim, setTurnoSim] = useState([]);
  const [simulacion, setSimulacion] = useState(false);
  const [inputAgregarTurno, setInputAgregarTurno] = useState(false)
  const [nuevoTurno, setNuevoTurno] = useState([])
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

    try {

      const nuevosTurnos = [...alumnoSeleccionado.turnos, ...turnoSim];

      await updateDoc(doc(db, "alumnos", idAlumno), { turnos: nuevosTurnos });
      setAlumnoSeleccionado((prev) => ({ ...prev, turnos: nuevosTurnos }));
      setTurnoSim([]);
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
      <div className='inicio-container'>
        <div className='nav-bar'>
          <Link className='auto-title' to="/turnos">Ir a Turnos</Link>
          <Link className='auto-title' to="/alumnos">Alumnos</Link>
          <Link className='auto-title' to="/profesores">Profesores</Link>
        </div>
      </div>
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
        setBotonReserva={setBotonReserva}
      />

      {dataAlumno && (
        <div className="alumno-modal">
          <AlumnoModalZona
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
            editarTurnos={editarTurnos}
            setEditarTurnos={setEditarTurnos}
            dataAlumno={dataAlumno}
            setDataAlumno={setDataAlumno}
            obtenerDiasDelMes={obtenerDiasDelMes}
            obtenerHorarios={obtenerHorarios}
            handleEditarTurno={handleEditarTurno}
            turnosEditables={turnosEditables}
            setTurnosEditables={setTurnosEditables}
            setSimulacion={setSimulacion}
            setTurnoSim={setTurnoSim}
            setWarningReserva={setWarningReserva}
          />
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
