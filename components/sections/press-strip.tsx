const LOGOS = ["BON APPETIT", "GOOP", "MEN'S HEALTH", "ELLE", "NYT COOKING", "VOGUE", "FOOD & WINE"];

export function PressStrip() {
	const items = [
		...LOGOS.map((l) => ({ label: l, group: "a" })),
		...LOGOS.map((l) => ({ label: l, group: "b" })),
	];
	return (
		<section className="bg-[var(--color-cream)] border-y-2 border-foreground/10 py-10 overflow-hidden">
			<div className="max-w-7xl mx-auto px-6 mb-6">
				<p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
					As seen in
				</p>
			</div>
			<div className="relative">
				<div className="yns-marquee flex items-center whitespace-nowrap gap-12 lg:gap-16 will-change-transform">
					{items.map((logo) => (
						<span
							key={`${logo.group}-${logo.label}`}
							className="display text-2xl sm:text-3xl uppercase tracking-tight text-foreground/70 hover:text-foreground transition-colors"
						>
							{logo.label}
						</span>
					))}
				</div>
				{/* Edge fade */}
				<div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-cream)] to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--color-cream)] to-transparent" />
			</div>
		</section>
	);
}
