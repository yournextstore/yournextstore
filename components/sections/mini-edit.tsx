import Image from "next/image";
import { YnsLink } from "../yns-link";

const TILES = [
	{
		label: "Girls",
		caption: "Twirl-ready dresses & playful prints",
		image: "/scraped-5.jpg",
		href: "/products",
	},
	{
		label: "Boys",
		caption: "Hard-wearing essentials, soft on skin",
		image: "/scraped-4.jpg",
		href: "/products",
	},
];

export function MiniEdit() {
	return (
		<section className="bg-background">
			<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
				<div className="text-center mb-10 sm:mb-14">
					<p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground mb-3">
						For The Little Ones
					</p>
					<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink">Mini Adventurers</h2>
					<p className="mt-4 max-w-md mx-auto text-sm sm:text-base text-muted-foreground font-light">
						Playful prints and easy-wear essentials, designed to keep up with every twirl, climb and puddle.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
					{TILES.map((tile) => (
						<YnsLink
							key={tile.label}
							prefetch="eager"
							href={tile.href}
							className="group relative block aspect-[5/4] overflow-hidden bg-cream"
						>
							<Image
								src={tile.image}
								alt={tile.label}
								fill
								sizes="(max-width: 768px) 100vw, 50vw"
								className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
							/>
							<div className="absolute inset-0 bg-gradient-to-tr from-ink/40 via-ink/5 to-transparent" />
							<div className="absolute inset-0 flex items-end p-8 sm:p-12">
								<div>
									<h3 className="font-serif text-white text-4xl sm:text-5xl tracking-tight drop-shadow-md">
										{tile.label}
									</h3>
									<p className="mt-2 text-white/90 text-sm font-light max-w-xs">{tile.caption}</p>
									<span className="mt-5 inline-block text-white text-[11px] tracking-[0.24em] uppercase border-b border-white/70 pb-0.5 group-hover:border-white transition-colors">
										Explore {tile.label}
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
