const faqs = [
	{
		q: "How long does a typical residential install take?",
		a: "Most rooftop systems are installed in one to two days, after a permit cycle that runs 2–4 weeks depending on jurisdiction.",
	},
	{
		q: "Do solar panels work in cloudy or cold weather?",
		a: "Yes. Modern PERC panels still produce 10–25% of rated output under cloud cover, and actually run more efficiently in cooler temperatures.",
	},
	{
		q: "What warranty comes with each panel?",
		a: "Every panel ships with a 12-year product warranty and a 25-year linear performance warranty guaranteeing at least 84.8% output at year 25.",
	},
	{
		q: "Can I add a battery later?",
		a: "All of our inverters are storage-ready, so you can start grid-tied today and add a battery in a separate phase without re-pulling permits on the array.",
	},
	{
		q: "Is there financing available?",
		a: "We offer 0% APR for 18 months, plus longer-term solar loans through partner lenders. Most homeowners qualify in minutes.",
	},
];

export function FAQs() {
	return (
		<section className="bg-[var(--cream)]">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="text-center mb-10">
					<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--forest)]/70">
						Got questions?
					</p>
					<h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">FAQs</h2>
				</div>

				<div className="divide-y divide-[var(--forest-deep)]/10 rounded-3xl bg-white ring-1 ring-[var(--forest-deep)]/10 shadow-sm overflow-hidden">
					{faqs.map((f, i) => (
						<details key={f.q} className="group px-5 sm:px-6" open={i === 0}>
							<summary className="flex cursor-pointer items-center justify-between gap-6 py-5 list-none">
								<span className="text-[15px] sm:text-base font-medium text-foreground">{f.q}</span>
								<span className="flex shrink-0 size-8 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--forest-deep)] group-open:bg-[var(--lime)] transition-colors">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										className="size-4 transition-transform group-open:rotate-45"
										aria-hidden
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
									>
										<path d="M12 5v14M5 12h14" />
									</svg>
								</span>
							</summary>
							<div className="pb-5 -mt-1 pr-12 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
								{f.a}
							</div>
						</details>
					))}
				</div>
			</div>
		</section>
	);
}
