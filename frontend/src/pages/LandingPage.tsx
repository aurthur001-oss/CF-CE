import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Shield, Globe, Zap, TrendingUp, Users, Award, CheckCircle, Activity, Leaf, Battery, Fuel } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const stats = [
        { label: 'Trading Volume', value: '$2.4B+', suffix: 'Monthly' },
        { label: 'Active Traders', value: '12,500+', suffix: 'Global' },
        { label: 'Energy Traded', value: '850K', suffix: 'MT/Year' },
        { label: 'Countries', value: '47', suffix: 'Worldwide' },
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
        { name: 'Rajesh Kumar', role: 'Head of Energy Procurement, Tata Steel', quote: 'Transformed our green hydrogen sourcing with 40% cost reduction through transparent spot trading.' },
        { name: 'Dr. Sarah Chen', role: 'Director, Shell New Energies', quote: 'The anonymous matching engine ensures competitive pricing without revealing our trading positions.' },
        { name: 'Ahmed Al-Rashid', role: 'CEO, ADNOC Clean Energy', quote: 'Best-in-class storage network with real-time monitoring. Essential for our ammonia export operations.' },
    ];

    const certifications = [
        'ISO 14001', 'ISO 9001', 'CertifHy', 'ISCC Plus', 'GreenHydrogen.org'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">

            {/* Ambient Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500 opacity-[0.07] blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[700px] h-[700px] bg-blue-600 opacity-[0.07] blur-[150px] rounded-full"></div>
                <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-violet-600 opacity-[0.05] blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10">

                {/* HERO SECTION */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center"
                    >
                        {/* Status Badge */}
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

                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[0.9]">
                            <span className="block text-white">The Future of Currency</span>
                            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                                Is Clean Energy
                            </span>
                        </h1>

                        {/* Value Proposition */}
                        <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
                            The world's most advanced platform for trading, storing, and sourcing
                            <span className="text-white font-medium"> green hydrogen, ammonia, and sustainable fuels</span>.
                            We bring efficient clean energy to you — buy, sell, and power the future.
                        </p>

                        {/* CTA Buttons */}
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

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                            {certifications.map((cert, i) => (
                                <span key={i} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* LIVE PRICE TICKER */}
                <section className="border-y border-slate-800/50 bg-slate-900/30 backdrop-blur-sm py-6 mb-20">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between gap-8 overflow-x-auto scrollbar-hide">
                            <div className="flex items-center gap-2 text-slate-400 text-sm shrink-0">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <span className="font-mono">LIVE PRICES</span>
                            </div>
                            <div className="flex gap-12">
                                {energyTypes.map((energy, i) => (
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

                {/* FOOTER */}
                <footer className="border-t border-slate-800/50 py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                <span className="font-mono text-sm text-slate-400">ALL SYSTEMS OPERATIONAL</span>
                            </div>
                            <div className="text-center">
                                <div className="text-slate-400 text-sm mb-1">
                                    © 2026 EnergyX Exchange. All rights reserved.
                                </div>
                                <div className="text-slate-500 text-xs">
                                    Powered by <span className="text-emerald-400 font-medium">Celestial Fuels Pvt Ltd</span> • Enabling the Clean Energy Transition
                                </div>
                            </div>
                            <div className="flex gap-6 text-sm text-slate-500">
                                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms</a>
                                <a href="#" className="hover:text-white transition-colors">Contact</a>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
};

export default LandingPage;
