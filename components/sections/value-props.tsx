const PROPS = [
	{
		title: "Exclusive Design",
		body: "Limited-run vessels designed in-house and produced in small batches. No two are exactly alike — small variations are the signature of work made by hand.",
	},
	{
		title: "Handmade Work",
		body: "Each piece is thrown, hand-built, or hand-poured by independent makers we know by name. Glazes are mixed in studio from raw mineral pigments.",
	},
	{
		title: "Careful Delivery",
		body: "Wrapped in unbleached paper, cushioned in recycled fiber, and dispatched within 48 hours. Insured worldwide shipping with traceable carriers.",
	},
] as const;

export function ValueProps() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{PROPS.map((p, i) => {
						const isDark = i === 2;
						return (
							<div
								key={p.title}
								className={`rounded-2xl border p-8 ${isDark ? "bg-[var(--espresso)] text-[var(--bone)] border-[var(--espresso)]" : "bg-[var(--bone)] border-border text-foreground"}`}
							>
								<div className="flex items-center gap-3 mb-5">
									<span
										className={`text-[10px] tracking-[0.28em] uppercase font-medium ${isDark ? "text-[var(--clay)]" : "text-[var(--mahogany)]"}`}
									>
										0{i + 1}
									</span>
									<span className={`h-px flex-1 ${isDark ? "bg-[var(--bone)]/20" : "bg-foreground/15"}`} />
								</div>
								<h3
									className={`font-display text-2xl sm:text-[28px] leading-tight tracking-[0.04em] uppercase ${isDark ? "text-[var(--bone)]" : "text-foreground"}`}
								>
									{p.title}
								</h3>
								<p
									className={`mt-4 text-[14px] leading-relaxed ${isDark ? "text-[var(--bone)]/70" : "text-muted-foreground"}`}
								>
									{p.body}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
