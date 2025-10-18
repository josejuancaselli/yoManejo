import { useEffect, useState, useRef } from "react";
import Simulacion from "./Simulacion";

import DiasDelMes from "./DiasDelMes";

const Prueba = ({ zona, turnos, setTurnos, simulacion, setSimulacion, alumnos, borrarTurno, setAlumnos }) => {

  const hoy = new Date();
  const [ventanaDia, setVentanaDia] = useState(null);
  const [fecha, setFecha] = useState({ mes: hoy.getMonth(), anio: hoy.getFullYear(), });
  const [ventanaReservado, setVentanaReservado] = useState(null)
  const ventanaRef = useRef(null); // ref para la ventana de horarios
  const botonDiaRef = useRef(null); // botón del día

  const diasSemana = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"];
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const mesActual = fecha.mes;
  const anioActual = fecha.anio;
  const primerDia = new Date(anioActual, mesActual, 1).getDay();
  const turnosAlumnos = alumnos.map(e => e.turnos).flat()

  const toggleDia = (dia, ref) => {
    botonDiaRef.current = ref; // guarda ref del botón activo
    setVentanaDia((prevDia) => (prevDia === dia ? null : dia));
  };

  // avanzar un mes
  const siguienteMes = () => {
    setFecha((prev) => {
      if (prev.mes === 11) return { mes: 0, anio: prev.anio + 1 };
      return { mes: prev.mes + 1, anio: prev.anio };
    });
  };

  // retroceder un mes
  const mesAnterior = () => {
    setFecha((prev) => {
      if (prev.mes === 0) return { mes: 11, anio: prev.anio - 1 };
      return { mes: prev.mes - 1, anio: prev.anio };
    });
  };

  const obtenerDiasDelMes = (mes, anio) => {
    const cantidadDias = new Date(anio, mes + 1, 0).getDate();
    return Array.from({ length: cantidadDias }, (_, i) => i + 1);
  };

  const diasDelMes = obtenerDiasDelMes(mesActual, anioActual);
  const disabled = diasDelMes.filter((dia) => {
    const fechaDia = new Date(fecha.anio, fecha.mes, dia); // fecha del día que se está mostrando
    const hoySolo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); // hoy a medianoche
    return fechaDia < hoySolo; // si es anterior a hoy, deshabilitar
  });

  const obtenerHorarios = () => { 
    return Array.from({ length: 11 }, (_, i) => String(i + 8) + ":00");
  };
  const horarios = obtenerHorarios();


  //efecto para cerrar ventana al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ventanaRef.current &&
        !ventanaRef.current.contains(event.target) &&
        botonDiaRef.current &&
        !botonDiaRef.current.contains(event.target)
      ) {
        setVentanaDia(null);
      }
    };

    if (ventanaDia !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ventanaDia]);


  const yaExiste = (dia, hora, mes, zona) => {
    return (turnosAlumnos.find((r) => r.dia === dia && r.hora === hora && r.mes === mes && r.zona === zona))
  }

  // ✅ chequea si se acaba de reservar un turno
  const estaReservado = (dia, hora, mes, zona) => {
    return turnos.find((r) => r.dia === dia && r.hora === hora && r.mes === mes && r.zona === zona);
  };

  // ✅ togglea turnos por zona
  const toggleHora = (dia, hora, mes, zona) => {
    const fechaCompleta = new Date(fecha.anio, fecha.mes, dia);
    const diaSemana = diasSemana[fechaCompleta.getDay()];
    const nuevoTurno = { diaSemana, dia, mes, anio: fecha.anio, hora, zona };
    const turno = { dia, hora, mes, zona };
    const alumnoCorrespondiente = alumnos.find(alumno =>
      alumno.turnos.some(t =>
        t.dia === turno.dia &&
        t.mes === turno.mes &&
        t.hora === turno.hora &&
        t.zona.toString() === turno.zona.toString()
      )
    );

    if (estaReservado(dia, hora, mes, zona)) {
      borrarTurno(dia, hora, mes, zona)
    } else if (yaExiste(dia, hora, mes, zona)) {

      setVentanaReservado(alumnoCorrespondiente)
    } else {
      setTurnos([...turnos, nuevoTurno])
    }
  };

  return (
    <div className={`calendario-container zona-${zona}`}>

      <div className="calendario-header">
        <h2 className="auto-title">AUTO {zona}</h2>
        <div className="nav-calendario">
          <button className="nav-btn" onClick={mesAnterior}>Anterior</button>
          <h2 className="mes-anio">{meses[fecha.mes]} {fecha.anio}</h2>
          <button className="nav-btn" onClick={siguienteMes}>Siguiente</button>
        </div>
      </div>

      <div className="dias-semana">
        {diasSemana.map((d, index) => ( //map dia de la semana con el nombre ("lunes", "martes", etc)
          <div key={index} className="dia-semana">{d}</div>
        ))}
      </div>

      <div className="dias-mes">
        {Array.from({ length: primerDia }).map((_, i) => ( // map para render del dia vacio al principio de mes
          <div key={"empty-" + i} className="dia-vacio"></div>
        ))}

        {diasDelMes.map((dia, index) => { // map para los dias de la semana
          const esHoy =
            dia === hoy.getDate() &&
            fecha.mes === hoy.getMonth() &&
            fecha.anio === hoy.getFullYear();

          return (
            <div key={index} className={`dia-mes ${esHoy ? "hoy" : ""}`}>
              <DiasDelMes
                ventanaDia={ventanaDia}
                botonDiaRef={botonDiaRef}
                dia={dia}
                disabled={disabled}
                toggleDia={toggleDia}
                ventanaRef={ventanaRef}
                estaReservado={estaReservado}
                horarios={horarios}
                fecha={fecha}
                zona={zona}
                yaExiste={yaExiste}
                alumnos={alumnos}
                toggleHora={toggleHora}
                setVentanaReservado={setVentanaReservado}
              />
            </div>
          );
        })}
      </div>


      {ventanaReservado && (
        <VentanaReservado
          setVentanaReservado={setVentanaReservado}
          ventanaReservado={ventanaReservado}
        />
      )}

      {simulacion && (
        <Simulacion
          setSimulacion={setSimulacion}
          setTurnos={setTurnos}
          turnos={turnos}
        />
      )}

    </div>
  );
};

export default Prueba;