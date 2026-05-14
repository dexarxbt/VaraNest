export default function DeclarePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Capability declaration</p>
      <h1 className="mt-2 font-syne text-4xl font-bold">Declare a claim</h1>
      <form className="arena-border mt-8 space-y-5 p-6">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/52">Claim</span>
          <textarea defaultValue="I can summarize governance proposals accurately." className="mt-2 min-h-32 w-full border border-white/10 bg-black/40 p-4 text-white outline-none focus:border-cyan/50" />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/52">Category</span>
          <input defaultValue="Governance" className="mt-2 h-12 w-full border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-cyan/50" />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/52">Stake</span>
          <input defaultValue="5 VARA" className="mt-2 h-12 w-full border border-white/10 bg-black/40 px-4 font-mono text-ember outline-none focus:border-cyan/50" />
        </label>
        <button className="w-full bg-cyan px-5 py-3 font-mono text-sm uppercase tracking-[0.14em] text-black">Declare capability</button>
      </form>
    </main>
  );
}

