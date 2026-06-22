const quotes = [
	{
		quote:
			"These cookies pulled my whole Valentine's plan together. The ribbon, the note — the receiver actually cried.",
		name: "Margaret S.",
		city: "Brooklyn, NY",
	},
	{
		quote: "Stayed gooey for days. I've already re-ordered. My family thinks I'm running a side business.",
		name: "Lenny W.",
		city: "Austin, TX",
	},
	{
		quote: "The little hand-drawn note inside was such a sweet touch. Feels like a tiny bakery hug.",
		name: "Priya R.",
		city: "Seattle, WA",
	},
];

function Stars() {
	return (
		<div className="flex gap-0.5 text-[var(--candy)]">
			{Array.from({ length: 5 }).map((_, i) => (
				<svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
					<title>star</title>
					<path d="M12 2l3 7 7 .9-5.2 4.8 1.6 7.3L12 18l-6.4 4 1.6-7.3L2 9.9 9 9z" />
				</svg>
			))}
		</div>
	);
}

export function Testimonials() {
	return (
		<section className="bg-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="text-center mb-14">
					<p className="text-xs font-bold tracking-[0.3em] text-[var(--candy)] uppercase">
						SUGAR-COATED REVIEWS
					</p>
					<h2 className="mt-3 font-display italic text-[var(--maroon)] text-4xl sm:text-5xl tracking-tight">
						Word of mouth (full of cookie)
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{quotes.map((q) => (
						<figure
							key={q.name}
							className="rounded-3xl bg-white p-8 ring-1 ring-[var(--border)] shadow-[0_10px_30px_rgba(92,27,38,0.08)] flex flex-col"
						>
							<Stars />
							<blockquote className="mt-5 font-display italic text-xl text-[var(--maroon)] leading-snug flex-1">
								“{q.quote}”
							</blockquote>
							<figcaption className="mt-6 pt-5 border-t border-[var(--border)]">
								<p className="text-sm font-bold text-[var(--ink)]">{q.name}</p>
								<p className="text-xs tracking-[0.15em] uppercase text-[var(--ink)]/60">{q.city}</p>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
