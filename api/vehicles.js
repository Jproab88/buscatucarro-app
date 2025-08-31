// api/vehicles.js

// Esta función se conecta a tu base de datos de Back4App para obtener la lista de vehículos.
async function getVehiclesFromDatabase() {
  const APP_ID = process.env.BACK4APP_APP_ID;
  const REST_API_KEY = process.env.BACK4APP_REST_API_KEY;

  if (!APP_ID || !REST_API_KEY) {
    console.error("Las credenciales de Back4App no están configuradas.");
    // Devolvemos un objeto vacío para no romper la app si las claves no están.
    return {}; 
  }

  const endpoint = 'https://parseapi.back4app.com/classes/all_cars_by_model_and_by_make_and_by_year';
  
  // Pedimos hasta 5000 registros y solo las columnas que necesitamos para ser eficientes.
  const queryParams = new URLSearchParams({
    limit: 5000,
    keys: 'Make,Model,Year',
    order: '-Year' // Ordenamos por año descendente para tener los más nuevos primero
  });

  const response = await fetch(`${endpoint}?${queryParams}`, {
    method: 'GET',
    headers: {
      'X-Parse-Application-Id': APP_ID,
      'X-Parse-REST-API-Key': REST_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error al obtener datos de Back4App: ${response.statusText}`);
  }

  const data = await response.json();
  const carList = data.results || [];

  // Procesamos la lista plana de carros para crear la estructura anidada que necesita el frontend.
  const formattedData = {};
  carList.forEach(car => {
    const { Make, Model, Year } = car;
    if (!Make || !Model || !Year) return; // Omitimos registros incompletos

    if (!formattedData[Make]) {
      formattedData[Make] = {};
    }
    if (!formattedData[Make][Model]) {
      formattedData[Make][Model] = new Set(); // Usamos un Set para evitar años duplicados
    }
    formattedData[Make][Model].add(Year.toString());
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
    const vehicles = await getVehiclesFromDatabase();
    // Devolvemos los datos con una cabecera de caché para optimizar el rendimiento.
    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache por 24 horas
    return response.status(200).json(vehicles);
  } catch (error) {
    console.error("Error en la API de vehículos:", error);
    return response.status(500).json({ error: 'No se pudo conectar a la base de datos de vehículos.' });
  }
}

