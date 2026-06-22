const POINTS = [
	{
		title: "Lace, hand-finished",
		body: "Heirloom Chantilly and Leavers lace, woven by ateliers in France and Italy.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
				<title>Lace</title>
				<circle cx="24" cy="24" r="9" stroke="currentColor" strokeWidth="1" />
				<circle cx="24" cy="9" r="4" stroke="currentColor" strokeWidth="1" />
				<circle cx="24" cy="39" r="4" stroke="currentColor" strokeWidth="1" />
				<circle cx="9" cy="24" r="4" stroke="currentColor" strokeWidth="1" />
				<circle cx="39" cy="24" r="4" stroke="currentColor" strokeWidth="1" />
				<circle cx="13" cy="13" r="2.5" stroke="currentColor" strokeWidth="1" />
				<circle cx="35" cy="13" r="2.5" stroke="currentColor" strokeWidth="1" />
				<circle cx="13" cy="35" r="2.5" stroke="currentColor" strokeWidth="1" />
				<circle cx="35" cy="35" r="2.5" stroke="currentColor" strokeWidth="1" />
			</svg>
		),
	},
	{
		title: "Second-skin comfort",
		body: "Engineered seamless edges and breathable jersey that disappears under everything.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
				<title>Comfort</title>
				<path
					d="M12 18c0-4 4-7 8-7 3 0 4 1 4 1s1-1 4-1c4 0 8 3 8 7 0 8-12 16-12 16s-12-8-12-16z"
					stroke="currentColor"
					strokeWidth="1"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	{
		title: "Ethically made",
		body: "Small-batch production with audited, fair-wage partners. No shortcuts, ever.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
				<title>Ethical</title>
				<circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1" />
				<path
					d="M17 24l5 5 9-11"
					stroke="currentColor"
					strokeWidth="1.2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
];

export function StoryStrip() {
	return (
		<section className="bg-[#f5ede2]">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
				<div className="mb-12 text-center">
					<p className="text-[11px] font-medium uppercase tracking-[0.24em] text-clay">Fabric & Fit</p>
					<h2
						className="mt-3 font-display text-[34px] italic leading-tight text-foreground sm:text-[44px]"
						style={{ fontFamily: "var(--font-cormorant)" }}
					>
						Made to be lived in.
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
					{POINTS.map((p) => (
						<div key={p.title} className="flex flex-col items-center text-center">
							<div className="text-clay">{p.icon}</div>
							<h3 className="mt-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-foreground">
								{p.title}
							</h3>
							<p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted-foreground">{p.body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
