const props = [
	{
		title: "100% Vegan",
		copy: "Plant-based start to finish.",
		icon: (
			<path
				d="M32 6 C 16 14, 8 30, 12 46 C 16 56, 28 60, 32 58 C 36 60, 48 56, 52 46 C 56 30, 48 14, 32 6 Z M 32 12 L 32 56"
				stroke="currentColor"
				strokeWidth="3"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		),
	},
	{
		title: "High Protein",
		copy: "13–15g per pouch.",
		icon: (
			<g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
				<rect x="10" y="22" width="44" height="20" rx="3" />
				<rect x="4" y="28" width="6" height="8" />
				<rect x="54" y="28" width="6" height="8" />
				<line x1="20" y1="22" x2="20" y2="42" />
				<line x1="44" y1="22" x2="44" y2="42" />
			</g>
		),
	},
	{
		title: "Gluten Free",
		copy: "Certified, every batch.",
		icon: (
			<g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
				<circle cx="32" cy="32" r="22" />
				<line x1="14" y1="14" x2="50" y2="50" />
				<path d="M32 14 C 28 22, 28 30, 32 38" />
				<path d="M32 26 C 36 30, 36 36, 32 42" />
			</g>
		),
	},
	{
		title: "Non-GMO",
		copy: "Whole-food ingredients.",
		icon: (
			<g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
				<path d="M16 50 C 16 30, 26 14, 48 12" />
				<path d="M32 50 C 32 38, 38 30, 48 24" />
				<path d="M22 36 C 28 36, 34 32, 36 26" />
				<circle cx="48" cy="12" r="3" fill="currentColor" />
			</g>
		),
	},
];

export function ValueProps() {
	return (
		<section className="bg-cream-paper">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="rounded-[36px] bg-[var(--cream-deep)] border border-forest/10 px-6 sm:px-10 py-12 sm:py-14">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-6">
						{props.map((prop) => (
							<div key={prop.title} className="flex flex-col items-center text-center text-forest">
								<svg viewBox="0 0 64 64" className="w-12 h-12 mb-4">
									{prop.icon}
								</svg>
								<h4 className="font-display uppercase tracking-[0.18em] text-lg">{prop.title}</h4>
								<p className="mt-1 text-sm text-forest/70">{prop.copy}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
