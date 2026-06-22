type Flavor = {
	name: string;
	tagline: string;
	color: string;
	accent: string;
};

const flavors: Flavor[] = [
	{
		name: "Passion Fruit",
		tagline: "Sunshine in a spoonful, with a tangy tropical lift.",
		color: "#f6c989",
		accent: "#c99a5e",
	},
	{
		name: "Meadow Berry",
		tagline: "Wild raspberry and strawberry from sunlit pastures.",
		color: "#d27a7a",
		accent: "#8b3a3a",
	},
	{
		name: "Vanilla Bean",
		tagline: "Real Madagascar pods, slow-steeped for depth.",
		color: "#e7c79a",
		accent: "#8b5e3c",
	},
];

function FolkLid({ color, accent }: { color: string; accent: string }) {
	return (
		<svg viewBox="0 0 160 160" className="w-full h-full" aria-hidden>
			<defs>
				<radialGradient id={`lid-${color.replace("#", "")}`} cx="50%" cy="40%" r="60%">
					<stop offset="0%" stopColor="#fff6e6" />
					<stop offset="100%" stopColor={color} />
				</radialGradient>
			</defs>
			<circle
				cx="80"
				cy="80"
				r="74"
				fill={`url(#lid-${color.replace("#", "")})`}
				stroke={accent}
				strokeWidth="2.5"
			/>
			<circle
				cx="80"
				cy="80"
				r="62"
				fill="none"
				stroke={accent}
				strokeWidth="1.2"
				strokeDasharray="3 4"
				opacity="0.6"
			/>
			<g transform="translate(80 80)">
				<circle r="22" fill="#fbf4e8" stroke={accent} strokeWidth="1.5" />
				<path d="M -10 6 Q -5 -10 0 -6 Q 5 -10 10 6 Z" fill={accent} />
				<circle cx="-4" cy="-2" r="1.8" fill="#4a2c1a" />
				<circle cx="4" cy="-2" r="1.8" fill="#4a2c1a" />
				<path d="M -4 5 Q 0 8 4 5" stroke="#4a2c1a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
			</g>
			{/* Decorative berries / leaves */}
			<g fill={accent} opacity="0.85">
				<circle cx="32" cy="56" r="3" />
				<circle cx="38" cy="62" r="2.5" />
				<circle cx="124" cy="58" r="3" />
				<circle cx="118" cy="64" r="2.5" />
				<path d="M 30 110 Q 36 100 44 110 Z" />
				<path d="M 116 110 Q 124 100 130 110 Z" />
			</g>
		</svg>
	);
}

export function FlavorFeatures() {
	return (
		<section className="bg-[#ecdcc1] border-y-2 border-dashed border-[#d9c1a3]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="text-center max-w-xl mx-auto">
					<p className="font-display text-xs sm:text-sm tracking-[0.32em] uppercase text-[#8b5e3c]">
						The Lineup
					</p>
					<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4a2c1a]">
						A flavor for every craving
					</h2>
				</div>

				<div className="mt-12 grid gap-10 sm:gap-8 md:grid-cols-3">
					{flavors.map((flavor) => (
						<div key={flavor.name} className="text-center group">
							<div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 transition-transform group-hover:-rotate-6">
								<div className="absolute inset-2 rounded-full bg-[#4a2c1a]/10 blur-md" />
								<div className="relative w-full h-full">
									<FolkLid color={flavor.color} accent={flavor.accent} />
								</div>
							</div>
							<h3 className="mt-5 font-display text-2xl sm:text-3xl font-extrabold text-[#4a2c1a]">
								{flavor.name}
							</h3>
							<p className="mt-2 px-2 text-sm sm:text-base text-[#8b5e3c] leading-relaxed">
								{flavor.tagline}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
