import React, { useState } from 'react';
import { Search, Car, Loader2, CheckCircle, XCircle, ExternalLink, Shield, Zap, Gauge, Wind } from 'lucide-react';

// --- Componente de Logo ---
const Logo = () => (
    <div className="flex items-center justify-center space-x-2">
        <Car className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">BuscaTuCarro IA</span>
    </div>
);

// --- Componente de la Tabla Comparativa ---
const ComparisonTable = ({ cars }) => {
    const features = [
        { key: 'pros', label: 'Pros', icon: CheckCircle, color: 'text-green-500' },
        { key: 'cons', label: 'Contras', icon: XCircle, color: 'text-red-500' },
        { key: 'airbags', label: 'Seguridad', icon: Shield, color: 'text-blue-500' },
        { key: 'horsepower', label: 'Potencia', icon: Zap, color: 'text-yellow-500' },
        { key: 'topSpeed', label: 'Vel. Máxima', icon: Wind, color: 'text-cyan-500' },
        { key: 'fuelEfficiency', label: 'Consumo', icon: Gauge, color: 'text-orange-500' },
    ];

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                        <th className="sticky left-0 bg-slate-50 dark:bg-slate-800 p-4 font-semibold text-slate-700 dark:text-slate-200 w-48 text-left">Vehículo</th>
                        {cars.map(car => (
                            <th key={car.id} className="p-4 font-semibold text-slate-700 dark:text-slate-200 border-l border-slate-200 dark:border-slate-700 w-48">
                                <div className="flex flex-col items-center text-center">
                                    {/* CORRECCIÓN: Contenedor con tamaño fijo para la imagen */}
                                    <div className="w-40 h-24 rounded-md mb-2 overflow-hidden relative bg-slate-200 dark:bg-slate-700">
                                        <img 
                                            src={car.imageUrl} 
                                            alt={`${car.make} ${car.model}`}
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x200/334155/ffffff?text=Imagen`; }}
                                        />
                                    </div>
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{car.make}</span>
                                    <span>{car.model}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {features.map(feature => (
                        <tr key={feature.key} className="bg-white dark:bg-slate-800/50">
                            <td className="sticky left-0 bg-white dark:bg-slate-800/50 p-4 font-medium text-slate-800 dark:text-slate-300 align-top">
                                <div className="flex items-center">
                                    <feature.icon className={`w-5 h-5 mr-2 ${feature.color}`} />
                                    {feature.label}
                                </div>
                            </td>
                            {cars.map(car => (
                                <td key={car.id} className="p-4 text-slate-600 dark:text-slate-400 align-top border-l border-slate-200 dark:border-slate-700">
                                    {Array.isArray(car[feature.key]) ? (
                                        <ul className="space-y-1.5">
                                            {car[feature.key].map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    ) : (
                                        <span>{car[feature.key]}</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                    <tr className="bg-white dark:bg-slate-800/50">
                        <td className="sticky left-0 bg-white dark:bg-slate-800/50 p-4 font-medium text-slate-800 dark:text-slate-300 align-top">Comprar</td>
                        {cars.map(car => (
                            <td key={car.id} className="p-4 align-top border-l border-slate-200 dark:border-slate-700">
                                <a 
                                    href={car.mercadoLibreUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-full bg-yellow-400 text-slate-900 font-bold py-2 px-3 rounded-lg hover:bg-yellow-500 transition-colors text-sm flex items-center justify-center"
                                >
                                    Mercado Libre <ExternalLink size={14} className="ml-1.5"/>
                                </a>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

// --- Componente Principal con Lógica de Vistas ---
function App() {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return;
        setIsLoading(true);
        setHasSearched(false);
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
            setHasSearched(true);
        }
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200 flex flex-col">
            {/* Si no se ha buscado, muestra la página de inicio */}
            {!hasSearched && !isLoading && (
                <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
                    <Logo />
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg mx-auto my-6">
                        Describe el carro que necesitas en la casilla de búsqueda y te traeremos las mejores 5 opciones que haya disponibles en el mercado.
                    </p>
                    <div className="w-full max-w-2xl">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                            <input type="text" name="keyword" placeholder="Ej: 'SUV familiar y segura para viajar'" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-14 pr-32 py-4 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-white text-lg shadow-lg" />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-md">
                                Buscar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Si está cargando, muestra el loader */}
            {isLoading && (
                <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="mt-4 text-slate-500">Analizando el mercado para ti...</p>
                </div>
            )}

            {/* Si ya buscó, muestra la página de resultados */}
            {hasSearched && !isLoading && (
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">Aquí tienes tu comparativa:</h2>
                    {cars.length > 0 ? (
                        <ComparisonTable cars={cars} />
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                            <Car size={48} className="mx-auto text-slate-400" />
                            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">No se encontraron vehículos</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Intenta con una descripción diferente.</p>
                        </div>
                    )}
                </main>
            )}

            <footer className="w-full text-center p-4 mt-auto">
                <p className="text-sm text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} BuscaTuCarro IA. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}

export default App;