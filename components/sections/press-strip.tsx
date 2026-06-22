const outlets = [
	"The New York Times",
	"CNN",
	"The Wall Street Journal",
	"Financial Times",
	"VOGUE",
	"The New Yorker",
	"FAST COMPANY",
	"TechCrunch",
];

export function PressStrip() {
	return (
		<section aria-label="Featured in" className="border-y border-border bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="brick-marquee-fade overflow-hidden py-7 sm:py-8">
					<div className="flex w-max items-center gap-14 sm:gap-20 brick-marquee-track">
						{[...outlets, ...outlets].map((name, i) => (
							<span
								key={`press-${i}`}
								className="font-display text-base sm:text-xl font-semibold uppercase tracking-[0.04em] text-foreground/85 whitespace-nowrap"
								style={{
									fontFamily:
										name === "The New York Times" || name === "The New Yorker"
											? "'Times New Roman', Times, serif"
											: name === "VOGUE" || name === "The Wall Street Journal" || name === "Financial Times"
												? "'Times New Roman', Times, serif"
												: undefined,
									letterSpacing: name === "VOGUE" ? "0.25em" : name === "FAST COMPANY" ? "0.15em" : undefined,
								}}
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
