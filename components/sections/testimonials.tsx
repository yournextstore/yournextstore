const QUOTES = [
	{
		text: "I swapped my afternoon coffee for the cacao mix and I haven't crashed since. Genuinely the calmest focus I've had in years.",
		name: "Mariana R.",
		role: "Writer · Lisbon",
		splash: "bg-[color:var(--color-mush-yellow)]",
	},
	{
		text: "The lion's mane tincture tastes like the forest floor in the best way. My foggy mornings are gone.",
		name: "Tom A.",
		role: "Endurance coach · Berlin",
		splash: "bg-[#b6e3f4]",
	},
	{
		text: "You can taste that it's not industrial. Real mushrooms, real ritual — feels like an old apothecary in a pouch.",
		name: "Inês V.",
		role: "Herbalist · Porto",
		splash: "bg-[color:var(--color-mush-chartreuse)]",
	},
];

function Stars() {
	return (
		<div
			role="img"
			aria-label="5 out of 5 stars"
			className="flex gap-0.5 text-[color:var(--color-mush-yellow-deep)]"
		>
			{Array.from({ length: 5 }).map((_, i) => (
				<svg key={`star-${i}`} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
					<title>star</title>
					<path d="M10 1.5l2.6 5.5 6 .9-4.3 4.2 1 6-5.3-2.8L4.7 18l1-6L1.4 7.9l6-.9L10 1.5z" />
				</svg>
			))}
		</div>
	);
}

export function Testimonials() {
	return (
		<section className="bg-[color:var(--color-mush-espresso)] text-[color:var(--color-mush-cream)] py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto">
					<p className="font-script text-3xl text-[color:var(--color-mush-yellow)]">Loved by ritual-makers</p>
					<h2 className="mt-2 font-display text-4xl sm:text-5xl text-[color:var(--color-mush-cream)] leading-tight">
						Small farm.
						<br />
						Big mornings.
					</h2>
				</div>
				<div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
					{QUOTES.map((q, i) => (
						<figure key={`q-${i}`} className="relative rounded-3xl bg-[#2a1408] p-7 border border-white/5">
							<div className={`absolute -top-3 left-6 rounded-full ${q.splash} px-3 py-1`}>
								<Stars />
							</div>
							<blockquote className="mt-4 text-[color:var(--color-mush-cream)]/90 text-base leading-relaxed">
								&ldquo;{q.text}&rdquo;
							</blockquote>
							<figcaption className="mt-6 flex items-center gap-3">
								<div className="h-9 w-9 rounded-full bg-[color:var(--color-mush-yellow)] grid place-items-center font-display text-[color:var(--color-mush-espresso)]">
									{q.name[0]}
								</div>
								<div>
									<div className="font-display text-sm tracking-wide text-[color:var(--color-mush-cream)]">
										{q.name}
									</div>
									<div className="text-xs text-[color:var(--color-mush-cream)]/60">{q.role}</div>
								</div>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
