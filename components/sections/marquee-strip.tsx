const items = [
	"Organic Ingredients",
	"Fair Trade Espresso",
	"75mg Caffeine",
	"No Alcohol",
	"Small Batch",
	"Hand Crafted",
];

export function MarqueeStrip() {
	const looped = [...items, ...items, ...items, ...items];
	return (
		<section className="bg-espresso-marquee text-cream overflow-hidden border-y border-espresso-deep">
			<div className="flex whitespace-nowrap py-4 sm:py-5 animate-marquee">
				{looped.map((item, i) => (
					<div
						key={`marquee-${i}`}
						className="flex items-center px-6 sm:px-10 text-[11px] sm:text-xs uppercase tracking-[0.32em] font-medium shrink-0"
					>
						<span>{item}</span>
						<span className="ml-6 sm:ml-10 text-terracotta inline-block" aria-hidden="true">
							◆
						</span>
					</div>
				))}
			</div>
		</section>
	);
}
