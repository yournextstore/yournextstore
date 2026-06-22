import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const FALLBACK_TILES = [
	{ name: "Animals", href: "/products", image: "/scraped-1.jpg", accent: "var(--color-mint)" },
	{ name: "Amuseables", href: "/products", image: "/scraped-2.jpg", accent: "var(--color-blush)" },
	{ name: "Baby", href: "/products", image: "/scraped-3.jpg", accent: "var(--color-cream)" },
	{ name: "Books", href: "/products", image: "/scraped-4.jpg", accent: "var(--color-mint-soft)" },
	{ name: "Gifts", href: "/products", image: "/scraped-5.jpg", accent: "var(--color-blush-soft)" },
];

export async function CategoryTiles() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });
	const tiles = collections.data.length
		? collections.data.map((c, i) => ({
				name: c.name,
				href: `/collection/${c.slug}`,
				image: FALLBACK_TILES[i % FALLBACK_TILES.length].image,
				accent: FALLBACK_TILES[i % FALLBACK_TILES.length].accent,
			}))
		: FALLBACK_TILES;

	return (
		<section aria-label="Shop by family" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="text-center mb-12">
					<span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-peach)]">
						Shop by family
					</span>
					<h2
						className="mt-3 font-heading text-3xl sm:text-4xl text-foreground"
						style={{ fontVariationSettings: "'SOFT' 100" }}
					>
						A friend for every story
					</h2>
				</div>
				<ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
					{tiles.map((tile) => (
						<li key={tile.name}>
							<YnsLink prefetch={"eager"} href={tile.href} className="group block text-center">
								<div
									className="relative aspect-square rounded-full overflow-hidden border-[3px] border-white shadow-[0_8px_30px_-12px_rgba(31,42,48,0.25)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-2deg]"
									style={{ backgroundColor: tile.accent }}
								>
									<Image
										src={tile.image}
										alt={tile.name}
										fill
										sizes="(max-width: 768px) 50vw, 20vw"
										className="object-cover mix-blend-multiply"
									/>
								</div>
								<p
									className="mt-4 font-heading text-base sm:text-lg text-foreground"
									style={{ fontVariationSettings: "'SOFT' 100" }}
								>
									{tile.name}
								</p>
								<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground mt-0.5">Discover →</p>
							</YnsLink>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
