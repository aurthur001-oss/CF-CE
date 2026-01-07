import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, TrendingUp, Package, AlertCircle, CheckCircle, XCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Analytics {
    total_users: number;
    total_producers: number;
    total_buyers: number;
    total_listings: number;
    total_trades_volume: number;
    pending_approvals: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    company_name?: string;
    is_active: boolean;
    is_approved: boolean;
}

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('ALL');

    useEffect(() => {
        // Check if user is admin
        if (!user || user.role !== 'ADMIN') {
            navigate('/trading');
            return;
        }

        fetchAnalytics();
        fetchUsers();
    }, [user, navigate, roleFilter]);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/admin/analytics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(response.data);
        } catch (error) {
            console.error('Failed to fetch analytics', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/admin/users?role_filter=${roleFilter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId: number, field: 'is_active' | 'is_approved', currentValue: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:8000/admin/users/${userId}/status`, {
                [field]: !currentValue
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user status', error);
        }
    };

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    return (
        <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8 text-red-400" />
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    </div>
                    <p className="text-slate-400">Platform management and analytics</p>
                </header>

                {/* Analytics Cards */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-slate-400 text-sm font-semibold uppercase">Total Users</div>
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="text-3xl font-bold">{analytics.total_users.toLocaleString()}</div>
                            <div className="text-sm text-slate-500 mt-2">
                                {analytics.total_producers} producers • {analytics.total_buyers} buyers
                            </div>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-slate-400 text-sm font-semibold uppercase">Total Listings</div>
                                <Package className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="text-3xl font-bold">{analytics.total_listings.toLocaleString()}</div>
                            <div className="text-sm text-slate-500 mt-2">Active marketplace items</div>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-slate-400 text-sm font-semibold uppercase">Trade Volume</div>
                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div className="text-3xl font-bold">${(analytics.total_trades_volume / 1000000).toFixed(1)}M</div>
                            <div className="text-sm text-slate-500 mt-2">Total transaction value</div>
                        </div>

                        <div className="bg-slate-900/80 border border-red-900/30 rounded-2xl p-6 lg:col-span-3">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-slate-400 text-sm font-semibold uppercase">Pending Approvals</div>
                                <AlertCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <div className="text-3xl font-bold text-red-400">{analytics.pending_approvals}</div>
                            <div className="text-sm text-slate-500 mt-2">Users awaiting approval</div>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">User Management</h2>
                            <select
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="ALL">All Roles</option>
                                <option value="PRODUCER">Producers</option>
                                <option value="BUYER">Buyers</option>
                                <option value="LOGISTICS">Logistics</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Company</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Active</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Approved</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading users...</td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No users found</td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium">{u.name}</div>
                                                    <div className="text-sm text-slate-500">{u.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${u.role === 'PRODUCER' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        u.role === 'BUYER' ? 'bg-blue-500/10 text-blue-400' :
                                                            'bg-purple-500/10 text-purple-400'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">{u.company_name || '-'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleUserStatus(u.id, 'is_active', u.is_active)}
                                                    className={`p-1.5 rounded-lg transition-colors ${u.is_active
                                                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                                            : 'bg-slate-700 text-slate-500 hover:bg-slate-600'
                                                        }`}
                                                >
                                                    {u.is_active ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleUserStatus(u.id, 'is_approved', u.is_approved)}
                                                    className={`p-1.5 rounded-lg transition-colors ${u.is_approved
                                                            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                                                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                        }`}
                                                >
                                                    {u.is_approved ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-xs text-slate-600">ID: {u.id}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
