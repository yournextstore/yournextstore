import Image from "next/image";

const ingredients = [
	{
		name: "Wild Basil",
		role: "Soothing botanical",
		image: "/scraped-3.jpg",
		note: "Cooling. Aromatic. A quiet anchor for the senses.",
	},
	{
		name: "Pink Grapefruit",
		role: "Bright antioxidant",
		image: "/scraped-1.jpg",
		note: "Hand-zested for skin-luminous vitamin C.",
	},
	{
		name: "Papaya Seed",
		role: "Gentle enzyme",
		image: "/scraped-4.jpg",
		note: "A traditional polish — small seeds, slow benefit.",
	},
	{
		name: "Red Currant",
		role: "Polyphenol pearl",
		image: "/scraped-5.jpg",
		note: "Tart, vivid, full of resilient little antioxidants.",
	},
];

export function Ingredients() {
	return (
		<section id="ingredients" className="bg-paper">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-2xl mx-auto mb-14">
					<span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">The Garden</span>
					<h2 className="mt-3 font-serif text-4xl sm:text-5xl leading-tight text-cocoa">
						Ingredients we trust, gathered slowly.
					</h2>
					<p className="mt-4 text-base text-cocoa/70 leading-relaxed">
						Every botanical is selected for what it does — and what it doesn't do. No filler, no shortcuts, no
						synthetic stand-ins.
					</p>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
					{ingredients.map((ingredient) => (
						<div
							key={ingredient.name}
							className="group rounded-3xl bg-card p-4 sm:p-5 ring-1 ring-border hover:ring-cocoa/15 hover:-translate-y-1 transition-all"
						>
							<div className="relative aspect-square overflow-hidden rounded-2xl bg-sand">
								<Image
									src={ingredient.image}
									alt={ingredient.name}
									fill
									sizes="(max-width: 768px) 50vw, 25vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							</div>
							<div className="pt-4">
								<p className="text-[10px] uppercase tracking-[0.2em] text-terracotta font-medium">
									{ingredient.role}
								</p>
								<h3 className="mt-1 font-serif text-2xl text-cocoa">{ingredient.name}</h3>
								<p className="mt-1.5 text-xs text-cocoa/65 leading-relaxed italic">"{ingredient.note}"</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
