import Image from "next/image";

const recipes = [
	{
		title: "Brown-butter morning oats",
		meta: "10 min · breakfast",
		image: "/scraped-0.jpg",
	},
	{
		title: "Cast-iron seared scallops",
		meta: "15 min · main",
		image: "/scraped-1.jpg",
	},
	{
		title: "Saffron-ghee basmati pilaf",
		meta: "25 min · side",
		image: "/scraped-2.jpg",
	},
	{
		title: "Honey-thyme banana bread",
		meta: "60 min · bake",
		image: "/scraped-3.jpg",
	},
];

export function Recipes() {
	return (
		<section className="bg-secondary relative">
			<div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 sm:py-28">
				<div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<p className="font-mono mb-3 text-[11px] uppercase tracking-[0.3em] text-amber-deep">/ recipes</p>
						<h2
							className="font-display max-w-2xl text-4xl font-medium leading-[1.05] tracking-tight text-mahogany sm:text-5xl"
							style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
						>
							what to cook this week.
						</h2>
					</div>
					<a
						href="#recipes"
						className="font-mono text-[11px] uppercase tracking-[0.25em] text-mahogany/70 transition-colors hover:text-mahogany"
					>
						all recipes →
					</a>
				</div>

				<div className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
					{recipes.map((recipe, i) => (
						<a
							key={recipe.title}
							href="#recipes"
							className="group relative w-[78vw] shrink-0 snap-start sm:w-[55vw] lg:w-auto"
						>
							<div className="relative aspect-[4/5] overflow-hidden bg-mahogany/10 shadow-[0_18px_40px_-20px_rgba(92,29,15,0.4)]">
								<Image
									src={recipe.image}
									alt={recipe.title}
									fill
									sizes="(max-width: 640px) 78vw, (max-width: 1024px) 55vw, 25vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-mahogany/65" />
								<span
									className="font-display absolute left-4 top-4 inline-flex rotate-[-3deg] bg-honey px-3 py-1 text-xs font-medium italic text-mahogany"
									style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
								>
									№ 0{i + 1}
								</span>
								<div className="absolute inset-x-4 bottom-4 text-cream">
									<h3
										className="font-display text-2xl leading-tight"
										style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
									>
										{recipe.title}
									</h3>
									<p className="font-mono mt-2 text-[10px] uppercase tracking-[0.25em] text-cream/80">
										{recipe.meta}
									</p>
								</div>
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
