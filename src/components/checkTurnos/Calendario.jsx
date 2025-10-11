import { useEffect, useState, useRef } from "react"; // hooks de React
import Simulacion from "./Simulacion"; // componente para la simulación de turnos
import VentanaReservado from "./VentanaReservado"; // componente para mostrar info de turno reservado
import DiasDelMes from "./DiasDelMes"; // componente que renderiza los días del mes
import Reservar from "./Reservar"; // componente para reservar un turno

// Componente principal del calendario
const Calendario = ({
  zona, // número o id de zona
  turnoSim, // array con turnos reservados actualmente
  setTurnoSim, // función para actualizar turnos
  simulacion, // boolean que controla si se muestra el componente Simulacion
  setSimulacion, // función para actualizar simulacion
  alumnos, // array de alumnos con sus turnos
  borrarTurno, // función para borrar un turno
  setAlumnos, // función para actualizar alumnos
  ventanaReservar, // boolean que controla si se muestra ventana de reservar
  setVentanaReservar // función para abrir/cerrar ventanaReservar
}) => {

  const hoy = new Date(); // fecha actual
  const [ventanaDia, setVentanaDia] = useState(null); // día seleccionado para mostrar horarios
  const [fecha, setFecha] = useState({ mes: hoy.getMonth(), anio: hoy.getFullYear() }); // mes y año actuales
  const [ventanaReservado, setVentanaReservado] = useState(null); // ventana para mostrar info de turno reservado
  const ventanaRef = useRef(null); // referencia al contenedor de horarios (para click fuera)
  const botonDiaRef = useRef(null); // referencia al botón del día activo

  const diasSemana = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"]; // nombres de los días
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; // nombres de los meses

  const mesActual = fecha.mes; // mes actual
  const anioActual = fecha.anio; // año actual
  const primerDia = new Date(anioActual, mesActual, 1).getDay(); // día de la semana del primer día del mes

  const turnosAlumnos = alumnos.map(e => e.turnos).flat(); // todos los turnos de todos los alumnos en un solo array

  // Toggle de la ventana de horarios de un día
  const toggleDia = (dia, ref) => {
    botonDiaRef.current = ref; // guardo el botón activo
    setVentanaDia((prevDia) => (prevDia === dia ? null : dia)); // si el día ya estaba abierto, lo cierro; si no, lo abro
  };

  // Avanzar un mes
  const siguienteMes = () => {
    setFecha((prev) => {
      if (prev.mes === 11) return { mes: 0, anio: prev.anio + 1 }; // si es diciembre, paso a enero del año siguiente
      return { mes: prev.mes + 1, anio: prev.anio };
    });
  };

  // Retroceder un mes
  const mesAnterior = () => {
    setFecha((prev) => {
      if (prev.mes === 0) return { mes: 11, anio: prev.anio - 1 }; // si es enero, paso a diciembre del año anterior
      return { mes: prev.mes - 1, anio: prev.anio };
    });
  };

  // Devuelve un array con los números de días del mes
  const obtenerDiasDelMes = (mes, anio) => {
    const cantidadDias = new Date(anio, mes + 1, 0).getDate(); // último día del mes
    return Array.from({ length: cantidadDias }, (_, i) => i + 1); // array [1,2,...,cantidadDias]
  };

  const diasDelMes = obtenerDiasDelMes(mesActual, anioActual); // días del mes actual

  // Filtra días que no se pueden seleccionar (anteriores a hoy)
  const disabled = diasDelMes.filter((dia) => {
    const fechaDia = new Date(fecha.anio, fecha.mes, dia); // fecha del día
    const hoySolo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); // hoy sin hora
    return fechaDia < hoySolo; // true si día anterior a hoy
  });

  // Genera los horarios disponibles (8:00 a 18:00)
  const obtenerHorarios = () => Array.from({ length: 11 }, (_, i) => `${i + 8}:00`);
  const horarios = obtenerHorarios();

  // Efecto para cerrar la ventana de horarios al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ventanaRef.current &&
        !ventanaRef.current.contains(event.target) &&
        botonDiaRef.current &&
        !botonDiaRef.current.contains(event.target)
      ) {
        setVentanaDia(null); // cierra ventana si clic afuera
      }
    };

    if (ventanaDia !== null) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside); // limpio listener al desmontar
  }, [ventanaDia]);

  // Chequea si el turno ya existe entre los turnos de los alumnos
  const yaExiste = (dia, hora, mes, zona) =>
    turnosAlumnos.find(r => r.dia === dia && r.hora === hora && r.mes === mes && r.zona === zona);

  // Chequea si el turno ya está reservado en el estado de turnos actual
  const estaReservado = (dia, hora, mes, zona) =>
    turnoSim.find(r => r.dia === dia && r.hora === hora && r.mes === mes && r.zona === zona);

  // Toggle para agregar o quitar un turno
  const toggleHora = (dia, hora, mes, zona) => {
    const fechaCompleta = new Date(fecha.anio, fecha.mes, dia); // fecha completa
    const diaSemana = diasSemana[fechaCompleta.getDay()]; // nombre del día
    const nuevoTurno = { diaSemana, dia, mes, anio: fecha.anio, hora, zona }; // objeto nuevo turno
    const turno = { dia, hora, mes, zona };

    // busco si el turno ya pertenece a un alumno
    const alumnoCorrespondiente = alumnos.find(alumno =>
      alumno.turnos.some(t =>
        t.dia === turno.dia &&
        t.mes === turno.mes &&
        t.hora === turno.hora &&
        t.zona.toString() === turno.zona.toString()
      )
    );

    if (estaReservado(dia, hora, mes, zona)) {
      borrarTurno(dia, hora, mes, zona); // si ya estaba reservado, borro
    } else if (yaExiste(dia, hora, mes, zona)) {
      setVentanaReservado(alumnoCorrespondiente); // si pertenece a un alumno, muestro info
    } else {
      setTurnoSim([...turnoSim, nuevoTurno]); // si no existe, agrego
    }
  };

  // Estado para los datos de reserva de una persona
  const [reserva, setReserva] = useState({});

  return (
    <>
      <div className={`calendario-container zona-${zona}`}>
        {console.log(reserva)}
        {console.log(turnoSim)}

        {/* Header del calendario con título y navegación de meses */}
        <div className="calendario-header">
          <h2 className="auto-title">AUTO {zona}</h2>
          <div className="nav-calendario">
            <button className="nav-btn" onClick={mesAnterior}>Anterior</button>
            <h2>{meses[fecha.mes]} {fecha.anio}</h2>
            <button className="nav-btn" onClick={siguienteMes}>Siguiente</button>
          </div>
        </div>

        {/* Render de los nombres de los días de la semana */}
        <div className="dias-semana">
          {diasSemana.map((d, index) => (
            <div key={index} className="dia-semana">{d}</div>
          ))}
        </div>

        {/* Render de los días del mes */}
        <div className="dias-mes">
          {/* días vacíos antes del primer día del mes */}
          {Array.from({ length: primerDia }).map((_, i) => (
            <div key={"empty-" + i} className="dia-vacio"></div>
          ))}

          {/* días reales del mes */}
          {diasDelMes.map((dia, index) => {
            const esHoy =
              dia === hoy.getDate() &&
              fecha.mes === hoy.getMonth() &&
              fecha.anio === hoy.getFullYear();

            return (
              <div key={index}>
                <DiasDelMes
                  esHoy={esHoy}
                  ventanaDia={ventanaDia}
                  botonDiaRef={botonDiaRef}
                  dia={dia}
                  disabled={disabled}
                  toggleDia={toggleDia}
                  ventanaRef={ventanaRef}
                  ventanaReservado={ventanaReservado}
                  setVentanaReservado={setVentanaReservado}
                  estaReservado={estaReservado}
                  horarios={horarios}
                  fecha={fecha}
                  zona={zona}
                  yaExiste={yaExiste}
                  alumnos={alumnos}
                  toggleHora={toggleHora}
                />
              </div>
            );
          })}
        </div>

        {/* Render de simulación */}
        {simulacion && (
          <Simulacion
            setSimulacion={setSimulacion}
            setTurnoSim={setTurnoSim}
            turnoSim={turnoSim}
            setVentanaReservar={setVentanaReservar}
            ventanaReservar={ventanaReservar}
          />
        )}
      </div>

      {/* Render de ventana de reservar */}
      {ventanaReservar && (
        <div className="simulacion-modal-backdrop">
          <Reservar
            turnoSim={turnoSim}
            setTurnoSim={setTurnoSim}
            setVentanaReservar={setVentanaReservar}
            reserva={reserva}
            setReserva={setReserva}
          />
        </div>
      )}
    </>
  );
};

export default Calendario;
