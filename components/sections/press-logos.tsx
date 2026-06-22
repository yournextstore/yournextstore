const PRESS = [
	"The Atlantic",
	"Architectural Digest",
	"The New Yorker",
	"Kinfolk",
	"Apartamento",
	"WSJ Magazine",
	"Cabana",
];

export function PressLogos() {
	return (
		<section className="bg-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<p className="text-center heritage-smallcaps text-[var(--ink)]/55 mb-8">As featured in</p>

				<div className="relative overflow-hidden">
					<div className="flex gap-12 sm:gap-16 marquee-track whitespace-nowrap">
						{[...PRESS, ...PRESS].map((name, i) => (
							<span
								key={`${name}-${i}`}
								className="font-display italic text-xl sm:text-2xl tracking-tight text-[var(--ink)]/55 hover:text-[var(--oxblood)] transition-colors"
							>
								{name}
							</span>
						))}
					</div>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[var(--cream)] to-transparent"
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[var(--cream)] to-transparent"
					/>
				</div>
			</div>
		</section>
	);
}
