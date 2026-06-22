import Image from "next/image";
import { YnsLink } from "../yns-link";

const TILES = [
	{
		eyebrow: "Step 01",
		title: "Cleanse",
		caption: "Gentle gel and balm cleansers that lift the day without stripping.",
		image: "/scraped-3.jpg",
		accent: "from-stone-200/40 to-stone-200/0",
		href: "/products",
	},
	{
		eyebrow: "Step 02",
		title: "Hydrate",
		caption: "Lightweight emulsions and serums that restore daily moisture.",
		image: "/scraped-1.jpg",
		accent: "from-[#E9D2D6]/60 to-[#E9D2D6]/0",
		href: "/products",
	},
	{
		eyebrow: "Step 03",
		title: "Defend",
		caption: "Antioxidant shields formulated to neutralize free radicals.",
		image: "/scraped-2.jpg",
		accent: "from-[#D6F23A]/45 to-[#D6F23A]/0",
		href: "/products",
	},
];

export function CategoryTiles() {
	return (
		<section className="bg-background">
			<div className="px-4 sm:px-8 lg:px-12 pt-20 pb-6">
				<div className="flex items-end justify-between mb-10">
					<div>
						<p className="uppercase-display text-[10.5px] tracking-[0.24em] text-muted-foreground">
							The Daily Ritual
						</p>
						<h2 className="mt-3 uppercase-display text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
							Cleanse · Hydrate · Defend
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="hidden sm:inline-flex uppercase-display text-[11px] tracking-[0.22em] text-foreground hover:text-foreground/70 transition-colors border-b border-foreground pb-1"
					>
						Explore all routines
					</YnsLink>
				</div>
			</div>
			<div className="px-4 sm:px-8 lg:px-12 pb-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/70">
					{TILES.map((tile) => (
						<YnsLink
							key={tile.title}
							prefetch={"eager"}
							href={tile.href}
							className="group relative overflow-hidden bg-stone-100 aspect-[4/5] block"
						>
							<div className={`absolute inset-0 bg-gradient-to-b ${tile.accent}`} />
							<Image
								src={tile.image}
								alt={tile.title}
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover opacity-90 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 flex flex-col justify-between p-7 sm:p-9">
								<div className="flex items-center gap-3">
									<span className="size-1.5 bg-foreground rounded-full" />
									<span className="uppercase-display text-[10.5px] tracking-[0.24em] text-foreground/80">
										{tile.eyebrow}
									</span>
								</div>
								<div>
									<h3 className="uppercase-display text-foreground text-3xl sm:text-4xl tracking-tight">
										{tile.title}
									</h3>
									<p className="mt-3 max-w-xs text-sm text-foreground/70 leading-relaxed">{tile.caption}</p>
									<div className="mt-5 inline-flex items-center gap-2 uppercase-display text-[11px] tracking-[0.22em] text-foreground">
										Shop
										<span
											aria-hidden="true"
											className="block w-6 h-px bg-foreground transition-all group-hover:w-10"
										/>
									</div>
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
