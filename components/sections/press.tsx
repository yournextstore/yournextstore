const outlets = [
	"Bon Appétit",
	"Cherry Bombe",
	"Food & Wine",
	"The Kitchn",
	"Eater",
	"Saveur",
	"Bon Vivant",
	"Edible",
];

export function Press() {
	return (
		<section className="bg-background border-y border-mahogany/15">
			<div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-10">
				<p className="font-mono mb-6 text-center text-[10px] uppercase tracking-[0.4em] text-mahogany/60">
					— as seen in —
				</p>
				<div className="relative overflow-hidden">
					<div className="animate-marquee flex w-max gap-16 whitespace-nowrap">
						{[...outlets, ...outlets].map((name, i) => (
							<span
								key={`${name}-${i}`}
								className="font-display text-2xl italic text-mahogany/45 sm:text-3xl"
								style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
							>
								{name}
							</span>
						))}
					</div>
					<div
						aria-hidden
						className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent"
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent"
					/>
				</div>
			</div>
		</section>
	);
}
