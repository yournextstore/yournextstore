import Image from "next/image";
import { YnsLink } from "../yns-link";

const TILES = [
	{
		label: "Dresses",
		caption: "Print-led & easy to wear",
		image: "/scraped-0.jpg",
		href: "/products",
	},
	{
		label: "Separates",
		caption: "Mix, match, repeat",
		image: "/scraped-1.jpg",
		href: "/products",
	},
	{
		label: "Vacation Edit",
		caption: "Sun-drenched essentials",
		image: "/scraped-2.jpg",
		href: "/products",
	},
];

export function CategoryTiles() {
	return (
		<section className="bg-background">
			<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
				<div className="text-center mb-10 sm:mb-14">
					<p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground mb-3">
						The Season At A Glance
					</p>
					<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink">Shop The Story</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
					{TILES.map((tile) => (
						<YnsLink
							key={tile.label}
							prefetch="eager"
							href={tile.href}
							className="group relative block aspect-[4/5] overflow-hidden bg-cream"
						>
							<Image
								src={tile.image}
								alt={tile.label}
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-ink/0 to-ink/0" />
							<div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-center">
								<h3 className="font-serif text-white text-3xl sm:text-4xl tracking-tight drop-shadow-md">
									{tile.label}
								</h3>
								<p className="mt-1.5 text-white/90 text-xs tracking-[0.18em] uppercase">{tile.caption}</p>
								<span className="mt-4 inline-block text-white text-[10px] tracking-[0.28em] uppercase border-b border-white/70 pb-0.5 group-hover:border-white transition-colors">
									Shop Now
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
