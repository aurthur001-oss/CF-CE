import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Warehouse, MapPin, Calendar, Lock, Shield, Filter, ChevronRight, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
// Leaflet CSS is imported in global setup now.


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

const StorageRentals = () => {
    const { isAuthenticated } = useAuth();
    const [listings, setListings] = useState<StorageListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRegion, setFilterRegion] = useState('ALL');
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [activeListingId, setActiveListingId] = useState<number | null>(null);

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

    // Combined Filtering: Region + Map Bounds
    const filteredListings = listings.filter(l => {
        const matchesRegion = filterRegion === 'ALL' || l.facility?.location_address?.includes(filterRegion);

        // Check map bounds
        let matchesMap = true;
        if (mapBounds && l.facility?.location_lat && l.facility?.location_lng) {
            const latLng = L.latLng(l.facility.location_lat, l.facility.location_lng);
            matchesMap = mapBounds.contains(latLng);
        }

        return matchesRegion && matchesMap;
    });

    return (
        <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Map Container - Top Half */}
            <div className="h-[50vh] w-full relative z-0">
                <MapContainer
                    center={[25, 10]}
                    zoom={2}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                    style={{ background: '#020617' }} // Matches slate-950
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    <MapController onBoundsChange={setMapBounds} />

                    {/* Markers for ALL listings (so you can see what is available outside bounds too, or maybe just filtered? typical is filtered based on viewport, so markers stay) */}
                    {/* Actually, markers should probably represent the filtered list OR all list. 
                        If we filter by bounds, we should probably render markers for ALL listings so users know where to pan.
                        BUT, if we want "map as filter", then list updates. 
                        Let's render active bounds markers.
                    */}
                    {listings.map((l) => (
                        l.facility?.location_lat && l.facility?.location_lng && (
                            <Marker
                                key={l.id}
                                position={[l.facility.location_lat, l.facility.location_lng]}
                                eventHandlers={{
                                    click: () => setActiveListingId(l.id)
                                }}
                            >
                                <Popup className="text-slate-900">
                                    <div className="p-1">
                                        <div className="font-bold">{l.facility.name}</div>
                                        <div className="text-xs">{l.facility.type}</div>
                                        <div className="text-xs font-mono mt-1 text-emerald-600">${l.price_per_day}/day</div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                </MapContainer>

                {/* Floating Map Overlay Info */}
                <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-700 shadow-xl">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Map Filter Active</div>
                    <div className="text-sm font-semibold flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        Showing {filteredListings.length} facilities in view
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Available Storage</h1>
                        <p className="text-slate-400 text-sm">
                            Pan and zoom the map above to filter results by location.
                        </p>
                    </div>

                    {/* Region Fallback Filter */}
                    <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
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
                    ) : filteredListings.length === 0 ? (
                        <div className="col-span-3 text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">No facilities in this area</h3>
                            <p className="text-slate-500">Try zooming out or moving the map to finding more locations.</p>
                        </div>
                    ) : (
                        filteredListings.map((listing) => (
                            <motion.div
                                key={listing.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`bg-slate-900/80 border rounded-2xl overflow-hidden transition-all group ${activeListingId === listing.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-800 hover:border-blue-500/30'}`}
                                onMouseEnter={() => setActiveListingId(listing.id)}
                            >
                                <div className="p-6">
                                    {/* Facility Type Badge */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 text-xs font-semibold px-2 py-1 rounded">
                                            <Warehouse className="w-3 h-3" />
                                            {listing.facility?.type || 'Storage Facility'}
                                        </div>
                                        <div className="text-xs text-slate-500 font-mono">ID: {listing.facility_id}</div>
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
