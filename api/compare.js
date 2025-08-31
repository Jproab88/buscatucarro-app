 import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const customSearchApiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
const customSearchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

async function fetchCarImage(query) {
    if (!customSearchApiKey || !customSearchEngineId) {
        console.warn("Google Custom Search API Keys not configured. Using placeholder.");
        return `https://placehold.co/300x200/334155/ffffff?text=${encodeURIComponent(query)}`;
    }
    try {
        const url = `https://www.googleapis.com/customsearch/v1?key=${customSearchApiKey}&cx=${customSearchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=1&imgSize=medium`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return data.items[0].link;
        }
        return `https://placehold.co/300x200/334155/ffffff?text=No+encontrada`;
    } catch (error) {
        console.error("Error fetching image from Google Search:", error);
        return `https://placehold.co/300x200/334155/ffffff?text=Error`;
    }
}

export default async function handler(request, response) {
    // El frontend enviará los carros en el cuerpo de la solicitud POST
    const { vehicles } = request.body;

    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
        return response.status(400).json({ error: 'No se proporcionaron vehículos para comparar.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const comparisonPromises = vehicles.map(async (vehicle) => {
            if (!vehicle || !vehicle.make || !vehicle.model || !vehicle.year) {
                return null; // Ignorar slots vacíos
            }

            const prompt = `
                Actúa como un experto en fichas técnicas de automóviles para Colombia.
                Para el vehículo "${vehicle.make} ${vehicle.model} ${vehicle.year}", proporciona la siguiente información:
                - Una lista de 3 pros clave (pros).
                - Una lista de 3 contras clave (cons).
                - Número de airbags (airbags).
                - Caballos de potencia (horsepower).
                - Velocidad máxima en km/h (topSpeed).
                - Consumo de combustible en km/litro o km/galón (fuelEfficiency).

                IMPORTANTE: Devuelve SÓLO un objeto JSON válido, sin ningún texto adicional.
                La estructura del objeto debe ser:
                {
                    "pros": ["string", "string", "string"],
                    "cons": ["string", "string", "string"],
                    "airbags": "string",
                    "horsepower": "string",
                    "topSpeed": "string",
                    "fuelEfficiency": "string"
                }
            `;
            
            const result = await model.generateContent(prompt);
            const aiResponse = await result.response;
            const text = aiResponse.text();
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const specs = JSON.parse(cleanedText);

            const imageUrl = await fetchCarImage(`${vehicle.make} ${vehicle.model} ${vehicle.year}`);

            return {
                ...vehicle,
                ...specs,
                imageUrl,
                mercadoLibreUrl: `https://listado.mercadolibre.com.co/${vehicle.make.toLowerCase()}-${vehicle.model.toLowerCase()}-${vehicle.year}`
            };
        });

        const results = await Promise.all(comparisonPromises);
        
        // Devolvemos el array con los resultados, incluyendo los nulos para que el frontend sepa cuáles slots estaban vacíos.
        return response.status(200).json(results);

    } catch (error) {
        console.error("Error en la función de comparación:", error);
        return response.status(500).json({ error: 'Ocurrió un error al procesar la comparación.' });
    }
}