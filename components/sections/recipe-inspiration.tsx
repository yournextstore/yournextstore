import Image from "next/image";
import { YnsLink } from "../yns-link";

const RECIPES = [
	{
		title: "Cheesy Plant Popcorn",
		category: "5-min snack",
		image: "/scraped-1.jpg",
		href: "/products",
	},
	{
		title: "Sun Crumble Avocado Toast",
		category: "Breakfast",
		image: "/scraped-2.jpg",
		href: "/products",
	},
	{
		title: "Umami Roasted Veg Bowl",
		category: "Weeknight",
		image: "/scraped-3.jpg",
		href: "/products",
	},
	{
		title: "Hemp Heart Pesto Pasta",
		category: "Dinner party",
		image: "/scraped-4.jpg",
		href: "/products",
	},
];

export function RecipeInspiration() {
	return (
		<section className="bg-[#fbe9d7]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
					<div className="max-w-xl">
						<span className="inline-flex items-center gap-2 rounded-full border border-[#1b2a2e]/15 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1b2a2e]">
							<span className="h-1.5 w-1.5 rounded-full bg-[#f5a623]" />
							From the journal
						</span>
						<h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-[#1b2a2e]">
							Recipes that earn the sprinkle.
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#1b2a2e] underline underline-offset-4 decoration-[#f5a623] decoration-2 hover:decoration-[#1b2a2e]"
					>
						Browse the blog →
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{RECIPES.map((recipe) => (
						<YnsLink key={recipe.title} prefetch={"eager"} href={recipe.href} className="group block">
							<div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#1b2a2e]/10 bg-white shadow-[0_20px_50px_-25px_rgba(27,42,46,0.4)]">
								<Image
									src={recipe.image}
									alt={recipe.title}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#1b2a2e]/70 via-[#1b2a2e]/0 to-transparent" />
								<div className="absolute inset-x-0 bottom-0 p-5">
									<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fbe9d7]/80">
										{recipe.category}
									</p>
									<h3 className="mt-1 font-display text-xl font-bold text-[#fbe9d7] leading-tight">
										{recipe.title}
									</h3>
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
