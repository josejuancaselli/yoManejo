import { useState } from "react";
import BotonesHora from "./BotonesHora";

const DiasDelMes = ({ estaReservado, horarios, esHoy, alumnos, toggleHora, yaExiste, fecha, zona, dia, disabled, setVentanaReservado, ventanaReservado }) => {

    const [horariosVisible, setHorariosVisible] = useState(false);

    return (
        <div
            className="dia-mes "
            onMouseEnter={() => {
                !disabled.includes(dia) && setHorariosVisible(true)
            }}
            onMouseLeave={() => setHorariosVisible(false)}

        >
            {/* este boton estas al pedo , lo tengo que sacar en algun momento y convertirlo en un DIV*/}
            <button className="dia-num-btn" style={{
                backgroundColor: disabled.includes(dia) && "#a9a9a9",
                cursor: disabled.includes(dia) ? "not-allowed" : "pointer"
            }}>
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
                        ventanaReservado={ventanaReservado}
                        setVentanaReservado={setVentanaReservado}
                        yaExiste={yaExiste}
                        fecha={fecha}
                        zona={zona}

                    />
                </div>
            )}
        </div>
    )
}

export default DiasDelMes