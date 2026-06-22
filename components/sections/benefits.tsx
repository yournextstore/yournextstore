const benefits = [
	{
		label: "20G Protein",
		copy: "From whey + almond. Bakes in, not bolted on.",
		color: "var(--cobalt)",
	},
	{
		label: "7 Ingredients",
		copy: "Read it like a recipe — because it is one.",
		color: "var(--crimson)",
	},
	{
		label: "Real Bakery",
		copy: "Slow-baked in small batches, shipped fresh.",
		color: "#7a5a2e",
	},
	{
		label: "Lightly Sweet",
		copy: "Honey & dates. No syrups or sugar alcohols.",
		color: "var(--butter)",
	},
];

export function Benefits() {
	return (
		<section className="bg-white border-t border-foreground/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
				<div className="text-center mb-10 sm:mb-14">
					<span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">
						<span aria-hidden="true" className="h-px w-6 bg-foreground/40" />
						What makes them work
						<span aria-hidden="true" className="h-px w-6 bg-foreground/40" />
					</span>
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-foreground max-w-2xl mx-auto leading-tight">
						Built like real food. Engineered to actually feed you.
					</h2>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-x divide-foreground/10 border border-foreground/10 sm:divide-y-0">
					{benefits.map((b, i) => (
						<div key={b.label} className="relative p-6 sm:p-8 bg-cream-gradient/30 group">
							<div
								className="absolute top-0 left-0 h-1 w-full transition-all group-hover:h-2"
								style={{ backgroundColor: b.color }}
								aria-hidden="true"
							/>
							<div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
								0{i + 1}
							</div>
							<div className="text-xl sm:text-2xl font-semibold text-foreground mb-3">{b.label}</div>
							<p className="text-sm text-muted-foreground leading-relaxed">{b.copy}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
