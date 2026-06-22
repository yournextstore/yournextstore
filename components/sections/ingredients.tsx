import Image from "next/image";

const ingredients = [
	{ name: "Sage", origin: "Provence, France", note: "Antibacterial" },
	{ name: "Mineral Salt", origin: "Hallstatt, Austria", note: "Gentle abrasive" },
	{ name: "Chamomile", origin: "Egypt", note: "Calming · Anti-inflammatory" },
	{ name: "Bromelain", origin: "Costa Rica", note: "Natural enzyme polish" },
];

export function Ingredients() {
	return (
		<section className="bg-cream">
			<div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-24 sm:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">
					<div>
						<p className="text-[11px] tracking-arame uppercase text-foreground/55">— Provenance</p>
						<h2 className="mt-4 font-serif text-4xl sm:text-[44px] leading-[1.05] text-foreground">
							Sourced from a
							<br />
							<em className="italic">handful of growers</em>
						</h2>
						<p className="mt-6 text-[15px] leading-[1.75] text-muted-foreground max-w-md">
							We work directly with four farms and one Alpine salt mine. We know their names. We pay for
							slower harvests. The result is a shorter ingredient list — and a longer pause every morning.
						</p>
						<ul className="mt-10 divide-y divide-foreground/15 border-y border-foreground/15">
							{ingredients.map((ing) => (
								<li key={ing.name} className="flex items-baseline justify-between gap-4 py-4">
									<span className="font-serif text-lg text-foreground min-w-[110px]">{ing.name}</span>
									<span className="flex-1 text-[12px] tracking-[0.18em] uppercase text-foreground/55">
										{ing.origin}
									</span>
									<span className="font-serif italic text-sm text-foreground/70 text-right">{ing.note}</span>
								</li>
							))}
						</ul>
					</div>
					<div className="relative aspect-[4/5] overflow-hidden bg-sand">
						<Image
							src="/scraped-5.jpg"
							alt="Botanical ingredient still life"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover object-center"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
