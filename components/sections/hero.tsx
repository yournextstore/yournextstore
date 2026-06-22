import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

type Tile = {
	name: string;
	href: string;
	className: string;
	textClass: string;
};

const FALLBACK_TILES: Tile[] = [
	{ name: "Bedroom", href: "/products", className: "yns-tile-orange", textClass: "text-white" },
	{ name: "Living Room", href: "/products", className: "yns-tile-white", textClass: "text-[#0f0f0f]" },
	{ name: "Dining Room", href: "/products", className: "yns-tile-blue", textClass: "text-white" },
	{ name: "Reading Room", href: "/products", className: "yns-tile-white", textClass: "text-[#0f0f0f]" },
	{ name: "Office Table", href: "/products", className: "yns-tile-green", textClass: "text-white" },
];

const TILE_STYLES = [
	{ className: "yns-tile-orange", textClass: "text-white" },
	{ className: "yns-tile-white", textClass: "text-[#0f0f0f]" },
	{ className: "yns-tile-blue", textClass: "text-white" },
	{ className: "yns-tile-white", textClass: "text-[#0f0f0f]" },
	{ className: "yns-tile-green", textClass: "text-white" },
] as const;

async function getCategoryTiles(): Promise<Tile[]> {
	"use cache";
	cacheLife("hours");

	try {
		const collections = await commerce.collectionBrowse({ limit: 5 });
		if (!collections.data || collections.data.length === 0) {
			return FALLBACK_TILES;
		}
		return collections.data.map((collection, i) => ({
			name: collection.name,
			href: `/collection/${collection.slug}`,
			className: TILE_STYLES[i % TILE_STYLES.length].className,
			textClass: TILE_STYLES[i % TILE_STYLES.length].textClass,
		}));
	} catch {
		return FALLBACK_TILES;
	}
}

export async function Hero() {
	const tiles = await getCategoryTiles();
	const displayTiles = tiles.length >= 5 ? tiles.slice(0, 5) : [...tiles, ...FALLBACK_TILES].slice(0, 5);

	return (
		<section className="relative mt-4 sm:mt-5 overflow-hidden rounded-[2rem] yns-hero-gradient">
			<div className="relative px-4 sm:px-8 lg:px-14 pt-14 sm:pt-20 pb-10 sm:pb-14">
				{/* Sun glow accents */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -top-32 right-1/4 h-[420px] w-[420px] rounded-full bg-[#fff4cc]/60 blur-3xl"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute top-1/2 -right-20 h-72 w-72 rounded-full bg-[#ffd6c2]/50 blur-3xl"
				/>

				<div className="relative text-center max-w-4xl mx-auto">
					<h1 className="font-display uppercase text-[#0f0f0f] tracking-[-0.02em] leading-[0.92]">
						<span className="block text-[clamp(2.4rem,8vw,5.5rem)]">Find Your</span>
						<span className="block text-[clamp(2.4rem,8vw,5.5rem)]">Dream Furniture</span>
					</h1>
					<p className="mt-5 sm:mt-7 text-base sm:text-lg text-neutral-700 max-w-xl mx-auto">
						Explore world-class furniture, hand-picked for your space, your style, and your everyday.
					</p>
				</div>

				{/* Category carousel */}
				<div className="relative mt-10 sm:mt-14 flex items-center gap-3 sm:gap-5">
					<button
						type="button"
						aria-label="Previous categories"
						className="hidden sm:inline-flex h-11 w-11 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-full bg-[#0f0f0f] text-white hover:bg-[#1a1a1a] transition-colors shadow-lg shadow-black/10"
					>
						<ChevronLeftIcon className="h-5 w-5" />
					</button>

					<div className="flex-1 min-w-0">
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
							{displayTiles.map((tile, i) => (
								<YnsLink
									key={`${tile.name}-${i}`}
									prefetch={"eager"}
									href={tile.href}
									className={`group relative aspect-[1/1.08] sm:aspect-[1/1.15] rounded-[1.75rem] overflow-hidden ${tile.className} ring-1 ring-black/5 shadow-[0_8px_30px_-12px_rgba(15,15,15,0.18)] transition-transform duration-300 hover:-translate-y-1`}
								>
									<div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between">
										<span
											className={`font-display uppercase text-lg sm:text-xl lg:text-[1.35rem] leading-[1.05] ${tile.textClass}`}
										>
											{tile.name}
										</span>
										<span
											className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${tile.textClass === "text-white" ? "bg-white/20 text-white" : "bg-[#0f0f0f]/10 text-[#0f0f0f]"} self-end opacity-0 group-hover:opacity-100 transition-opacity`}
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												className="h-3.5 w-3.5"
												aria-hidden="true"
											>
												<path d="M7 17L17 7M17 7H8M17 7V16" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</span>
									</div>
								</YnsLink>
							))}
						</div>
					</div>

					<button
						type="button"
						aria-label="Next categories"
						className="hidden sm:inline-flex h-11 w-11 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-full bg-[#0f0f0f] text-white hover:bg-[#1a1a1a] transition-colors shadow-lg shadow-black/10"
					>
						<ChevronRightIcon className="h-5 w-5" />
					</button>
				</div>
			</div>
		</section>
	);
}
