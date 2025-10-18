import { useEffect, useState, useRef } from "react"; // hooks de React
import Simulacion from "./Simulacion"; // componente para la simulación de turnos

import DiasDelMes from "./DiasDelMes"; // componente que renderiza los días del mes
import Reservar from "./Reservar"; // componente para reservar un turno

// Componente principal del calendario
const Calendario = ({ zona, turnoSim, setTurnoSim, alumnos, borrarTurno, }) => {

  const hoy = new Date(); // fecha actual
  const [ventanaDia, setVentanaDia] = useState(null); // día seleccionado para mostrar horarios
  const [fecha, setFecha] = useState({ mes: hoy.getMonth(), anio: hoy.getFullYear() }); // mes y año actuales
  const [ventanaDireccion, setVentanaDireccion] = useState(null); // ventana para mostrar info de turno reservado
  const ventanaRef = useRef(null); // referencia al contenedor de horarios (para click fuera)
  const botonDiaRef = useRef(null); // referencia al botón del día activo

  const diasSemana = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"]; // nombres de los días
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; // nombres de los meses

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


  const mesActual = fecha.mes; // mes actual
  const anioActual = fecha.anio; // año actual
  const primerDia = new Date(anioActual, mesActual, 1).getDay(); // día de la semana del primer día del mes

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
  const horariosMañana = () => [...Array.from({ length: 5 }, (_, i) => `${i + 7}:45`)];
  const horariosTarde = () => [...Array.from({ length: 5 }, (_, i) => `${i + 14}:00`)];
  const obtenerHorarios = () => [horariosMañana(), horariosTarde()].flat();

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
  const yaExiste = (dia, hora, mes, zona, anio) =>
    turnosAlumnos.find(r => r.dia === dia && r.hora === hora && r.mes === mes && r.zona === zona && r.anio === anio);

  // Chequea si el turno ya está reservado en el simulador de turnos
  const estaReservado = (dia, hora, mes, zona, anio) =>
    turnoSim.find(r => r.dia === dia && r.hora === hora && r.mes === mes && r.zona === zona && r.anio === anio);

  const reservado = (dia, hora, mes, zona, anio) =>{
    return yaExiste(dia, hora, mes, zona, anio) || estaReservado(dia, hora, mes, zona, anio);
  }

  // Toggle para agregar o quitar un turno
  const toggleHora = (dia, hora, mes, zona) => {
    const anio = fecha.anio; // lo tomás del estado de fecha
    const nuevoTurno = { dia, mes, anio, hora, zona };

    // 1️⃣ Si el turno ya está en tu lista de simulación, lo borramos (toggle OFF)
    const yaSeleccionado = turnoSim.some(t => t.dia === dia && t.hora === hora && t.mes === mes && t.zona === zona && t.anio === anio);

    if (yaSeleccionado) {
      setTurnoSim(turnoSim.filter(t => !(t.dia === dia && t.hora === hora && t.mes === mes && t.zona === zona && t.anio === anio)));
      return;
    }

    // 2️⃣ Si el turno pertenece a un alumno real, mostramos la ventana de info
    const alumnoCorrespondiente = alumnos.find(alumno =>
      alumno.turnos.some(t =>
        t.dia === dia &&
        t.mes === mes &&
        t.anio === anio &&
        t.hora === hora &&
        t.zona.toString() === zona.toString()
      )
    );

    if (alumnoCorrespondiente) {
      setVentanaDireccion(alumnoCorrespondiente);
      return;
    }

    // 3️⃣ Si no está ni reservado ni seleccionado, lo agregamos
    setTurnoSim(prev => [...prev, nuevoTurno]);
  };




  return (
    <>

      <div className={`calendario-container zona-${zona}`}>

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
                  dia={dia}
                  disabled={disabled}
                  ventanaDireccion={ventanaDireccion}
                  setVentanaDireccion={setVentanaDireccion}
                  horarios={horarios}
                  fecha={fecha}
                  zona={zona}                  
                  alumnos={alumnos}
                  toggleHora={toggleHora}
                  horariosMañana={horariosMañana}
                  horariosTarde={horariosTarde}
                  reservado={reservado}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Calendario;
