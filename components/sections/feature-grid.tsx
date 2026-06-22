const features = [
	{
		label: "MATERIAL №01",
		title: "Hand-pressed cork.",
		body: "Sourced from cooperative forests in Portugal. Naturally water-resistant, dampens dice, and ages into something better.",
		icon: (
			<svg viewBox="0 0 64 64" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.5">
				<title>Cork inlay</title>
				<circle cx="32" cy="32" r="26" />
				<circle cx="22" cy="24" r="2" fill="currentColor" />
				<circle cx="40" cy="22" r="1.5" fill="currentColor" />
				<circle cx="44" cy="38" r="2.2" fill="currentColor" />
				<circle cx="26" cy="42" r="1.8" fill="currentColor" />
				<circle cx="33" cy="32" r="1.5" fill="currentColor" />
			</svg>
		),
	},
	{
		label: "MATERIAL №02",
		title: "Full-grain leather.",
		body: "Vegetable-tanned in a 4th-generation Italian workshop. Stitched, not glued. Built to soften with miles, not minutes.",
		icon: (
			<svg viewBox="0 0 64 64" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.5">
				<title>Leather handle</title>
				<rect x="8" y="22" width="48" height="20" rx="3" />
				<path d="M16 22V14a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v8" />
				<path d="M14 30h36" strokeDasharray="2 3" />
			</svg>
		),
	},
	{
		label: "MATERIAL №03",
		title: "Weatherproof shell.",
		body: "Anodized aluminum frame, marine-grade closures, dust-sealed gasket. Survives the trunk, the trail, and the rainstorm.",
		icon: (
			<svg viewBox="0 0 64 64" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.5">
				<title>Weatherproof case</title>
				<rect x="10" y="16" width="44" height="36" rx="3" />
				<path d="M10 30h44" />
				<rect x="28" y="10" width="8" height="6" rx="1" />
				<circle cx="20" cy="42" r="2" />
				<circle cx="44" cy="42" r="2" />
			</svg>
		),
	},
];

export function FeatureGrid() {
	return (
		<section className="relative bg-[color:var(--color-yns-bone)] border-y border-[color:var(--color-yns-ink)]/10">
			<div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24">
				<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
					<div>
						<p className="text-xs tracking-utility font-semibold text-[color:var(--color-yns-wood)] mb-3">
							CHAPTER 02 — THE BUILD
						</p>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-[color:var(--color-yns-ink)] max-w-2xl">
							Three materials.
							<br />
							Zero compromises.
						</h2>
					</div>
					<p className="max-w-sm text-base text-[color:var(--color-yns-ink)]/65 leading-relaxed">
						Specced like field gear. Finished like heirloom goods. Each component chosen for the way it
						behaves twenty years from now, not on day one.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[color:var(--color-yns-ink)]/15 border border-[color:var(--color-yns-ink)]/15">
					{features.map((feature) => (
						<article
							key={feature.title}
							className="group bg-[color:var(--color-yns-bone)] hover:bg-[color:var(--color-yns-cream)] p-8 sm:p-10 flex flex-col gap-5 transition-colors"
						>
							<div className="text-[color:var(--color-yns-wood)] group-hover:text-[color:var(--color-yns-ink)] transition-colors">
								{feature.icon}
							</div>
							<p className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-ink)]/55">
								{feature.label}
							</p>
							<h3 className="font-display text-2xl sm:text-3xl font-black uppercase leading-[1] tracking-[-0.01em] text-[color:var(--color-yns-ink)]">
								{feature.title}
							</h3>
							<p className="text-sm leading-relaxed text-[color:var(--color-yns-ink)]/70">{feature.body}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
