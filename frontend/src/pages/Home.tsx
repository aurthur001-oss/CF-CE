

const Home = () => {
    return (
        <div className="pt-16 min-h-screen bg-slate-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-center mb-8">
                    The Future of <span className="text-cyan-400">Green Energy</span> Supply Chain
                </h1>
                <p className="text-xl text-slate-400 text-center max-w-3xl mx-auto mb-12">
                    Revolutionizing hydrogen trading, storage renting, and equipment procurement with advanced AI and blockchain technology.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors group">
                        <h3 className="text-xl font-bold mb-4 group-hover:text-cyan-400">Anonymous Trading</h3>
                        <p className="text-slate-400">Trade green hydrogen blindly with complete privacy and automated matching.</p>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors group">
                        <h3 className="text-xl font-bold mb-4 group-hover:text-cyan-400">Storage Rentals</h3>
                        <p className="text-slate-400">Find and book secure storage facilities for your energy inventory instantly.</p>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors group">
                        <h3 className="text-xl font-bold mb-4 group-hover:text-cyan-400">Marketplace</h3>
                        <p className="text-slate-400">Source high-quality parts and manufacturing services from verified suppliers.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
