import React, { useState, useEffect } from 'react';
import { Search, Car, Loader2, CheckCircle, XCircle, ExternalLink, Shield, Zap, Gauge, Wind, ArrowLeft, Wrench, Newspaper, Calendar, Hash, Calculator, GitCompareArrows } from 'lucide-react';
import SearchPage from './components/SearchPage'; // <-- ¡IMPORTANTE! Asegúrate que la ruta sea correcta.

// --- Componente de Logo ---
const Logo = () => (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.reload()}>
        <Car className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-bold text-gray-800 tracking-tight">MiCarroIdeal</span>
    </div>
);

// --- Componente de la Página de Herramientas (Diseño Mejorado) ---
const ToolsPage = () => {
    const [city, setCity] = useState('Bogota');
    const [avalúo, setAvalúo] = useState('');
    const [tax, setTax] = useState(null);
    const picoYPlacaData = { Bogota: { L: '1-2-3-4-5', M: '6-7-8-9-0', X: '1-2-3-4-5', J: '6-7-8-9-0', V: '1-2-3-4-5' }, Medellin: { L: '7-1', M: '8-2', X: '9-3', J: '5-4', V: '6-0' }, Cali: { L: '1-2', M: '3-4', X: '5-6', J: '7-8', V: '9-0' }, };
    const today = new Date().toLocaleString('es-CO', { weekday: 'short' }).toUpperCase().charAt(0);
    const todayDigits = picoYPlacaData[city][today] || 'No aplica';
    const handleTaxCalculation = (e) => { e.preventDefault(); const value = Number(avalúo); if (!value || value <= 0) { setTax(null); return; } let calculatedTax; if (value <= 54057000) { calculatedTax = value * 0.015; } else if (value <= 121635000) { calculatedTax = value * 0.025; } else { calculatedTax = value * 0.035; } setTax(calculatedTax); };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Herramientas del Conductor</h1>
                <p className="mt-4 text-lg text-gray-600">Utilidades para simplificar tu vida en la carretera.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-transform transform hover:-translate-y-2">
                    <div className="flex items-center mb-4"><Calendar className="w-7 h-7 mr-3 text-blue-500" /><h2 className="text-2xl font-bold text-gray-800">Pico y Placa Hoy</h2></div>
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 text-lg focus:ring-2 focus:ring-blue-400">
                        <option value="Bogota">Bogotá</option> <option value="Medellin">Medellín</option> <option value="Cali">Cali</option>
                    </select>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="text-gray-600">Placas terminadas en:</p>
                        <p className="text-5xl font-extrabold text-blue-600">{todayDigits}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-transform transform hover:-translate-y-2">
                    <div className="flex items-center mb-4"><Calculator className="w-7 h-7 mr-3 text-green-500" /><h2 className="text-2xl font-bold text-gray-800">Calculadora de Impuesto</h2></div>
                    <form onSubmit={handleTaxCalculation}>
                        <input type="number" placeholder="Valor del avalúo (ej: 50000000)" value={avalúo} onChange={(e) => setAvalúo(e.target.value)} className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 text-lg focus:ring-2 focus:ring-green-400" />
                        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-md">Calcular</button>
                    </form>
                    {tax !== null && <div className="mt-4 bg-green-50 p-4 rounded-lg text-center"><p className="text-gray-600">Impuesto estimado:</p><p className="text-3xl font-bold text-green-700">${tax.toLocaleString('es-CO')}</p></div>}
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-transform transform hover:-translate-y-2">
                    <div className="flex items-center mb-4"><Hash className="w-7 h-7 mr-3 text-red-500" /><h2 className="text-2xl font-bold text-gray-800">Consulta RUNT</h2></div>
                    <p className="text-gray-600 mb-4">Verifica el historial de un vehículo, multas y más en el sitio oficial del RUNT.</p>
                    <a href="https://www.runt.com.co/consulta-ciudadana/#/consultaVehiculo" target="_blank" rel="noopener noreferrer" className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 flex items-center justify-center transition-all transform hover:scale-105 shadow-md">Ir al RUNT <ExternalLink size={16} className="ml-2"/></a>
                </div>
            </div>
        </main>
    );
};

// --- Componente de la Página del Blog ---
const BlogPage = () => {
    // La lógica se mantiene, solo se mejora el diseño
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState(null);
    
    // Simulación de carga de artículos
    useEffect(() => { 
        const mockArticles = [
            { id: '1', title: 'SUVs vs. Sedanes: ¿Cuál es la Mejor Opción para las Vías Colombianas?', summary: 'Analizamos las ventajas y desventajas de cada categoría para ayudarte a decidir cuál se adapta mejor a tu estilo de vida y a las carreteras del país.', content: 'Cuando se trata de comprar un carro en Colombia, una de las decisiones más grandes es elegir entre un SUV y un sedán...', imageUrl: 'https://images.pexels.com/photos/1637859/pexels-photo-1637859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
            { id: '2', title: 'Top 5: Los Carros Más Vendidos en la Historia de Colombia', summary: 'Un recorrido por los modelos icónicos que han conquistado los corazones y las carreteras de los colombianos.', content: 'Contenido del artículo sobre los carros más vendidos...', imageUrl: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
            { id: '3', title: 'Mantenimiento Básico: 5 Cosas que Debes Revisar Regularmente', summary: 'Aprende a cuidar tu vehículo para prolongar su vida útil y evitar costosas reparaciones. No necesitas ser un experto.', content: 'Contenido del artículo sobre mantenimiento...', imageUrl: 'https://images.pexels.com/photos/4488636/pexels-photo-4488636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        ];
        setTimeout(() => { setArticles(mockArticles); setIsLoading(false); }, 1000); 
    }, []);

    if (selectedArticle) {
        return (
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
                <button onClick={() => setSelectedArticle(null)} className="flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-8 transition-colors"><ArrowLeft className="mr-2" size={20} />Volver al Blog</button>
                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-200">
                    <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-64 md:h-96 object-cover rounded-xl mb-8" />
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tighter">{selectedArticle.title}</h1>
                    <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/### (.*)/g, '<h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">$1</h3>').replace(/\* (.*)/g, '<li class="ml-5 mb-2">$1</li>').replace(/\n\n/g, '<br/><br/>') }} />
                </div>
            </main>
        );
    }
    
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Noticias y Consejos del Motor</h1>
                <p className="mt-4 text-lg text-gray-600">Mantente al día con las últimas novedades y guías prácticas.</p>
            </div>
             {isLoading ? ( <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div> ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map(article => (
                        <div key={article.id} onClick={() => setSelectedArticle(article)} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="overflow-hidden h-52"><img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{article.title}</h2>
                                <p className="text-gray-600 text-sm">{article.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

// --- Componente de la Página del Comparador ---
const ComparatorPage = () => {
    // La lógica se mantiene, solo se mejora el diseño
    const [carDatabase, setCarDatabase] = useState({});
    const [dbLoading, setDbLoading] = useState(true);

    useEffect(() => {
        const fetchCarDatabase = async () => {
            setDbLoading(true);
            try {
                const response = await fetch('/api/vehicles');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setCarDatabase(data);
            } catch (error) {
                console.error("Could not fetch car database:", error);
            } finally {
                setDbLoading(false);
            }
        };
        fetchCarDatabase();
    }, []);

    const initialSlots = [ { id: 1, make: '', model: '', year: '' }, { id: 2, make: '', model: '', year: '' }, { id: 3, make: '', model: '', year: '' }, { id: 4, make: '', model: '', year: '' }, ];
    const [vehicleSlots, setVehicleSlots] = useState(initialSlots);
    const [comparisonResult, setComparisonResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSelectorChange = (id, field, value) => { setVehicleSlots(prevSlots => prevSlots.map(slot => { if (slot.id === id) { const newSlot = { ...slot, [field]: value }; if (field === 'make') { newSlot.model = ''; newSlot.year = ''; } if (field === 'model') { newSlot.year = ''; } return newSlot; } return slot; })); };
    const handleCompare = async () => { const vehiclesToCompare = vehicleSlots.filter(slot => slot.make && slot.model && slot.year); if (vehiclesToCompare.length < 2) { alert("Por favor selecciona al menos dos vehículos para comparar."); return; } setIsLoading(true); setComparisonResult([]); try { const response = await fetch('/api/compare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vehicles: vehicleSlots }), }); if (!response.ok) { throw new Error('Error en la respuesta de la API'); } const data = await response.json(); setComparisonResult(data); } catch (error) { console.error("Error al comparar:", error); } finally { setIsLoading(false); } };
    
    // Este es el componente de la tabla que se usará en la página de comparación
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
                    </tbody>
                </table>
            </div>
        );
    };


    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
             <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Comparador de Vehículos</h1>
                <p className="mt-4 text-lg text-gray-600">Selecciona hasta 4 vehículos de nuestra base de datos para ver sus características lado a lado.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 {vehicleSlots.map(slot => (
                    <div key={slot.id} className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 space-y-4">
                        <h3 className="font-bold text-xl text-center text-gray-700">Vehículo {slot.id}</h3>
                        <select value={slot.make} onChange={(e) => handleSelectorChange(slot.id, 'make', e.target.value)} disabled={dbLoading} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-50 focus:ring-2 focus:ring-blue-400">
                            <option value="">{dbLoading ? "Cargando Marcas..." : "Selecciona Marca"}</option>
                            {Object.keys(carDatabase).map(make => <option key={make} value={make}>{make}</option>)}
                        </select>
                        <select value={slot.model} onChange={(e) => handleSelectorChange(slot.id, 'model', e.target.value)} disabled={!slot.make} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-50 focus:ring-2 focus:ring-blue-400">
                            <option value="">Selecciona Modelo</option>
                            {slot.make && carDatabase[slot.make] && Object.keys(carDatabase[slot.make]).map(model => <option key={model} value={model}>{model}</option>)}
                        </select>
                        <select value={slot.year} onChange={(e) => handleSelectorChange(slot.id, 'year', e.target.value)} disabled={!slot.model} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-50 focus:ring-2 focus:ring-blue-400">
                            <option value="">Selecciona Año</option>
                            {slot.model && carDatabase[slot.make] && carDatabase[slot.make][slot.model] && carDatabase[slot.make][slot.model].map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                ))}
            </div>
            
            <div className="text-center mb-8">
                <button onClick={handleCompare} disabled={isLoading || dbLoading} className="bg-blue-600 text-white font-bold px-10 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl disabled:bg-blue-400 flex items-center justify-center mx-auto text-lg">
                    {isLoading ? <><Loader2 className="w-6 h-6 mr-3 animate-spin" /> Comparando...</> : <><GitCompareArrows className="w-6 h-6 mr-3" /> Comparar Vehículos</>}
                </button>
            </div>
            {comparisonResult.length > 0 && !isLoading && (
                <div className="animate-fade-in">
                    <ComparisonTable cars={comparisonResult.filter(Boolean)} />
                </div>
            )}
        </main>
    );
};

// --- Componente Principal con Navegación ---
function App() {
    const [view, setView] = useState('buscador'); 

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col">
            <header className="bg-white/80 shadow-md sticky top-0 z-40 backdrop-blur-lg">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
                    <Logo />
                    <div className="hidden md:flex items-center space-x-2 bg-gray-100 p-1.5 rounded-full">
                        <button onClick={() => setView('buscador')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${view === 'buscador' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-blue-600'}`}><Search className="w-4 h-4 inline mr-2" />Buscador IA</button>
                        <button onClick={() => setView('comparador')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${view === 'comparador' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-blue-600'}`}><GitCompareArrows className="w-4 h-4 inline mr-2" />Comparador</button>
                        <button onClick={() => setView('herramientas')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${view === 'herramientas' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-blue-600'}`}><Wrench className="w-4 h-4 inline mr-2" />Herramientas</button>
                        <button onClick={() => setView('blog')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${view === 'blog' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-blue-600'}`}><Newspaper className="w-4 h-4 inline mr-2" />Blog</button>
                    </div>
                </nav>
            </header>
            
            <div className="flex-grow">
                {view === 'buscador' && <SearchPage />}
                {view === 'comparador' && <ComparatorPage />}
                {view === 'herramientas' && <ToolsPage />}
                {view === 'blog' && <BlogPage />}
            </div>

            <footer className="w-full text-center p-6 mt-auto bg-gray-100 border-t border-gray-200">
                <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} MiCarroIdeal. Creado con Inteligencia Artificial.</p>
            </footer>
        </div>
    );
}

export default App;

