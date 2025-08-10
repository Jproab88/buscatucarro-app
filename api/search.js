import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateImage(prompt) {
    const imageUrl = `https://source.unsplash.com/600x400/?${encodeURIComponent(prompt)}`;
    return imageUrl;
}

export default async function handler(request, response) {
  const userQuery = request.query.q;

  if (!userQuery) {
    return response.status(400).json({ error: 'No se proporcionó una búsqueda.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    // Prompt mejorado: Añadimos la petición de una consulta para YouTube.
    const prompt = `
      Actúa como un experto asesor de autos en Colombia. Un usuario busca lo siguiente: "${userQuery}".
      Recomiéndale entre 3 y 5 vehículos que se ajusten a su búsqueda.
      Para cada vehículo, proporciona la siguiente información:
      - Marca (make)
      - Modelo (model)
      - Un rango de años relevante (yearRange)
      - Un rango de precios estimado en pesos colombianos (priceRange), formato "$XXXM - $XXXM"
      - Una descripción corta y atractiva (description)
      - Un prompt detallado para un generador de imágenes de IA (imagePrompt), por ejemplo: "photo of a red Mazda 3 sedan 2023 on a highway"
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
        "imagePrompt": "string",
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

    // Mapeamos los resultados para añadir los enlaces finales.
    const finalResults = await Promise.all(carResults.map(async (car, index) => {
        const imageUrl = await generateImage(car.imagePrompt);
        
        const make_lower = car.make.toLowerCase();
        const model_lower_slug = car.model.toLowerCase().replace(/ /g, '-');

        return {
            ...car,
            id: index + 1,
            imageUrl: imageUrl, 
            // Lógica de compra actualizada: Se eliminó OLX.
            purchaseLinks: [
                { site: "TuCarro", url: `https://carros.tucarro.com.co/${make_lower}/${model_lower_slug}` },
                { site: "Mercado Libre", url: `https://listado.mercadolibre.com.co/${make_lower}-${model_lower_slug}`},
                { site: "Carroya", url: `https://www.carroya.com/buscar/vehiculos/${make_lower}/${model_lower_slug}`}
            ],
            // Nuevo campo: URL de búsqueda de reseñas en YouTube.
            youtubeReviewUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(car.youtubeQuery)}`
        }
    }));

    return response.status(200).json(finalResults);

  } catch (error) {
    console.error("Error en la función serverless:", error);
    return response.status(500).json({ error: 'Ocurrió un error al procesar la búsqueda con la IA.' });
  }
}