const benefits = [
	{
		label: "Naturally Alkaline",
		value: "pH 8.2",
		desc: "Soft mineral profile balanced over centuries through limestone bedrock.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
				<title>Alkaline pH</title>
				<path
					d="M24 6C20 14 12 20 12 30a12 12 0 0 0 24 0c0-10-8-16-12-24Z"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinejoin="round"
				/>
				<path d="M20 30c0 3 2 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
			</svg>
		),
	},
	{
		label: "Total Dissolved",
		value: "62 mg/L",
		desc: "Just enough calcium, magnesium and bicarbonate to feel almost sweet on the palate.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
				<title>Mineral content</title>
				<circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.6" />
				<path d="M14 24h20M24 14v20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
			</svg>
		),
	},
	{
		label: "Zero",
		value: "Plastics",
		desc: "Glass only. Bottled, sealed and shipped without a single drop of PET.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
				<title>No plastics</title>
				<rect x="18" y="10" width="12" height="32" rx="3" stroke="currentColor" strokeWidth="1.6" />
				<path d="M14 14l20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
			</svg>
		),
	},
	{
		label: "Carbon",
		value: "Neutral",
		desc: "Every shipment is offset through verified Pacific Northwest reforestation projects.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
				<title>Carbon neutral</title>
				<path
					d="M24 8c-9 4-14 12-14 20a14 14 0 0 0 28 0c0-8-5-16-14-20Z"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinejoin="round"
				/>
				<path d="M24 18v12M18 24h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
			</svg>
		),
	},
];

export function Benefits() {
	return (
		<section id="about" className="bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="max-w-2xl">
					<p className="text-[11px] tracking-[0.22em] uppercase text-yns-green font-medium">The good stuff</p>
					<h2 className="mt-4 font-display text-4xl sm:text-5xl text-yns-navy leading-[1.05]">
						Minerals in, <span className="italic">everything else out.</span>
					</h2>
				</div>
				<div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
					{benefits.map((b) => (
						<div key={b.label} className="border-t border-foreground/15 pt-6">
							<div className="text-yns-green w-10 h-10 mb-6">{b.icon}</div>
							<p className="text-[11px] tracking-[0.22em] uppercase text-foreground/55 font-medium">
								{b.label}
							</p>
							<p className="mt-2 font-display text-3xl text-yns-navy leading-none">{b.value}</p>
							<p className="mt-4 text-[14px] leading-relaxed text-foreground/70">{b.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
