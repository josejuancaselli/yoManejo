import BotonesHora from "./BotonesHora";

const DiasDelMes = ({ estaReservado, horarios, setVentanaReservado, ventanaRef, alumnos, toggleHora, yaExiste, fecha, zona, ventanaDia, botonDiaRef, dia, toggleDia, disabled }) => {

    

    return (
        <>
            <button
                ref={(el) => { if (ventanaDia === dia) botonDiaRef.current = el; }}
                className={`dia-num-btn ${disabled.includes(dia) ? "disabled" : ""}`}
                onClick={() => { toggleDia(dia) }}
                disabled={disabled.includes(dia)}
            >
                {dia}
            </button>

            {ventanaDia === dia && (
                <BotonesHora
                ventanaRef = {ventanaRef}
                ventanaDia={ventanaDia}
                dia = {dia}
                horarios={horarios}
                estaReservado={estaReservado}
                yaExiste={yaExiste}
                fecha={fecha}
                alumnos={alumnos}
                setVentanaReservado={setVentanaReservado}
                toggleHora={toggleHora}
                zona={zona}
                />
            )}
        </>
    )
}

export default DiasDelMes