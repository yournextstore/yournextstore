const values = [
	{
		label: "BPA-Free",
		caption: "Food-safe materials only",
		icon: (
			<svg viewBox="0 0 48 48" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.4">
				<circle cx="24" cy="24" r="18" />
				<path d="M24 8v32M8 24h32" />
				<path d="M14 14l20 20" />
			</svg>
		),
	},
	{
		label: "Ergonomic",
		caption: "Shaped from real hands",
		icon: (
			<svg viewBox="0 0 48 48" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.4">
				<path d="M16 8c4 0 8 4 8 10s-4 10-8 10" />
				<path d="M24 18c4 0 8 4 8 10s-4 12-8 12H10" />
				<path d="M16 40h-4" />
			</svg>
		),
	},
	{
		label: "Sustainably made",
		caption: "Glass, silicone, longevity",
		icon: (
			<svg viewBox="0 0 48 48" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.4">
				<path d="M24 6c10 4 16 12 16 22 0 8-6 14-16 14S8 36 8 28C8 18 14 10 24 6z" />
				<path d="M24 6v36" />
				<path d="M14 22c4 2 8 2 10 0 2-2 6-2 10 0" />
			</svg>
		),
	},
	{
		label: "Designed in Denmark",
		caption: "Made for slow homes",
		icon: (
			<svg viewBox="0 0 48 48" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.4">
				<rect x="6" y="10" width="36" height="24" />
				<path d="M18 10v24M6 22h36" />
			</svg>
		),
	},
];

export function Values() {
	return (
		<section className="bg-[var(--cream)] border-y border-[var(--border)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14 lg:py-20">
				<div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
					{values.map((v, i) => (
						<div
							key={v.label}
							className={`flex flex-col items-center text-center px-4 py-8 lg:py-4 ${i < 2 ? "lg:py-0" : ""}`}
						>
							<div className="text-[var(--olive-dark)] mb-4">{v.icon}</div>
							<h3 className="font-display text-xl text-foreground">{v.label}</h3>
							<p className="mt-1 text-[11px] tracking-[0.18em] uppercase text-foreground/60">{v.caption}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
