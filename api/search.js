import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Función para buscar la primera imagen en Google usando la API de Custom Search.
async function fetchFirstGoogleImage(make, model) {
    console.log(`Buscando imagen real en Google para: ${make} ${model}`);
    
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    const query = `${make} ${model} photo`;

    // Construimos la URL para la API de Google Custom Search
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la API de Google Search: ${response.status}`);
        }
        const data = await response.json();

        // Si la búsqueda tiene resultados y el primer resultado tiene un link, lo usamos.
        if (data.items && data.items.length > 0 && data.items[0].link) {
            return data.items[0].link;
        }
    } catch (error) {
        console.error("Error al buscar imagen en Google:", error);
    }

    // Si todo lo demás falla, usamos un placeholder confiable para no romper la página.
    return `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(make + ' ' + model)}`;
}


export default async function handler(request, response) {
  const userQuery = request.query.q;

  if (!userQuery) {
    return response.status(400).json({ error: 'No se proporcionó una búsqueda.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = `
      Actúa como un experto asesor de autos en Colombia. Un usuario busca lo siguiente: "${userQuery}".
      Recomiéndale entre 3 y 5 vehículos que se ajusten a su búsqueda.
      Para cada vehículo, proporciona la siguiente información:
      - Marca (make)
      - Modelo (model)
      - Un rango de años relevante (yearRange)
      - Un rango de precios estimado en pesos colombianos (priceRange), formato "$XXXM - $XXXM"
      - Una descripción corta y atractiva (description)
      - Una lista de 3 a 4 "pros" (ventajas principales)
      - Una lista de 3 a 4 "cons" (desventajas o puntos a considerar)
      - Una consulta de búsqueda optimizada para YouTube en español (youtubeQuery), por ejemplo: "reseña Mazda 3 2023 español"
      
      IMPORTANTE: Devuelve SÓLO un array de objetos JSON válido, sin ningún texto adicional antes o después.
      La estructura de cada objeto debe ser:
      {
        "make": "string",
        "model": "string",
        "yearRange": "string",
        "priceRange": "string",
        "description": "string",
        "pros": ["string", "string"],
        "cons": ["string", "string"],
        "youtubeQuery": "string"
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
            purchaseLinks: [
                { site: "TuCarro", url: `https://carros.tucarro.com.co/${make_lower}/${model_lower_slug}` },
                { site: "Mercado Libre", url: `https://listado.mercadolibre.com.co/${make_lower}-${model_lower_slug}`},
                { site: "Carroya", url: `https://www.carroya.com/buscar/vehiculos/${make_lower}/${model_lower_slug}`}
            ],
            youtubeReviewUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(car.youtubeQuery)}`
        }
    }));

    return response.status(200).json(finalResults);

  } catch (error) {
    console.error("Error en la función serverless:", error);
    return response.status(500).json({ error: 'Ocurrió un error al procesar la búsqueda con la IA.' });
  }
}