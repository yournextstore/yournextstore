const quotes = [
	{ source: "Bon Appétit", line: "“The crispy, chewy savory snack we didn’t know we needed.”" },
	{ source: "Eater", line: "“A pouch that punches way above its weight class.”" },
	{ source: "Food & Wine", line: "“Genuinely craveable plant protein — finally.”" },
	{ source: "The Strategist", line: "“Officially in our desk-drawer rotation.”" },
];

const logos = ["BON APPÉTIT", "EATER", "FOOD & WINE", "STRATEGIST", "FORBES", "GOOP"];

export function Press() {
	return (
		<section className="bg-cream py-16 sm:py-20 border-y border-charcoal/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<p className="text-center font-display text-[11px] tracking-[0.32em] uppercase text-chili">
					Crunched, reviewed, approved
				</p>

				<div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{quotes.map((q) => (
						<figure key={q.source} className="rounded-2xl border border-charcoal/10 bg-card p-6">
							<blockquote className="font-script italic text-base text-charcoal leading-relaxed">
								{q.line}
							</blockquote>
							<figcaption className="mt-4 font-display text-xs uppercase tracking-[0.2em] text-chili">
								— {q.source}
							</figcaption>
						</figure>
					))}
				</div>

				<div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
					{logos.map((logo) => (
						<span
							key={logo}
							className="font-display text-base sm:text-lg font-extrabold tracking-[0.2em] text-mahogany"
						>
							{logo}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
