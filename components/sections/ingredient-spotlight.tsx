import Image from "next/image";

const INGREDIENTS = [
	{ name: "Oat Kernel Extract", note: "calms and soothes itchy skin" },
	{ name: "Coconut-Derived Cleansers", note: "softly lifts dirt and dander" },
	{ name: "Chamomile", note: "brightens light coats, gentle on dark ones" },
	{ name: "Aloe Leaf", note: "hydrates without weighing the coat down" },
	{ name: "Rice Starch", note: "absorbs oil between baths" },
];

export function IngredientSpotlight() {
	return (
		<section className="yns-ingredient-wash">
			<div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-20 lg:px-8">
				<div className="relative aspect-[4/5] overflow-hidden rounded-sm">
					<Image
						src="/scraped-4.jpg"
						alt="Clean botanical ingredients"
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
				</div>
				<div className="flex flex-col justify-center">
					<p className="text-[11px] yns-letter-spacing-mid uppercase text-muted-foreground">
						Made with intention
					</p>
					<h2 className="mt-3 font-serif text-4xl sm:text-5xl font-light leading-[1.05] text-foreground">
						A short list of <em className="italic">clean ingredients</em>, and nothing else.
					</h2>
					<p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
						We formulate with what works and leave out what doesn&apos;t. Every product is free of sulfates,
						parabens, phthalates, and synthetic fragrance — and approved by the dogs who matter.
					</p>
					<ul className="mt-10 divide-y divide-[#A89C8C]/30 border-y border-[#A89C8C]/30">
						{INGREDIENTS.map((i) => (
							<li key={i.name} className="flex items-baseline justify-between gap-4 py-4">
								<span className="font-serif text-xl sm:text-2xl italic font-light text-foreground">
									{i.name}
								</span>
								<span className="text-right text-xs sm:text-sm tracking-wide text-muted-foreground">
									{i.note}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
