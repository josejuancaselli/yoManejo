import { useState } from "react";
import Simulacion from "./Simulacion";
import { useAlumnos } from "../../helpers/useAlumnos";
import { useFechas } from "../../helpers/useFechas";
import { useTurnos } from "../../helpers/useTurnos";
import ZonasSection from "./ZonasSection";
import AlumnoModalZona from "./AlumnoModalZona";
import { toggleZona } from "../../helpers/zonaHelper";
import { Link } from "react-router-dom";
import ReservarPrueba from "./ReservarPrueba";

const ZonaTurnos = () => {
  const [reserva, setReserva] = useState({});

  // UI
  const [ventanaReservar, setVentanaReservar] = useState(false);
  const [simulacion, setSimulacion] = useState(false);
  const [modoSimulacion, setModoSimulacion] = useState("preview");
  const [editarTurnos, setEditarTurnos] = useState(null);

  // Zonas
  const [zonasSeleccionadas, setZonasSeleccionadas] = useState([]);

  const {
    alumnos,
    setAlumnos,
    alumnosFiltrados,
    setAlumnosFiltrados,
    ventanaAlumno,
    setVentanaAlumno,
    busquedaAlumno,
    modoEdicion,
    setModoEdicion,
    alumnoSeleccionado,
    setAlumnoSeleccionado,
    toggleAlumno,
    handleEditar,
    editarAlumno,
    borrarAlumno,
    turnoModificandose,
    setTurnoModificandose,
    todosLosTurnos,
    setRefresh,
    handleBusqueda,
    renderBusqueda,
    setRenderBusqueda,
    dataAlumno,
    setDataAlumno,
    capturarAlumno,
  } = useAlumnos();

  const { obtenerDiasDelMes, obtenerHorarios, horariosMañana, horariosTarde, horarios } = useFechas();

  const {
    turnoSim,
    setTurnoSim,
    turnosEditables,
    setTurnosEditables,
    borrarTurnoSimulado,
    agregarTurno,
    borrarTurnoReservado,
    handleEditarTurno,
  } = useTurnos({
    alumnoSeleccionado,
    setAlumnoSeleccionado,
    alumnos,
    setAlumnos,
    setRefresh,
    handleEditar,
  });

  const handleToggleZona = (zona) => {
    setZonasSeleccionadas((prev) => toggleZona(prev, zona));
  };

  const handleReservaConfirmada = () => {
    setModoSimulacion("readonly");
    setSimulacion(true);
    setVentanaReservar(false);
  };

  return (
    <div className="zona-turnos-container">

      <div className='inicio-container'>
        <div className='nav-bar'>
          <Link className='auto-title' to="/turnos">Ir a Turnos</Link>
          <Link className='auto-title' to="/alumnos">Alumnos</Link>
          <Link className='auto-title' to="/profesores">Profesores</Link>
          <Link className='auto-title' to="/contabilidad"> Contabildad </Link>
        </div>
      </div>

      <ZonasSection
        handleBusqueda={handleBusqueda}
        renderBusqueda={renderBusqueda}
        alumnosFiltrados={alumnosFiltrados}
        capturarAlumno={capturarAlumno}
        setAlumnosFiltrados={setAlumnosFiltrados}
        setRenderBusqueda={setRenderBusqueda}
        handleToggleZona={handleToggleZona}
        setSimulacion={setSimulacion}
        simulacion={simulacion}
        ventanaReservar={ventanaReservar}
        setVentanaReservar={setVentanaReservar}
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
        setModoSimulacion={setModoSimulacion}
        modoSimulacion={modoSimulacion}
        dataAlumno={dataAlumno}
      />

      {dataAlumno && (
        <div className="alumno-modal">
          <AlumnoModalZona
            modoEdicion={modoEdicion}
            setModoEdicion={setModoEdicion}
            alumnoSeleccionado={alumnoSeleccionado}
            handleEditar={handleEditar}
            editarAlumno={editarAlumno}
            borrarTurnoReservado={borrarTurnoReservado}
            setAlumnoSeleccionado={setAlumnoSeleccionado}
            agregarTurno={agregarTurno}
            editarTurnos={editarTurnos}
            setEditarTurnos={setEditarTurnos}
            setDataAlumno={setDataAlumno}
            obtenerDiasDelMes={obtenerDiasDelMes}
            obtenerHorarios={obtenerHorarios}
            handleEditarTurno={handleEditarTurno}
            turnosEditables={turnosEditables}
            setTurnosEditables={setTurnosEditables}
            setSimulacion={setSimulacion}
            setTurnoSim={setTurnoSim}
            modoSimulacion={modoSimulacion}
            setModoSimulacion={setModoSimulacion}
            turnoSim={turnoSim}
            borrarTurnoSimulado={borrarTurnoSimulado}
          />
        </div>
      )}

      {simulacion && (
        <Simulacion
          setSimulacion={setSimulacion}
          setTurnoSim={setTurnoSim}
          turnoSim={turnoSim}
          setVentanaReservar={setVentanaReservar}
          modoSimulacion={modoSimulacion}
        />
      )}

      {ventanaReservar && (
        <div className="reserva-modal-backdrop">
          <ReservarPrueba
            setVentanaReservar={setVentanaReservar}
            setSimulacion={setSimulacion}
            turnoSim={turnoSim}
            setReserva={setReserva}
            setRefresh={setRefresh}
            modoSimulacion={modoSimulacion}
            handleReservaConfirmada={handleReservaConfirmada}
          />
        </div>
      )}

    </div>
  );
};

export default ZonaTurnos;