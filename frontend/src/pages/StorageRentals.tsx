import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Warehouse, MapPin, Calendar, Lock, Globe, Shield, Filter, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface StorageListing {
    id: number;
    facility_id: number;
    capacity_available: number;
    price_per_day: number;
    min_duration_days: number;
    facility?: {
        name: string;
        location_address: string;
        location_lat?: number;
        location_lng?: number;
        type: string;
    };
}

// Static map component (no API needed)
const LocationMap: React.FC<{ lat?: number; lng?: number; name: string }> = ({ lat, lng, name }) => {
    if (!lat || !lng) return null;

    // Calculate position on a simple grid map
    const xPos = ((lng + 180) / 360) * 100;
    const yPos = ((90 - lat) / 180) * 100;

    return (
        <div className="relative w-full h-32 bg-slate-800 rounded-lg overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20% 20%'
                }}></div>
            </div>

            {/* Location Marker */}
            <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${Math.min(Math.max(xPos, 10), 90)}%`, top: `${Math.min(Math.max(yPos, 20), 80)}%` }}
            >
                <div className="relative">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse"></div>
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-emerald-500/30 rounded-full animate-ping"></div>
                </div>
            </div>

            {/* Coordinates Display */}
            <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-1 rounded text-xs font-mono text-slate-400">
                {lat.toFixed(2)}°N, {lng.toFixed(2)}°E
            </div>

            {/* Region Label */}
            <div className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-semibold">
                <Globe className="w-3 h-3 inline mr-1" />
                {name.split(',')[0]}
            </div>
        </div>
    );
};

const StorageRentals = () => {
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
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-blue-400 font-semibold">CERTIFIED FACILITIES</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="text-white">Global Storage</span><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Network</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Access 500+ certified hydrogen and clean fuel storage facilities worldwide.
                            Real-time availability, transparent pricing, and instant booking.
                        </p>
                    </motion.div>

                    {/* Preview */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-blue-900/20">
                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-10 flex items-center justify-center">
                            <Link to="/login" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 px-10 rounded-xl flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-blue-500/30">
                                <Lock className="w-5 h-5" /> Sign In to Book
                            </Link>
                        </div>
                        <div className="bg-slate-900 p-8 grid grid-cols-3 gap-6 opacity-30 blur-sm">
                            <div className="h-64 bg-slate-800 rounded-xl"></div>
                            <div className="h-64 bg-slate-800 rounded-xl"></div>
                            <div className="h-64 bg-slate-800 rounded-xl"></div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 text-center">
                        {[
                            { value: '500+', label: 'Verified Facilities' },
                            { value: '25M', label: 'kg Capacity' },
                            { value: '47', label: 'Countries' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-1">{stat.value}</div>
                                <div className="text-slate-500 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Authenticated View
    const [listings, setListings] = useState<StorageListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRegion, setFilterRegion] = useState('ALL');

    const fetchListings = async () => {
        try {
            const response = await axios.get('http://localhost:8000/storage/listings/');
            setListings(response.data);
        } catch (error) {
            console.error("API offline - using demo data", error);
            // Demo data
            setListings([
                {
                    id: 1, facility_id: 101, capacity_available: 5000, price_per_day: 150, min_duration_days: 7,
                    facility: { name: 'Gujarat Hydrogen Hub', location_address: 'Ahmedabad, Gujarat', location_lat: 23.02, location_lng: 72.57, type: 'Underground Cavern' }
                },
                {
                    id: 2, facility_id: 102, capacity_available: 12000, price_per_day: 280, min_duration_days: 14,
                    facility: { name: 'Mundra Port Terminal', location_address: 'Mundra, Gujarat', location_lat: 22.84, location_lng: 69.71, type: 'Cryogenic Tank' }
                },
                {
                    id: 3, facility_id: 103, capacity_available: 3500, price_per_day: 95, min_duration_days: 3,
                    facility: { name: 'Neom Green Storage', location_address: 'Tabuk, Saudi Arabia', location_lat: 28.0, location_lng: 35.5, type: 'Pressure Vessel' }
                },
                {
                    id: 4, facility_id: 104, capacity_available: 8000, price_per_day: 220, min_duration_days: 7,
                    facility: { name: 'Rotterdam H2 Hub', location_address: 'Rotterdam, Netherlands', location_lat: 51.92, location_lng: 4.48, type: 'Salt Cavern' }
                },
                {
                    id: 5, facility_id: 105, capacity_available: 6500, price_per_day: 185, min_duration_days: 5,
                    facility: { name: 'Tokyo Bay Terminal', location_address: 'Yokohama, Japan', location_lat: 35.44, location_lng: 139.64, type: 'LH2 Tank' }
                },
                {
                    id: 6, facility_id: 106, capacity_available: 15000, price_per_day: 350, min_duration_days: 30,
                    facility: { name: 'Houston Energy Complex', location_address: 'Houston, Texas', location_lat: 29.76, location_lng: -95.37, type: 'Underground Storage' }
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleBook = (id: number) => {
        alert(`Booking request initiated for Facility #${id}. Our team will contact you within 24 hours.`);
    };

    const regions = ['ALL', ...new Set(listings.map(l => l.facility?.location_address?.split(',').pop()?.trim() || 'Unknown'))];
    const filteredListings = filterRegion === 'ALL' ? listings : listings.filter(l => l.facility?.location_address?.includes(filterRegion));

    return (
        <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Storage Network</h1>
                            <p className="text-slate-400">
                                Find and book certified clean energy storage facilities worldwide
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-400 text-sm font-semibold">{listings.length} Facilities Available</span>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                        <Filter className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-400">Region:</span>
                        <select
                            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            value={filterRegion}
                            onChange={(e) => setFilterRegion(e.target.value)}
                        >
                            {regions.map(r => (
                                <option key={r} value={r}>{r === 'ALL' ? 'All Regions' : r}</option>
                            ))}
                        </select>
                    </div>
                </header>

                {/* Listings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-3 text-center py-20 text-slate-500">Loading facilities...</div>
                    ) : (
                        filteredListings.map((listing) => (
                            <motion.div
                                key={listing.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group"
                            >
                                {/* Location Map */}
                                <LocationMap
                                    lat={listing.facility?.location_lat}
                                    lng={listing.facility?.location_lng}
                                    name={listing.facility?.location_address || 'Unknown'}
                                />

                                <div className="p-6">
                                    {/* Facility Type Badge */}
                                    <div className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 text-xs font-semibold px-2 py-1 rounded mb-3">
                                        <Warehouse className="w-3 h-3" />
                                        {listing.facility?.type || 'Storage Facility'}
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                        {listing.facility?.name || `Facility #${listing.facility_id}`}
                                    </h3>

                                    {/* Location */}
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-5">
                                        <MapPin className="w-4 h-4" />
                                        {listing.facility?.location_address || 'Location Confidential'}
                                    </div>

                                    {/* Specs Grid */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                                            <div className="text-xs text-slate-500 mb-1">Capacity</div>
                                            <div className="font-mono font-bold text-white">
                                                {listing.capacity_available >= 1000
                                                    ? `${(listing.capacity_available / 1000).toFixed(1)}T`
                                                    : `${listing.capacity_available}kg`}
                                            </div>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                                            <div className="text-xs text-slate-500 mb-1">Daily Rate</div>
                                            <div className="font-mono font-bold text-emerald-400">${listing.price_per_day}</div>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                                            <div className="text-xs text-slate-500 mb-1">Min Stay</div>
                                            <div className="font-mono font-bold text-white">{listing.min_duration_days}d</div>
                                        </div>
                                    </div>

                                    {/* Book Button */}
                                    <button
                                        onClick={() => handleBook(listing.id)}
                                        className="w-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Request Booking
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StorageRentals;
