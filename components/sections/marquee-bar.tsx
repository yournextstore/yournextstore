const items = [
	"High-Grade Formulas",
	"Positive Skin Science",
	"One Of A Kind",
	"High-Grade Formulas",
	"Positive Skin Science",
	"One Of A Kind",
	"High-Grade Formulas",
	"Positive Skin Science",
	"One Of A Kind",
	"High-Grade Formulas",
	"Positive Skin Science",
	"One Of A Kind",
];

export function MarqueeBar() {
	return (
		<section className="overflow-hidden border-y border-border bg-brand-lime/20 py-4">
			<div className="animate-marquee flex whitespace-nowrap">
				{items.map((item, i) => (
					<span
						key={`marquee-${i}`}
						className="mx-6 text-sm font-semibold uppercase tracking-widest text-foreground sm:mx-8 sm:text-base"
					>
						{item}
					</span>
				))}
				{items.map((item, i) => (
					<span
						key={`marquee-dup-${i}`}
						className="mx-6 text-sm font-semibold uppercase tracking-widest text-foreground sm:mx-8 sm:text-base"
					>
						{item}
					</span>
				))}
			</div>
		</section>
	);
}
