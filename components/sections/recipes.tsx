import Image from "next/image";

const recipes = [
	{
		title: "Crispy Chili Oil Noodles",
		image: "/scraped-1.jpg",
	},
	{
		title: "Roasted Veggie & Quinoa Bowl",
		image: "/scraped-2.jpg",
	},
	{
		title: "Spicy Street Food Skewers",
		image: "/scraped-0.jpg",
	},
];

export function Recipes() {
	return (
		<section className="py-16 sm:py-24">
			<div className="max-w-[1820px] mx-auto px-5 sm:px-8 lg:px-10">
				<div className="flex items-end justify-between mb-12">
					<div>
						<span className="text-xs font-bold uppercase tracking-widest text-[#ff2524] mb-2 block">
							Let us cook!
						</span>
						<h2 className="font-[family-name:var(--font-prompt)] text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground">
							Recipes
						</h2>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{recipes.map((recipe) => (
						<div key={recipe.title} className="group cursor-pointer">
							<div className="relative aspect-[4/3] rounded-md border-[3px] border-foreground shadow-[6px_6px_0_0_#000] overflow-hidden mb-4 group-hover:shadow-[3px_3px_0_0_#000] group-hover:translate-x-[3px] group-hover:translate-y-[3px] transition-all duration-200">
								<Image
									src={recipe.image}
									alt={recipe.title}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							</div>
							<h3 className="text-lg font-bold text-foreground">{recipe.title}</h3>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
