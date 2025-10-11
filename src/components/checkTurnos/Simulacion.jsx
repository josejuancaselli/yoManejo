import html2canvas from "html2canvas";


const Simulacion = ({ setSimulacion, setTurnoSim, turnoSim, setVentanaReservar, ventanaReservar }) => {

    const imprimirJPG = () => {
        const element = document.querySelector(".simulacion-modal");
        if (!element) return;

        const backdrop = document.querySelector(".simulacion-modal-backdrop");
        const originalBackdropDisplay = backdrop?.style.display;
        if (backdrop) backdrop.style.display = "hidden";

        html2canvas(element, { backgroundColor: null })
            .then((canvas) => {
                const imgData = canvas.toDataURL("image/jpeg", 1.0);
                const link = document.createElement("a");
                link.href = imgData;
                link.download = "turnos.jpeg";
                link.click();
            })
            .finally(() => {
                if (backdrop && originalBackdropDisplay !== undefined) {
                    backdrop.style.display = originalBackdropDisplay;
                }
            });
    };
    return (
        <div className="simulacion-modal-backdrop">
            <div className="simulacion-modal">
                <button
                    onClick={() => { setSimulacion(false); setTurnoSim([]); }}
                    className="btn-close"
                    aria-label="Cerrar"
                >
                    ×
                </button>
                <ul className="simulacion-list">
                    {turnoSim.map((e, index) => (
                        <li key={index} className="simulacion-item">

                            {e.diaSemana} - {e.dia}/{e.mes} - {e.hora} hs - Zona {e.zona}
                        </li>
                    ))}
                </ul>

                <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "10px" }}>
                    <button onClick={imprimirJPG} className="btn-imprimir">Simular</button>
                    <button className="btn-imprimir" onClick={() => { setVentanaReservar(true); setSimulacion(false) }}>Reservar</button>

                </div>
            </div>
        </div>
    )
}

export default Simulacion