const testimonials = [
	{
		stars: 5,
		quote:
			"I genuinely look forward to these. My morning routine is now a 10-second ritual, not a swallowing contest.",
		name: "Maya R.",
		role: "Beauty strip — 4 months in",
		avatar: "#f4884a",
		initial: "M",
	},
	{
		stars: 5,
		quote:
			"Fell asleep in 20 minutes and didn't wake up groggy. I've tried every melatonin gummy out there — this is the one.",
		name: "Jordan K.",
		role: "Sleep strip — daily",
		avatar: "#4b1fb5",
		initial: "J",
	},
	{
		stars: 5,
		quote:
			"Energy without the jitters or the 2pm crash. My team thinks I'm hiding something. I'm just hiding these in my pocket.",
		name: "Priya S.",
		role: "Energy strip — pre-workout",
		avatar: "#f5c518",
		initial: "P",
	},
];

function Star() {
	return (
		<svg viewBox="0 0 20 20" fill="#f5c518" className="h-4 w-4">
			<path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
		</svg>
	);
}

export function Testimonials() {
	return (
		<section className="bg-[#fef7f0]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
					<div>
						<p className="font-marker text-[#f4884a] text-xl mb-2 -rotate-2">the receipts</p>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1a0f4d]">12,000+ five-star reviews.</h2>
					</div>
					<div className="flex items-center gap-2 text-sm font-bold text-[#1a0f4d]">
						<div className="flex gap-0.5">
							{Array.from({ length: 5 }).map((_, i) => (
								<Star key={`hdr-${i.toString()}`} />
							))}
						</div>
						<span>4.9 / 5 average</span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					{testimonials.map((t, i) => (
						<figure
							key={t.name}
							className={`relative rounded-[2rem] bg-white border-2 border-[#ecd9c6] p-7 ${i === 1 ? "md:-translate-y-4" : ""}`}
						>
							<div className="flex gap-0.5 mb-4">
								{Array.from({ length: t.stars }).map((_, s) => (
									<Star key={`s-${i.toString()}-${s.toString()}`} />
								))}
							</div>
							<blockquote className="text-[#1a0f4d] text-base leading-relaxed font-medium mb-6">
								&ldquo;{t.quote}&rdquo;
							</blockquote>
							<figcaption className="flex items-center gap-3">
								<span
									className="inline-flex h-10 w-10 items-center justify-center rounded-full font-extrabold text-white text-sm"
									style={{ backgroundColor: t.avatar }}
								>
									{t.initial}
								</span>
								<div>
									<p className="text-sm font-bold text-[#1a0f4d]">{t.name}</p>
									<p className="text-xs text-[#1a0f4d]/60">{t.role}</p>
								</div>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
