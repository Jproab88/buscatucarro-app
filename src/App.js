import React, { useState, useEffect } from 'react';
import { Search, Car, Loader2, CheckCircle, XCircle, ExternalLink, Shield, Zap, Gauge, Wind, ArrowLeft, Wrench, Newspaper, Calendar, Hash, Calculator, GitCompareArrows } from 'lucide-react';

// --- Base de Datos de Vehículos para los Desplegables ---
// En una app real, esto vendría de una base de datos.
const carDatabase = {
    "Toyota": {
        "Corolla": ["2023", "2022", "2021"],
        "RAV4": ["2023", "2022", "2021"],
        "Hilux": ["2024", "2023", "2022"],
    },
    "Mazda": {
        "3": ["2024", "2023", "2022"],
        "CX-5": ["2024", "2023", "2022"],
        "2": ["2023", "2022", "2021"],
    },
    "Chevrolet": {
        "Onix": ["2024", "2023", "2022"],
        "Tracker": ["2024", "2023", "2022"],
        "D-Max": ["2023", "2022", "2021"],
    },
    "Renault": {
        "Duster": ["2024", "2023", "2022"],
        "Kwid": ["2023", "2022", "2021"],
        "Stepway": ["2023", "2022", "2021"],
    },
    "Kia": {
        "Sportage": ["2023", "2022", "2021"],
        "Picanto": ["2024", "2023", "2022"],
        "Rio": ["2023", "2022", "2021"],
    }
};

// --- Datos de Ejemplo para el Blog (mientras no conectamos la DB) ---
const mockArticles = [
    { id: '1', title: 'SUVs vs. Sedanes: ¿Cuál es la Mejor Opción para las Vías Colombianas?', summary: 'Analizamos las ventajas y desventajas de cada categoría para ayudarte a decidir cuál se adapta mejor a tu estilo de vida y a las carreteras del país.', content: 'Cuando se trata de comprar un carro en Colombia, una de las decisiones más grandes es elegir entre un SUV y un sedán...', imageUrl: 'https://images.pexels.com/photos/1637859/pexels-photo-1637859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '2', title: 'Top 5: Los Carros Más Vendidos en la Historia de Colombia', summary: 'Un recorrido por los modelos icónicos que han conquistado los corazones y las carreteras de los colombianos.', content: 'Contenido del artículo sobre los carros más vendidos...', imageUrl: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

// --- Componente de Logo ---
const Logo = () => ( <div className="flex items-center space-x-2"><Car className="h-8 w-8 text-indigo-600 dark:text-indigo-400" /><span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">MiCarroIdeal IA</span></div> );

// --- Componente de la Página de Búsqueda ---
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

    if (!hasSearched && !isLoading) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Tu Próximo Carro, <span className="text-indigo-600">Más Cerca.</span></h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg mx-auto my-6">Describe el carro que necesitas y te traeremos las mejores 5 opciones del mercado en una tabla comparativa.</p>
                <div className="w-full max-w-2xl">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                        <input type="text" name="keyword" placeholder="Ej: 'SUV familiar y segura para viajar'" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-14 pr-32 py-4 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-white text-lg shadow-lg" />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-md">Buscar</button>
                    </form>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="mt-4 text-slate-500">Analizando el mercado para ti...</p>
            </div>
        );
    }
    
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => { setHasSearched(false); setCars([]); setSearchInput(''); }} className="flex items-center text-indigo-600 hover:underline font-semibold"><ArrowLeft className="mr-2" size={20} />Nueva Búsqueda</button>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">Aquí tienes tu comparativa:</h2>
                <div className="w-40"></div>
            </div>
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
    );
};

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
        <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
            <table className="min-w-full border-collapse table-fixed">
                <colgroup>
                    <col className="w-48" />
                    {cars.map(car => <col key={car.id} className="w-56" />)}
                </colgroup>
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                        <th className="sticky left-0 bg-slate-50 dark:bg-slate-800 p-4 font-semibold text-slate-700 dark:text-slate-200 text-left">Vehículo</th>
                        {cars.map(car => (
                            <th key={car.id} className="p-4 font-semibold text-slate-700 dark:text-slate-200 border-l border-slate-200 dark:border-slate-700">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-48 h-28 rounded-md mb-2 overflow-hidden relative bg-slate-200 dark:bg-slate-700">
                                        <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="absolute top-0 left-0 w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x200/334155/ffffff?text=Imagen`; }}/>
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
                        <tr key={feature.key}>
                            <td className="sticky left-0 bg-white dark:bg-slate-800/50 p-4 font-medium text-slate-800 dark:text-slate-300 align-top"><div className="flex items-center"><feature.icon className={`w-5 h-5 mr-2 ${feature.color} flex-shrink-0`} />{feature.label}</div></td>
                            {cars.map(car => (<td key={car.id} className="p-4 text-slate-600 dark:text-slate-400 align-top border-l border-slate-200 dark:border-slate-700 text-sm">{Array.isArray(car[feature.key]) ? (<ul className="space-y-1.5">{car[feature.key].map((item, i) => <li key={i}>{item}</li>)}</ul>) : (<span>{car[feature.key]}</span>)}</td>))}
                        </tr>
                    ))}
                    <tr>
                        <td className="sticky left-0 bg-white dark:bg-slate-800/50 p-4 font-medium text-slate-800 dark:text-slate-300 align-top">Comprar</td>
                        {cars.map(car => (<td key={car.id} className="p-4 align-middle border-l border-slate-200 dark:border-slate-700"><a href={car.mercadoLibreUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-yellow-400 text-slate-900 font-bold py-2 px-3 rounded-lg hover:bg-yellow-500 transition-colors text-sm flex items-center justify-center">Mercado Libre <ExternalLink size={14} className="ml-1.5"/></a></td>))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

// --- Componente de la Página de Herramientas ---
const ToolsPage = () => {
    const [city, setCity] = useState('Bogota');
    const [avalúo, setAvalúo] = useState('');
    const [tax, setTax] = useState(null);

    const picoYPlacaData = {
        Bogota: { L: '1-2-3-4-5', M: '6-7-8-9-0', X: '1-2-3-4-5', J: '6-7-8-9-0', V: '1-2-3-4-5' },
        Medellin: { L: '7-1', M: '8-2', X: '9-3', J: '5-4', V: '6-0' },
        Cali: { L: '1-2', M: '3-4', X: '5-6', J: '7-8', V: '9-0' },
    };
    const today = new Date().toLocaleString('es-CO', { weekday: 'short' }).toUpperCase().charAt(0);
    const todayDigits = picoYPlacaData[city][today] || 'No aplica';

    const handleTaxCalculation = (e) => {
        e.preventDefault();
        const value = Number(avalúo);
        if (!value || value <= 0) {
            setTax(null);
            return;
        }
        let calculatedTax;
        if (value <= 54057000) {
            calculatedTax = value * 0.015;
        } else if (value <= 121635000) {
            calculatedTax = value * 0.025;
        } else {
            calculatedTax = value * 0.035;
        }
        setTax(calculatedTax);
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Herramientas para Conductores</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Pico y Placa */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4"><Calendar className="w-6 h-6 mr-3 text-indigo-500" /><h2 className="text-xl font-bold">Pico y Placa Hoy</h2></div>
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-2 mb-4 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700">
                        <option value="Bogota">Bogotá</option>
                        <option value="Medellin">Medellín</option>
                        <option value="Cali">Cali</option>
                    </select>
                    <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-md text-center">
                        <p className="text-slate-600 dark:text-slate-300">Placas terminadas en:</p>
                        <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{todayDigits}</p>
                    </div>
                </div>
                {/* Calculadora de Impuestos */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4"><Calculator className="w-6 h-6 mr-3 text-indigo-500" /><h2 className="text-xl font-bold">Calculadora de Impuesto</h2></div>
                    <form onSubmit={handleTaxCalculation}>
                        <input type="number" placeholder="Valor del avalúo (ej: 50000000)" value={avalúo} onChange={(e) => setAvalúo(e.target.value)} className="w-full p-2 mb-4 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700" />
                        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-700">Calcular</button>
                    </form>
                    {tax !== null && <div className="mt-4 bg-slate-100 dark:bg-slate-700 p-4 rounded-md text-center"><p className="text-slate-600 dark:text-slate-300">Impuesto estimado:</p><p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${tax.toLocaleString('es-CO')}</p></div>}
                </div>
                {/* Consulta RUNT */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4"><Hash className="w-6 h-6 mr-3 text-indigo-500" /><h2 className="text-xl font-bold">Consulta RUNT</h2></div>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">Verifica el historial de un vehículo, multas y más en el sitio oficial del RUNT.</p>
                    <a href="https://www.runt.com.co/consulta-ciudadana/#/consultaVehiculo" target="_blank" rel="noopener noreferrer" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 flex items-center justify-center">Ir al RUNT <ExternalLink size={16} className="ml-2"/></a>
                </div>
            </div>
        </main>
    );
};

// --- Componente de la Página del Blog ---
const BlogPage = () => {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setArticles(mockArticles);
            setIsLoading(false);
        }, 1000);
    }, []);

    if (selectedArticle) {
        return (
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={() => setSelectedArticle(null)} className="flex items-center text-indigo-600 hover:underline font-semibold mb-6"><ArrowLeft className="mr-2" size={20} />Volver al Blog</button>
                <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-lg shadow-md">
                    <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-64 md:h-96 object-cover rounded-lg mb-6" />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{selectedArticle.title}</h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/### (.*)/g, '<h3>$1</h3>').replace(/\* (.*)/g, '<li>$1</li>').replace(/\n\n/g, '<br/><br/>') }} />
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Blog de Noticias y Consejos</h1>
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-indigo-500 animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map(article => (
                        <div key={article.id} onClick={() => setSelectedArticle(article)} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden cursor-pointer group">
                            <div className="overflow-hidden h-48"><img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{article.title}</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{article.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

// --- NUEVO Componente de la Página del Comparador ---
const ComparatorPage = () => {
    const initialSlots = [
        { id: 1, make: '', model: '', year: '' },
        { id: 2, make: '', model: '', year: '' },
        { id: 3, make: '', model: '', year: '' },
        { id: 4, make: '', model: '', year: '' },
    ];
    const [vehicleSlots, setVehicleSlots] = useState(initialSlots);
    const [comparisonResult, setComparisonResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectorChange = (id, field, value) => {
        setVehicleSlots(prevSlots => prevSlots.map(slot => {
            if (slot.id === id) {
                const newSlot = { ...slot, [field]: value };
                if (field === 'make') { newSlot.model = ''; newSlot.year = ''; }
                if (field === 'model') { newSlot.year = ''; }
                return newSlot;
            }
            return slot;
        }));
    };

    const handleCompare = async () => {
        const vehiclesToCompare = vehicleSlots.filter(slot => slot.make && slot.model && slot.year);
        if (vehiclesToCompare.length < 2) {
            alert("Por favor selecciona al menos dos vehículos para comparar.");
            return;
        }
        setIsLoading(true);
        setComparisonResult([]);
        try {
            const response = await fetch('/api/compare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vehicles: vehicleSlots }),
            });
            if (!response.ok) { throw new Error('Error en la respuesta de la API'); }
            const data = await response.json();
            setComparisonResult(data);
        } catch (error) {
            console.error("Error al comparar:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const features = [
        { key: 'pros', label: 'Pros', icon: CheckCircle, color: 'text-green-500' },
        { key: 'cons', label: 'Contras', icon: XCircle, color: 'text-red-500' },
        { key: 'airbags', label: 'Seguridad', icon: Shield, color: 'text-blue-500' },
        { key: 'horsepower', label: 'Potencia', icon: Zap, color: 'text-yellow-500' },
        { key: 'topSpeed', label: 'Vel. Máxima', icon: Wind, color: 'text-cyan-500' },
        { key: 'fuelEfficiency', label: 'Consumo', icon: Gauge, color: 'text-orange-500' },
    ];

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">Comparador de Vehículos</h1>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-8">Selecciona hasta 4 vehículos para ver sus características lado a lado.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {vehicleSlots.map(slot => (
                    <div key={slot.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md space-y-3">
                        <h3 className="font-bold text-lg text-center">Vehículo {slot.id}</h3>
                        <select value={slot.make} onChange={(e) => handleSelectorChange(slot.id, 'make', e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700">
                            <option value="">Selecciona Marca</option>
                            {Object.keys(carDatabase).map(make => <option key={make} value={make}>{make}</option>)}
                        </select>
                        <select value={slot.model} onChange={(e) => handleSelectorChange(slot.id, 'model', e.target.value)} disabled={!slot.make} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 disabled:opacity-50">
                            <option value="">Selecciona Modelo</option>
                            {slot.make && Object.keys(carDatabase[slot.make]).map(model => <option key={model} value={model}>{model}</option>)}
                        </select>
                        <select value={slot.year} onChange={(e) => handleSelectorChange(slot.id, 'year', e.target.value)} disabled={!slot.model} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 disabled:opacity-50">
                            <option value="">Selecciona Año</option>
                            {slot.model && carDatabase[slot.make][slot.model].map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                ))}
            </div>

            <div className="text-center mb-8">
                <button onClick={handleCompare} disabled={isLoading} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full hover:bg-indigo-700 transition-colors shadow-lg disabled:bg-indigo-400 flex items-center justify-center mx-auto">
                    {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Comparando...</> : <><GitCompareArrows className="w-5 h-5 mr-2" /> Comparar</>}
                </button>
            </div>

            {comparisonResult.length > 0 && !isLoading && (
                 <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                    <table className="min-w-full border-collapse table-fixed">
                        <colgroup>
                            <col className="w-48" />
                            {comparisonResult.map((car, index) => <col key={index} className="w-56" />)}
                        </colgroup>
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800">
                                <th className="sticky left-0 bg-slate-50 dark:bg-slate-800 p-4 font-semibold text-slate-700 dark:text-slate-200 text-left">Vehículo</th>
                                {comparisonResult.map((car, index) => (
                                    <th key={index} className="p-4 font-semibold text-slate-700 dark:text-slate-200 border-l border-slate-200 dark:border-slate-700">
                                        {car ? (
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-48 h-28 rounded-md mb-2 overflow-hidden relative bg-slate-200 dark:bg-slate-700">
                                                    <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="absolute top-0 left-0 w-full h-full object-cover" />
                                                </div>
                                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{car.make}</span>
                                                <span>{`${car.model} ${car.year}`}</span>
                                            </div>
                                        ) : <div className="h-44"></div>}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {features.map(feature => (
                                <tr key={feature.key}>
                                    <td className="sticky left-0 bg-white dark:bg-slate-800/50 p-4 font-medium text-slate-800 dark:text-slate-300 align-top"><div className="flex items-center"><feature.icon className={`w-5 h-5 mr-2 ${feature.color} flex-shrink-0`} />{feature.label}</div></td>
                                    {comparisonResult.map((car, index) => (<td key={index} className="p-4 text-slate-600 dark:text-slate-400 align-top border-l border-slate-200 dark:border-slate-700 text-sm">{car && (Array.isArray(car[feature.key]) ? (<ul className="space-y-1.5">{car[feature.key].map((item, i) => <li key={i}>{item}</li>)}</ul>) : (<span>{car[feature.key]}</span>))}</td>))}
                                </tr>
                            ))}
                            <tr>
                                <td className="sticky left-0 bg-white dark:bg-slate-800/50 p-4 font-medium text-slate-800 dark:text-slate-300 align-top">Comprar</td>
                                {comparisonResult.map((car, index) => (<td key={index} className="p-4 align-middle border-l border-slate-200 dark:border-slate-700">{car && <a href={car.mercadoLibreUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-yellow-400 text-slate-900 font-bold py-2 px-3 rounded-lg hover:bg-yellow-500 transition-colors text-sm flex items-center justify-center">Mercado Libre <ExternalLink size={14} className="ml-1.5"/></a>}</td>))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
};


// --- Componente Principal con Navegación ---
function App() {
    const [view, setView] = useState('buscador'); // 'buscador', 'herramientas', 'blog', o 'comparador'

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200 flex flex-col">
            <header className="bg-white/80 dark:bg-slate-900/80 shadow-sm sticky top-0 z-40 backdrop-blur-lg">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <Logo />
                    <div className="flex items-center space-x-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-full">
                        <button onClick={() => setView('buscador')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${view === 'buscador' ? 'bg-white dark:bg-slate-700 text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}><Search className="w-4 h-4 inline mr-1.5" />Buscador</button>
                        <button onClick={() => setView('comparador')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${view === 'comparador' ? 'bg-white dark:bg-slate-700 text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}><GitCompareArrows className="w-4 h-4 inline mr-1.5" />Comparador</button>
                        <button onClick={() => setView('herramientas')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${view === 'herramientas' ? 'bg-white dark:bg-slate-700 text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}><Wrench className="w-4 h-4 inline mr-1.5" />Herramientas</button>
                        <button onClick={() => setView('blog')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${view === 'blog' ? 'bg-white dark:bg-slate-700 text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}><Newspaper className="w-4 h-4 inline mr-1.5" />Blog</button>
                    </div>
                </nav>
            </header>
            
            {view === 'buscador' && <SearchPage />}
            {view === 'comparador' && <ComparatorPage />}
            {view === 'herramientas' && <ToolsPage />}
            {view === 'blog' && <BlogPage />}

            <footer className="w-full text-center p-4 mt-auto">
                <p className="text-sm text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} MiCarroIdeal IA. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}

export default App;