export function Press() {
	const logos = ["Bon Appetit", "The Cut", "Food & Wine", "Bustle", "Well + Good", "Eater"];
	const reviews = [
		{
			quote: "Genuinely tastes like a cinnamon roll. I'm baffled and obsessed in equal measure.",
			author: "Maya R.",
			handle: "@bakegoals",
		},
		{
			quote: "My 3pm snack got an upgrade. Crunchy, cozy, and somehow has protein in it.",
			author: "Jordan T.",
			handle: "@jordannibbles",
		},
		{
			quote: "Tastes like Sunday morning. Eats like a gym snack. I'm never going back.",
			author: "Riley C.",
			handle: "@rileyeatswell",
		},
	];

	return (
		<section className="bg-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<p className="text-[var(--cobalt)]/60 uppercase tracking-[0.25em] text-xs font-semibold text-center mb-8">
					As featured in
				</p>
				<div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mb-16 opacity-80">
					{logos.map((logo) => (
						<span
							key={logo}
							className="font-display text-[var(--cobalt)] text-lg sm:text-xl italic tracking-tight"
						>
							{logo}
						</span>
					))}
				</div>

				<div className="grid sm:grid-cols-3 gap-5">
					{reviews.map((r) => (
						<figure
							key={r.author}
							className="rounded-3xl bg-white p-6 border border-[var(--cobalt)]/10 cloud-shadow"
						>
							<div className="flex gap-1 mb-3 text-[var(--butter)]" role="img" aria-label="5 stars">
								{Array.from({ length: 5 }).map((_, i) => (
									<svg
										key={`s-${r.author}-${i}`}
										className="h-4 w-4"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true"
									>
										<path d="M12 2l2.9 6.5L22 10l-5 4.8L18 22l-6-3.4L6 22l1-7.2L2 10l7.1-1.5L12 2z" />
									</svg>
								))}
							</div>
							<blockquote className="text-[var(--cobalt)] text-base leading-relaxed">
								&ldquo;{r.quote}&rdquo;
							</blockquote>
							<figcaption className="mt-4 text-sm text-[var(--cobalt)]/65">
								<span className="font-semibold text-[var(--cobalt)]">{r.author}</span> · {r.handle}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
