import React, { useState, useEffect, useRef } from 'react';
import { Search, Car, X, ArrowLeft, ExternalLink, Loader2, BarChart3, CheckCircle, XCircle, Youtube } from 'lucide-react';

// --- Componente de Logo ---
const Logo = () => (
    <div className="flex items-center space-x-2">
        <Car className="h-8 w-8 text-indigo-500" />
        <span className="text-2xl font-bold text-white tracking-tight">BuscaTuCarro IA</span>
    </div>
);

// --- Componente de Tarjeta de Miniatura para la Galería ---
const CarThumbnail = ({ car, onClick }) => (
    <article 
        className="relative aspect-square bg-slate-800 rounded-lg overflow-hidden group cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
        onClick={() => onClick(car)}
    >
        <img 
            src={car.imageUrl} 
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/1e293b/ffffff?text=${encodeURIComponent(car.make + ' ' + car.model)}`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 p-4">
            <h3 className="font-bold text-white text-lg leading-tight">{car.make}</h3>
            <p className="text-sm text-slate-300">{car.model}</p>
        </div>
    </article>
);

// --- Componente de Vista Detallada (Lightbox) ---
const CarDetailModal = ({ car, onClose }) => {
    if (!car) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
            >
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                    <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="absolute top-0 left-0 w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
                    <div>
                        <p className="text-sm text-indigo-500 font-semibold">{car.yearRange}</p>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{car.make} {car.model}</h2>
                        <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 my-3">{car.priceRange}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{car.description}</p>
                    </div>
                    
                    <div className="space-y-4 text-sm my-4">
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Pros</h4>
                            <ul className="space-y-1.5">{car.pros?.map((pro, i) => (<li key={i} className="flex items-start text-slate-600 dark:text-slate-300"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" /><span>{pro}</span></li>))}</ul>
                        </div>
                         <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Contras</h4>
                            <ul className="space-y-1.5">{car.cons?.map((con, i) => (<li key={i} className="flex items-start text-slate-600 dark:text-slate-300"><XCircle className="w-4 h-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" /><span>{con}</span></li>))}</ul>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                         {car.youtubeReviewUrl && (<a href={car.youtubeReviewUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-slate-100 text-slate-800 font-bold py-2.5 px-3 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm flex items-center justify-center"><Youtube size={16} className="mr-2"/> Ver Reseñas</a>)}
                         <div className="grid grid-cols-3 gap-2">{car.purchaseLinks.map(link => (<a key={link.site} href={link.url} target="_blank" rel="noopener noreferrer" className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold py-2 px-3 rounded-lg hover:bg-indigo-100 dark:hover:bg-slate-600 transition-colors text-xs flex items-center justify-center text-center">{link.site}</a>))}</div>
                    </div>
                </div>
            </div>
             <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"><X /></button>
        </div>
    );
};


// --- Componente Principal con Diseño Multiverse ---
function App() {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [activeCar, setActiveCar] = useState(null); // Para controlar el lightbox

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return;
        setIsLoading(true);
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
        <div className="bg-slate-900 min-h-screen font-sans text-slate-200">
            <CarDetailModal car={activeCar} onClose={() => setActiveCar(null)} />
            
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <Logo />
                    <div className="w-full max-w-md">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input type="text" name="keyword" placeholder="Describe el carro de tus sueños..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-12 pr-4 py-2.5 border border-slate-600 bg-slate-800 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                        </form>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    </div>
                )}

                {!isLoading && cars.length === 0 && (
                    <div className="text-center py-24">
                        <h1 className="text-4xl font-bold text-white">Encuentra tu Próximo Vehículo</h1>
                        <p className="text-lg text-slate-400 mt-4 max-w-xl mx-auto">
                            Describe el carro que necesitas en la barra de búsqueda superior y te traeremos las mejores opciones del mercado.
                        </p>
                    </div>
                )}

                {!isLoading && cars.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {cars.map(car => <CarThumbnail key={car.id} car={car} onClick={setActiveCar} />)}
                    </div>
                )}
            </main>
            
            <footer className="w-full text-center p-4 mt-auto">
                <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} BuscaTuCarro IA. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}

export default App;