const BRANDS = [
	"Balenciaga",
	"Acne Studios",
	"Jacquemus",
	"Alexander McQueen",
	"The Row",
	"Lemaire",
	"Loewe",
	"Maison Margiela",
	"Khaite",
	"Toteme",
	"Prada",
	"Dolce & Gabbana",
];

export function BrandMarquee() {
	const loop = [...BRANDS, ...BRANDS];
	return (
		<section className="border-y border-border/70 bg-background">
			<div className="mx-auto max-w-[1440px] overflow-hidden px-0 py-8 lg:py-10">
				<p className="px-6 text-center text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
					Stocking 120+ designer houses
				</p>
				<div className="mt-5 flex overflow-hidden">
					<div className="animate-marquee flex shrink-0 items-center gap-14 whitespace-nowrap px-7">
						{loop.map((brand, i) => (
							<span
								key={`${brand}-${i}`}
								className="font-display text-2xl italic text-foreground/70 lg:text-3xl"
							>
								{brand}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
