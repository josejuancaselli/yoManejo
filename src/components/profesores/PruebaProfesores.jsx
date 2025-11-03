import React, { useMemo, useState, useEffect } from 'react'
import { useFechas } from '../../helpers/useFechas'
import { useAlumnos } from '../../helpers/useAlumnos'
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from '../../firebase/firebaseConfig';
import { SiGooglemaps } from "react-icons/si";
import "./profesores.css"

const PruebaProfesores = () => {
    const [auto, setAuto] = useState(null)
    const [turno, setTurno] = useState(null)
    const [topico, setTopico] = useState(null)
    const [evaluacion, setEvaluacion] = useState({})
    const [modo, setModo] = useState("hoy") // 👈 Nuevo estado para cambiar entre HOY y MAÑANA
    const [alumnos, setAlumnos] = useState([])
    const colores = ["#d74545", "#2bcb2b", "#ddab4f", "#e7e74b", "#f9f9f9"]
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
        const fetchAlumnos = async () => {
            try {
                const alumnosCollection = collection(db, "alumnos")
                const alumnosSnapshot = await getDocs(alumnosCollection)
                const alumnosList = alumnosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setAlumnos(alumnosList)
            } catch (error) {
                console.error("Error cargando alumnos desde Firebase:", error)
            }
        }
        fetchAlumnos()
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
            [idAlumno]: { ...prev[idAlumno], [aspecto]: color }
        }))
    }

    const terminarClase = async (id) => {
        try {
            const ref = doc(db, "alumnos", id);
            const snapshot = await getDoc(ref);

            if (snapshot.exists()) {
                const data = snapshot.data();
                const evaluacionActual = data.evaluacion || {};
                const nuevosCambios = evaluacion[id] || {};
                const evaluacionActualizada = { ...evaluacionActual, ...nuevosCambios };

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

    const turnosManiana = turnosOrdenados.filter((t) => t.zona === auto && horasManiana.includes(t.hora));
    const turnosTarde = turnosOrdenados.filter((t) => t.zona === auto && horasTarde.includes(t.hora));

    return (
        <div className='profe_wrapper'>
            <div className="profe-header">
                <h2 className='profe-fecha'>
                    {modo === "hoy"
                        ? `${String(hoy.getDate()).padStart(2, "0")} - ${String(fecha.mes + 1).padStart(2, "0")} - ${fecha.anio}`
                        : `${String(mañana.getDate()).padStart(2, "0")} - ${String(mañana.getMonth() + 1).padStart(2, "0")} - ${mañana.getFullYear()}`
                    }
                </h2>
                <button className={modo === "hoy" ? "activo" : ""} onClick={() => setModo("hoy")}                >
                    Hoy
                </button>
                <button className={modo === "mañana" ? "activo" : ""} onClick={() => setModo("mañana")}                >
                    Mañana
                </button>
            </div>

            <div className='profe-btn-wrapper'>
                {autos.map((e, index) => (
                    <button key={index} onClick={() => { setAuto(e); setTurno(null) }}>
                        Coche {e}
                    </button>
                ))}
            </div>

            <h3 className='profe-auto'>Coche {auto}</h3>
            {auto && (
                <div className='profe-alm-wrapper'>
                    <div className="profe-data-alm">
                        <h3 className="turno-header" onClick={() => setTurnoSeleccionado("mañana")}>Turno mañana</h3>
                        {turnoSeleccionado === "mañana" && (
                            <div className="turno-lista">
                                {turnosManiana.length > 0 ? (
                                    turnosManiana.map((e, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setTurno(e)}
                                            className="profe-data-alm"
                                        >
                                            <p>{e.hora}</p>
                                            <p>{e.nombre}</p>
                                            <p
                                                style={{
                                                    fontSize: "1.1rem",
                                                    fontWeight: "bold",
                                                    marginLeft: "auto",
                                                }}
                                            >
                                                {e.direccion.calle} {e.direccion.altura}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="sin-turnos">No hay turnos de mañana</p>
                                )}
                            </div>
                        )}

                    </div>
                    {/* 🔹 Sección turno tarde */}
                    <div className="profe-data-alm">
                        <h3 className="turno-header" onClick={() => setTurnoSeleccionado("tarde")}>Turno tarde</h3>
                        {turnoSeleccionado === "tarde" && (
                            <div className="turno-lista">
                                {turnosTarde.length > 0 ? (
                                    turnosTarde.map((e, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setTurno(e)}
                                            className="profe-data-alm"
                                        >
                                            <p>{e.hora}</p>
                                            <p>{e.nombre}</p>
                                            <p
                                                style={{
                                                    fontSize: "1.1rem",
                                                    fontWeight: "bold",
                                                    marginLeft: "auto",
                                                }}
                                            >
                                                {e.direccion.calle} {e.direccion.altura}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="sin-turnos">No hay turnos de tarde</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}


            {turno && (
                <>
                    <div className='profe-turno-wrapper'>
                        <div className='evaluacion' style={{ backgroundColor: "#e2eeedff" }}>
                            <p>{turno.hora}</p>
                            <div style={{}}>
                                <a
                                    style={{ display: "flex", flexDirection: "row" }}
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`calle ${turno.direccion["calle"]} ${turno.direccion["altura"]}, la plata`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {turno.direccion["calle"]} {turno.direccion["altura"]} {turno.direccion["entrecalles"]}<SiGooglemaps style={{ color: "#dd1a22" }} />
                                </a>
                            </div>
                            <p>{turno.nombre}</p>
                            <p>{turno.telefono}</p>
                            <div className='profe-warnings-wrapper'>
                                <div className='profe-warnings' style={{ backgroundColor: evaluacion[turno.id]?.tm || turno.evaluacion?.tm }} onClick={() => setTopico("tm")}>TM</div>
                                <div className='profe-warnings' style={{ backgroundColor: evaluacion[turno.id]?.im || turno.evaluacion?.im }} onClick={() => setTopico("im")}>IM</div>
                                <div className='profe-warnings' style={{ backgroundColor: evaluacion[turno.id]?.df || turno.evaluacion?.df }} onClick={() => setTopico("df")}>DF</div>
                            </div>
                        </div>

                        {/* DOMINIO BÁSICO */}
                        <div className='evaluacion' style={{ backgroundColor: "#c8d6d5ff" }}>
                            <h2>DOMINIO BASICO</h2>
                            <ul>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.volante || turno.evaluacion?.volante }} onClick={() => setTopico("volante")}>Volante</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.embriague || turno.evaluacion?.embriague }} onClick={() => setTopico("embriague")}>Embriague</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.caja || turno.evaluacion?.caja }} onClick={() => setTopico("caja")}>Caja</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.freno || turno.evaluacion?.freno }} onClick={() => setTopico("freno")}>Freno/Acelerador</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.posicion || turno.evaluacion?.posicion }} onClick={() => setTopico("posicion")}>Posición Manejo</li>
                            </ul>
                        </div>

                        {/* CIRCULACIÓN */}
                        <div className='evaluacion' style={{ backgroundColor: "#b8c5c4ff" }}>
                            <h2>CIRCULACION</h2>
                            <ul>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.carril || turno.evaluacion?.carril }} onClick={() => setTopico("carril")}>Carril</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.velocidad || turno.evaluacion?.velocidad }} onClick={() => setTopico("velocidad")}>Velocidad</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.señalizacion || turno.evaluacion?.señalizacion }} onClick={() => setTopico("señalizacion")}>Señalización</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.calles || turno.evaluacion?.calles }} onClick={() => setTopico("calles")}>Calles</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.avenidas || turno.evaluacion?.avenidas }} onClick={() => setTopico("avenidas")}>Avenidas</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.rotondas || turno.evaluacion?.rotondas }} onClick={() => setTopico("rotondas")}>Rotondas</li>
                            </ul>
                        </div>

                        {/* ESTACIONAMIENTO */}
                        <div className='evaluacion' style={{ backgroundColor: "#aeb9b9ff" }}>
                            <h2>ESTACIONAMIENTO</h2>
                            <ul>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.paraleloDerecho || turno.evaluacion?.paraleloDerecho }} onClick={() => setTopico("paraleloDerecho")}>Paralelo Derecho</li>
                                <li style={{ backgroundColor: evaluacion[turno.id]?.paraleloIzquierdo || turno.evaluacion?.paraleloIzquierdo }} onClick={() => setTopico("paraleloIzquierdo")}>Paralelo Izquierdo</li>
                            </ul>
                        </div>

                        <button onClick={() => setTurno(null)}>X</button>

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

                    <button onClick={() => terminarClase(turno.id)}>Terminar Clase</button>
                </>
            )}

        </div>
    )
}

export default PruebaProfesores
