// api/vehicles.js
import carList from './vehicle-data.json';

// Esta función ahora procesa los datos desde el archivo JSON local.
function getVehiclosDesdeArchivoLocal() {
  
  // Procesamos la lista plana de carros para crear la estructura anidada que necesita el frontend.
  const formattedData = {};
  carList.forEach(car => {
    // Actualizamos los nombres de las propiedades para que coincidan con el nuevo JSON
    const { Marca, Modelo, Año } = car;
    if (!Marca || !Modelo || !Año) return; // Omitimos registros incompletos

    if (!formattedData[Marca]) {
      formattedData[Marca] = {};
    }
    if (!formattedData[Marca][Modelo]) {
      formattedData[Marca][Modelo] = new Set(); // Usamos un Set para evitar años duplicados
    }
    formattedData[Marca][Modelo].add(Año.toString());
  });
  
  // Convertimos los Sets a Arrays ordenados
  for (const make in formattedData) {
    for (const model in formattedData[make]) {
      formattedData[make][model] = Array.from(formattedData[make][model]).sort((a, b) => b - a);
    }
  }

  return formattedData;
}


export default async function handler(request, response) {
  try {
    const vehicles = getVehiclosDesdeArchivoLocal();
    // Devolvemos los datos con una cabecera de caché para optimizar el rendimiento.
    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache por 24 horas
    return response.status(200).json(vehicles);
  } catch (error) {
    console.error("Error al procesar el archivo de vehículos:", error);
    return response.status(500).json({ error: 'No se pudo procesar la lista de vehículos.' });
  }
}

