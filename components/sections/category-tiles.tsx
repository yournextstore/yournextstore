import Image from "next/image";
import { YnsLink } from "../yns-link";

const TILES = [
	{
		label: "Bras",
		href: "/products",
		image: "/scraped-1.jpg",
		caption: "Soft-cup, contour & wireless",
	},
	{
		label: "Briefs",
		href: "/products",
		image: "/scraped-4.jpg",
		caption: "Everyday & barely-there essentials",
	},
	{
		label: "Sleepwear",
		href: "/products",
		image: "/scraped-3.jpg",
		caption: "Silk, satin and brushed cotton",
	},
];

export function CategoryTiles() {
	return (
		<section className="bg-background">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
				<div className="mb-10 text-center">
					<p className="text-[11px] font-medium uppercase tracking-[0.24em] text-clay">Shop the edit</p>
					<h2
						className="mt-3 font-display text-[40px] italic leading-none tracking-tight text-foreground sm:text-[48px]"
						style={{ fontFamily: "var(--font-cormorant)" }}
					>
						The new staples
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
					{TILES.map((tile) => (
						<YnsLink
							key={tile.label}
							prefetch={"eager"}
							href={tile.href}
							className="group relative block overflow-hidden rounded-sm bg-blush"
						>
							<div className="relative aspect-[4/5] w-full overflow-hidden">
								<Image
									src={tile.image}
									alt={tile.label}
									fill
									sizes="(max-width: 640px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div
									aria-hidden="true"
									className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1a1410]/55 via-[#1a1410]/10 to-transparent"
								/>
							</div>
							<div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
								<h3
									className="font-display text-[34px] italic leading-none text-white drop-shadow-sm sm:text-[42px]"
									style={{ fontFamily: "var(--font-cormorant)" }}
								>
									{tile.label}
								</h3>
								<p className="mt-2 text-[12px] font-medium uppercase tracking-[0.18em] text-white/90">
									{tile.caption}
								</p>
								<span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/95 transition-all group-hover:gap-2">
									Shop now
									<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
										<path
											d="M3 7h8m-3-3l3 3-3 3"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
