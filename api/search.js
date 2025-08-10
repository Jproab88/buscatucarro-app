import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function fetchFirstGoogleImage(make, model) {
    console.log(`Buscando imagen real en Google para: ${make} ${model}`);
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    const query = `${make} ${model} photo`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) { throw new Error(`Error en la API de Google Search: ${response.status}`); }
        const data = await response.json();
        if (data.items && data.items.length > 0 && data.items[0].link) {
            return data.items[0].link;
        }
    } catch (error) {
        console.error("Error al buscar imagen en Google:", error);
    }
    return `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(make + ' ' + model)}`;
}

export default async function handler(request, response) {
  const userQuery = request.query.q;
  if (!userQuery) {
    return response.status(400).json({ error: 'No se proporcionó una búsqueda.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    // Prompt mejorado: Ahora pedimos las características técnicas.
    const prompt = `
      Actúa como un experto asesor de autos en Colombia. Un usuario busca lo siguiente: "${userQuery}".
      Recomiéndale los 5 mejores vehículos que se ajusten a su búsqueda.
      Para cada vehículo, proporciona la siguiente información:
      - Marca (make)
      - Modelo (model)
      - Una lista de 3 "pros" (ventajas principales)
      - Una lista de 3 "cons" (desventajas o puntos a considerar)
      - Número de airbags (airbags), como un string, ej: "6 airbags" o "2 frontales"
      - Velocidad máxima en km/h (topSpeed), como un string, ej: "190 km/h"
      - Caballos de potencia (horsepower), como un string, ej: "150 HP"
      - Consumo de combustible en km/litro (fuelEfficiency), como un string, ej: "15 km/l"
      
      IMPORTANTE: Devuelve SÓLO un array de 5 objetos JSON válido, sin ningún texto adicional.
      La estructura de cada objeto debe ser:
      {
        "make": "string",
        "model": "string",
        "pros": ["string", "string", "string"],
        "cons": ["string", "string", "string"],
        "airbags": "string",
        "topSpeed": "string",
        "horsepower": "string",
        "fuelEfficiency": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const text = aiResponse.text();

    const cleanedText = text.replace('```json', '').replace('```', '').trim();
    const carResults = JSON.parse(cleanedText);

    const finalResults = await Promise.all(carResults.map(async (car, index) => {
        const imageUrl = await fetchFirstGoogleImage(car.make, car.model);
        const make_lower = car.make.toLowerCase();
        const model_lower_slug = car.model.toLowerCase().replace(/ /g, '-');

        return {
            ...car,
            id: index + 1,
            imageUrl: imageUrl, 
            mercadoLibreUrl: `https://listado.mercadolibre.com.co/${make_lower}-${model_lower_slug}`
        }
    }));

    return response.status(200).json(finalResults);

  } catch (error) {
    console.error("Error en la función serverless:", error);
    return response.status(500).json({ error: 'Ocurrió un error al procesar la búsqueda con la IA.' });
  }
}