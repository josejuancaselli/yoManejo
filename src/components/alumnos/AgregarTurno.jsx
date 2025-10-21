
const AgregarTurno = ({ nuevoTurno, setNuevoTurno, obtenerDiasDelMes, alumnoSeleccionado, fecha, obtenerHorarios, agregarTurno, alumno, setInputAgregarTurno }) => {


    return (
        <>
            <label>Dia</label>
            <select name="dia" value={nuevoTurno.dia} onChange={(e) => setNuevoTurno({ ...nuevoTurno, dia: Number(e.target.value) })}>
                <option value="" disabled hidden>

                </option>
                {obtenerDiasDelMes(nuevoTurno.mes, nuevoTurno.anio).map((dia, index) => {
                    return (
                        <option key={index} value={dia}>{dia}</option>
                    )
                })}
            </select>

            <label>Mes</label>
            <select name="mes" value={nuevoTurno.mes} onChange={(e) => setNuevoTurno({ ...nuevoTurno, mes: Number(e.target.value) })}>
                <option value="" disabled hidden>

                </option>
                {[...Array.from({ length: 12 }, (_, i) => i + 0)].map((mes) => {
                    return (
                        <option key={mes} value={mes}>{mes + 1}</option> // mostramos 1-12, pero value sigue 0-11
                    )
                })}
            </select>

            <label>Hora</label>
            <select name="hora" value={nuevoTurno.hora} onChange={(e) => setNuevoTurno({ ...nuevoTurno, hora: (e.target.value) })}>
                <option value="" disabled hidden>

                </option>
                {obtenerHorarios().map((hora, index) => {
                    return (
                        <option key={index} value={`${hora}`}>{hora}</option>
                    )
                })}
            </select>

            <label>Zona</label>
            <select name="zona" value={nuevoTurno.zona} onChange={(e) => setNuevoTurno({ ...nuevoTurno, zona: (e.target.value) })}>
                <option value="" disabled hidden>

                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>

            <label>Año</label>
            <input type="number" value={nuevoTurno.anio} onChange={(e) => setNuevoTurno({ ...nuevoTurno, anio: Number(e.target.value) })} />

            <button onClick={() => { agregarTurno(alumnoSeleccionado.id) }}>Confirmar</button>
            <button onClick={() => setInputAgregarTurno(false)}>Cancelar</button>
        </>
    )
}

export default AgregarTurno