import Image from "next/image";

const ingredients = [
	{
		title: "Cleansing",
		image: "/scraped-0.jpg",
		description:
			"Skin care products help to effectively cleanse the skin from grease, makeup, and other impurities — a gentle reset for daily ritual.",
	},
	{
		title: "Fresh and radiant",
		image: "/scraped-1.jpg",
		description:
			"Skin care products help give you a fresh and radiant appearance, brightening dullness and pigmentation for a luminous, healthy glow.",
	},
	{
		title: "Moisturizing",
		image: "/scraped-3.jpg",
		description:
			"These products provide intensive skin hydration to eliminate dryness, flaking, and tightness — leaving skin soft, smooth, and supple.",
	},
];

export function NaturalIngredients() {
	return (
		<section id="ingredients" className="bg-background py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-xl mx-auto">
					<div className="font-serif text-xs tracking-[0.4em] uppercase text-muted-foreground">
						Natural Ingredients
					</div>
					<p className="mt-4 font-serif italic text-base text-muted-foreground">
						valuable to your skin — our choice for perfect care
					</p>
				</div>

				<div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{ingredients.map((item) => (
						<article key={item.title} className="group">
							<div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand">
								<Image
									src={item.image}
									alt={item.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-deep-brown/15 via-transparent to-transparent" />
							</div>
							<div className="mt-5">
								<h3 className="font-serif text-2xl text-foreground">{item.title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-[28ch]">
									{item.description}
								</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
