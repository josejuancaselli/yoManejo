import React, { useState } from "react"
import { FaEdit, FaRegTrashAlt } from "react-icons/fa"
import { IoIosClose } from "react-icons/io"
import { useFechas } from "../../helpers/useFechas"

const TurnoData = ({
    turnosEditables,
    editarTurnos,
    setEditarTurnos,
    handleEditarTurno,
    borrarTurnoReservado,
    obtenerHorarios,
    obtenerDiasDelMes,
    alumnoSeleccionado,
    turnoSim,               // 👈 nuevo
    borrarTurnoSimulado,    // 👈 nuevo
}) => {
    const [turnoAEliminar, setTurnoAEliminar] = useState(null)
    const { fechaDesdeDia } = useFechas()

    const formatearTurno = (turno) =>
        `${fechaDesdeDia(turno.dia, turno.mes, turno.anio)} - ${String(turno.dia).padStart(2, "0")}/${String(turno.mes + 1).padStart(2, "0")} - ${turno.hora} hs - Coche ${turno.zona}`

    return (
        <>
            {/* ── Turnos confirmados ── */}
            <ul className="turnos-lista">
                {[...turnosEditables.flat()]
                    .sort((a, b) => {
                        const fechaA = new Date(a.anio, a.mes, a.dia, parseInt(a.hora))
                        const fechaB = new Date(b.anio, b.mes, b.dia, parseInt(b.hora))
                        return fechaA - fechaB
                    })
                    .map((turno, index) => (
                        <li key={index} className="turno-item">
                            {editarTurnos !== index ? (
                                <div className="turno-editable">
                                    <div className="turno-editable-info">
                                        <p>{formatearTurno(turno)}</p>
                                        <div>
                                            <button
                                                className="turnos-btn-editar"
                                                onClick={() => setEditarTurnos(index)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="turnos-btn-borrar"
                                                onClick={() => setTurnoAEliminar(index)}
                                            >
                                                <FaRegTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="turno-editable">
                                    <div>
                                        <label>Día</label>
                                        <select
                                            className="turno-editable-select"
                                            value={turno.dia}
                                            onChange={(e) => handleEditarTurno(e, index, "dia")}
                                        >
                                            <option value="" disabled hidden></option>
                                            {obtenerDiasDelMes(turno.mes, turno.anio).map((d, i) => (
                                                <option key={i} value={d}>
                                                    {String(d).padStart(2, "0")}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Mes</label>
                                        <select
                                            className="turno-editable-select"
                                            value={turno.mes}
                                            onChange={(e) => handleEditarTurno(e, index, "mes")}
                                        >
                                            {[...Array(12).keys()].map((m) => (
                                                <option key={m} value={m}>
                                                    {String(m + 1).padStart(2, "0")}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Año</label>
                                        <select
                                            className="turno-editable-select"
                                            value={turno.anio}
                                            onChange={(e) => handleEditarTurno(e, index, "anio")}
                                        >
                                            <option value={new Date().getFullYear()}>
                                                {new Date().getFullYear()}
                                            </option>
                                            <option value={new Date().getFullYear() + 1}>
                                                {new Date().getFullYear() + 1}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Hora</label>
                                        <select
                                            className="turno-editable-select"
                                            value={turno.hora}
                                            onChange={(e) => handleEditarTurno(e, index, "hora")}
                                        >
                                            {obtenerHorarios().map((h, i) => (
                                                <option key={i} value={h}>
                                                    {h}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Coche</label>
                                        <select
                                            className="turno-editable-select"
                                            value={turno.zona}
                                            onChange={(e) => handleEditarTurno(e, index, "zona")}
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="automatico">Atm</option>
                                        </select>
                                    </div>
                                    <button
                                        className="turno-btn-cerrar"
                                        onClick={() => setEditarTurnos(null)}
                                    >
                                        <IoIosClose />
                                    </button>
                                </div>
                            )}

                            {turnoAEliminar === index && (
                                <div className="turno-borrar-wrapper">
                                    <p>¿Está seguro que desea borrar el turno?</p>
                                    <button
                                        onClick={() => {
                                            borrarTurnoReservado(
                                                turno.dia,
                                                turno.hora,
                                                turno.mes,
                                                turno.zona,
                                                turno.anio,
                                                alumnoSeleccionado.id,
                                                "si"
                                            )
                                            setTurnoAEliminar(null)
                                        }}
                                    >
                                        SI
                                    </button>
                                    <button onClick={() => setTurnoAEliminar(null)}>NO</button>
                                </div>
                            )}
                        </li>
                    ))}
            </ul>

            {/* ── Turnos pendientes de confirmar ── */}
            {turnoSim && turnoSim.length > 0 && (
                <div className="turnos-pendientes">
                    <p className="turnos-pendientes-label">Por confirmar:</p>
                    <ul className="turnos-lista">
                        {[...turnoSim.flat()]
                            .sort((a, b) => {
                                const fechaA = new Date(a.anio, a.mes, a.dia, parseInt(a.hora))
                                const fechaB = new Date(b.anio, b.mes, b.dia, parseInt(b.hora))
                                return fechaA - fechaB
                            })
                            .map((turno, index) => (
                                <li key={index} className="turno-item turno-item--pendiente">
                                    <div className="turno-editable">
                                        <div className="turno-editable-info">
                                            <p>{formatearTurno(turno)}</p>
                                            <button
                                                className="turnos-btn-borrar"
                                                onClick={() => borrarTurnoSimulado(turno.dia, turno.hora, turno.mes, turno.zona, turno.anio)}
                                            >
                                                <IoIosClose />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </>
    )
}

export default TurnoData