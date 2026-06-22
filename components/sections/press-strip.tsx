const PRESS_LOGOS = [
	"GQ",
	"Vogue",
	"Outside",
	"Runner's World",
	"Esquire",
	"Forbes",
	"Wired",
	"Men's Health",
	"Bloomberg",
	"Hypebeast",
];

export function PressStrip() {
	return (
		<section className="bg-background border-y border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<p className="text-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-6">
					As featured in
				</p>
				<div className="relative overflow-hidden">
					<div className="flex gap-12 animate-marquee whitespace-nowrap will-change-transform">
						{[...PRESS_LOGOS, ...PRESS_LOGOS].map((logo, i) => (
							<span
								key={`${logo}-${i}`}
								className="text-foreground/40 hover:text-foreground/80 transition-colors text-2xl sm:text-3xl font-serif italic tracking-tight"
							>
								{logo}
							</span>
						))}
					</div>
					<div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
					<div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
				</div>
			</div>
		</section>
	);
}
