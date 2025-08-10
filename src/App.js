import React, { useState, useEffect, useRef } from 'react';
import { Search, Car, MessageSquare, X, Send, Bot, User, Star, ExternalLink, Loader2, BarChart3 } from 'lucide-react';

// --- SIMULACIÓN DE API DE IA (ACTUALIZADA CON MÁS DATOS) ---
// En una aplicación real, esta función haría una llamada a la API de Gemini.
const fetchCarRecommendations = async (prompt) => {
    console.log("Generando prompt para la IA:", prompt);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const keyword = prompt.toLowerCase();
    if (keyword.includes("suv") || keyword.includes("camioneta") || keyword.includes("familiar")) {
        return [
            {
                id: 1,
                make: "Toyota",
                model: "RAV4 XLE Híbrida",
                yearRange: "2021 - 2023",
                priceRange: "$130M - $160M",
                description: "La reina de la confiabilidad. Su sistema híbrido ofrece un consumo excepcional, ideal para la ciudad y la carretera. Es espaciosa, segura y tiene un excelente valor de reventa.",
                imagePrompt: "Toyota RAV4 Híbrida 2022 color blanco perlado",
                purchaseLinks: [
                    { site: "TuCarro", url: "https://carros.tucarro.com.co/toyota/rav4/" },
                    { site: "Mercado Libre", url: "https://listado.mercadolibre.com.co/toyota-rav4" }
                ]
            },
            {
                id: 2,
                make: "Mazda",
                model: "CX-5 Grand Touring",
                yearRange: "2021 - 2023",
                priceRange: "$125M - $155M",
                description: "Combina un diseño premium, acabados de lujo y una experiencia de manejo deportiva. Es perfecta si valoras la estética y la calidad de los materiales sin sacrificar la funcionalidad familiar.",
                imagePrompt: "Mazda CX-5 Grand Touring 2023 color rojo diamante",
                purchaseLinks: [
                    { site: "TuCarro", url: "https://carros.tucarro.com.co/mazda/cx-5/" },
                    { site: "Mercado Libre", url: "https://listado.mercadolibre.com.co/mazda-cx-5" }
                ]
            },
            {
                id: 3,
                make: "Kia",
                model: "Sportage Zenith",
                yearRange: "2023 - 2024",
                priceRange: "$140M - $170M",
                description: "Con un diseño futurista y un interior cargado de tecnología, la nueva Sportage es una de las más llamativas. Ofrece un gran espacio, comodidad y una de las mejores garantías.",
                imagePrompt: "Kia Sportage 2024 color azul oscuro en una ciudad de noche",
                purchaseLinks: [
                    { site: "TuCarro", url: "https://carros.tucarro.com.co/kia/sportage/" },
                    { site: "Mercado Libre", url: "https://listado.mercadolibre.com.co/kia-sportage" }
                ]
            },
            {
                id: 6,
                make: "Renault",
                model: "Duster Intens",
                yearRange: "2022 - 2024",
                priceRange: "$75M - $95M",
                description: "Una opción robusta y muy práctica, conocida por su excelente relación precio/beneficio y su suspensión preparada para las vías de Colombia. Ideal para quienes buscan durabilidad y bajo costo.",
                imagePrompt: "Renault Duster 2023 color gris",
                purchaseLinks: [
                    { site: "TuCarro", url: "https://carros.tucarro.com.co/renault/duster/" },
                    { site: "Mercado Libre", url: "https://listado.mercadolibre.com.co/renault-duster" }
                ]
            },
            {
                id: 7,
                make: "Chevrolet",
                model: "Tracker Turbo RS",
                yearRange: "2023 - 2024",
                priceRange: "$90M - $110M",
                description: "Ofrece un buen nivel de equipamiento en seguridad y conectividad, con un motor turbo eficiente para la ciudad. Su versión RS añade un look más deportivo y atractivo.",
                imagePrompt: "Chevrolet Tracker RS 2024 color rojo",
                purchaseLinks: [
                    { site: "TuCarro", url: "https://carros.tucarro.com.co/chevrolet/tracker/" },
                    { site: "Mercado Libre", url: "https://listado.mercadolibre.com.co/chevrolet-tracker" }
                ]
            }
        ];
    } else {
         return [
            {
                id: 4,
                make: "Mazda",
                model: "3 Grand Touring",
                yearRange: "2022 - 2024",
                priceRange: "$85M - $110M",
                description: "Un sedán con diseño y manejo excepcionales. Sus acabados interiores son de alta gama y su equipamiento en seguridad y tecnología es de los mejores en su categoría.",
                imagePrompt: "Mazda 3 Grand Touring 2023 sedán color gris máquina",
                purchaseLinks: [
                    { site: "TuCarro", url: "https://carros.tucarro.com.co/mazda/mazda-3/" },
                    { site: "Mercado Libre", url: "https://listado.mercadolibre.com.co/mazda-3" }
                ]
            },
            {
                id: 5,
                make: "Chevrolet",
                model: "Onix Turbo RS",
                yearRange: "2023 - 2024",
                priceRange: "$68M - $80M",
                description: "Un hatchback ágil y muy eficiente gracias a su motor turbo. El diseño RS le da un toque deportivo y viene muy bien equipado en conectividad y seguridad para su precio.",
                imagePrompt: "Chevrolet Onix RS 2024 color rojo",
                purchaseLinks: [
                    { site: "TuCarro", url: "https://carros.tucarro.com.co/chevrolet/onix/" },
                    { site: "Mercado Libre", url: "https://listado.mercadolibre.com.co/chevrolet-onix" }
                ]
            }
        ];
    }
};

const GeminiChat = ({ isChatOpen, setIsChatOpen }) => {
    const [messages, setMessages] = useState([ { from: 'bot', text: '¡Hola! Soy tu asistente de IA. Dime qué buscas y te ayudaré a encontrar tu carro perfecto. Por ejemplo: "Busco un SUV familiar, seguro y económico".' } ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatMessagesRef = useRef(null);
    useEffect(() => { if (chatMessagesRef.current) { chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight; } }, [messages]);
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;
        const userMessage = { from: 'user', text: input };
        setMessages(prev => [...prev, userMessage]); setInput(''); setIsLoading(true);
        setTimeout(() => {
            const botResponse = { from: 'bot', text: `¡Claro! Basado en tu búsqueda, aquí tienes algunas recomendaciones excelentes:\n\n**1. Mazda CX-5 Grand Touring (Usado, 2020-2022):**\n*Precio estimado: $100.000.000 - $120.000.000 COP*\nEs una opción fantástica si valoras el diseño, la calidad de los materiales y una excelente experiencia de manejo.\n\n**2. Toyota Corolla Cross XEI (Nuevo o Usado, 2022-2024):**\n*Precio estimado: $105.000.000 - $125.000.000 COP*\nSi tu prioridad es la confiabilidad y la eficiencia, esta es tu mejor apuesta.\n\n¿Quieres que profundice en alguna de estas opciones o que busque algo diferente?` };
            setMessages(prev => [...prev, botResponse]); setIsLoading(false);
        }, 2500);
    };
    return (
        <div className={`fixed bottom-4 right-4 transition-all duration-300 ease-in-out z-50 ${isChatOpen ? 'w-11/12 max-w-md h-3/4 max-h-[600px]' : 'w-16 h-16'}`}>
            {isChatOpen ? (
                 <div className="flex flex-col w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900 rounded-t-2xl"><div className="flex items-center space-x-2"><Bot className="text-blue-600 dark:text-blue-400" size={24} /><h3 className="font-bold text-gray-800 dark:text-white">Asistente de Compra IA</h3></div><button onClick={() => setIsChatOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"><X size={20} /></button></div>
                    <div ref={chatMessagesRef} className="flex-1 p-4 overflow-y-auto space-y-4">{messages.map((msg, index) => (<div key={index} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>{msg.from === 'bot' && <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"><Bot size={20} className="text-white"/></div>}<div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.from === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}><p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p></div>{msg.from === 'user' && <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"><User size={20} className="text-gray-700"/></div>}</div>))}{isLoading && (<div className="flex justify-start"><div className="flex items-end gap-2"><div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"><Bot size={20} className="text-white"/></div><div className="max-w-xs md:max-w-sm px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none flex items-center space-x-2"><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></span><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></span></div></div></div>)}</div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700"><div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-full"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Escribe tu consulta aquí..." className="w-full bg-transparent p-3 pl-4 text-sm text-gray-800 dark:text-white focus:outline-none" /><button onClick={handleSendMessage} disabled={isLoading} className="p-2 m-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"><Send size={20} /></button></div></div>
                </div>
            ) : ( <button onClick={() => setIsChatOpen(true)} className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110"><MessageSquare size={32} /></button> )}
        </div>
    );
};

const CarCard = ({ car }) => {
    const imageUrl = `https://placehold.co/600x400/334155/ffffff?text=${encodeURIComponent(car.imagePrompt)}`;
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="relative"><img className="w-full h-48 object-cover" src={imageUrl} alt={car.imagePrompt} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Imagen+no+disponible'; }} /></div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{car.make} {car.model}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{car.yearRange}</p>
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400 my-2">{car.priceRange}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-4">{car.description}</p>
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-bold mb-2 text-gray-800 dark:text-white">Ver ofertas en:</h4>
                    <div className="flex flex-col space-y-2">{car.purchaseLinks.map(link => (<a key={link.site} href={link.url} target="_blank" rel="noopener noreferrer" className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm flex items-center justify-center">{link.site} <ExternalLink size={14} className="ml-2"/></a>))}</div>
                </div>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
        <div className="p-4"><div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div><div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div><div className="h-8 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div><div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded mb-1"></div><div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded mb-1"></div><div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div><div className="h-10 w-full bg-gray-300 dark:bg-gray-600 rounded mt-6"></div><div className="h-10 w-full bg-gray-300 dark:bg-gray-600 rounded mt-2"></div></div>
    </div>
);

const ComparisonModal = ({ carsToCompare, onClose }) => {
    if (!carsToCompare || carsToCompare.length === 0) return null;
    const features = ['Imagen', 'Marca', 'Modelo', 'Rango de Años', 'Rango de Precios', 'Descripción'];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comparativa de Vehículos</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X className="text-gray-600 dark:text-gray-300" /></button></div>
                <div className="overflow-x-auto flex-grow">
                    <table className="w-full min-w-[800px] text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0"><tr><th className="p-4 font-semibold text-gray-700 dark:text-gray-200 w-1/6">Característica</th>{carsToCompare.map(car => (<th key={car.id} className="p-4 font-semibold text-gray-700 dark:text-gray-200">{car.make} {car.model}</th>))}</tr></thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{features.map(feature => (<tr key={feature}><td className="p-4 font-medium text-gray-800 dark:text-gray-300 align-top">{feature}</td>{carsToCompare.map(car => (<td key={car.id} className="p-4 text-gray-600 dark:text-gray-400 align-top">{feature === 'Imagen' && <img src={`https://placehold.co/600x400/334155/ffffff?text=${encodeURIComponent(car.imagePrompt)}`} alt={car.model} className="rounded-lg object-cover h-24 w-full"/>}{feature === 'Marca' && car.make}{feature === 'Modelo' && car.model}{feature === 'Rango de Años' && car.yearRange}{feature === 'Rango de Precios' && car.priceRange}{feature === 'Descripción' && car.description}</td>))}</tr>))}</tbody>
                    </table>
                </div>
                 <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-2xl"><button onClick={onClose} className="w-full sm:w-auto float-right bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">Cerrar</button></div>
            </div>
        </div>
    );
};

function App() {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showComparison, setShowComparison] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return;
        setIsLoading(true);
        setHasSearched(true);
        setCars([]);
        const results = await fetchCarRecommendations(searchInput);
        setCars(results);
        setIsLoading(false);
    };

    const handleCompareClick = () => {
        setShowComparison(true);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200">
            <ComparisonModal carsToCompare={cars.slice(0, 5)} onClose={() => setShowComparison(false)} />
            
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16"><div className="flex items-center"><Car className="h-8 w-8 text-blue-600 dark:text-blue-400" /><span className="font-bold text-xl ml-2 text-gray-900 dark:text-white">BuscaTuCarro IA</span></div><div className="hidden md:flex items-center space-x-4"><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">Nuevos</a><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">Usados</a><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">Vender</a><button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Iniciar Sesión</button></div></div></nav>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8"><h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">Tu Asistente de Compra Inteligente</h1><p className="text-lg text-gray-600 dark:text-gray-300">Describe el carro de tus sueños y nuestra IA lo encontrará por ti.</p></div>
                
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8"><div className="flex gap-2"><div className="relative flex-grow"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} /><input type="text" name="keyword" placeholder="Ej: 'SUV familiar económica' o 'deportivo rojo'" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-14 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-lg shadow-lg transition-shadow focus:shadow-xl" /></div><button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-bold px-8 rounded-full hover:bg-blue-700 transition-colors shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center">{isLoading ? <Loader2 className="animate-spin" /> : 'Buscar'}</button></div></form>

                {!isLoading && cars.length > 1 && (
                    <div className="text-center mb-12">
                        <button onClick={handleCompareClick} className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors shadow-lg flex items-center justify-center mx-auto">
                            <BarChart3 className="mr-2" />
                            Comparar los Mejores Resultados
                        </button>
                    </div>
                )}

                <div>
                    {isLoading && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>)}
                    {!isLoading && !hasSearched && (<div className="text-center py-16"><Search size={48} className="mx-auto text-gray-400" /><h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Comienza tu búsqueda</h3><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Usa la barra superior para describir el vehículo que necesitas.</p></div>)}
                    {!isLoading && hasSearched && cars.length === 0 && (<div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md"><Car size={48} className="mx-auto text-gray-400" /><h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">No se encontraron vehículos</h3><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Intenta con una descripción diferente o usa el chat para más ayuda.</p></div>)}
                    {!isLoading && cars.length > 0 && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">{cars.map(car => <CarCard key={car.id} car={car} />)}</div>)}
                </div>
            </main>

            <GeminiChat isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
            
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="text-center text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} BuscaTuCarro IA. Todos los derechos reservados.</div></div></footer>
            
            {showComparison && <ComparisonModal carsToCompare={cars.slice(0, 5)} onClose={() => setShowComparison(false)} />}
        </div>
    );
}

export default App;