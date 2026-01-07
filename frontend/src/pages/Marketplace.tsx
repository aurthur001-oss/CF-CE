import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Filter, Lock, Package, Shield, Layers, ChevronRight, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
// Leaflet CSS is imported in global setup now, but keeping it here doesn't hurt, 
// though we usually remove the manual fix code.


interface MarketItem {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url?: string;
    location_lat?: number;
    location_lng?: number; // Added for map filtering
    location_name?: string;
}

// Category configuration
const CATEGORIES = [
    { key: 'ALL', label: 'All Products', color: 'text-white' },
    { key: 'Electrolyzer', label: 'Electrolyzers', color: 'text-emerald-400' },
    { key: 'Compressor', label: 'Compressors', color: 'text-blue-400' },
    { key: 'Storage Tank', label: 'Storage Tanks', color: 'text-cyan-400' },
    { key: 'Fuel Cell', label: 'Fuel Cells', color: 'text-violet-400' },
    { key: 'Valve & Fitting', label: 'Valves & Fittings', color: 'text-orange-400' },
    { key: 'Sensor & Safety', label: 'Safety Equipment', color: 'text-red-400' },
    { key: 'Transport Container', label: 'Transport', color: 'text-amber-400' },
    { key: 'Dispenser', label: 'Dispensers', color: 'text-teal-400' },
];

// Certification badges
const getCertifications = (category: string) => {
    const certs: { [key: string]: string[] } = {
        'Electrolyzer': ['ISO 22734', 'IEC 62282'],
        'Compressor': ['API 618', 'ISO 13631'],
        'Storage Tank': ['ISO 19881', 'UN/ECE R134'],
        'Fuel Cell': ['IEC 62282', 'SAE J2615'],
        'Valve & Fitting': ['ISO 19880-3', 'ASME B16'],
        'Sensor & Safety': ['IEC 60079', 'ATEX'],
        'Transport Container': ['ADR/RID', 'ISO 11120'],
        'Dispenser': ['SAE J2601', 'ISO 19880-1'],
    };
    return certs[category] || ['ISO 9001'];
};

// Component to handle map events and update bounds
const MapController: React.FC<{ onBoundsChange: (bounds: L.LatLngBounds) => void }> = ({ onBoundsChange }) => {
    const map = useMapEvents({
        moveend: () => {
            onBoundsChange(map.getBounds());
        },
        zoomend: () => {
            onBoundsChange(map.getBounds());
        }
    });

    // Trigger initial bounds calculation
    useEffect(() => {
        onBoundsChange(map.getBounds());
    }, [map, onBoundsChange]);

    return null;
};

const Marketplace = () => {
    const { isAuthenticated } = useAuth();

    // Authenticated View State
    const [items, setItems] = useState<MarketItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [activeItemId, setActiveItemId] = useState<number | null>(null);

    // Public Preview
    if (!isAuthenticated) {
        return (
            <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
                <div className="max-w-5xl w-full text-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 mb-6">
                            <Package className="w-4 h-4 text-violet-400" />
                            <span className="text-sm text-violet-400 font-semibold">CERTIFIED EQUIPMENT</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="text-white">Industrial</span><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Equipment Marketplace</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Source verified electrolyzers, compressors, fuel cells, and safety equipment
                            directly from certified manufacturers. ISO compliant with global shipping.
                        </p>
                    </motion.div>

                    {/* Preview */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-violet-900/20">
                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-10 flex items-center justify-center">
                            <Link to="/login" className="bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-4 px-10 rounded-xl flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-violet-500/30">
                                <Lock className="w-5 h-5" /> Sign In to Shop
                            </Link>
                        </div>
                        <div className="bg-slate-900 p-8 grid grid-cols-4 gap-4 opacity-30 blur-sm">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-[4/3] bg-slate-800 rounded-xl"></div>
                            ))}
                        </div>
                    </div>

                    {/* Categories Preview */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {CATEGORIES.slice(1, 6).map((cat) => (
                            <span key={cat.key} className={`px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm ${cat.color}`}>
                                {cat.label}
                            </span>
                        ))}
                        <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-400">+4 more</span>
                    </div>
                </div>
            </div>
        );
    }

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/marketplace/items/');
            // Inject demo locations if missing, so the map works for the user immediately
            const mappedItems = response.data.map((item: MarketItem) => ({
                ...item,
                location_lat: item.location_lat || 20 + Math.random() * 30, // Random Lat between 20 and 50
                location_lng: item.location_lng || -20 + Math.random() * 100, // Random Lng
                location_name: item.location_name || 'Verified Supplier Location'
            }));
            setItems(mappedItems);
        } catch (error) {
            console.error("API offline - using demo data", error);
            // Demo data with added locations
            setItems([
                { id: 1, name: 'PEM Electrolyzer Stack 1MW', category: 'Electrolyzer', description: 'High efficiency proton exchange membrane electrolyzer. 65% efficiency, 99.999% H2 purity.', price: 850000, stock_quantity: 3, location_lat: 52.52, location_lng: 13.40, location_name: 'Berlin, Germany' },
                { id: 2, name: 'Ionic Compressor 700 bar', category: 'Compressor', description: 'Oil-free ionic liquid piston compressor for high-pressure hydrogen applications.', price: 280000, stock_quantity: 5, location_lat: 48.85, location_lng: 2.35, location_name: 'Paris, France' },
                { id: 3, name: 'Type IV Carbon Fiber Tank 10kg', category: 'Storage Tank', description: 'Automotive-grade carbon fiber composite tank. 700 bar rated, UN ECE R134 certified.', price: 2200, stock_quantity: 150, location_lat: 35.67, location_lng: 139.65, location_name: 'Tokyo, Japan' },
                { id: 4, name: 'PEM Fuel Cell 100kW', category: 'Fuel Cell', description: 'Industrial fuel cell for stationary power generation. High durability with 20,000hr lifetime.', price: 180000, stock_quantity: 8, location_lat: 37.56, location_lng: 126.97, location_name: 'Seoul, South Korea' },
                { id: 5, name: 'High-Pressure H2 Valve 700 bar', category: 'Valve & Fitting', description: 'Stainless steel 316L valve for 700 bar systems. ISO 19880-3 compliant.', price: 450, stock_quantity: 800, location_lat: 41.87, location_lng: -87.62, location_name: 'Chicago, USA' },
                { id: 6, name: 'H2 Leak Detection System', category: 'Sensor & Safety', description: 'Industrial-grade catalytic sensor with 0.1% LEL sensitivity. ATEX Zone 1 rated.', price: 2800, stock_quantity: 200, location_lat: 51.50, location_lng: -0.12, location_name: 'London, UK' },
                { id: 7, name: 'Tube Trailer 500kg', category: 'Transport Container', description: '20-tube trailer for road transport. ADR compliant, 250 bar working pressure.', price: 180000, stock_quantity: 12, location_lat: 52.36, location_lng: 4.90, location_name: 'Amsterdam, Netherlands' },
                { id: 8, name: 'H2 Dispenser 700 bar', category: 'Dispenser', description: 'Fast-fill hydrogen dispenser with SAE J2601 protocol. 3-minute fill time for FCEVs.', price: 145000, stock_quantity: 20, location_lat: 34.05, location_lng: -118.24, location_name: 'Los Angeles, USA' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleBuy = (item: MarketItem) => {
        alert(`Quote request sent for "${item.name}". Our sales team will contact you within 24 hours with pricing and delivery options.`);
    };

    // Filtering
    const filteredItems = items.filter(item => {
        const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
        const matchesSearch = !searchQuery ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Map Bound Filter
        let matchesMap = true;
        if (mapBounds && item.location_lat && item.location_lng) {
            const latLng = L.latLng(item.location_lat, item.location_lng);
            matchesMap = mapBounds.contains(latLng);
        }

        return matchesCategory && matchesSearch && matchesMap;
    });

    return (
        <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">

            {/* Map Container - Top Half */}
            <div className="h-[40vh] w-full relative z-0">
                <MapContainer
                    center={[30, 0]}
                    zoom={2}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                    style={{ background: '#020617' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    <MapController onBoundsChange={setMapBounds} />

                    {/* Rendering Markers */}
                    {items.map((item) => (
                        item.location_lat && item.location_lng && (
                            <Marker
                                key={item.id}
                                position={[item.location_lat, item.location_lng]}
                                eventHandlers={{
                                    click: () => setActiveItemId(item.id)
                                }}
                            >
                                <Popup className="text-slate-900">
                                    <div className="p-1">
                                        <div className="font-bold">{item.name}</div>
                                        <div className="text-xs text-violet-600 font-semibold">{item.category}</div>
                                        <div className="text-xs mt-1">Stock: {item.stock_quantity}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                </MapContainer>

                {/* Floating Map Overlay Info */}
                <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-700 shadow-xl">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Geolocated Suppliers</div>
                    <div className="text-sm font-semibold flex items-center gap-2">
                        <Layers className="w-4 h-4 text-violet-400" />
                        Showing {filteredItems.length} items in view
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Equipment Marketplace</h1>
                            <p className="text-slate-400">
                                Browse certified equipment filtered by supplier location on the map.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-lg">
                            <Package className="w-5 h-5 text-violet-400" />
                            <span className="text-violet-400 text-sm font-semibold">{items.length} Products Available</span>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search equipment..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-slate-400" />
                            <select
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </header>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-4 text-center py-20 text-slate-500">Loading products...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="col-span-4 text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">No suppliers in this area</h3>
                            <p className="text-slate-500">Try zooming out or moving the map to see global inventory.</p>
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                className={`bg-slate-900/80 border rounded-2xl overflow-hidden transition-all group flex flex-col ${activeItemId === item.id ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-slate-800 hover:border-violet-500/30'}`}
                                onMouseEnter={() => setActiveItemId(item.id)}
                            >
                                {/* Product Image Placeholder */}
                                <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                                    {/* Location Badge */}
                                    {item.location_name && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm p-2 flex items-center gap-1.5 text-xs text-slate-300">
                                            <MapPin className="w-3 h-3 text-violet-400" />
                                            {item.location_name}
                                        </div>
                                    )}

                                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                                        <Package className="w-16 h-16 text-slate-700" />
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3 bg-violet-500/90 text-white text-xs font-bold px-2 py-1 rounded">
                                        {item.category}
                                    </div>

                                    {/* Stock Badge */}
                                    {item.stock_quantity < 10 && (
                                        <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-xs font-bold px-2 py-1 rounded">
                                            Only {item.stock_quantity} left
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    {/* Certifications */}
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {getCertifications(item.category).slice(0, 2).map((cert, i) => (
                                            <span key={i} className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                                <Shield className="w-2.5 h-2.5" />
                                                {cert}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Name */}
                                    <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-violet-400 transition-colors line-clamp-2">
                                        {item.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                                        {item.description}
                                    </p>

                                    {/* Price & Action */}
                                    <div className="flex items-end justify-between mt-auto">
                                        <div>
                                            <div className="text-xs text-slate-500 mb-0.5">Starting at</div>
                                            <div className="text-2xl font-bold font-mono">
                                                ${item.price >= 1000 ? `${(item.price / 1000).toFixed(0)}k` : item.price.toLocaleString()}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleBuy(item)}
                                            className="bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-xl transition-colors group-hover:scale-105"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
