const VALUES = [
	{
		title: "Clean Formulas",
		description: "Plant-pressed butters, never silicones, parabens, or synthetic fragrance.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-9 w-9">
				<path
					d="M24 6c-6 8-10 14-10 20a10 10 0 0020 0c0-6-4-12-10-20z"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path d="M20 28a6 6 0 004 4" strokeLinecap="round" />
			</svg>
		),
	},
	{
		title: "Buildable Color",
		description: "Sheer one swipe, opaque after three. Every shade works on every skin tone.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-9 w-9">
				<circle cx="18" cy="24" r="9" />
				<circle cx="30" cy="24" r="9" />
				<circle cx="24" cy="32" r="9" />
			</svg>
		),
	},
	{
		title: "Refillable Tubes",
		description: "Aluminum bullets you keep — magnetic refills cut packaging waste by 78%.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-9 w-9">
				<rect x="18" y="6" width="12" height="20" rx="1.5" />
				<path d="M14 26h20v14a4 4 0 01-4 4H18a4 4 0 01-4-4V26z" />
				<path d="M24 6v4" strokeLinecap="round" />
			</svg>
		),
	},
	{
		title: "Made for Daily Wear",
		description: "Eight-hour hydrating wear, kiss-friendly finish, never sticky.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-9 w-9">
				<path d="M12 24a12 12 0 0124 0c0 4-2 7-6 9l-3 2H21l-3-2c-4-2-6-5-6-9z" strokeLinejoin="round" />
				<path d="M19 23c2-2 4-2 5 0c1-2 3-2 5 0" strokeLinecap="round" />
			</svg>
		),
	},
];

export function About() {
	return (
		<section id="about" className="bg-warm-paper border-y border-foreground/10">
			<div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					<div className="lg:col-span-4">
						<p className="text-eyebrow text-[color:var(--color-terracotta-deep)] mb-4">The Ritual</p>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-[3.2rem] leading-[1.05] tracking-tight text-foreground">
							Color that loves your lips back.
						</h2>
						<p className="mt-7 text-foreground/70 leading-relaxed">
							We started Your Next Store because the world had enough drying, drag-and-stain lip color. Every
							formula begins with shea, ends with squalane, and is poured in small batches by women-owned
							suppliers from Marseille to Marrakech.
						</p>
					</div>

					<div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
						{VALUES.map((value) => (
							<div key={value.title} className="flex gap-5">
								<div className="shrink-0 text-[color:var(--color-terracotta-deep)]">{value.icon}</div>
								<div>
									<h3 className="text-eyebrow text-foreground mb-2">{value.title}</h3>
									<p className="text-foreground/65 leading-relaxed">{value.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
