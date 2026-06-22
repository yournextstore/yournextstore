const outlets = [
	{ name: "Bon Appétit", style: "font-display italic text-2xl" },
	{ name: "EATER", style: "font-wordmark text-xl tracking-[0.28em]" },
	{ name: "Food & Wine", style: "font-display text-xl tracking-tight" },
	{ name: "The Infatuation", style: "font-display italic text-2xl" },
	{ name: "NYT Cooking", style: "font-mono-ed text-base tracking-[0.18em] uppercase" },
	{ name: "Saveur", style: "font-display text-2xl tracking-tight" },
];

export function PressRow() {
	return (
		<section className="relative bg-[var(--brand-cream)]">
			<div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
				<p className="text-center font-mono-ed text-[10px] uppercase tracking-[0.32em] text-[var(--brand-ink)]/45">
					Quietly making noise in
				</p>
				<div className="mt-10 grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
					{outlets.map((outlet) => (
						<div
							key={outlet.name}
							className={`${outlet.style} flex items-center justify-center text-[var(--brand-ink)]/55 transition-colors hover:text-[var(--brand-ink)]`}
						>
							{outlet.name}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
