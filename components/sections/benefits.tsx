const BENEFITS = [
	{
		title: "A2 Dairy",
		body: "Brewed with single-source A2 milk for a creamier sip that’s easier on your stomach.",
		accent: "var(--color-cobalt)",
		icon: (
			<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
				<title>milk bottle</title>
				<path d="M24 10h16v6l4 6v32a4 4 0 01-4 4H24a4 4 0 01-4-4V22l4-6v-6z" />
				<path d="M20 30h24" />
				<circle cx="32" cy="40" r="3" fill="currentColor" />
			</svg>
		),
	},
	{
		title: "Happy Tummy",
		body: "Live cultures + low sugar formulation that keeps your gut microbes singing all morning.",
		accent: "var(--color-leaf-deep)",
		icon: (
			<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
				<title>smile</title>
				<circle cx="32" cy="32" r="22" />
				<circle cx="24" cy="26" r="2.5" fill="currentColor" />
				<circle cx="40" cy="26" r="2.5" fill="currentColor" />
				<path d="M22 38c3 5 8 7 10 7s7-2 10-7" />
			</svg>
		),
	},
	{
		title: "Real Espresso",
		body: "Cold-extracted single-origin beans — never instant, never bitter, always Saturday-good.",
		accent: "var(--color-pink)",
		icon: (
			<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
				<title>coffee bean</title>
				<ellipse cx="32" cy="32" rx="22" ry="14" transform="rotate(-30 32 32)" />
				<path d="M16 22c8 8 24 12 32 20" transform="rotate(-30 32 32)" />
			</svg>
		),
	},
];

export function Benefits() {
	return (
		<section className="relative bg-[var(--color-cream)] border-b-2 border-foreground/10 overflow-hidden">
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
				<div className="text-center max-w-2xl mx-auto mb-14">
					<p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-leaf-deep)] mb-3">
						Why drink us
					</p>
					<h2 className="display text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]">
						Gut friendly
						<br />
						<span className="text-[var(--color-pink)] italic">dairy</span> &mdash; for real.
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{BENEFITS.map((b, i) => (
						<div
							key={b.title}
							className="relative bg-white rounded-3xl p-8 border-2 border-foreground/10 hover-pop"
							style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -1 : 1}deg)` }}
						>
							{/* Badge */}
							<div
								className="absolute -top-5 -left-3 sticker w-14 h-14 rounded-full flex items-center justify-center text-white border-[3px] border-white"
								style={{ background: b.accent }}
							>
								<span className="display text-lg">{String(i + 1).padStart(2, "0")}</span>
							</div>
							<div className="w-16 h-16 mt-4 mb-6" style={{ color: b.accent }}>
								{b.icon}
							</div>
							<h3 className="display text-2xl uppercase mb-3">{b.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
						</div>
					))}
				</div>
			</div>
			{/* Halftone corner */}
			<div className="halftone absolute bottom-0 right-0 w-48 h-48 text-foreground pointer-events-none" />
		</section>
	);
}
