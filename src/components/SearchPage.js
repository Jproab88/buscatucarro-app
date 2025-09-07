import React, { useState } from 'react';
import { Search, Car, Loader2, ArrowLeft, CheckCircle, XCircle, Shield, Zap, Wind, Gauge, ExternalLink } from 'lucide-react';

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
        <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
            <table className="min-w-full border-collapse" style={{ tableLayout: 'fixed' }}>
                <colgroup>
                    <col style={{ width: '12rem' }} />
                    {cars.map(car => <col key={car.id} style={{ width: '16rem' }} />)}
                </colgroup>
                <thead>
                    <tr className="bg-gray-50">
                        <th className="sticky left-0 bg-gray-100 p-4 font-semibold text-gray-600 text-left text-sm tracking-wider z-10">Vehículo</th>
                        {cars.map(car => (
                            <th key={car.id} className="p-4 font-semibold text-gray-600 border-l border-gray-200 min-w-0">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-full h-32 rounded-lg mb-3 overflow-hidden relative shadow-inner bg-gray-200">
                                        <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="absolute top-0 left-0 w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x200/e2e8f0/94a3b8?text=Auto`; }}/>
                                    </div>
                                    <span className="font-bold text-blue-700 text-lg">{car.make}</span>
                                    <span className="text-gray-700">{car.model}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {features.map((feature, fIndex) => (
                        <tr key={feature.key} className="transition-colors hover:bg-gray-50">
                            <td className="sticky left-0 p-4 font-medium text-gray-800 align-top bg-white border-r border-gray-200 z-10"><div className="flex items-center"><feature.icon className={`w-5 h-5 mr-3 ${feature.color} flex-shrink-0`} />{feature.label}</div></td>
                            {cars.map(car => (<td key={car.id} className="p-4 text-gray-600 align-top border-l border-gray-200 text-sm min-w-0">{Array.isArray(car[feature.key]) ? (<ul className="space-y-2">{car[feature.key].map((item, i) => <li key={i} className="flex items-start"><span className="mr-2 mt-1">&#8226;</span><span>{item}</span></li>)}</ul>) : (<span>{car[feature.key]}</span>)}</td>))}
                        </tr>
                    ))}
                    <tr className="bg-white">
                         <td className="sticky left-0 p-4 font-medium text-gray-800 align-top bg-white border-r border-gray-200 z-10">Comprar</td>
                        {cars.map(car => (<td key={car.id} className="p-4 align-middle border-l border-gray-200"><a href={car.mercadoLibreUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-yellow-400 text-gray-900 font-bold py-2.5 px-3 rounded-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center">Mercado Libre <ExternalLink size={14} className="ml-2"/></a></td>))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};


const SearchPage = () => {
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

    if (isLoading || hasSearched) {
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                 <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <button onClick={() => { setHasSearched(false); setCars([]); setSearchInput(''); }} className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"><ArrowLeft className="mr-2" size={20} />Nueva Búsqueda</button>
                    <h2 className="text-3xl font-bold text-gray-800 text-center">Tu Comparativa Inteligente</h2>
                    <div className="w-40 hidden sm:block"></div>
                </div>
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center text-center py-20"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /><p className="mt-4 text-gray-500 text-lg">Analizando el mercado para ti...</p></div>
                ) : cars.length > 0 ? ( 
                    <ComparisonTable cars={cars} /> 
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md border"><Car size={48} className="mx-auto text-gray-400" /><h3 className="mt-4 text-xl font-semibold text-gray-900">No se encontraron vehículos</h3><p className="mt-1 text-gray-500">Intenta con una descripción diferente o más general.</p></div>
                )}
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
             <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
            </div>
            
            <div className="w-full flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tighter">Encuentra tu Carro Ideal.</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">Describe el carro de tus sueños con IA y obtén una comparativa instantánea de las mejores opciones del mercado.</p>
                
                <div className="w-full max-w-3xl">
                    <form onSubmit={handleSearch} className="relative shadow-2xl shadow-blue-200/50">
                        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" size={28} />
                        <input
                            type="text"
                            name="keyword"
                            placeholder="Ej: 'SUV cómoda, segura para la familia y económica'"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-20 pr-40 py-6 border-2 border-transparent rounded-full focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-xl transition-shadow"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
                            Buscar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;