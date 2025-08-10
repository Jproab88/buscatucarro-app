import React, { useState, useEffect, useRef } from 'react';
import { Search, Car, MessageSquare, X, Send, Bot, User, Star, ExternalLink, Loader2, BarChart3, CheckCircle, XCircle, Youtube } from 'lucide-react';

// --- Componente de Chat (Sin cambios funcionales) ---
const GeminiChat = ({ isChatOpen, setIsChatOpen }) => {
    const [messages, setMessages] = useState([ { from: 'bot', text: '¡Hola! Soy tu asistente de IA. Dime qué buscas y te ayudaré a encontrar tu carro perfecto.' } ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatMessagesRef = useRef(null);
    useEffect(() => { if (chatMessagesRef.current) { chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight; } }, [messages]);
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;
        const userMessage = { from: 'user', text: input };
        setMessages(prev => [...prev, userMessage]); setInput(''); setIsLoading(true);
        setTimeout(() => {
            const botResponse = { from: 'bot', text: `Claro, basándome en tu búsqueda, aquí tienes algunas recomendaciones...` };
            setMessages(prev => [...prev, botResponse]); setIsLoading(false);
        }, 1500);
    };
    return (
        <div className={`fixed bottom-4 right-4 transition-all duration-300 ease-in-out z-50 ${isChatOpen ? 'w-11/12 max-w-md h-3/4 max-h-[600px]' : 'w-16 h-16'}`}>
            {isChatOpen ? (
                 <div className="flex flex-col w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900 rounded-t-2xl"><div className="flex items-center space-x-2"><Bot className="text-indigo-600 dark:text-indigo-400" size={24} /><h3 className="font-bold text-gray-800 dark:text-white">Asistente de Compra IA</h3></div><button onClick={() => setIsChatOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"><X size={20} /></button></div>
                    <div ref={chatMessagesRef} className="flex-1 p-4 overflow-y-auto space-y-4">{messages.map((msg, index) => (<div key={index} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>{msg.from === 'bot' && <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center"><Bot size={20} className="text-white"/></div>}<div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.from === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}><p className="text-sm whitespace-pre-wrap">{msg.text}</p></div>{msg.from === 'user' && <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"><User size={20} className="text-gray-700"/></div>}</div>))}{isLoading && (<div className="flex justify-start"><div className="flex items-end gap-2"><div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center"><Bot size={20} className="text-white"/></div><div className="max-w-xs md:max-w-sm px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none flex items-center space-x-2"><span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span><span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75"></span><span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></span></div></div></div>)}</div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700"><div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-full"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Escribe tu consulta aquí..." className="w-full bg-transparent p-3 pl-4 text-sm text-gray-800 dark:text-white focus:outline-none" /><button onClick={handleSendMessage} disabled={isLoading} className="p-2 m-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"><Send size={20} /></button></div></div>
                </div>
            ) : ( <button onClick={() => setIsChatOpen(true)} className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-110"><MessageSquare size={32} /></button> )}
        </div>
    );
};

// --- Componente de Tarjeta de Vehículo REDISEÑADO ---
const CarCard = ({ car }) => {
    const imageUrl = car.imageUrl;
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col group">
            {/* SOLUCIÓN AL TAMAÑO DE IMAGEN: Contenedor con altura fija y overflow hidden */}
            <div className="relative w-full h-56 overflow-hidden">
                <img 
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    src={imageUrl} 
                    alt={`${car.make} ${car.model}`} 
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/334155/ffffff?text=${encodeURIComponent(car.make + ' ' + car.model)}`; }}
                />
            </div>
            <div className="p-5 flex-grow flex flex-col">
                <div>
                    <p className="text-sm text-indigo-500 font-semibold">{car.yearRange}</p>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mt-1">{car.make} {car.model}</h3>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 my-3">{car.priceRange}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 flex-grow mb-4">{car.description}</p>
                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    {car.youtubeReviewUrl && (
                        <a href={car.youtubeReviewUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-slate-100 text-slate-800 font-bold py-2.5 px-3 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm flex items-center justify-center">
                            <Youtube size={16} className="mr-2"/> Ver Reseñas
                        </a>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                        {car.purchaseLinks.map(link => (
                            <a key={link.site} href={link.url} target="_blank" rel="noopener noreferrer" className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold py-2 px-3 rounded-lg hover:bg-indigo-100 dark:hover:bg-slate-600 transition-colors text-xs flex items-center justify-center text-center">
                                {link.site}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="w-full h-56 bg-slate-300 dark:bg-slate-700"></div>
        <div className="p-5"><div className="h-4 w-1/4 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div><div className="h-6 w-3/4 bg-slate-300 dark:bg-slate-600 rounded mb-4"></div><div className="h-8 w-1/2 bg-slate-300 dark:bg-slate-600 rounded mb-4"></div><div className="h-4 w-full bg-slate-300 dark:bg-slate-600 rounded mb-1"></div><div className="h-4 w-full bg-slate-300 dark:bg-slate-600 rounded mb-1"></div><div className="h-4 w-2/3 bg-slate-300 dark:bg-slate-600 rounded mb-4"></div><div className="h-10 w-full bg-slate-300 dark:bg-slate-600 rounded mt-6"></div></div>
    </div>
);

const ComparisonModal = ({ carsToCompare, onClose }) => {
    if (!carsToCompare || carsToCompare.length === 0) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tabla Comparativa</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><X className="text-slate-600 dark:text-slate-300" /></button></div>
                <div className="overflow-x-auto flex-grow"><table className="w-full min-w-[1000px] text-sm text-left"><thead className="bg-slate-50 dark:bg-slate-900 sticky top-0"><tr><th className="p-4 font-semibold text-slate-700 dark:text-slate-200 w-48">Característica</th>{carsToCompare.map(car => (<th key={car.id} className="p-4 font-semibold text-slate-700 dark:text-slate-200">{car.make} {car.model}</th>))}</tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-700"><tr className="bg-white dark:bg-slate-800"><td className="p-4 font-medium text-slate-800 dark:text-slate-300 align-top">Rango de Precios</td>{carsToCompare.map(car => (<td key={car.id} className="p-4 text-lg font-extrabold text-indigo-600 dark:text-indigo-400 align-top">{car.priceRange}</td>))}</tr><tr className="bg-slate-50 dark:bg-slate-800/50"><td className="p-4 font-medium text-slate-800 dark:text-slate-300 align-top">Pros</td>{carsToCompare.map(car => (<td key={car.id} className="p-4 text-slate-600 dark:text-slate-400 align-top"><ul className="space-y-2">{car.pros?.map((pro, i) => (<li key={i} className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" /><span>{pro}</span></li>))}</ul></td>))}</tr><tr className="bg-white dark:bg-slate-800"><td className="p-4 font-medium text-slate-800 dark:text-slate-300 align-top">Contras</td>{carsToCompare.map(car => (<td key={car.id} className="p-4 text-slate-600 dark:text-slate-400 align-top"><ul className="space-y-2">{car.cons?.map((con, i) => (<li key={i} className="flex items-start"><XCircle className="w-4 h-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" /><span>{con}</span></li>))}</ul></td>))}</tr><tr className="bg-slate-50 dark:bg-slate-800/50"><td className="p-4 font-medium text-slate-800 dark:text-slate-300 align-top">Descripción</td>{carsToCompare.map(car => (<td key={car.id} className="p-4 text-slate-600 dark:text-slate-400 align-top">{car.description}</td>))}</tr></tbody></table></div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-b-2xl text-right"><button onClick={onClose} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">Cerrar</button></div>
            </div>
        </div>
    );
};

// --- Componente Principal con NUEVO DISEÑO ---
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
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchInput)}`);
            if (!response.ok) { throw new Error(`Error de la API: ${response.statusText}`); }
            const results = await response.json();
            setCars(results);
        } catch (error) {
            console.error("Error al buscar:", error);
            setCars([]); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200">
            {showComparison && <ComparisonModal carsToCompare={cars.slice(0, 5)} onClose={() => setShowComparison(false)} />}
            
            <header className="bg-white/80 dark:bg-slate-900/80 shadow-sm sticky top-0 z-40 backdrop-blur-lg">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16"><div className="flex items-center"><Car className="h-8 w-8 text-indigo-600 dark:text-indigo-400" /><span className="font-bold text-xl ml-2 text-slate-900 dark:text-white">BuscaTuCarro IA</span></div><div className="hidden md:flex items-center space-x-4"><a href="#" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Nuevos</a><a href="#" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Usados</a><a href="#" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Vender</a><button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Iniciar Sesión</button></div></div></nav>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center pt-8 pb-12">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Tu Próximo Carro, <span className="text-indigo-600">Más Cerca.</span></h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Describe el carro de tus sueños. Nuestra IA analiza el mercado y te presenta las mejores opciones al instante.</p>
                </div>
                
                <div className="max-w-2xl mx-auto mb-12">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                        <input type="text" name="keyword" placeholder="Ej: 'SUV familiar económica' o 'deportivo rojo'" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-14 pr-32 py-4 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-white text-lg shadow-lg" />
                        <button type="submit" disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Buscar'}
                        </button>
                    </form>
                </div>

                {!isLoading && cars.length > 1 && (
                    <div className="text-center mb-12">
                        <button onClick={() => setShowComparison(true)} className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors shadow-lg flex items-center justify-center mx-auto transform hover:scale-105">
                            <BarChart3 className="mr-2" />
                            Comparar los Mejores Resultados
                        </button>
                    </div>
                )}

                <div>
                    {isLoading && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>)}
                    {!isLoading && !hasSearched && (<div className="text-center py-16 opacity-70"><Search size={48} className="mx-auto text-slate-400" /><h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Comienza tu búsqueda</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Usa la barra superior para describir el vehículo que necesitas.</p></div>)}
                    {!isLoading && hasSearched && cars.length === 0 && (<div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md"><Car size={48} className="mx-auto text-slate-400" /><h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">No se encontraron vehículos</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Intenta con una descripción diferente o usa el chat para más ayuda.</p></div>)}
                    {!isLoading && cars.length > 0 && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{cars.map(car => <CarCard key={car.id} car={car} />)}</div>)}
                </div>
            </main>

            <GeminiChat isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
            
            <footer className="bg-transparent mt-16"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="text-center text-sm text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} BuscaTuCarro IA. Todos los derechos reservados.</div></div></footer>
        </div>
    );
}

export default App;