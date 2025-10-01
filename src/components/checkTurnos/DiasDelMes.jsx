import { useState } from "react";
import BotonesHora from "./BotonesHora";

const DiasDelMes = ({ estaReservado, horarios, setVentanaReservado, ventanaRef, alumnos, toggleHora, yaExiste, fecha, zona, ventanaDia, botonDiaRef, dia, toggleDia, disabled }) => {

    const [horariosVisible, setHorariosVisible] = useState(false);

    return (
        <div
            className="dia-mes"
            onMouseEnter={() => setHorariosVisible(true)}
            onMouseLeave={() => setHorariosVisible(false)}
        >
            <button
                // ref={(el) => { if (ventanaDia === dia) botonDiaRef.current = el; }}
                className={`dia-num-btn ${disabled.includes(dia) ? "disabled" : ""}`}
                // onClick={() => { toggleDia(dia) }}
                disabled={disabled.includes(dia)}
            >
                {dia}
            </button>

            {horariosVisible && (
                <div className="horarios-wrapper">
                    <BotonesHora
                        horarios={horarios}
                        toggleHora={toggleHora}
                        alumnos={alumnos}
                        dia={dia}
                        estaReservado={estaReservado}
                        yaExiste={yaExiste}
                        fecha={fecha}
                        zona={zona}
                    />
                </div>
            )}

            {/* {ventanaDia === dia && (
                <BotonesHora
                    ventanaRef={ventanaRef}
                    ventanaDia={ventanaDia}
                    dia={dia}
                    horarios={horarios}
                    estaReservado={estaReservado}
                    yaExiste={yaExiste}
                    fecha={fecha}
                    alumnos={alumnos}
                    setVentanaReservado={setVentanaReservado}
                    toggleHora={toggleHora}
                    zona={zona}
                />
            )} */}
        </div>
    )
}

export default DiasDelMes