import Image from "next/image";
import { YnsLink } from "../yns-link";

const tiles = [
	{
		name: "Guava Cosmo",
		tagline: "Hibiscus · Lime · Tequila",
		bg: "bg-pop-yellow",
		text: "text-primary",
		img: "/scraped-0.jpg",
		href: "/products",
		accent: "bg-primary",
	},
	{
		name: "Watermelon Riot",
		tagline: "Watermelon · Mint · Rosé",
		bg: "bg-pop-pink",
		text: "text-white",
		img: "/scraped-3.jpg",
		href: "/products",
		accent: "bg-pop-yellow",
	},
	{
		name: "Mango Bandida",
		tagline: "Mango · Chili · Mezcal",
		bg: "bg-pop-mint",
		text: "text-pop-ink",
		img: "/scraped-5.jpg",
		href: "/products",
		accent: "bg-pop-orange",
	},
];

export function FlavorGrid() {
	return (
		<section id="flavors" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex items-end justify-between mb-10 sm:mb-14">
					<div>
						<p className="text-[11px] uppercase tracking-[0.28em] font-semibold text-primary">
							Signature flavors
						</p>
						<h2 className="mt-2 font-display text-4xl sm:text-5xl uppercase text-pop-ink">
							Frozen. <span className="text-primary">Boozy.</span> Loud.
						</h2>
					</div>
					<YnsLink
						href="/products"
						className="hidden sm:inline-flex text-[11px] font-semibold uppercase tracking-[0.22em] text-pop-ink hover:text-primary"
					>
						Browse all →
					</YnsLink>
				</div>

				<div className="grid gap-6 sm:gap-8 md:grid-cols-3">
					{tiles.map((tile, i) => (
						<YnsLink
							key={tile.name}
							href={tile.href}
							className={`group relative ${tile.bg} ${tile.text} overflow-hidden rounded-[2rem] shadow-[8px_8px_0_rgba(47,47,47,0.92)] transition-transform hover:-translate-y-1`}
						>
							<div className="aspect-[4/5] relative">
								<div aria-hidden className="absolute inset-0 bg-pop-dots opacity-25 mix-blend-overlay" />
								<div
									className={`absolute top-5 left-5 h-12 w-12 rounded-full ${tile.accent} text-white text-[10px] font-bold uppercase tracking-[0.1em] flex items-center justify-center rotate-[-8deg]`}
								>
									{String(i + 1).padStart(2, "0")}
								</div>
								<Image
									src={tile.img}
									alt={tile.name}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-contain p-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2"
								/>
								<div className="absolute inset-x-0 bottom-0 p-6 backdrop-blur-[1px]">
									<h3 className="font-display text-3xl sm:text-4xl uppercase leading-none">{tile.name}</h3>
									<p className="mt-2 text-xs uppercase tracking-[0.18em] font-semibold opacity-90">
										{tile.tagline}
									</p>
									<span className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] font-bold">
										Shop →
									</span>
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
