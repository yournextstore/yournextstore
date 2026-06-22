const PILLARS = [
	{
		label: "Hundred-night trial",
		body: "Sleep on it for a season. If it isn’t the mattress for you, we collect it ourselves and rehome it.",
		icon: (
			<svg viewBox="0 0 56 56" className="h-12 w-12" aria-hidden="true">
				<title>Crescent moon, hundred-night trial</title>
				<circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="1" />
				<path d="M36 14 a18 18 0 1 0 6 26 14 14 0 1 1 -6 -26 z" fill="currentColor" opacity="0.92" />
			</svg>
		),
	},
	{
		label: "Two-decade warranty",
		body: "Twenty years on every tuft, button, and seam — and a quiet repair if the cotton ever asks for it.",
		icon: (
			<svg viewBox="0 0 56 56" className="h-12 w-12" aria-hidden="true">
				<title>Heritage seal, twenty-year warranty</title>
				<circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="1" />
				<circle cx="28" cy="28" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
				<path
					d="M18 28 L26 36 L40 20"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	{
		label: "Delivery by white glove",
		body: "Two attendants will carry, place, and dress your bed — and take away the one it replaces.",
		icon: (
			<svg viewBox="0 0 56 56" className="h-12 w-12" aria-hidden="true">
				<title>Drayage carriage, white-glove delivery</title>
				<circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="1" />
				<rect x="14" y="22" width="22" height="12" fill="none" stroke="currentColor" strokeWidth="1.2" />
				<path d="M36 26 L44 26 L44 34 L36 34" fill="none" stroke="currentColor" strokeWidth="1.2" />
				<circle cx="20" cy="38" r="3" fill="currentColor" />
				<circle cx="40" cy="38" r="3" fill="currentColor" />
			</svg>
		),
	},
];

export function Trial() {
	return (
		<section className="bg-[var(--cream)] border-t border-b border-[var(--ink)]/12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="text-center mb-12">
					<span className="heritage-smallcaps text-[var(--oxblood)]">The covenant</span>
					<h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl tracking-[-0.01em] text-[var(--ink)]">
						Three quiet <em className="italic">promises</em>
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14">
					{PILLARS.map((p) => (
						<div key={p.label} className="text-center text-[var(--ink)]">
							<div className="inline-flex text-[var(--oxblood)] mb-5">{p.icon}</div>
							<h3 className="font-display text-xl sm:text-2xl tracking-tight">{p.label}</h3>
							<p className="mt-3 text-sm italic text-[var(--ink)]/70 leading-relaxed max-w-[26ch] mx-auto">
								{p.body}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
