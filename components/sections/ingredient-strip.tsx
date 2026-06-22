const claims = [
	{
		label: "No Seed Oils",
		body: "Cold-pressed olive & avocado only — never canola, soy, or corn.",
		icon: (
			<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
				<path d="M16 4c-4 4-7 8-7 13a7 7 0 0 0 14 0c0-5-3-9-7-13Z" stroke="currentColor" strokeWidth="1.4" />
				<path d="M6 26L26 6" stroke="currentColor" strokeWidth="1.4" />
			</svg>
		),
	},
	{
		label: "No Preservatives",
		body: "Vinegar, salt, and citrus do the work — nothing synthetic.",
		icon: (
			<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
				<rect x="9" y="10" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" />
				<path d="M12 10V6h8v4" stroke="currentColor" strokeWidth="1.4" />
				<path d="M12 18l8 6M20 18l-8 6" stroke="currentColor" strokeWidth="1.4" />
			</svg>
		),
	},
	{
		label: "Real Ingredients",
		body: "Every label reads like a recipe. Nine words or fewer.",
		icon: (
			<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
				<path
					d="M16 5C9 5 5 11 5 17s4 10 11 10 11-4 11-10S23 5 16 5Z"
					stroke="currentColor"
					strokeWidth="1.4"
				/>
				<path d="M16 5c4 5 4 17 0 22M5 17h22" stroke="currentColor" strokeWidth="1.4" />
			</svg>
		),
	},
	{
		label: "Small Batch",
		body: "Bottled by hand in California. Every lot tasted before shipping.",
		icon: (
			<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
				<path d="M8 26h16M10 26V10h12v16" stroke="currentColor" strokeWidth="1.4" />
				<path d="M13 14h6M13 18h6M13 22h6" stroke="currentColor" strokeWidth="1.4" />
				<path d="M10 10l2-4h8l2 4" stroke="currentColor" strokeWidth="1.4" />
			</svg>
		),
	},
];

export function IngredientStrip() {
	return (
		<section className="relative border-y border-[var(--brand-ink)]/10 bg-[var(--brand-cream)]">
			<div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
				<div className="mb-12 flex flex-col items-center gap-3">
					<p className="font-mono-ed text-[10px] uppercase tracking-[0.32em] text-[var(--brand-ember)]">
						The fine print isn't fine print
					</p>
					<h3 className="text-center font-display text-2xl font-medium tracking-tight text-[var(--brand-ink)] sm:text-3xl">
						What goes in. What stays out.
					</h3>
				</div>
				<div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-y-14 lg:grid-cols-4 lg:gap-8">
					{claims.map((claim) => (
						<div key={claim.label} className="flex flex-col items-center text-center">
							<div className="mb-5 flex h-14 w-14 items-center justify-center text-[var(--brand-ember)]">
								{claim.icon}
							</div>
							<h4 className="font-display text-lg font-medium tracking-tight text-[var(--brand-ink)]">
								{claim.label}
							</h4>
							<p className="mt-2 max-w-[14rem] font-mono-ed text-[11px] leading-relaxed text-[var(--brand-ink)]/65">
								{claim.body}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
