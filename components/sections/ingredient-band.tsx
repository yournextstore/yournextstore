import Image from "next/image";

const callouts = [
	{
		latin: "Rosa damascena",
		common: "Damask Rose Absolute",
		note: "warm · honeyed · slow opening",
	},
	{
		latin: "Boswellia carteri",
		common: "Frankincense Resin",
		note: "smoke · breath · golden hour",
	},
	{
		latin: "Vanilla planifolia",
		common: "Bourbon Vanilla",
		note: "skin · sugar · low candlelight",
	},
];

export function IngredientBand() {
	return (
		<section className="bg-mahogany-band text-bone overflow-hidden">
			<div className="max-w-[1600px] mx-auto px-6 sm:px-10 py-24 sm:py-32 lg:py-40">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
					<div className="lg:col-span-5">
						<p className="eyebrow text-clay mb-7">From the Atelier</p>
						<h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05]">
							A formula in three <span className="italic text-clay">whispers.</span>
						</h2>
						<p className="mt-7 text-bone/65 text-base leading-relaxed max-w-md">
							Each blend begins with a single botanical question — how do we slow a moment without silencing
							it? Our materials are pressed, distilled and aged for restraint.
						</p>

						<dl className="mt-12 space-y-7">
							{callouts.map((item, idx) => (
								<div key={item.latin} className="grid grid-cols-[auto_1fr] gap-5 items-baseline">
									<dt className="eyebrow text-clay text-[0.65rem] tabular-nums">0{idx + 1}</dt>
									<dd>
										<p className="font-serif italic text-bone text-2xl leading-tight">{item.latin}</p>
										<p className="mt-1 text-bone/80 text-sm">{item.common}</p>
										<p className="mt-1.5 eyebrow text-bone/50 text-[0.6rem]">{item.note}</p>
									</dd>
								</div>
							))}
						</dl>
					</div>

					<div className="lg:col-span-7 relative">
						<div className="grid grid-cols-5 gap-3 sm:gap-4">
							<div className="col-span-3 relative aspect-[3/4] overflow-hidden">
								<Image
									src="/scraped-4.jpg"
									alt="A single drop of amber serum suspended in warm light"
									fill
									sizes="(max-width: 1024px) 60vw, 30vw"
									className="object-cover"
								/>
							</div>
							<div className="col-span-2 flex flex-col gap-3 sm:gap-4">
								<div className="relative aspect-square overflow-hidden">
									<Image
										src="/scraped-3.jpg"
										alt="A flat-lay of curated ritual essentials"
										fill
										sizes="(max-width: 1024px) 40vw, 20vw"
										className="object-cover"
									/>
								</div>
								<div className="relative flex-1 overflow-hidden bg-espresso/40 p-6 flex flex-col justify-between min-h-[200px]">
									<p className="font-serif italic text-bone text-2xl leading-snug">
										&ldquo;Restraint is the most generous luxury.&rdquo;
									</p>
									<p className="eyebrow text-clay text-[0.6rem]">— The Atelier, 2026</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
