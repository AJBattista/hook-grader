export default function BriefBuilderPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
        Brief Builder
      </h1>
      <p className="text-xl md:text-2xl text-zinc-400 mb-12 text-center max-w-3xl">
        Generate high-converting UGC briefs in seconds.
      </p>

      <div className="w-full max-w-lg border border-zinc-800 rounded-2xl p-10 bg-zinc-950/50">
        <div className="space-y-8">
          <div>
            <label className="block text-sm text-zinc-400 mb-3">Brand Name</label>
            <input
              type="text"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Your Brand"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-3">Product Type</label>
            <input
              type="text"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="e.g. Energy Drink, Skincare"
            />
          </div>
          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-5 rounded-full font-medium text-lg transition-colors">
            Generate Brief
          </button>
        </div>
      </div>

      <p className="mt-16 text-zinc-600 text-sm">
        Built by AJ Battista • aj-battista.com
      </p>
    </div>
  );
}
