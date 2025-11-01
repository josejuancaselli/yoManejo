import React, { useMemo, useState } from 'react'
import { useFechas } from '../../helpers/useFechas'
import { useAlumnos } from '../../helpers/useAlumnos'
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from '../../firebase/firebaseConfig';
import "./profesores.css"

const PruebaProfesores = () => {
    const [auto, setAuto] = useState(null)
    const [turno, setTurno] = useState(null)
    const [topico, setTopico] = useState(null)
    const colores = ["#ff3838", "#38ff38", "#ffb225", "#ffff23", "#f9f9f9"]
    const [evaluacion, setEvaluacion] = useState({})

    const autos = ["1", "2", "3", "automatico"]


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
        setEvaluacion(prev => ({ ...prev, [idAlumno]: { ...prev[idAlumno], [aspecto]: color } }))
    }

    const terminarClase = async (id) => {
        try {
            const ref = doc(db, "alumnos", id);
            const snapshot = await getDoc(ref);

            if (snapshot.exists()) {
                const data = snapshot.data();
                const evaluacionActual = data.evaluacion || {};
                const nuevosCambios = evaluacion[id] || {};

                // ✅ Combina lo anterior con lo nuevo
                const evaluacionActualizada = { ...evaluacionActual, ...nuevosCambios };

                // 🔥 Actualiza solo los campos modificados
                await updateDoc(ref, { evaluacion: evaluacionActualizada });

                setTopico(null);
                setTurno(null);

                console.log("Evaluación actualizada correctamente para el alumno:", id);
            } else {
                console.warn("El alumno no existe en la base de datos:", id);
            }
        } catch (error) {
            console.error("Error al actualizar la evaluación:", error);
        }
    };



    return (
        <div className='profe_wrapper'>
            <h2 className='profe-fecha'>{String(hoy.getDate()).padStart(2, "0")} - {String(fecha.mes + 1).padStart(2, "0")} - {fecha.anio}</h2>
            <div className='profe-btn-wrapper'>
                {autos.map((e, index) => {
                    return (
                        <button key={index} onClick={() => { setAuto(e), setTurno(null) }}>Coche {e}</button>
                    )
                })}
            </div>

            <h3 className='profe-auto'>Coche {auto}</h3>
            <div className='profe-alm-wrapper'>
                {turnosOrdenados.filter(t => t.zona === auto).map((e, index) => {
                    return (
                        <div key={index} onClick={() => setTurno(e)} className='profe-data-alm'>
                            <p>{e.hora}</p>
                            <p>{e.nombre}</p>
                            <p style={{ fontSize: "1.1rem", fontWeight: "bold", marginLeft: "auto" }}>{e.direccion}</p>
                        </div>
                    )
                })}
            </div>
            {turno && (
                <>
                    <div className='profe-turno-wrapper'>

                        <div className='evaluacion' style={{backgroundColor:"#e2eeedff"}}>
                            <p>{turno.hora}</p>
                            <p>{turno.direccion}</p>
                            <p>{turno.nombre}</p>
                            <p>{turno.telefono}</p>
                        </div>
                        <div className='evaluacion' style={{backgroundColor:"#c8d6d5ff"}}>
                            <h2>DOMINIO BASICO</h2>
                            <ul>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.volante || turno.evaluacion?.volante }} onClick={() => setTopico("volante")}> Volante</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.embriague ||turno.evaluacion?.embriague }} onClick={() => setTopico("embriague")}> Embriague</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.caja || turno.evaluacion?.caja }} onClick={() => setTopico("caja")}> Caja</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.freno || turno.evaluacion?.freno }} onClick={() => setTopico("freno")}> Freno/Acelerador</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.posicion || turno.evaluacion?.posicion }} onClick={() => setTopico("posicion")}> Posicion Manejo</li>

                            </ul>
                        </div>
                        <div className='evaluacion' style={{backgroundColor:"#b8c5c4ff"}}>
                            <h2>CIRCULACION</h2>
                            <ul>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.carril || turno.evaluacion?.carril }} onClick={() => setTopico("carril")}> carril</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.velocidad || turno.evaluacion?.velocidad }} onClick={() => setTopico("velocidad")}> velocidad</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.señalizacion  || turno.evaluacion?.señalizacion}} onClick={() => setTopico("señalizacion")}> señalizacion</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.calles || turno.evaluacion?.calles }} onClick={() => setTopico("calles")}> calles</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.avenidas || turno.evaluacion?.avenidas }} onClick={() => setTopico("avenidas")}> avenidas</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.rotondas || turno.evaluacion?.rotondas }} onClick={() => setTopico("rotondas")}> rotondas</li>
                            </ul>
                        </div>
                        <div className='evaluacion' style={{backgroundColor:"#aeb9b9ff"}}>
                            <h2>ESTACIONAMIENTO</h2>
                            <ul>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.paraleloDerecho || turno.evaluacion?.paraleloDerecho }} onClick={() => setTopico("paraleloDerecho")}> Paralelo Derecho</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.paraleloIzquierdo || turno.evaluacion?.paraleloIzquierdo }} onClick={() => setTopico("paraleloIzquierdo")}> Paralelo Izquierdo</li>

                            </ul>
                        </div>
                        <button onClick={() => setTurno(null)}>X</button>
                        {console.log(evaluacion)}
                        {topico && (
                            <div className='profe-color'>
                                {colores.map((e, index) => {
                                    return (
                                        <div key={index} style={{ backgroundColor: `${e}` }} onClick={() => { cambiarColor(turno.id, topico, `${e}`), setTopico(null) }}>

                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <button onClick={() => terminarClase(turno.id)}>Terminar Clase</button>
                </>
            )}
            <div>
            </div>
        </div>
    )
}

export default PruebaProfesores