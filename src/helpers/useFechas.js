import { useState } from "react";

export const useFechas = () => {

    const hoy = new Date(); // fecha actual
    const [fecha, setFecha] = useState({ mes: hoy.getMonth(), anio: hoy.getFullYear() }); // mes y año actuales

    const diasSemana = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"]; // nombres de los días
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; // nombres de los meses

    const mesActual = fecha.mes; // mes actual
    const anioActual = fecha.anio; // año actual
    const primerDia = new Date(anioActual, mesActual, 1).getDay(); // día de la semana del primer día del mes

    // Devuelve un array con los números de días del mes
    const obtenerDiasDelMes = (mes, anio) => {
        const cantidadDias = new Date(anio, mes+1, 0).getDate(); // último día del mes
        return Array.from({ length: cantidadDias }, (_, i) => i + 1); // array [1,2,...,cantidadDias]
    };

    const diasDelMes = obtenerDiasDelMes(mesActual, anioActual); // días del mes actual

    const horariosMañana = () => [...Array.from({ length: 5 }, (_, i) => `${i + 7}:45`)];
    const horariosTarde = () => [...Array.from({ length: 5 }, (_, i) => `${i + 14}:00`)];
    const obtenerHorarios = () => [horariosMañana(), horariosTarde()].flat();

    return { fecha, setFecha, hoy, diasSemana, meses, primerDia, diasDelMes, obtenerDiasDelMes,obtenerHorarios }
}