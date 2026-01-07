import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { user, logout } = useAuth();

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-3 group">
                            {/* Replaced Icon with Logo Image */}
                            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
                                <img src="/logo.png" alt="CF-EnergX Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white tracking-tight">
                                    CF-Energ<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">X</span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            <Link to="/trading" className="text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                                Trading
                            </Link>
                            <Link to="/storage" className="text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                                Storage
                            </Link>
                            <Link to="/marketplace" className="text-slate-300 hover:text-purple-400 hover:bg-slate-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                                Marketplace
                            </Link>

                            {/* Admin Link - Only for Admin Users */}
                            {user && user.role === 'ADMIN' && (
                                <Link to="/admin" className="text-slate-300 hover:text-red-400 hover:bg-slate-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                                    Admin
                                </Link>
                            )}


                            {user ? (
                                <div className="flex items-center gap-4 ml-6 pl-6 border-l border-slate-700">
                                    <Link to="/profile" className="text-right hover:opacity-80 transition-opacity">
                                        <div className="text-sm font-medium text-white">{user.name || user.email.split('@')[0]}</div>
                                        <div className="text-xs text-slate-500">{user.role || 'Trader'}</div>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-all text-sm font-medium border border-red-500/20"
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 ml-6 pl-6 border-l border-slate-700">
                                    <Link
                                        to="/login"
                                        className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <Link to="/trading" className="text-slate-300 hover:text-white hover:bg-slate-800 block px-4 py-3 rounded-lg text-base font-medium transition-colors">
                            Trading
                        </Link>
                        <Link to="/storage" className="text-slate-300 hover:text-white hover:bg-slate-800 block px-4 py-3 rounded-lg text-base font-medium transition-colors">
                            Storage
                        </Link>
                        <Link to="/marketplace" className="text-slate-300 hover:text-white hover:bg-slate-800 block px-4 py-3 rounded-lg text-base font-medium transition-colors">
                            Marketplace
                        </Link>

                        {/* Admin Link - Only for Admin Users */}
                        {user && user.role === 'ADMIN' && (
                            <Link to="/admin" className="text-slate-300 hover:text-white hover:bg-slate-800 block px-4 py-3 rounded-lg text-base font-medium transition-colors">
                                Admin Dashboard
                            </Link>
                        )}

                        <div className="pt-4 border-t border-slate-800 mt-4">
                            {user ? (
                                <>
                                    <Link to="/profile" className="text-slate-300 hover:text-white block px-4 py-3 rounded-lg text-base font-medium transition-colors">
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left text-red-400 hover:bg-red-500/10 block px-4 py-3 rounded-lg text-base font-medium transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <Link to="/login" className="text-slate-300 hover:text-white block px-4 py-3 rounded-lg text-base font-medium transition-colors">
                                        Sign In
                                    </Link>
                                    <Link to="/signup" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white block px-4 py-3 rounded-lg text-base font-bold text-center">
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
