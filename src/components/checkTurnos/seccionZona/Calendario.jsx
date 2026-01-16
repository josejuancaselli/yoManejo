import { useEffect, useState, useRef } from "react"; // hooks de React
import { useFechas } from "../../../helpers/useFechas";
import DiasDelMes from "./DiasDelMes";



// Componente principal del calendario
const Calendario = ({ zona, turnoSim, setTurnoSim, alumnos, horariosMañana, horariosTarde, horarios }) => {

  const { fecha, setFecha, hoy, diasSemana, meses, primerDia, diasDelMes } = useFechas();
  const [ventanaDia, setVentanaDia] = useState(null); // día seleccionado para mostrar horarios
  const [ventanaDireccion, setVentanaDireccion] = useState(null); // ventana para mostrar info de turno reservado
  const ventanaRef = useRef(null); // referencia al contenedor de horarios (para click fuera)
  const botonDiaRef = useRef(null); // referencia al botón del día activo
  const [activeHora, setActiveHora] = useState(null);
  const [mañanaTarde, setMañanaTarde] = useState(["mañana", "tarde"]);

  const turnosAlumnos = alumnos.map(e => e.turnos).flat(); // todos los turnos de todos los alumnos en un solo array
  const toggleMañanaTarde = (tipo) => {
    setMañanaTarde((prev) =>
      prev.includes(tipo)
        ? prev.filter((t) => t !== tipo) // si ya estaba, lo saca
        : [...prev, tipo] // si no estaba, lo agrega
    );
  };

  // Toggle de la ventana de horarios de un día
  const toggleDia = (dia, ref) => {
    botonDiaRef.current = ref; // guardo el botón activo
    setVentanaDia((prevDia) => (prevDia === dia ? null : dia)); // si el día ya estaba abierto, lo cierro; si no, lo abro
  };

  const cambioMes = ((e) => {
    setFecha((prev) => {
      if (e === "siguiente") {
        return prev.mes === 11 ? { mes: 0, anio: prev.anio + 1 } : { mes: prev.mes + 1, anio: prev.anio } // esto era la funcion d mes siguiente
      } else if (e === "anterior") {
        return prev.mes === 0 ? { mes: 11, anio: prev.anio - 1 } : { mes: prev.mes - 1, anio: prev.anio } // esto era la funcion d mes anterior
      }
      return prev;
    })
  })
  // Filtra días que no se pueden seleccionar (anteriores a hoy)
  const disabled = diasDelMes.filter((dia) => {
    const fechaDia = new Date(fecha.anio, fecha.mes, dia); // fecha del día
    const hoySolo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); // hoy sin hora
    return fechaDia < hoySolo; // true si día anterior a hoy
  });

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

  const reservado = (dia, hora, mes, zona, anio) => {
    return yaExiste(dia, hora, mes, zona, anio) || estaReservado(dia, hora, mes, zona, anio);
  }



  // Toggle para agregar o quitar un turno
  // Este toggle sirve para dos cosas:
  // 1. Si el turno ya está en tu lista de simulación, lo borramos (toggle OFF)
  // 2. Si el turno pertenece a un alumno real, mostramos la ventana de info
  // 3. Si no está ni reservado ni seleccionado, lo agregamos
  const toggleHora = (dia, hora, mes, anio, zona) => {
    
    const nuevoTurno = { dia, mes, anio, hora, zona };

    // 1. Si el turno ya está en tu lista de simulación, lo borramos (toggle OFF)
    const yaSeleccionado = turnoSim.some(t => t.dia === dia && t.hora === hora && t.mes === mes && t.zona === zona && t.anio === anio);
    if (yaSeleccionado) {
      // Borramos el turno de la lista de simulación
      setTurnoSim(turnoSim.filter(t => !(t.dia === dia && t.hora === hora && t.mes === mes && t.zona === zona && t.anio === anio)));
      return;
    }

    // 2. Si el turno pertenece a un alumno real, mostramos la ventana de info
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
      // Mostramos la ventana de info del alumno correspondiente
      setVentanaDireccion(alumnoCorrespondiente);
      return;
    }

    // 3. Si no está ni reservado ni seleccionado, lo agregamos
    setTurnoSim(prev => [...prev, nuevoTurno]);
    
  };

  /* ====== CÁLCULO DE FILAS PARA EL MODAL ====== */
  const columnas = 7;
  const totalCeldas = diasDelMes.length + primerDia;
  const filas = Math.ceil(totalCeldas / columnas);
  /* ========================================== */

  return (
    <>
      <div className="zona-tabs">
        <button
          className={`mañana-tab tab-zona-${zona}`}
          onClick={() => toggleMañanaTarde("mañana")}
          style={mañanaTarde.includes("mañana") && { zona }
            ? { backgroundColor: "rgb(14 0 0 / 83%)", color: "#d5d5d5" }
            : { }
          }
        >
          Mañana
        </button>
        <button
          className={`tarde-tab tab-zona-${zona}`}
          onClick={() => toggleMañanaTarde("tarde")}
          style={mañanaTarde.includes("tarde") && { zona }
            ? {backgroundColor: "rgb(14 0 0 / 83%)", color: "#d5d5d5"}
            : {  }
          }
        >
          Tarde
        </button>
      </div>
      <div className={`calendario-container zona-${zona}`}>

        {/* Header del calendario con título y navegación de meses */}
        <div className="calendario-header">
          <h2 className="auto-title">Coche {zona}</h2>
          <div className="nav-calendario">
            <button className="nav-btn" onClick={() => cambioMes("anterior")}>Anterior</button>
            <h2>{meses[fecha.mes]} {fecha.anio}</h2>
            <button className="nav-btn" onClick={() => cambioMes("siguiente")}>Siguiente</button>
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
            const indexReal = index + primerDia;
            const filaActual = Math.floor(indexReal / columnas) + 1;
            const abreArriba = filaActual > filas - 2;

            

            return (
              <div key={index} >
                <DiasDelMes
                  abreArriba={abreArriba}
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
                  activeHora={activeHora}
                  setActiveHora={setActiveHora}
                  mañanaTarde={mañanaTarde}
                  setMañanaTarde={setMañanaTarde}
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
