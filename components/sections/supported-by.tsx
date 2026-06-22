const partners = [
	{ name: "ATELIER", style: "font-display font-bold tracking-[0.18em]" },
	{ name: "Maison.", style: "font-display italic font-semibold" },
	{ name: "FORGE", style: "font-display tracking-[0.32em] font-medium" },
	{ name: "kinfolk", style: "font-display font-light tracking-tight text-xl" },
	{ name: "ROAMR", style: "font-display font-extrabold tracking-tight" },
	{ name: "Heritage", style: "font-display font-medium italic" },
	{ name: "VESPA·CO", style: "font-display tracking-[0.22em]" },
	{ name: "norden", style: "font-display font-semibold tracking-[0.15em]" },
];

export function SupportedBy() {
	return (
		<section className="bg-secondary">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="text-center max-w-xl mx-auto">
					<div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
						<span className="h-1.5 w-1.5 rounded-full bg-foreground" />
						Stocked & featured by
					</div>
					<h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
						We're supported by
					</h2>
					<p className="mt-3 text-muted-foreground">
						A small but growing list of retailers and journals carrying our editions.
					</p>
				</div>

				<div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
					{partners.map((p) => (
						<div
							key={p.name}
							className="group relative flex items-center justify-center h-24 sm:h-28 rounded-2xl bg-background border border-border hover:border-foreground/20 hover:bg-cream transition-colors"
						>
							<span
								className={`text-xl sm:text-2xl text-foreground/85 group-hover:text-foreground transition-colors ${p.style}`}
							>
								{p.name}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
