const QUOTES = [
	{
		quote:
			"The kind of warm, lived-in nude that does the work of three different lip products — and finally, a tube that doesn't end up in a landfill.",
		source: "Vogue",
	},
	{
		quote:
			"Eight hours, two cups of coffee, and one office sandwich later — the color was still there. I'm a convert.",
		source: "The Cut",
	},
	{
		quote:
			"Buttery without being slippery, pigmented without being flat. The Easy Way is genuinely the easy way.",
		source: "Allure",
	},
];

const LOGOS = ["VOGUE", "ALLURE", "THE CUT", "REFINERY29", "ELLE", "BAZAAR", "NYLON", "WHO WHAT WEAR"];

export function PressWall() {
	return (
		<section className="bg-[color:var(--color-slate-ink)] text-[color:var(--color-bone)]">
			<div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="text-center max-w-2xl mx-auto mb-16">
					<p className="text-eyebrow text-[color:var(--color-blush)] mb-4">As Seen In</p>
					<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
						The press, the reviews, the receipts.
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 mb-16">
					{QUOTES.map((q) => (
						<figure key={q.source} className="flex flex-col gap-6">
							<svg
								viewBox="0 0 24 24"
								fill="currentColor"
								className="h-7 w-7 text-[color:var(--color-terracotta)]"
								aria-hidden="true"
							>
								<path d="M9.5 6c-3 1-5 4-5 8v4h5v-4h-2c0-3 1-5 3-6l-1-2zm9 0c-3 1-5 4-5 8v4h5v-4h-2c0-3 1-5 3-6l-1-2z" />
							</svg>
							<blockquote className="font-display text-xl lg:text-[1.35rem] leading-snug text-[color:var(--color-bone)]">
								&ldquo;{q.quote}&rdquo;
							</blockquote>
							<figcaption className="text-eyebrow text-[color:var(--color-bone)]/60">— {q.source}</figcaption>
						</figure>
					))}
				</div>

				<div className="relative overflow-hidden border-t border-[color:var(--color-bone)]/15 pt-10">
					<div className="flex gap-12 animate-marquee whitespace-nowrap">
						{[...LOGOS, ...LOGOS].map((logo, i) => (
							<span key={`${logo}-${i}`} className="text-eyebrow text-[color:var(--color-bone)]/55">
								{logo}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
