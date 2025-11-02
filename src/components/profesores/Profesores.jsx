import React, { useMemo, useState } from 'react'
import { useFechas } from '../../helpers/useFechas'
import { useAlumnos } from '../../helpers/useAlumnos'

const Profesores = () => {
  const [auto, setAuto] = useState(null)
  const [verManiana, setVerManiana] = useState(false) // false = hoy, true = mañana
  const autos = ["1", "2", "3"]

  const { fecha, hoy } = useFechas()
  const { alumnos } = useAlumnos()

  // 📅 Calculamos la fecha de mañana solo una vez
  const manana = useMemo(() => {
    const d = new Date(hoy)
    d.setDate(d.getDate() + 1)
    return d
  }, [hoy])

  // 🧠 Obtenemos los turnos del día correspondiente
  const turnosDelDia = useMemo(() => {
    const fechaComparar = verManiana ? manana : hoy

    return alumnos.flatMap(alumno => alumno.turnos.filter(t => t.dia === fechaComparar.getDate() && t.mes === fechaComparar.getMonth() && t.anio === fechaComparar.getFullYear())
      .map(t => ({
        ...t,
        nombre: alumno.nombre,
        calle: alumno.calle,
        altura: alumno.altura,
        entrecalles: alumno.entrecalles
      }))
    )
  }, [alumnos, hoy, manana, verManiana])

  // 🧠 Agrupamos por zona y ordenamos
  const clasesPorZona = useMemo(() => {
    const ordenarPorHora = (a, b) => {
      const [hA, mA] = a.hora.split(":").map(Number)
      const [hB, mB] = b.hora.split(":").map(Number)
      return hA * 60 + mA - (hB * 60 + mB)
    }

    const zonas = {}
    for (const turno of turnosDelDia) {
      if (!zonas[turno.zona]) zonas[turno.zona] = []
      zonas[turno.zona].push(turno)
    }

    for (const zona in zonas) zonas[zona].sort(ordenarPorHora)
    return zonas
  }, [turnosDelDia])

  // 📍 Fecha que se muestra en pantalla
  const fechaMostrada = verManiana ? manana : hoy

  return (
    <div>
      {/* Fecha y botón */}
      <div style={{ marginBottom: "1rem" }}>
        <h3>
          Clases del día:{" "}
          {fechaMostrada.getDate()}-
          {String(fechaMostrada.getMonth() + 1).padStart(2, "0")}-
          {fechaMostrada.getFullYear()}
        </h3>

        <button onClick={() => setVerManiana(!verManiana)}>
          {verManiana ? "Ver clases de hoy" : "Ver clases de mañana"}
        </button>
      </div>

      {/* Botones de autos */}
      <div style={{ marginBottom: "1rem" }}>
        {autos.map((zona) => (
          <button
            key={zona}
            onClick={() => setAuto(zona)}
            style={{
              marginRight: "8px",
              backgroundColor: auto === zona ? "#ddd" : "white"
            }}
          >
            Auto {zona}
          </button>
        ))}
      </div>

      {/* Clases filtradas */}
      {auto && (
        <div>
          {(clasesPorZona[auto] || []).length > 0 ? (
            clasesPorZona[auto].map((e, i) => (
              <div key={i}>
                <p><strong>{e.hora}</strong></p>
                <p>{e.nombre}</p>
                <p>{e.direccion}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No hay clases {verManiana ? "mañana" : "hoy"} en esta zona</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Profesores
