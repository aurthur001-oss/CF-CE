import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, Smartphone, Upload, CheckCircle, ArrowRight, Lock, Zap, User, Building, FileText } from 'lucide-react';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        otp: '',
        fullName: '',
        password: '',
        companyName: '',
        role: 'BUYER',
        documentId: '',
        termsAccepted: false
    });

    // Temp Token from OTP Step
    const [tempToken, setTempToken] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- STEP 1: IDENTITY ---
    const handleIdentitySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:8000/auth-flow/step1-identity', {
                email: formData.email,
                phone: formData.phone
            });
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    // --- STEP 2: OTP ---
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:8000/auth-flow/step2-verify-otp', {
                email: formData.email,
                otp: formData.otp
            });
            if (res.data.verified) {
                setTempToken(res.data.temp_token);
                setStep(3);
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    // --- STEP 3: KYC & COMPLETION ---
    const handleKycSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.termsAccepted) {
            setError("You must accept the terms.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:8000/auth-flow/step3-kyc-complete', {
                temp_token: tempToken,
                full_name: formData.fullName,
                password: formData.password,
                role: formData.role,
                company_name: formData.companyName,
                document_id: formData.documentId,
                terms_accepted: formData.termsAccepted
            });

            // Login User
            login(res.data.access_token, res.data.user);
            navigate('/trading');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'KYC Check Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-emerald-500 opacity-[0.05] blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-blue-600 opacity-[0.05] blur-[120px] rounded-full"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-lg"
            >
                {/* Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-emerald-900/10">

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white tracking-tight">
                                    Energy<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">X</span>
                                </span>
                                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-medium -mt-1">by Celestial Fuels</span>
                            </div>
                        </Link>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex justify-between mb-8 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 rounded-full"></div>
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 -z-10 rounded-full transition-all duration-500"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        ></div>

                        {[
                            { num: 1, label: 'Identity', icon: User },
                            { num: 2, label: 'Verify', icon: Smartphone },
                            { num: 3, label: 'Profile', icon: FileText },
                        ].map(s => (
                            <div key={s.num} className="flex flex-col items-center gap-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= s.num
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                                    }`}>
                                    {step > s.num ? <CheckCircle size={18} /> : <s.icon size={18} />}
                                </div>
                                <span className={`text-xs font-medium ${step >= s.num ? 'text-emerald-400' : 'text-slate-500'}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">

                        {/* STEP 1: IDENTITY */}
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                onSubmit={handleIdentitySubmit}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                                    <p className="text-slate-400 text-sm">Join the global clean energy trading network</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                                        <input
                                            type="email" name="email" required
                                            value={formData.email} onChange={handleChange}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                            placeholder="you@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Mobile Number</label>
                                        <input
                                            type="tel" name="phone" required
                                            value={formData.phone} onChange={handleChange}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>Continue <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </motion.form>
                        )}

                        {/* STEP 2: OTP */}
                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                onSubmit={handleOtpSubmit}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-4">
                                        <Smartphone size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
                                    <p className="text-slate-400 text-sm">Enter the code sent to {formData.phone}</p>
                                    <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono px-3 py-2 rounded-lg">
                                        <Shield size={14} />
                                        Demo OTP: 123456
                                    </div>
                                </div>

                                <div>
                                    <input
                                        type="text" name="otp" required
                                        value={formData.otp} onChange={handleChange}
                                        className="w-full text-center text-3xl tracking-[0.5em] font-mono bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 rounded-xl hover:from-blue-400 hover:to-indigo-400 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Code'}
                                </button>
                            </motion.form>
                        )}

                        {/* STEP 3: KYC */}
                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                onSubmit={handleKycSubmit}
                                className="space-y-5"
                            >
                                <div className="text-center mb-4">
                                    <div className="mx-auto w-12 h-12 bg-violet-500/10 text-violet-400 rounded-full flex items-center justify-center mb-2">
                                        <Shield size={24} />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Complete Your Profile</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-2">Full Name</label>
                                        <input
                                            type="text" name="fullName" required
                                            value={formData.fullName} onChange={handleChange}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-2">Company Name</label>
                                        <input
                                            type="text" name="companyName"
                                            value={formData.companyName} onChange={handleChange}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2">Password</label>
                                    <input
                                        type="password" name="password" required
                                        value={formData.password} onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
                                        placeholder="Min 8 characters"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
                                    >
                                        <option value="BUYER">Buyer (Purchase Energy)</option>
                                        <option value="PRODUCER">Producer (Sell Energy)</option>
                                        <option value="LOGISTICS">Logistics Provider</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2">Business Registration ID</label>
                                    <div className="relative">
                                        <input
                                            type="text" name="documentId"
                                            value={formData.documentId} onChange={handleChange}
                                            placeholder="e.g. GSTIN / Udyam / CRN"
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 pl-10 text-sm text-white focus:outline-none focus:border-violet-500"
                                        />
                                        <Building size={16} className="absolute left-3 top-3.5 text-slate-500" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox" name="termsAccepted"
                                        checked={formData.termsAccepted} onChange={handleChange}
                                        id="terms"
                                        className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <label htmlFor="terms" className="text-xs text-slate-400">
                                        I agree to the <a href="#" className="text-emerald-400 hover:underline">Terms of Service</a> & <a href="#" className="text-emerald-400 hover:underline">Privacy Policy</a>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-4 rounded-xl hover:from-violet-400 hover:to-purple-400 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50"
                                >
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Login Link */}
                    <div className="mt-6 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                            Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
