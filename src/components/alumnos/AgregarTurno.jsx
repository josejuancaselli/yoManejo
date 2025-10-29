import { FaCheck } from "react-icons/fa";
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import { FaSave } from "react-icons/fa";

const AgregarTurno = ({ nuevoTurno, setNuevoTurno, obtenerDiasDelMes, alumnoSeleccionado, fecha, obtenerHorarios, agregarTurno, alumno, setInputAgregarTurno }) => {


    return (
        <div className="turno-editable">
            <div>
                <label>Dia</label>
                <select className="turno-editable-select" name="dia" value={nuevoTurno.dia} onChange={(e) => setNuevoTurno({ ...nuevoTurno, dia: Number(e.target.value) })}>
                    <option value="" disabled hidden>
                    </option>
                    {obtenerDiasDelMes(nuevoTurno.mes, nuevoTurno.anio).map((dia, index) => {
                        return (
                            <option key={index} value={dia}>{dia}</option>
                        )
                    })}
                </select>
            </div>

            <div>
                <label>Mes</label>
                <select className="turno-editable-select" name="mes" value={nuevoTurno.mes} onChange={(e) => setNuevoTurno({ ...nuevoTurno, mes: Number(e.target.value) })}>
                    <option value="" disabled hidden>
                    </option>
                    {[...Array.from({ length: 12 }, (_, i) => i + 0)].map((mes) => {
                        return (
                            <option key={mes} value={mes}>{mes + 1}</option> // mostramos 1-12, pero value sigue 0-11
                        )
                    })}
                </select>
            </div>

            <div>
                <label>Año</label>
                <select className="turno-editable-select" value={nuevoTurno.anio} onChange={(e) => setNuevoTurno({ ...nuevoTurno, anio: Number(e.target.value) })} >
                    <option value="" disabled hidden></option>
                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                    <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                </select>
            </div>

            <div>
                <label>Hora</label>
                <select className="turno-editable-select" name="hora" value={nuevoTurno.hora} onChange={(e) => setNuevoTurno({ ...nuevoTurno, hora: (e.target.value) })}>
                    <option value="" disabled hidden>

                    </option>
                    {obtenerHorarios().map((hora, index) => {
                        return (
                            <option key={index} value={`${hora}`}>{hora}</option>
                        )
                    })}
                </select>
            </div>

            <div>
                <label>Zona</label>
                <select className="turno-editable-select" name="zona" value={nuevoTurno.zona} onChange={(e) => setNuevoTurno({ ...nuevoTurno, zona: (e.target.value) })}>
                    <option value="" disabled hidden>

                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>




            <button className="turno-guardar" onClick={() => { { agregarTurno(alumnoSeleccionado.id), setInputAgregarTurno(false) } }}><FaSave /></button> 
            <button className="turno-cerrar" onClick={() => setInputAgregarTurno(false)}><FaRegTrashAlt /></button>{/* cerrar ventana */}
        </div>
    )
}

export default AgregarTurno