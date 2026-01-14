export const toggleZona = (prevZonas, zona) => {
    return prevZonas.includes(zona) ? prevZonas.filter((z) => z !== zona) : [...prevZonas, zona];
};