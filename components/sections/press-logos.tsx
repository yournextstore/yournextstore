const PRESS = [
	"Kinfolk",
	"Cereal",
	"Apartamento",
	"AD France",
	"The Modern House",
	"Cabana",
	"T Magazine",
	"Wallpaper*",
];

export function PressLogos() {
	return (
		<section className="bg-sand/60 py-12 sm:py-14 border-y border-border/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<p className="text-[11px] uppercase tracking-[0.32em] text-espresso/60 text-center mb-8">
					Featured in
				</p>
				<div className="overflow-hidden">
					<div className="flex animate-aura-marquee gap-12 sm:gap-16 whitespace-nowrap will-change-transform">
						{[...PRESS, ...PRESS].map((name, idx) => (
							<span
								key={`${name}-${idx}`}
								className="font-serif italic text-2xl sm:text-3xl text-espresso/45 hover:text-espresso/80 transition-colors"
							>
								{name}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
