const faqs = [
	{
		q: "What makes the bars different?",
		a: "We start with whole, recognizable ingredients — oats, honey, nuts, cacao — pressed, never extruded. No protein isolates, no sugar alcohols, no syrup blends. Most bars in our category list 18+ ingredients. Ours list six.",
	},
	{
		q: "How many grams of protein?",
		a: "12–14g of protein per bar, plus 4–6g of fiber. Sweetened only with raw clover honey and a touch of date paste.",
	},
	{
		q: "Are they gluten-free?",
		a: "Our Caramel Cashew bar is certified gluten-free. Our Honey Oat and Cocoa Almond bars use oats milled in a shared facility and aren't certified GF.",
	},
	{
		q: "How does shipping work?",
		a: "Orders ship within 24 hours from our Oakland kitchen. Free shipping on stacks over $40. Subscriptions ship every 2, 4, or 8 weeks — adjust or cancel anytime.",
	},
	{
		q: "What's your return policy?",
		a: "If you don't love it, we'll refund the full order — no questions, no shipping back required. We'd rather you tell us what's off so we can make it better.",
	},
];

export function FaqHome() {
	return (
		<section className="bg-espresso">
			<div className="max-w-3xl mx-auto px-4 sm:px-8 py-24 sm:py-32">
				<div className="text-center mb-14">
					<p className="font-display tracking-[0.32em] text-[11px] text-bronze-light mb-6">
						QUESTIONS, ANSWERED
					</p>
					<h2 className="font-display text-5xl sm:text-6xl text-cream leading-[0.9]">
						The fine print
						<br />
						you actually want.
					</h2>
				</div>

				<div className="divide-y divide-bronze/20 border-y border-bronze/20">
					{faqs.map((faq, i) => (
						<details key={faq.q} className="group py-6" {...(i === 0 ? { open: true } : {})}>
							<summary className="flex items-center justify-between cursor-pointer list-none">
								<span className="font-display text-lg sm:text-xl text-cream tracking-tight pr-6">
									{faq.q}
								</span>
								<span className="font-display text-bronze-light text-2xl shrink-0 transition-transform group-open:rotate-45">
									+
								</span>
							</summary>
							<p className="mt-4 text-cream/65 leading-relaxed text-sm sm:text-base max-w-2xl">{faq.a}</p>
						</details>
					))}
				</div>
			</div>
		</section>
	);
}
