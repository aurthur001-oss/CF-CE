import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Filter, Lock, Shield, Tag, Package, Star, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface MarketItem {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url?: string;
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

const Marketplace = () => {
    const { isAuthenticated } = useAuth();

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

    // Authenticated View
    const [items, setItems] = useState<MarketItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/marketplace/items/');
            setItems(response.data);
        } catch (error) {
            console.error("API offline - using demo data", error);
            // Demo data
            setItems([
                { id: 1, name: 'PEM Electrolyzer Stack 1MW', category: 'Electrolyzer', description: 'High efficiency proton exchange membrane electrolyzer. 65% efficiency, 99.999% H2 purity.', price: 850000, stock_quantity: 3 },
                { id: 2, name: 'Ionic Compressor 700 bar', category: 'Compressor', description: 'Oil-free ionic liquid piston compressor for high-pressure hydrogen applications.', price: 280000, stock_quantity: 5 },
                { id: 3, name: 'Type IV Carbon Fiber Tank 10kg', category: 'Storage Tank', description: 'Automotive-grade carbon fiber composite tank. 700 bar rated, UN ECE R134 certified.', price: 2200, stock_quantity: 150 },
                { id: 4, name: 'PEM Fuel Cell 100kW', category: 'Fuel Cell', description: 'Industrial fuel cell for stationary power generation. High durability with 20,000hr lifetime.', price: 180000, stock_quantity: 8 },
                { id: 5, name: 'High-Pressure H2 Valve 700 bar', category: 'Valve & Fitting', description: 'Stainless steel 316L valve for 700 bar systems. ISO 19880-3 compliant.', price: 450, stock_quantity: 800 },
                { id: 6, name: 'H2 Leak Detection System', category: 'Sensor & Safety', description: 'Industrial-grade catalytic sensor with 0.1% LEL sensitivity. ATEX Zone 1 rated.', price: 2800, stock_quantity: 200 },
                { id: 7, name: 'Tube Trailer 500kg', category: 'Transport Container', description: '20-tube trailer for road transport. ADR compliant, 250 bar working pressure.', price: 180000, stock_quantity: 12 },
                { id: 8, name: 'H2 Dispenser 700 bar', category: 'Dispenser', description: 'Fast-fill hydrogen dispenser with SAE J2601 protocol. 3-minute fill time for FCEVs.', price: 145000, stock_quantity: 20 },
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
    let filteredItems = items;
    if (filterCategory !== 'ALL') {
        filteredItems = filteredItems.filter(item => item.category === filterCategory);
    }
    if (searchQuery) {
        filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Equipment Marketplace</h1>
                            <p className="text-slate-400">
                                Source verified industrial equipment from certified manufacturers
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
                        <div className="col-span-4 text-center py-20 text-slate-500">No products found matching your criteria</div>
                    ) : (
                        filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all group flex flex-col"
                            >
                                {/* Product Image Placeholder */}
                                <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
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
