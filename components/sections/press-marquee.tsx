const press = [
	"RUNNER'S WORLD",
	"OUTSIDE",
	"BON APPÉTIT",
	"MEN'S HEALTH",
	"BICYCLING",
	"GQ",
	"FAST COMPANY",
	"NEW YORK TIMES",
];

export function PressMarquee() {
	return (
		<section className="bg-espresso border-y border-bronze/20 py-10 overflow-hidden">
			<p className="font-display tracking-[0.32em] text-[11px] text-bronze-light text-center mb-8">
				AS SEEN IN
			</p>
			<div className="relative">
				<div className="flex animate-marquee whitespace-nowrap">
					{[...press, ...press].map((p, i) => (
						<span
							key={`${p}-${i}`}
							className="font-display text-2xl sm:text-3xl tracking-[0.18em] text-bronze/60 mx-10 inline-block"
						>
							{p}
						</span>
					))}
				</div>
				<div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-espresso to-transparent pointer-events-none" />
				<div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-espresso to-transparent pointer-events-none" />
			</div>
		</section>
	);
}
