const press = [
	{
		quote: "“Smells like a vacation, works like nothing else we tested.”",
		source: "Outside Magazine",
	},
	{
		quote: "“Finally, a clean repellent you actually want to keep on the kitchen counter.”",
		source: "Goop",
	},
	{
		quote: "“Eight hours in the Yucatán humidity. Zero bites. We’re obsessed.”",
		source: "Condé Nast Traveler",
	},
];

const logos = ["FAST COMPANY", "VOGUE", "WIRED", "GQ", "TIME", "BON APPÉTIT"];

export function Press() {
	return (
		<section className="bg-[var(--tropic-cream)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
				<div className="rounded-[40px] bg-[#15323b] text-[var(--tropic-cream)] px-6 sm:px-12 py-12 sm:py-16">
					<div className="text-center">
						<span className="text-[11px] uppercase tracking-[0.32em] text-[var(--tropic-yellow)]">
							As seen in
						</span>
						<div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-6 items-center justify-items-center">
							{logos.map((logo) => (
								<span
									key={logo}
									className="font-display italic text-xl sm:text-2xl tracking-wide text-[var(--tropic-cream)]/85"
								>
									{logo}
								</span>
							))}
						</div>
					</div>

					<div className="mt-12 grid md:grid-cols-3 gap-8 sm:gap-10">
						{press.map((p, i) => (
							<figure
								key={p.source}
								className={`pt-6 border-t border-[var(--tropic-cream)]/20 ${i > 0 ? "" : ""}`}
							>
								<blockquote className="font-display italic text-2xl sm:text-3xl leading-snug text-[var(--tropic-cream)]">
									{p.quote}
								</blockquote>
								<figcaption className="mt-5 text-[11px] uppercase tracking-[0.32em] text-[var(--tropic-yellow)]">
									{p.source}
								</figcaption>
							</figure>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
