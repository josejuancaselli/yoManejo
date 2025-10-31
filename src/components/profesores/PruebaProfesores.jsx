import React, { useMemo, useState } from 'react'
import { useFechas } from '../../helpers/useFechas'
import { useAlumnos } from '../../helpers/useAlumnos'

const PruebaProfesores = () => {
    const [auto, setAuto] = useState(null)
    const [turno, setTurno] = useState(null)
    const [evaluacion, setEvaluacion] = useState(null)
    const [colores, setColores] = useState({})

    const autos = ["1", "2", "3"]


    const { fecha, hoy } = useFechas()
    const { alumnos } = useAlumnos()

    const turnosDeHoy = alumnos.flatMap(alumno => alumno.turnos.filter((t) =>
        t.dia === hoy.getDate() &&
        t.mes === fecha.mes &&
        t.anio === fecha.anio).map((e) => ({ ...e, ...alumno })
        ))

    const turnosOrdenados = turnosDeHoy.sort((a, b) => {
        const uno = a.hora.split(":")
        const dos = b.hora.split(":")
        return uno[0] * 60 + uno[1] - (dos[0] * 60 + dos[1])
    })

    const cambiarColor = (idAlumno, aspecto, color) => {
        setColores(prev => ({ ...prev, [idAlumno]: { ...prev[idAlumno], [aspecto]: color } }))
    }

    return (
        <div>

            <h2>{hoy.getDate()} - {fecha.mes + 1} - {fecha.anio}</h2>
            <div>
                {autos.map((e, index) => {
                    return (
                        <button key={index} onClick={() => { setAuto(e), setTurno(null) }}>Auto: {e}</button>
                    )
                })}
            </div>

            <h3>Auto: {auto}</h3>
            <div>
                {turnosOrdenados.filter(t => t.zona === auto).map((e, index) => {
                    return (
                        <div key={index} onClick={() => setTurno(e)} style={{ display: "flex", gap: "10px" }}>
                            <p>{e.hora}</p>
                            <p>{e.direccion}</p>
                        </div>
                    )
                })}
            </div>
            {turno && (

                <div style={{ backgroundColor: "beige" }}>
                    {console.log("Turno ID:", turno.id)}
                    {console.log("Volante:", colores[turno.id]?.posicion)}  
                    {console.log(colores)}
                    <div style={{ border: "solid 1px black" }}>
                        <p>{turno.hora}</p>
                        <p>{turno.direccion}</p>
                        <p>{turno.nombre}</p>
                        <p>{turno.telefono}</p>
                    </div>
                    <div style={{ border: "solid 1px black" }}>
                        <h2>DOMINIO BASICO</h2>
                        <ul>
                            <li style={{ backgroundColor: colores[turno.id]?.volante }} onClick={() => setEvaluacion("volante")}> Volante</li>
                            <li style={{ backgroundColor: colores[turno.id]?.embriague }} onClick={() => setEvaluacion("embriague")}> Embriague</li>
                            <li style={{ backgroundColor: colores[turno.id]?.caja }} onClick={() => setEvaluacion("caja")}> Caja</li>
                            <li style={{ backgroundColor: colores[turno.id]?.freno }} onClick={() => setEvaluacion("freno")}> Freno/Acelerador</li>
                            <li style={{ backgroundColor: colores[turno.id]?.posicion }} onClick={() => setEvaluacion("posicion")}> Posicion Manejo</li>
                        </ul>
                    </div>
                    <div style={{ border: "solid 1px black" }}>
                        <h2>CIRCULACION</h2>
                        <ul>
                            <li style={{ backgroundColor: colores[turno.id]?.carril }} onClick={() => setEvaluacion("carril")}> carril</li>
                            <li style={{ backgroundColor: colores[turno.id]?.velocidad }} onClick={() => setEvaluacion("velocidad")}> velocidad</li>
                            <li style={{ backgroundColor: colores[turno.id]?.señalizacion }} onClick={() => setEvaluacion("señalizacion")}> señalizacion</li>
                            <li style={{ backgroundColor: colores[turno.id]?.calles }} onClick={() => setEvaluacion("calles")}> calles</li>
                            <li style={{ backgroundColor: colores[turno.id]?.avenidas }} onClick={() => setEvaluacion("avenidas")}> avenidas</li>
                            <li style={{ backgroundColor: colores[turno.id]?.rotondas }} onClick={() => setEvaluacion("rotondas")}> rotondas</li>
                        </ul>
                    </div>
                    <div style={{ border: "solid 1px black" }}>
                        <h2>ESTACIONAMIENTO</h2>
                        <ul>
                            <li style={{ backgroundColor: colores[turno.id]?.paraleloDerecho }} onClick={() => setEvaluacion("paraleloDerecho")}> Paralelo Derecho</li>
                            <li style={{ backgroundColor: colores[turno.id]?.paraleloIzquierdo }} onClick={() => setEvaluacion("paraleloIzquierdo")}> Paralelo Izquierdo</li>

                        </ul>
                    </div>
                    <button onClick={() => setTurno(null)}>Cerrar</button>
                    {evaluacion && (
                        <div>
                            <div style={{ backgroundColor: "red", height: "30px", width: "30px" }} onClick={() => { cambiarColor(turno.id, evaluacion, "red"), setEvaluacion(null) }}></div>
                            <div style={{ backgroundColor: "green", height: "30px", width: "30px" }} onClick={() => { cambiarColor(turno.id, evaluacion, "green"), setEvaluacion(null) }}></div>

                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default PruebaProfesores