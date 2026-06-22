import Image from "next/image";

const ingredients = [
	{ name: "Rolled Oats", note: "Slow-baked" },
	{ name: "Raw Honey", note: "Single-source" },
	{ name: "Almonds", note: "Dry roasted" },
	{ name: "Cacao", note: "Stone-ground" },
];

export function Ingredients() {
	return (
		<section id="story" className="bg-espresso">
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-24 sm:py-32">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="relative aspect-[4/5] lg:aspect-square overflow-hidden">
						<Image
							src="/scraped-3.jpg"
							alt="Whole-food ingredients"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-linear-to-tr from-espresso/60 via-transparent to-transparent pointer-events-none" />
					</div>

					<div>
						<p className="font-display tracking-[0.32em] text-[11px] text-bronze-light mb-6">
							INGREDIENTS YOU CAN SEE
						</p>
						<h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-cream leading-[0.9] mb-8">
							Real food.
							<br />
							<span className="text-bronze-light">No bullshit.</span>
						</h2>
						<p className="text-cream/70 text-lg leading-relaxed max-w-md mb-12">
							Every bar starts with whole-food ingredients you can pronounce — pressed cold, baked low,
							sweetened only with raw honey. No syrups, no isolates, no shortcuts.
						</p>
						<div className="grid grid-cols-2 gap-x-12 gap-y-6 max-w-md">
							{ingredients.map((ingredient, i) => (
								<div key={ingredient.name} className="border-t border-bronze/30 pt-4">
									<p className="font-display text-[10px] tracking-[0.24em] text-bronze-light mb-1">
										0{i + 1}
									</p>
									<p className="font-display text-xl text-cream">{ingredient.name}</p>
									<p className="text-cream/50 text-xs uppercase tracking-wider mt-1">{ingredient.note}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
