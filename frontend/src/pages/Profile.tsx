import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Wallet, Package, TrendingUp, Building2, MapPin, Mail, Phone, Globe } from 'lucide-react';

const Profile: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="p-8 text-center text-slate-400">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">User Profile</h1>
                        <p className="text-slate-400 mt-2">Manage your account and view assets.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Identity & Wallet */}
                    <div className="space-y-8">

                        {/* Profile Card */}
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl font-bold text-white">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                            {user.role}
                                        </span>
                                        {user.is_active && (
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm text-slate-400">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </div>
                                {user.company_name && (
                                    <div className="flex items-center gap-3">
                                        <Building2 className="w-4 h-4" />
                                        <span>{user.company_name}</span>
                                    </div>
                                )}
                                {user.region && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4" />
                                        <span>{user.region}, {user.country}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Wallet Information */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all"></div>

                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-emerald-400" />
                                Wallet Balance
                            </h3>

                            <div className="space-y-1">
                                <p className="text-slate-400 text-sm">Available Funds</p>
                                <div className="text-4xl font-mono font-bold text-white tracking-tight">
                                    ${user.wallet_balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-800 flex gap-4">
                                <button className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-2 rounded-lg text-sm font-medium transition-colors border border-emerald-500/20">
                                    Deposit
                                </button>
                                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                                    Withdraw
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Inventory & Assets */}
                    <div className="lg:col-span-2 space-y-8">

                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Package className="w-5 h-5 text-blue-400" />
                                    Inventory
                                </h3>
                                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                    View History
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                                            <th className="pb-4 font-medium">Fuel Type</th>
                                            <th className="pb-4 font-medium">Quantity Available</th>
                                            <th className="pb-4 font-medium">Est. Value</th>
                                            <th className="pb-4 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {user.inventory && user.inventory.length > 0 ? (
                                            user.inventory.map((item: any, idx: number) => (
                                                <tr key={idx} className="border-b border-slate-800/50 group hover:bg-slate-800/30 transition-colors">
                                                    <td className="py-4 font-medium text-white">{item.fuel_type?.replace('_', ' ')}</td>
                                                    <td className="py-4 text-slate-300 font-mono">
                                                        {item.quantity?.toLocaleString()} kg
                                                    </td>
                                                    <td className="py-4 text-emerald-400 font-mono">
                                                        —
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        <button className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                                                            List for Sale
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-slate-500 italic">
                                                    No inventory items found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
