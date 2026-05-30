import { useEffect, useState } from "react";
import Simulacion from "./Simulacion";
import Reservar from "./Reservar";
import { db } from "../../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useAlumnos } from "../../helpers/useAlumnos";
import { useFechas } from "../../helpers/useFechas";
import ZonasSection from "./ZonasSection";
import AlumnoModalZona from "./AlumnoModalZona";
import { toggleZona } from "../../helpers/zonaHelper";


import { Link } from "react-router-dom";
import ReservarPrueba from "./ReservarPrueba";


const ZonaTurnos = () => {
  const [reserva, setReserva] = useState({}); //este estado todavia no se si sirve para algo
  // const [inputAgregarTurno, setInputAgregarTurno] = useState(false)
  // const [nuevoTurno, setNuevoTurno] = useState([])  

  // UI
  const [ventanaReservar, setVentanaReservar] = useState(false)
  const [simulacion, setSimulacion] = useState(false);
  const [modoSimulacion, setModoSimulacion] = useState("preview");


  //Flujo
  const [turnoSim, setTurnoSim] = useState([]);
  const [zonasSeleccionadas, setZonasSeleccionadas] = useState([]);

  //Edicion
  const [editarTurnos, setEditarTurnos] = useState(null);
  const [turnosEditables, setTurnosEditables] = useState([]);

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


  //================================================================//
  // ZONAS
  //================================================================//
  const handleToggleZona = (zona) => {// Set zona seleccionada to true or false based on if it's already in the list  
    setZonasSeleccionadas((prev) => toggleZona(prev, zona));
  };


  //================================================================//
  // turnos TEMPORALES (simulacion)
  //================================================================//  
  const borrarTurnoSimulado = (dia, hora, mes, zona, anio) => { // Esta funcion borra un turno simulado de la lista de turnos simulados.
    setTurnoSim(
      turnoSim.filter(
        (r) =>
          !(r.dia === dia && r.hora === hora && r.mes === mes && r.zona === zona && r.anio === anio)
      )
    );
  };
  const agregarTurno = async (idAlumno) => {// Agrega un turno simulado a la lista de turnos del alumno seleccionado y actualiza el cambio en la base de datos
    try {
      const nuevosTurnos = [...alumnoSeleccionado.turnos, ...turnoSim];// Creamos los turnos simulados de la lista de turnos simulados y los turnos del alumno seleccionado      
      await updateDoc(doc(db, "alumnos", idAlumno), { turnos: nuevosTurnos });// Actualiza el cambio en la base de datos      
      setAlumnoSeleccionado((prev) => ({ ...prev, turnos: nuevosTurnos }));// Actualiza el alumno seleccionado con los nuevos turnos      
      setTurnoSim([]);// Reset el turno simulado
    } catch (error) {
      console.error("Error agregando turno:", error);
    }
  };

  //================================================================//
  // turnos EXISTENTES (base de datos)
  //================================================================//  
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

  const handleEditarTurno = (e, index, campo) => {// Función para actualizar un turno editable
    const valor = ["dia", "mes", "anio"].includes(campo) ? Number(e.target.value) : e.target.value;
    const turnosAlumnos = alumnos.map((alumno) => alumno.turnos).flat()
    const nuevosTurnos = [...turnosEditables];
    const turnoEditado = { ...nuevosTurnos[index], [campo]: valor };
    const existeDuplicado = turnosAlumnos.some((t, i) =>// --- Validación de duplicados ---
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

  const handleReservaConfirmada = () => {
    setModoSimulacion("readonly");
    setSimulacion(true);
    setVentanaReservar(false);
  };


  // Cargamos los turnos al entrar en modo edición o al cambiar el alumno seleccionado
  useEffect(() => {
    if (alumnoSeleccionado.turnos) {
      setTurnosEditables(alumnoSeleccionado.turnos.map((t) => ({ ...t })));
    }
  }, [alumnoSeleccionado]);

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
            agregarTurno={agregarTurno}
            turnoModificandose={turnoModificandose}
            setTurnoModificandose={setTurnoModificandose}
            todosLosTurnos={todosLosTurnos}
            capturarAlumno={capturarAlumno}
            alumnosFiltrados={alumnosFiltrados}
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
            modoSimulacion={modoSimulacion}
            setModoSimulacion={setModoSimulacion}
            turnoSim={turnoSim}
            borrarTurnoSimulado = {borrarTurnoSimulado}
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
          modoSimulacion={modoSimulacion}

        />
      )}

      {/* Render de ventana de reservar */}
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
