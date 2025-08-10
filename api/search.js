import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Búsqueda de imagen mejorada para evitar placeholders.
async function fetchFirstGoogleImage(make, model) {
    console.log(`Buscando imagen para: ${make} ${model}`);
    
    // 1. Diccionario de imágenes curadas para resultados óptimos.
    const knownImages = {
        "RAV4": "https://images.pexels.com/photos/18437335/pexels-photo-18437335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "CX-5": "https://images.pexels.com/photos/16455239/pexels-photo-16455239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "Sportage": "https://images.pexels.com/photos/14093952/pexels-photo-14093952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "Duster": "https://images.pexels.com/photos/15982132/pexels-photo-15982132/free-photo-of-dacia-duster-suv-in-a-forest.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "Tracker": "https://www.chevrolet.com.co/content/dam/chevrolet/south-america/colombia/espanol/index/pick-up-trucks-and-suvs/2025-tracker-turbo/mov/01-images/2025-tracker-turbo-rs-rojo.jpg?imwidth=960",
        "Mazda 3": "https://images.pexels.com/photos/18841774/pexels-photo-18841774/free-photo-of-a-red-mazda-in-a-dark-garage.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "Onix": "https://www.chevrolet.com.co/content/dam/chevrolet/south-america/colombia/espanol/index/cars/2025-onix-turbo-s/colorizer/rojo-escarlata/01-images/onix-rs-rojo-escarlata.jpg?imwidth=960",
        "Corolla": "https://images.pexels.com/photos/1637859/pexels-photo-1637859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    };

    // Buscamos si el modelo contiene alguna de las llaves para devolver una imagen de alta calidad.
    for (const key in knownImages) {
        if (model.toLowerCase().includes(key.toLowerCase())) {
            return knownImages[key];
        }
    }

    // 2. Si no está en el diccionario, se realiza una búsqueda dinámica en un servicio de imágenes.
    // Esto reemplaza el placeholder por un intento de encontrar una foto real.
    return `https://source.unsplash.com/600x400/?${encodeURIComponent(make + ' ' + model)}`;
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
        // Obtenemos la URL de la imagen para cada carro.
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