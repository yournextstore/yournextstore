import Image from "next/image";

const quotes = [
	{
		quote: "The only bar that doesn't feel like punishment after a 20-mile trail run.",
		name: "Marin Cole",
		role: "Ultra Runner",
	},
	{
		quote: "Real ingredients I'd actually buy at the market — pressed into a bar.",
		name: "Devon Reyes",
		role: "Chef · Brooklyn",
	},
	{
		quote: "Lives in my chalk bag, my saddlebag and my desk drawer. Honest fuel.",
		name: "Sloan Whitaker",
		role: "Climber",
	},
];

export function Testimonials() {
	return (
		<section className="relative overflow-hidden">
			<div className="absolute inset-0">
				<Image src="/scraped-4.jpg" alt="" fill sizes="100vw" className="object-cover object-center" />
				<div className="absolute inset-0 bg-espresso/80" />
				<div className="absolute inset-0 bg-linear-to-b from-espresso via-transparent to-espresso" />
			</div>

			<div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8 py-24 sm:py-32">
				<p className="font-display tracking-[0.32em] text-[11px] text-bronze-light text-center mb-10">
					FROM THE FIELD
				</p>

				<div className="grid md:grid-cols-3 gap-10 md:gap-16">
					{quotes.map((q) => (
						<figure key={q.name} className="text-center md:text-left">
							<span className="font-display text-7xl text-bronze leading-none block mb-4">"</span>
							<blockquote className="font-display text-2xl sm:text-3xl text-cream leading-[1.05] mb-6">
								{q.quote}
							</blockquote>
							<figcaption>
								<p className="font-display text-sm tracking-[0.18em] text-cream">{q.name}</p>
								<p className="text-bronze-light text-xs uppercase tracking-widest mt-1">{q.role}</p>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
