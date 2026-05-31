import React, { useMemo, useState, useEffect } from 'react'
import { useFechas } from '../../helpers/useFechas'
import { useAlumnos } from '../../helpers/useAlumnos'
import { collection, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../../firebase/firebaseConfig';
import { SiGooglemaps } from "react-icons/si";
import "./profesores.css"

const Profesores = () => {
    const [auto, setAuto] = useState(null)
    const [turno, setTurno] = useState(null)
    const [topico, setTopico] = useState(null)
    const [anotacion, setAnotacion] = useState("")
    const [evaluacion, setEvaluacion] = useState({})
    const [modo, setModo] = useState("hoy") // 👈 Nuevo estado para cambiar entre HOY y MAÑANA
    const [alumnos, setAlumnos] = useState([])
    const colores = ["#d74545", "#ddab4f", "#e7e74b", "#2bcb2b", "#f9f9f9"]
    const autos = ["1", "2", "3", "automatico"]
    const horasManiana = ["07:45", "08:45", "09:45", "10:45", "11:45"];
    const horasTarde = ["14:00", "15:00", "16:00", "17:00", "18:00"];
    const [turnoSeleccionado, setTurnoSeleccionado] = useState("");

    const { fecha, hoy } = useFechas()

    // 🔹 Calcular fecha de mañana
    const mañana = useMemo(() => {
        const f = new Date(hoy)
        f.setDate(f.getDate() + 1)
        return f
    }, [hoy])

    // 🔹 Cargar alumnos desde Firebase


    useEffect(() => {
        const alumnosCollection = collection(db, "alumnos")

        const unsubscribe = onSnapshot(alumnosCollection, (snapshot) => {
            const alumnosList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setAlumnos(alumnosList)
        }, (error) => {
            console.error("Error escuchando alumnos en tiempo real:", error)
        })

        return () => unsubscribe()
    }, [])

    // 🔹 Elegir si mostrar turnos de hoy o de mañana
    const turnosFiltrados = alumnos.flatMap(alumno =>
        alumno.turnos.filter((t) => {
            const esHoy = (
                t.dia === hoy.getDate() &&
                t.mes === fecha.mes &&
                t.anio === fecha.anio
            )
            const esMañana = (
                t.dia === mañana.getDate() &&
                t.mes === mañana.getMonth() &&
                t.anio === mañana.getFullYear()
            )
            return modo === "hoy" ? esHoy : esMañana
        }).map((e) => ({ ...e, ...alumno }))
    )

    const turnosOrdenados = turnosFiltrados.sort((a, b) => {
        const uno = a.hora.split(":")
        const dos = b.hora.split(":")
        return uno[0] * 60 + parseInt(uno[1]) - (dos[0] * 60 + parseInt(dos[1]))
    })

    const cambiarColor = (idAlumno, aspecto, color) => {
        setEvaluacion(prev => ({
            ...prev,
            [idAlumno]: {
                ...prev[idAlumno],
                [aspecto]: color
            }
        }))
    }

    const terminarClase = async (id) => {
        try {
            const ref = doc(db, "alumnos", id);
            const snapshot = await getDoc(ref);

            if (snapshot.exists()) {
                const data = snapshot.data();

                const evaluacionDB = data.evaluacion || {};

                const tieneSistemaNuevo =
                    evaluacionDB.actual || evaluacionDB.historial

                const evaluacionActual = tieneSistemaNuevo
                    ? evaluacionDB.actual || {}
                    : evaluacionDB

                const historialActual = tieneSistemaNuevo
                    ? evaluacionDB.historial || []
                    : []

                const nuevosCambios = evaluacion[id] || {};

                const evaluacionActualizada = {
                    ...evaluacionActual,
                    ...nuevosCambios,
                    anotaciones: anotacion
                };

                const nuevaClase = {
                    fecha: new Date().toISOString(),
                    evaluacion: evaluacionActualizada,
                };

                await updateDoc(ref, {
                    evaluacion: {
                        actual: evaluacionActualizada,
                        historial: [...historialActual, nuevaClase]
                    }
                });

                setTopico(null);
                setAnotacion("");
                setTurno(null);

                console.log("Evaluación actualizada correctamente para el alumno:", id);
            } else {
                console.warn("El alumno no existe en la base de datos:", id);
            }
        } catch (error) {
            console.error("Error al actualizar la evaluación:", error);
        }
    };

    const turnosManiana = turnosOrdenados.filter((t) => t.zona === auto && horasManiana.includes(t.hora));
    const turnosTarde = turnosOrdenados.filter((t) => t.zona === auto && horasTarde.includes(t.hora));

    return (
        <div className={`profe-wrapper ${modo === "hoy" ? "modo-hoy" : "modo-manana"}`}>

            <div className="profe-header">

                <h2 className={`profe-fecha ${modo}`}>
                    Coche {auto}
                </h2>
                <button className={`btn-modo ${modo === "hoy" ? "btn-modo--activo-hoy" : ""}`}
                    onClick={() => setModo("hoy")}               >
                    Hoy
                </button>
                <button className={`btn-modo ${modo === "mañana" ? "btn-modo--activo-manana" : ""}`}
                    onClick={() => setModo("mañana")}              >
                    Mañana
                </button>
            </div>

            <div className='profe-btn-wrapper'>
                {autos.map((e, index) => (
                    <button key={index}
                        className={auto === e ? "btn-coche--activo" : ""}
                        onClick={() => { setAuto(e); setTurno(null) }}>
                        Coche {e}
                    </button>
                ))}
            </div>

            <h2 className={`profe-modo-badge ${modo}`} style={{ margin: "0 auto" }}>
                {modo === "hoy" ? "HOY" : "MAÑANA"}
            </h2>

            {auto && (
                <div className={`profe-alm-wrapper ${modo === "hoy" ? "h" : "m"}`}>

                    <div className="profe-data-alm">
                        <h3
                            className={`turno-header ${turnoSeleccionado === "mañana" ? "abierto" : ""}`}
                            onClick={() => setTurnoSeleccionado(turnoSeleccionado === "mañana" ? "" : "mañana")}
                        >
                            Turnos mañana
                        </h3>
                        <div className={`turno-lista acordeon ${turnoSeleccionado === "mañana" ? "abierto" : ""}`}>
                            {turnosManiana.length > 0 ? (
                                turnosManiana.map((e, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setTurno(e)}
                                        className="profe-data-alm"
                                    >

                                        <p>{e.hora}</p>

                                        {e.puntoEncuentro?.calle || e.puntoEncuentro?.entrecalles || e.puntoEncuentro?.altura ? (
                                            <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                                                {e.puntoEncuentro.calle} {e.puntoEncuentro.entrecalles} {e.puntoEncuentro.altura}
                                            </p>
                                        ) : (
                                            <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                                                {e.direccion.calle} {e.direccion.entrecalles} {e.direccion.altura}
                                            </p>
                                        )}
                                        {/* <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                                            {e.direccion.calle} {e.direccion.entrecalles} {e.direccion.altura}
                                        </p> */}
                                        <p>{e.nombre} {e.telefono}</p>

                                    </div>
                                ))
                            ) : (
                                <p className="sin-turnos">No hay turnos de mañana</p>
                            )}
                        </div>
                    </div>

                    {/* 🔹 Sección turno tarde */}
                    <div className="profe-data-alm">
                        <h3
                            className={`turno-header ${turnoSeleccionado === "tarde" ? "abierto" : ""}`}
                            onClick={() => setTurnoSeleccionado(turnoSeleccionado === "tarde" ? "" : "tarde")}
                        >
                            Turnos tarde
                        </h3>
                        <div className={`turno-lista acordeon ${turnoSeleccionado === "tarde" ? "abierto" : ""}`}>
                            {console.log(turno)}
                            {turnosTarde.length > 0 ? (
                                turnosTarde.map((e, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setTurno(e)}
                                        className="profe-data-alm"
                                    >

                                        <p>{e.hora}</p>
                                        {e.puntoEncuentro?.calle || e.puntoEncuentro?.entrecalles || e.puntoEncuentro?.altura ? (
                                            <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                                                {e.puntoEncuentro.calle} {e.puntoEncuentro.entrecalles} {e.puntoEncuentro.altura}
                                            </p>
                                        ) : (
                                            <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                                                {e.direccion.calle} {e.direccion.entrecalles} {e.direccion.altura}
                                            </p>
                                        )}

                                        <p>{e.nombre} {e.telefono}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="sin-turnos">No hay turnos de tarde</p>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {turno && (
                <>
                    <div className='profe-turno-wrapper'>
                        <div className='evaluacion' style={{ backgroundColor: "#e2eeedff" }}>
                            <p>{turno.hora}</p>
                            <div style={{}}>

                                {turno.puntoEncuentro?.calle || turno.puntoEncuentro?.entrecalles || turno.puntoEncuentro?.altura ? (
                                    <p style={{ display: "flex", flexDirection: "row", color: "black" }}                                                                           >
                                        {turno.puntoEncuentro["calle"]} {turno.puntoEncuentro["altura"]} {turno.puntoEncuentro["entrecalles"]}<SiGooglemaps style={{ color: "#dd1a22" }} />
                                    </p>
                                ) : (
                                    <p style={{ display: "flex", flexDirection: "row", color: "black" }}                                    >
                                        {turno.direccion["calle"]} {turno.direccion["altura"]} {turno.direccion["entrecalles"]}<SiGooglemaps style={{ color: "#dd1a22" }} />
                                    </p>
                                )}

                            </div>
                            <p>{turno.nombre}</p>
                            <p>{turno.telefono}</p>
                            <p>{turno.observaciones}</p>
                            <div className='profe-warnings-wrapper'>
                                <div className='profe-warnings' style={{ backgroundColor: evaluacion[turno.id]?.tm || turno.evaluacion?.actual?.tm }} onClick={() => setTopico("tm")}>TM</div>
                                <div className='profe-warnings' style={{ backgroundColor: evaluacion[turno.id]?.im || turno.evaluacion?.actual?.im }} onClick={() => setTopico("im")}>IM</div>
                                <div className='profe-warnings' style={{ backgroundColor: evaluacion[turno.id]?.df || turno.evaluacion?.actual?.df }} onClick={() => setTopico("df")}>DF</div>
                            </div>
                        </div>

                        {/* DOMINIO BÁSICO */}
                        <div className='evaluacion' style={{ backgroundColor: "#c8d6d5ff" }}>
                            <h2>DOMINIO BASICO</h2>
                            <ul>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.volante || turno.evaluacion?.actual?.volante }} onClick={() => setTopico("volante")}>Volante</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.embriague || turno.evaluacion?.actual?.embriague }} onClick={() => setTopico("embriague")}>Embriague</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.caja || turno.evaluacion?.actual?.caja }} onClick={() => setTopico("caja")}>Caja</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.freno || turno.evaluacion?.actual?.freno }} onClick={() => setTopico("freno")}>Freno/Acelerador</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.posicion || turno.evaluacion?.actual?.posicion }} onClick={() => setTopico("posicion")}>Posición Manejo</li>
                            </ul>
                        </div>

                        {/* CIRCULACIÓN */}
                        <div className='evaluacion' style={{ backgroundColor: "#b8c5c4ff" }}>
                            <h2>CIRCULACION</h2>
                            <ul>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.carril || turno.evaluacion?.actual?.carril }} onClick={() => setTopico("carril")}>Carril</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.velocidad || turno.evaluacion?.actual?.velocidad }} onClick={() => setTopico("velocidad")}>Velocidad</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.señalizacion || turno.evaluacion?.actual?.señalizacion }} onClick={() => setTopico("señalizacion")}>Señalización</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.calles || turno.evaluacion?.actual?.calles }} onClick={() => setTopico("calles")}>Calles</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.avenidas || turno.evaluacion?.actual?.avenidas }} onClick={() => setTopico("avenidas")}>Avenidas</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.rotondas || turno.evaluacion?.actual?.rotondas }} onClick={() => setTopico("rotondas")}>Rotondas</li>
                            </ul>
                        </div>

                        {/* ESTACIONAMIENTO */}
                        <div className='evaluacion' style={{ backgroundColor: "#aeb9b9ff" }}>
                            <h2>ESTACIONAMIENTO</h2>
                            <ul>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.paraleloDerecho || turno.evaluacion?.actual?.paraleloDerecho }} onClick={() => setTopico("paraleloDerecho")}>Paralelo Derecho</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.paraleloIzquierdo || turno.evaluacion?.actual?.paraleloIzquierdo }} onClick={() => setTopico("paraleloIzquierdo")}>Paralelo Izquierdo</li>
                            </ul>
                        </div>

                        {/*ANOTACIONES*/}
                        <div className='evaluacion' style={{ backgroundColor: "rgb(141, 150, 150)", justifyContent: "unset", alignItems: "unset" }}>
                            <h2 style={{ margin: "20px auto" }}>ANOTACIONES</h2>
                            <textarea
                                value={anotacion}
                                onChange={(e) => setAnotacion(e.target.value)}
                                style={{ height: "100px", width: "70%", resize: "none", margin: "0 auto" }}>
                            </textarea>
                            <ul style={{ padding: "0" }}>
                                {
                                    turno.evaluacion?.historial?.map((e, index) => {
                                        return (
                                            e.evaluacion.anotaciones === "" ? null : (
                                                <li key={index} style={{ listStyle: "none", backgroundColor: "#d3d3d3", marginTop: "8px", padding: "4px", borderRadius: "8px" }}                                                >
                                                    <p style={{ fontSize: "0.9rem", color: "#555" }}>
                                                        {new Date(e.fecha).toLocaleDateString()}
                                                    </p>

                                                    <p style={{ overflowWrap: "break-word" }}>{e.evaluacion.anotaciones}</p>
                                                </li>
                                            )
                                        )
                                    })
                                }
                            </ul>

                        </div>
                        <button onClick={() => { terminarClase(turno.id) }}>X</button>

                        {topico && (
                            <div className='profe-color'>
                                {colores.map((e, index) => (
                                    <div
                                        key={index}
                                        style={{ backgroundColor: `${e}` }}
                                        onClick={() => { cambiarColor(turno.id, topico, `${e}`); setTopico(null); }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <button className='terminar-clase' onClick={() => terminarClase(turno.id)}>Terminar Clase</button>
                </>
            )}

        </div>
    )
}

export default Profesores
