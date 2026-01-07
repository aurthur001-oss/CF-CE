import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Globe, Zap, CheckCircle, Activity, Leaf, Battery, Fuel, Cpu, Building2, PlayCircle, BarChart3, Users, Award, TrendingUp, Home, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const [viewState, setViewState] = useState<'landing' | 'app'>('landing');
    const [activeTab, setActiveTab] = useState<'plasma' | 'energx'>('plasma');

    // --- CF-EnergX Data (Startup Realistic) ---
    const stats = [
        { label: 'Trading Volume', value: '$2,000+', suffix: 'Monthly' },
        { label: 'Active Traders', value: '20+', suffix: 'Global' },
        { label: 'Energy Traded', value: '2K', suffix: 'Kg/Month' },
        { label: 'Countries', value: '3', suffix: 'Worldwide' },
    ];

    const features = [
        {
            title: 'Anonymous Order Matching',
            icon: Shield,
            desc: 'Zero-knowledge identity protection ensures fair pricing. Your trading strategy stays confidential until deal execution.',
            color: 'from-emerald-500 to-teal-600'
        },
        {
            title: 'Global Storage Network',
            icon: Globe,
            desc: 'Access 500+ certified storage facilities worldwide. Real-time capacity monitoring with IoT-connected infrastructure.',
            color: 'from-blue-500 to-cyan-600'
        },
        {
            title: 'Equipment Marketplace',
            icon: Zap,
            desc: 'Procure electrolyzers, compressors, and logistics assets from verified manufacturers with instant quotes.',
            color: 'from-violet-500 to-purple-600'
        }
    ];

    const energyTypes = [
        { name: 'Green Hydrogen', icon: Leaf, price: '$4.50/kg', change: '+2.3%', positive: true },
        { name: 'Blue Hydrogen', icon: Fuel, price: '$2.10/kg', change: '-0.8%', positive: false },
        { name: 'Green Ammonia', icon: Battery, price: '$580/MT', change: '+1.5%', positive: true },
        { name: 'Bio-Methanol', icon: Zap, price: '$320/MT', change: '+0.4%', positive: true },
    ];

    const testimonials = [
        { name: 'Vova', role: 'CEO, Kosmoc CP', quote: 'Transformed our green hydrogen sourcing with 40% cost reduction through transparent spot trading.' },
        { name: 'Krishna Kumar Aruljyothi', role: 'Researcher, HYSET', quote: 'The anonymous matching engine ensures competitive pricing without revealing our trading positions.' },
        { name: 'Nexsys Automation', role: 'Partner', quote: 'Best-in-class storage network with real-time monitoring. Essential for our ammonia export operations.' },
    ];


    const certifications = [
        'ISO 14001', 'ISO 9001', 'CertifHy', 'ISCC Plus', 'GreenHydrogen.org'
    ];

    // --- Plasma Pyrolysis Data ---
    const plasmaProcess = [
        {
            title: 'Methane Feedstock',
            desc: 'Utilizing natural gas (CH₄) to decarbonize existing infrastructure.',
            icon: Fuel,
            color: 'text-blue-400'
        },
        {
            title: '4000°C Plasma Torch',
            desc: 'Superheating 15% of feed to create hyper-energetic plasma state.',
            icon: Zap,
            color: 'text-violet-400'
        },
        {
            title: 'Reactor Cracking',
            desc: 'Mixing at 1500°C to strip carbon, releasing pure hydrogen.',
            icon: Cpu,
            color: 'text-orange-400'
        },
        {
            title: 'Hydrogen + Carbon',
            desc: 'Yielding 99.999% pure H₂ and valuable solid carbon black.',
            icon: Building2,
            color: 'text-emerald-400'
        }
    ];

    // Scroll to technology section
    const scrollToTech = () => {
        const element = document.getElementById('technology');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleEnterApp = (tab: 'plasma' | 'energx') => {
        setActiveTab(tab);
        setViewState('app');
    };

    const returnToGate = () => {
        setViewState('landing');
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden font-sans relative">

            {/* INITIAL LANDING GATE */}
            <AnimatePresence>
                {viewState === 'landing' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-auto bg-slate-950 p-4"
                    >
                        {/* ANIMATED BACKGROUND FOR LANDING */}
                        <div className="fixed inset-0 bg-slate-950 pointer-events-none">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900/60 to-slate-950 z-0"></div>
                            {/* Animated Particles/Gradient Blobs */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                    rotate: [0, 45, 0]
                                }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                    rotate: [0, -45, 0]
                                }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-600/20 blur-[120px] rounded-full"
                            />
                        </div>

                        {/* CONTENT -- Centered and Responsive */}
                        <div className="relative z-10 w-full max-w-7xl flex flex-col items-center justify-center min-h-screen py-10">
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-center mb-10 md:mb-16 px-4"
                            >
                                <h2 className="text-sm md:text-xl text-slate-400 font-light tracking-[0.3em] uppercase mb-4">Welcome To</h2>
                                <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                    CELESTIALFUELS <br className="md:hidden" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">PVT LTD</span>
                                </h1>
                                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                                    Bridging the gap between advanced production and global distribution.
                                </p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-6 md:gap-8 w-full max-w-5xl px-4 pb-10">
                                {/* CF-PLASMA CARD */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleEnterApp('plasma')}
                                    className="cursor-pointer group relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-b from-slate-900/80 to-slate-900/40 backdrop-blur-sm p-1"
                                >
                                    <div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative p-6 md:p-10 h-full flex flex-col items-center text-center">
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-violet-900/30 flex items-center justify-center mb-6 border border-violet-500/30 group-hover:border-violet-400 transition-colors">
                                            <Zap className="w-8 h-8 md:w-10 md:h-10 text-violet-400" />
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">CF-Plasma</h3>
                                        <div className="h-0.5 w-12 bg-violet-500/50 mb-4 md:mb-6"></div>
                                        <p className="text-violet-200 font-medium text-lg mb-2">Cheapest, Purest & Cleanest Hydrogen</p>
                                        <p className="text-slate-400 text-sm">Plasma Pyrolysis of Methane</p>
                                    </div>
                                </motion.div>

                                {/* CF-ENERGX CARD */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleEnterApp('energx')}
                                    className="cursor-pointer group relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-slate-900/80 to-slate-900/40 backdrop-blur-sm p-1"
                                >
                                    <div className="absolute inset-0 bg-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative p-6 md:p-10 h-full flex flex-col items-center text-center">
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-900/30 flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:border-emerald-400 transition-colors">
                                            <Activity className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">CF-EnergX</h3>
                                        <div className="h-0.5 w-12 bg-emerald-500/50 mb-4 md:mb-6"></div>
                                        <p className="text-emerald-200 font-medium text-lg mb-2">Supply Chain of Green Fuels</p>
                                        <p className="text-slate-400 text-sm">Global Trading Marketplace</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN APP CONTENT */}
            <div className={`relative z-10 transition-opacity duration-1000 ${viewState === 'landing' ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>

                {/* DYNAMIC HEADER / TAB NAVIGATION */}
                <div className="flex flex-col md:flex-row justify-between items-center px-6 pt-6 pb-4 sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50 transition-all duration-300">

                    {/* LEFT: Dynamic Logo/Title */}
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <button
                            onClick={returnToGate}
                            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all mr-2"
                            title="Back to Entrance"
                        >
                            <Home className="w-5 h-5" />
                        </button>

                        <div className={`p-2 rounded-lg ${activeTab === 'plasma' ? 'bg-violet-500/20 text-violet-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {activeTab === 'plasma' ? <Zap className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-white leading-none">
                                {activeTab === 'plasma' ? 'CELESTIALFUELS' : 'CF-ENERGX'}
                            </span>
                            <span className={`text-[10px] font-bold tracking-widest uppercase ${activeTab === 'plasma' ? 'text-violet-400' : 'text-emerald-400'}`}>
                                {activeTab === 'plasma' ? 'PLASMA PYROLYSIS' : 'TRADING PLATFORM'}
                            </span>
                        </div>
                    </div>

                    {/* CENTER: Tab Switcher */}
                    <div className="bg-slate-900/80 p-1.5 rounded-full border border-slate-800 flex relative shadow-lg shadow-black/20">
                        <motion.div
                            className="absolute top-1.5 bottom-1.5 rounded-full bg-slate-800 border border-slate-700 shadow-sm"
                            initial={false}
                            animate={{
                                x: activeTab === 'plasma' ? 0 : '100%',
                                width: '140px'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />

                        <button
                            onClick={() => setActiveTab('plasma')}
                            className={`relative w-[140px] z-10 py-2 rounded-full text-xs md:text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${activeTab === 'plasma' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Zap className="w-4 h-4" /> CF-Plasma
                        </button>
                        <button
                            onClick={() => setActiveTab('energx')}
                            className={`relative w-[140px] z-10 py-2 rounded-full text-xs md:text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${activeTab === 'energx' ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-400'}`}
                        >
                            <Activity className="w-4 h-4" /> CF-EnergX
                        </button>
                    </div>

                    {/* RIGHT: Status/CTA (Dynamic based on Tab) */}
                    <div className="hidden md:flex items-center gap-4 w-[200px] justify-end">
                        {activeTab === 'plasma' ? (
                            <a href="mailto:contact@celestialfuels.com" className="text-sm font-semibold hover:underline text-violet-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Contact Us
                            </a>
                        ) : (
                            <Link to="/signup" className="text-sm font-semibold hover:underline text-emerald-400">
                                Join Network
                            </Link>
                        )}
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="min-h-[80vh]">
                    {activeTab === 'plasma' ? (
                        <motion.div
                            key="plasma"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* --- TAB 1: CELESTIAL FUELS (PLASMA PART) --- */}

                            {/* HERO */}
                            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
                                <div className="text-center">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-5 py-2 mb-8"
                                    >
                                        <span className="animate-pulse h-2 w-2 rounded-full bg-violet-400"></span>
                                        <span className="text-sm text-violet-300 font-semibold tracking-wide">PIONEERING PLASMA PYROLYSIS</span>
                                    </motion.div>

                                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[0.9]">
                                        <span className="block text-white">Emission-Free Hydrogen</span>
                                        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400">
                                            From Methane
                                        </span>
                                    </h1>

                                    <p className="text-lg md:text-2xl text-slate-400 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
                                        Leveraging <span className="text-violet-400 font-medium">Plasma</span> to crack methane into ultra-pure hydrogen and high-value carbon with <span className="text-white font-medium">Zero CO₂</span>.
                                    </p>

                                    {/* NEW IMAGE: Hydrogen Plant Specs */}
                                    <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/20 border border-violet-500/20">
                                        <img src="/assets/hydrogen-plant-specs.png" alt="CF750 Plant Specs" className="w-full h-auto" />
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20 animate-fade-in-up">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveTab('energx')}
                                            className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all"
                                        >
                                            Trade Our Hydrogen <ArrowRight className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={scrollToTech}
                                            className="inline-flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all"
                                        >
                                            <PlayCircle className="w-5 h-5" /> View Technology
                                        </motion.button>
                                    </div>
                                </div>
                            </section>

                            {/* TECHNOLOGY STEPS WITH IMAGE */}
                            <section id="technology" className="bg-slate-900/30 border-y border-slate-800/50 py-24">
                                <div className="max-w-7xl mx-auto px-4">
                                    <div className="text-center mb-16">
                                        <h2 className="text-3xl md:text-5xl font-bold mb-6">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Plasma Pyrolysis</span> Process</h2>
                                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Decarbonizing natural gas with high-efficiency direct cracking.</p>
                                    </div>

                                    {/* REPLACED GRID WITH NEW IMAGE */}
                                    <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-700 bg-white/5 p-2">
                                        <img src="/assets/plasma-components.png" alt="Reactor, Plasma Torch, Hydrogen Filter" className="w-full h-auto rounded-2xl" />
                                    </div>
                                </div>
                            </section>

                            {/* VISION & CONTAINERS */}
                            <section className="py-24 max-w-7xl mx-auto px-4">
                                <div className="grid lg:grid-cols-2 gap-16 items-center">
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 mb-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                            <Globe className="w-3 h-3" /> Turnkey Solution
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                            Scalable <span className="text-white">Modular Units</span><br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Ready for Deployment</span>
                                        </h2>
                                        <div className="space-y-6 text-lg text-slate-400">
                                            <p>
                                                Our <strong>CF750</strong> units are containerized for rapid deployment anywhere in the world.
                                                Producing <strong>50kg of H₂ per hour</strong>, they are the building blocks of the hydrogen economy.
                                            </p>
                                            <p>
                                                By co-producing high-value solid carbon, we ensure economic viability from day one.
                                            </p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="relative"
                                        initial={{ opacity: 0, x: 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                    >
                                        {/* NEW IMAGE: CONTAINERS */}
                                        <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                                            <img src="/assets/hydrogen-containers.png" alt="Celestial Fuels Containers" className="w-full h-auto" />
                                        </div>
                                    </motion.div>
                                </div>
                            </section>

                        </motion.div>
                    ) : (
                        <motion.div
                            key="energx"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* --- TAB 2: CF-ENERGX (EXISTING TRADING PLATFORM) --- */}

                            {/* HERO SECTION */}
                            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
                                <div className="text-center">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-5 py-2 mb-8"
                                    >
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span className="text-sm text-emerald-400 font-semibold tracking-wide">LIVE MARKETS • 24/7 TRADING</span>
                                    </motion.div>

                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[0.9]">
                                        <span className="block text-white">The Future of Currency</span>
                                        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                                            Is Clean Energy
                                        </span>
                                    </h1>

                                    <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
                                        The world's most advanced platform for trading, storing, and sourcing
                                        <span className="text-white font-medium"> green hydrogen, ammonia, and sustainable fuels</span>.
                                        We bring efficient clean energy to you — buy, sell, and power the future.
                                    </p>

                                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                            <Link
                                                to="/signup"
                                                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
                                            >
                                                Start Trading Today <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                            <Link
                                                to="/trading"
                                                className="inline-flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-lg px-10 py-5 rounded-2xl transition-all"
                                            >
                                                <BarChart3 className="w-5 h-5" /> View Live Markets
                                            </Link>
                                        </motion.div>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                                        {certifications.map((cert, i) => (
                                            <span key={i} className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* LIVE PRICE TICKER */}
                            <section className="border-y border-slate-800/50 bg-slate-900/30 backdrop-blur-sm py-6 mb-20">
                                <div className="max-w-7xl mx-auto px-4">
                                    <div className="flex items-center gap-8">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm shrink-0 z-10 bg-slate-900/50 backdrop-blur-md py-1 pr-4 rounded-r-xl">
                                            <Activity className="w-4 h-4 text-emerald-500" />
                                            <span className="font-mono">LIVE PRICES</span>
                                        </div>
                                        <div className="flex-1 overflow-hidden relative mask-linear-fade">
                                            <motion.div
                                                className="flex gap-12"
                                                animate={{ x: ["0%", "-50%"] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                    duration: 30
                                                }}
                                            >
                                                {[...energyTypes, ...energyTypes, ...energyTypes].map((energy, i) => (
                                                    <div key={i} className="flex items-center gap-4 shrink-0">
                                                        <energy.icon className={`w-5 h-5 ${energy.positive ? 'text-emerald-400' : 'text-red-400'}`} />
                                                        <div>
                                                            <div className="text-white font-semibold text-sm">{energy.name}</div>
                                                            <div className="flex items-center gap-2 text-xs">
                                                                <span className="font-mono font-bold">{energy.price}</span>
                                                                <span className={energy.positive ? 'text-emerald-400' : 'text-red-400'}>
                                                                    {energy.change}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* STATISTICS */}
                            <section className="max-w-7xl mx-auto px-4 mb-24">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {stats.map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-800/50"
                                        >
                                            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                                                {stat.value}
                                            </div>
                                            <div className="text-white font-semibold mb-1">{stat.label}</div>
                                            <div className="text-slate-500 text-sm">{stat.suffix}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* WHY TRADE WITH US */}
                            <section className="max-w-7xl mx-auto px-4 mb-24">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-16"
                                >
                                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                        Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Industry Leaders</span> Choose Us
                                    </h2>
                                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                                        From Fortune 500 energy companies to emerging clean tech startups,
                                        we power the global transition to sustainable energy commerce.
                                    </p>
                                </motion.div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {features.map((feature, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.15 }}
                                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                            className="group p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300"
                                        >
                                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                                <feature.icon size={28} className="text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
                                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* PLATFORM CAPABILITIES */}
                            <section className="bg-slate-900/50 border-y border-slate-800/50 py-24 mb-24">
                                <div className="max-w-7xl mx-auto px-4">
                                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                        >
                                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 rounded-full px-4 py-1 text-sm font-semibold mb-6">
                                                <TrendingUp className="w-4 h-4" /> TRADING PLATFORM
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                                Institutional-Grade<br />
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Trading Infrastructure</span>
                                            </h2>
                                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                                Our matching engine processes 10,000+ orders per second with sub-millisecond latency.
                                                Built for serious traders who demand reliability, transparency, and competitive execution.
                                            </p>
                                            <ul className="space-y-4">
                                                {[
                                                    'Real-time order book with depth visualization',
                                                    'Anonymous ID trading for strategy protection',
                                                    'Multi-currency settlement (USD, EUR, INR, AED)',
                                                    'API access for algorithmic trading',
                                                    'Escrow-backed smart contract settlements',
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="relative"
                                        >
                                            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 overflow-hidden">
                                                {/* Mock Trading Interface */}
                                                <div className="h-full flex flex-col gap-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-sm font-semibold text-emerald-400">GREEN H₂ / USD</div>
                                                        <div className="text-2xl font-mono font-bold">$4.52</div>
                                                    </div>
                                                    <div className="flex-1 bg-slate-900/50 rounded-xl p-4">
                                                        <div className="h-full bg-gradient-to-t from-emerald-500/20 to-transparent rounded-lg relative overflow-hidden">
                                                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
                                                                <path d="M0,40 Q10,35 20,38 T40,30 T60,25 T80,15 T100,10" fill="none" stroke="rgb(16 185 129)" strokeWidth="2" />
                                                                <path d="M0,40 Q10,35 20,38 T40,30 T60,25 T80,15 T100,10 L100,50 L0,50 Z" fill="url(#gradient)" opacity="0.3" />
                                                                <defs>
                                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                        <stop offset="0%" stopColor="rgb(16 185 129)" />
                                                                        <stop offset="100%" stopColor="transparent" />
                                                                    </linearGradient>
                                                                </defs>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                                                        <div className="bg-slate-800 rounded-lg p-2">
                                                            <div className="text-slate-500">24h Vol</div>
                                                            <div className="font-mono font-bold text-white">$12.4M</div>
                                                        </div>
                                                        <div className="bg-slate-800 rounded-lg p-2">
                                                            <div className="text-slate-500">Open Orders</div>
                                                            <div className="font-mono font-bold text-white">1,247</div>
                                                        </div>
                                                        <div className="bg-slate-800 rounded-lg p-2">
                                                            <div className="text-slate-500">24h Change</div>
                                                            <div className="font-mono font-bold text-emerald-400">+2.3%</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </section>

                            {/* TESTIMONIALS */}
                            <section className="max-w-7xl mx-auto px-4 mb-24">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-16"
                                >
                                    <div className="inline-flex items-center gap-2 text-slate-400 mb-4">
                                        <Users className="w-5 h-5" />
                                        <span className="text-sm font-semibold uppercase tracking-wider">Trusted by Industry Leaders</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold">
                                        What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Partners</span> Say
                                    </h2>
                                </motion.div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {testimonials.map((t, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800"
                                        >
                                            <div className="flex gap-1 mb-6">
                                                {[...Array(5)].map((_, i) => (
                                                    <Award key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                                ))}
                                            </div>
                                            <p className="text-lg text-slate-300 mb-6 leading-relaxed italic">"{t.quote}"</p>
                                            <div>
                                                <div className="font-bold text-white">{t.name}</div>
                                                <div className="text-slate-500 text-sm">{t.role}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* FINAL CTA */}
                            <section className="max-w-5xl mx-auto px-4 mb-24">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="text-center p-12 md:p-16 rounded-[2rem] bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-cyan-600/20 border border-emerald-500/20"
                                >
                                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                        Ready to Trade the Future?
                                    </h2>
                                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                                        Join thousands of energy professionals who are already shaping the clean energy economy.
                                        Create your account in under 2 minutes.
                                    </p>
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                        <Link
                                            to="/signup"
                                            className="inline-flex items-center gap-3 bg-white text-slate-900 font-bold text-lg px-12 py-5 rounded-2xl shadow-2xl hover:bg-slate-100 transition-all"
                                        >
                                            Create Free Account <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </section>
                        </motion.div>
                    )}
                </div>

                {/* SHARED FOOTER */}
                <footer className="border-t border-slate-800/50 py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                <span className="font-mono text-sm text-slate-400">ALL SYSTEMS OPERATIONAL</span>
                            </div>
                            <div className="text-center">
                                <div className="text-slate-400 text-sm mb-1">
                                    © 2026 CelestialFuels & EnergX. All rights reserved.
                                </div>
                                <div className="text-slate-500 text-xs">
                                    Powered by <span className="text-emerald-400 font-medium">CF-EnergX</span> • Enabling the Clean Energy Transition
                                </div>
                            </div>
                            <div className="flex gap-6 text-sm text-slate-500">
                                <button onClick={() => alert("Privacy Policy: We respect your data. Standard GDPR/CCPA protections apply to all traders and producers.")} className="hover:text-white transition-colors">Privacy</button>
                                <button onClick={() => alert("Terms of Service: Standard CelstialFuels & EnergX trading protocols apply.")} className="hover:text-white transition-colors">Terms</button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText("founders@celestialfuels.com");
                                        alert("Email copied to clipboard: founders@celestialfuels.com");
                                        window.location.href = "mailto:founders@celestialfuels.com";
                                    }}
                                    className="hover:text-white transition-colors"
                                >
                                    Contact
                                </button>
                                <a href="https://www.linkedin.com/company/celestialfuels" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
};

export default LandingPage;
