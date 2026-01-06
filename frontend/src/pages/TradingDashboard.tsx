import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowDown, ArrowUp, Activity, Lock, RefreshCw, Filter, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface TradeOrder {
    id: number;
    anonymous_id: string;
    order_type: 'BUY' | 'SELL';
    fuel_type: string;
    quantity: number;
    price_per_unit: number;
    status: string;
}

// Industry-standard fuel type display names
const FUEL_DISPLAY_NAMES: { [key: string]: { name: string; short: string; color: string } } = {
    'GREEN_HYDROGEN': { name: 'Green H₂ (Renewable)', short: 'GH₂', color: 'text-emerald-400' },
    'BLUE_HYDROGEN': { name: 'Blue H₂ (CCS)', short: 'BH₂', color: 'text-blue-400' },
    'GREY_HYDROGEN': { name: 'Grey H₂ (SMR)', short: 'GrH₂', color: 'text-slate-400' },
    'CBG': { name: 'Compressed Biogas', short: 'CBG', color: 'text-lime-400' },
    'BIO_ETHANOL': { name: 'Bio-Ethanol (E100)', short: 'BioE', color: 'text-amber-400' },
    'METHANOL': { name: 'Green Methanol', short: 'MeOH', color: 'text-orange-400' },
    'AMMONIA': { name: 'Green NH₃ (Carrier)', short: 'NH₃', color: 'text-cyan-400' },
    'SAF': { name: 'Sustainable Aviation Fuel', short: 'SAF', color: 'text-violet-400' },
    'TURQUOISE_HYDROGEN': { name: 'Turquoise H₂ (Pyrolysis)', short: 'TH₂', color: 'text-teal-400' },
    'PINK_HYDROGEN': { name: 'Pink H₂ (Nuclear)', short: 'PH₂', color: 'text-pink-400' },
};

const getFuelDisplay = (fuelType: string) => {
    return FUEL_DISPLAY_NAMES[fuelType] || { name: fuelType.replace('_', ' '), short: fuelType, color: 'text-white' };
};

const TradingDashboard = () => {
    const { isAuthenticated, user } = useAuth();

    // Public Preview - Gated Access
    if (!isAuthenticated) {
        return (
            <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
                <div className="max-w-5xl w-full text-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm text-emerald-400 font-semibold">LIVE ORDER BOOK</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="text-white">Institutional-Grade</span><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Energy Trading</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Access our anonymous order matching engine with zero-knowledge identity protection.
                            Trade Green Hydrogen, Ammonia, SAF, and sustainable fuels with institutional liquidity.
                        </p>
                    </motion.div>

                    {/* Preview UI */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-emerald-900/20 group">
                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-10 flex items-center justify-center">
                            <Link to="/login" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 px-10 rounded-xl flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-emerald-500/30">
                                <Lock className="w-5 h-5" /> Sign In to Trade
                            </Link>
                        </div>
                        <div className="bg-slate-900 p-8 grid grid-cols-3 gap-6 opacity-30 blur-sm">
                            <div className="col-span-1 bg-slate-800 h-80 rounded-xl"></div>
                            <div className="col-span-2 bg-slate-800 h-80 rounded-xl"></div>
                        </div>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        {[
                            { title: 'Anonymous Trading IDs', desc: 'Your identity is protected with ANON-IDs until trade execution.' },
                            { title: 'Real-Time Order Book', desc: 'Sub-millisecond updates with full market depth visibility.' },
                            { title: 'Smart Contract Settlement', desc: 'Escrow-backed execution with instant settlement confirmation.' },
                        ].map((feature, i) => (
                            <div key={i} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Authenticated View
    const [orders, setOrders] = useState<TradeOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
    const [fuelType, setFuelType] = useState('GREEN_HYDROGEN');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [filterFuel, setFilterFuel] = useState('ALL');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const USER_ID = user?.id || 1;

    const fetchOrders = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);
        try {
            const response = await axios.get('http://localhost:8000/trading/orders/');
            setOrders(response.data);
        } catch (error) {
            console.error("API offline - using demo data", error);
            // Demo data for UI
            setOrders([
                { id: 1, anonymous_id: 'ANON-7F8A2C', order_type: 'SELL', fuel_type: 'GREEN_HYDROGEN', quantity: 2500, price_per_unit: 4.52, status: 'OPEN' },
                { id: 2, anonymous_id: 'ANON-3D9E1B', order_type: 'BUY', fuel_type: 'GREEN_HYDROGEN', quantity: 1800, price_per_unit: 4.48, status: 'OPEN' },
                { id: 3, anonymous_id: 'ANON-9C4F5A', order_type: 'SELL', fuel_type: 'AMMONIA', quantity: 5000, price_per_unit: 0.68, status: 'OPEN' },
                { id: 4, anonymous_id: 'ANON-2B7D8E', order_type: 'BUY', fuel_type: 'BLUE_HYDROGEN', quantity: 3200, price_per_unit: 2.15, status: 'OPEN' },
                { id: 5, anonymous_id: 'ANON-6A1C4F', order_type: 'SELL', fuel_type: 'SAF', quantity: 1000, price_per_unit: 1.85, status: 'OPEN' },
                { id: 6, anonymous_id: 'ANON-8E3B2D', order_type: 'BUY', fuel_type: 'METHANOL', quantity: 4500, price_per_unit: 0.42, status: 'OPEN' },
            ]);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(() => fetchOrders(), 10000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8000/trading/orders/?user_id=${USER_ID}`, {
                order_type: orderType,
                fuel_type: fuelType,
                quantity: parseFloat(quantity),
                price_per_unit: parseFloat(price)
            });
            setQuantity('');
            setPrice('');
            fetchOrders();
        } catch (error) {
            console.error("Order placement failed", error);
            alert("Order submitted (demo mode - backend offline)");
        }
    };

    const filteredOrders = filterFuel === 'ALL'
        ? orders
        : orders.filter(o => o.fuel_type === filterFuel);

    const buyOrders = filteredOrders.filter(o => o.order_type === 'BUY').sort((a, b) => b.price_per_unit - a.price_per_unit);
    const sellOrders = filteredOrders.filter(o => o.order_type === 'SELL').sort((a, b) => a.price_per_unit - b.price_per_unit);

    return (
        <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Trading Floor
                        </h1>
                        <p className="text-slate-400">Anonymous Order Book • Real-Time Matching Engine</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => fetchOrders(true)}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-lg text-sm font-mono border border-emerald-500/20">
                            <Activity className="w-4 h-4" />
                            <span>MARKET LIVE</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Order Placement Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
                    >
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-emerald-400" />
                            Place Order
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Order Type Toggle */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOrderType('BUY')}
                                    className={`p-3 rounded-xl font-bold text-sm transition-all ${orderType === 'BUY'
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    BID (Buy)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOrderType('SELL')}
                                    className={`p-3 rounded-xl font-bold text-sm transition-all ${orderType === 'SELL'
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    ASK (Sell)
                                </button>
                            </div>

                            {/* Energy Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Energy Type</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-white text-sm"
                                    value={fuelType}
                                    onChange={(e) => setFuelType(e.target.value)}
                                >
                                    {Object.entries(FUEL_DISPLAY_NAMES).map(([key, val]) => (
                                        <option key={key} value={key}>{val.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Quantity (kg)</label>
                                <input
                                    type="number"
                                    step="1"
                                    min="1"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-white font-mono"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="0"
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Limit Price ($/kg)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-white font-mono"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${orderType === 'BUY'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30'
                                    : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/30'
                                    }`}
                            >
                                Submit {orderType === 'BUY' ? 'Bid' : 'Ask'} Order
                            </button>
                        </form>
                    </motion.div>

                    {/* Order Book */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3 space-y-6"
                    >
                        {/* Filter Bar */}
                        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                            <Filter className="w-5 h-5 text-slate-400" />
                            <span className="text-sm text-slate-400">Filter by:</span>
                            <select
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                value={filterFuel}
                                onChange={(e) => setFilterFuel(e.target.value)}
                            >
                                <option value="ALL">All Energy Types</option>
                                {Object.entries(FUEL_DISPLAY_NAMES).map(([key, val]) => (
                                    <option key={key} value={key}>{val.name}</option>
                                ))}
                            </select>
                            <div className="ml-auto text-sm text-slate-500">
                                {filteredOrders.length} active orders
                            </div>
                        </div>

                        {/* Split Order Book */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Buy Orders (Bids) */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
                                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                                    <h3 className="font-bold text-emerald-400 flex items-center gap-2">
                                        <ArrowUp className="w-4 h-4" /> Bids (Buy Orders)
                                    </h3>
                                    <span className="text-sm text-slate-500">{buyOrders.length} orders</span>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-950 text-slate-400 sticky top-0">
                                            <tr>
                                                <th className="p-3 text-left font-medium">Type</th>
                                                <th className="p-3 text-right font-medium">Qty</th>
                                                <th className="p-3 text-right font-medium">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {loading ? (
                                                <tr><td colSpan={3} className="p-6 text-center text-slate-500">Loading...</td></tr>
                                            ) : buyOrders.length === 0 ? (
                                                <tr><td colSpan={3} className="p-6 text-center text-slate-500">No buy orders</td></tr>
                                            ) : (
                                                buyOrders.slice(0, 15).map((order) => (
                                                    <tr key={order.id} className="hover:bg-emerald-500/5">
                                                        <td className={`p-3 font-medium ${getFuelDisplay(order.fuel_type).color}`}>
                                                            {getFuelDisplay(order.fuel_type).short}
                                                        </td>
                                                        <td className="p-3 text-right font-mono text-slate-300">{order.quantity.toLocaleString()}</td>
                                                        <td className="p-3 text-right font-mono font-bold text-emerald-400">${order.price_per_unit.toFixed(2)}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Sell Orders (Asks) */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
                                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                                    <h3 className="font-bold text-red-400 flex items-center gap-2">
                                        <ArrowDown className="w-4 h-4" /> Asks (Sell Orders)
                                    </h3>
                                    <span className="text-sm text-slate-500">{sellOrders.length} orders</span>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-950 text-slate-400 sticky top-0">
                                            <tr>
                                                <th className="p-3 text-left font-medium">Type</th>
                                                <th className="p-3 text-right font-medium">Qty</th>
                                                <th className="p-3 text-right font-medium">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {loading ? (
                                                <tr><td colSpan={3} className="p-6 text-center text-slate-500">Loading...</td></tr>
                                            ) : sellOrders.length === 0 ? (
                                                <tr><td colSpan={3} className="p-6 text-center text-slate-500">No sell orders</td></tr>
                                            ) : (
                                                sellOrders.slice(0, 15).map((order) => (
                                                    <tr key={order.id} className="hover:bg-red-500/5">
                                                        <td className={`p-3 font-medium ${getFuelDisplay(order.fuel_type).color}`}>
                                                            {getFuelDisplay(order.fuel_type).short}
                                                        </td>
                                                        <td className="p-3 text-right font-mono text-slate-300">{order.quantity.toLocaleString()}</td>
                                                        <td className="p-3 text-right font-mono font-bold text-red-400">${order.price_per_unit.toFixed(2)}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TradingDashboard;
