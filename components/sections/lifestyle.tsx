import Image from "next/image";

const steps = [
	{
		num: "01",
		title: "Pop it",
		copy: "Unwrap straight from the freezer. Each pop is hand-poured with real fruit and an actual splash of spirit.",
		color: "bg-pop-yellow",
		text: "text-primary",
	},
	{
		num: "02",
		title: "Plunge it",
		copy: "Drop a pop into bubbly, prosecco, mezcal, or sparkling water — instant signature cocktail.",
		color: "bg-pop-pink",
		text: "text-white",
	},
	{
		num: "03",
		title: "Party loud",
		copy: "Tag the squad. Pool-deck, rooftop, fire-escape — anywhere a 21% ABV pop belongs.",
		color: "bg-pop-mint",
		text: "text-pop-ink",
	},
];

export function Lifestyle() {
	return (
		<section className="relative overflow-hidden">
			<div className="bg-pop-cream">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
					<div className="grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
						<div>
							<p className="text-[11px] uppercase tracking-[0.28em] font-semibold text-primary">
								How it works
							</p>
							<h2 className="mt-2 font-display text-4xl sm:text-6xl uppercase text-pop-ink leading-[0.9]">
								Three steps to <br />
								<span className="brush-underline text-primary">cocktail magic</span>
							</h2>
							<p className="mt-6 max-w-md text-pop-ink/75 leading-relaxed">
								Pair a pop with whatever&apos;s in your bar cart. Every flavor is engineered to play nicely
								with sparkling wines, mezcal, gin, and zero-proof bubbles.
							</p>

							<ul className="mt-10 space-y-5">
								{steps.map((step) => (
									<li
										key={step.num}
										className={`relative flex items-start gap-5 rounded-2xl ${step.color} ${step.text} p-5 shadow-[5px_5px_0_rgba(47,47,47,0.92)]`}
									>
										<span className="font-display text-4xl leading-none">{step.num}</span>
										<div>
											<h3 className="font-display text-2xl uppercase leading-none">{step.title}</h3>
											<p className="mt-2 text-sm leading-relaxed opacity-90">{step.copy}</p>
										</div>
									</li>
								))}
							</ul>
						</div>

						<div className="relative h-[420px] sm:h-[520px] lg:h-[580px]">
							<div className="absolute inset-0 rounded-[2.5rem] overflow-hidden bg-pop-mint-deck shadow-[10px_10px_0_rgba(47,47,47,0.92)]">
								<div aria-hidden className="absolute inset-0 bg-pop-dots opacity-25 mix-blend-overlay" />
								<div className="absolute inset-0">
									<Image
										src="/scraped-1.jpg"
										alt="Pour-over cocktail with boozy popsicle stirrer"
										fill
										sizes="(max-width: 1024px) 100vw, 50vw"
										className="object-cover"
									/>
								</div>
								<div className="absolute bottom-6 left-6 rounded-2xl bg-white/95 px-5 py-4 shadow-md max-w-[260px]">
									<p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">
										Bar tip
									</p>
									<p className="mt-1 text-sm leading-snug text-pop-ink">
										Drop a Guava Cosmo into a coupe of prosecco — watch it melt into a sunset slushie.
									</p>
								</div>
							</div>

							{/* sticker */}
							<div className="absolute -top-4 -right-2 sm:-right-6 h-28 w-28 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-[0.18em] flex items-center justify-center rotate-[10deg] shadow-lg animate-wiggle">
								<span className="text-center leading-tight">
									Frozen
									<br />
									cocktails
									<br />
									unlocked
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
