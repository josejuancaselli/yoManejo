import { useState } from "react";

export const useFechas = () =>{

    const hoy = new Date(); // fecha actual
    const [fecha, setFecha] = useState({ mes: hoy.getMonth(), anio: hoy.getFullYear() }); // mes y año actuales
    return {fecha, setFecha, hoy}
}