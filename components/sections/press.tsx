const QUOTES = [
	{
		body: "The most quietly considered tea brand to land in Britain this decade. A glass kettle and a single pouch, and you understand the obsession.",
		source: "Financial Times — How To Spend It",
	},
	{
		body: "Loose leaf rendered as a daily ritual — slow, exacting, and unfussily beautiful. Their Earl Grey Lavender is what tea wants to taste like.",
		source: "Cereal Magazine",
	},
	{
		body: "Equal parts apothecary and design studio. The packaging alone justifies a place in the cupboard; the leaves justify everything else.",
		source: "Monocle, The Forecast",
	},
];

export function Press() {
	return (
		<section className="bg-[color:var(--color-yns-cream)]">
			<div className="max-w-6xl mx-auto px-6 lg:px-10 py-24 sm:py-28">
				<p className="text-center text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-yns-blue-400)]">
					Press
				</p>
				<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
					{QUOTES.map((q) => (
						<figure key={q.source} className="flex flex-col text-center">
							<span
								aria-hidden="true"
								className="mx-auto font-serif text-5xl leading-none text-[color:var(--color-yns-blue-400)]"
							>
								“
							</span>
							<blockquote className="mt-4 font-serif text-lg sm:text-xl font-light text-[color:var(--color-yns-navy)] leading-snug">
								{q.body}
							</blockquote>
							<figcaption className="mt-6 text-[11px] tracking-[0.32em] uppercase text-[color:var(--color-yns-navy)]/55">
								{q.source}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
