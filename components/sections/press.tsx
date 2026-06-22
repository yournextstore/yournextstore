const PRESS = [
	{ name: "Bon Appétit", style: "font-serif italic tracking-tight" },
	{ name: "EATER", style: "yns-display tracking-tight" },
	{ name: "BON BON", style: "font-sans font-black uppercase tracking-[0.4em]" },
	{ name: "the Cut", style: "font-serif tracking-wider" },
	{ name: "GOOP", style: "font-sans font-black tracking-[0.5em]" },
	{ name: "FOOD52", style: "font-mono font-bold tracking-wide" },
];

export function Press() {
	return (
		<section id="stockists" className="bg-cream py-14 sm:py-20 border-y border-ink/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<p className="text-center text-xs font-bold uppercase tracking-[0.45em] text-ink/55 mb-8">
					As seen on the shelves of
				</p>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-6 items-center justify-items-center">
					{PRESS.map((p) => (
						<div key={p.name} className={`text-ink/75 hover:text-ink transition-colors text-xl ${p.style}`}>
							{p.name}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
