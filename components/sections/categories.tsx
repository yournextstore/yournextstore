import { Plus } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const FALLBACK_TILES = [
	{ name: "Vases", slug: "vases", image: "/scraped-3.jpg" },
	{ name: "Candles", slug: "candles", image: "/scraped-4.jpg" },
	{ name: "Ceramics", slug: "ceramics", image: "/scraped-5.jpg" },
] as const;

export async function Categories() {
	"use cache";
	cacheLife("hours");

	const result = await commerce.collectionBrowse({ limit: 3 });
	const tiles = result.data.length
		? result.data.slice(0, 3).map((c, i) => ({
				name: c.name,
				slug: c.slug,
				image: FALLBACK_TILES[i % FALLBACK_TILES.length]?.image ?? "/scraped-3.jpg",
				href: `/collection/${c.slug}`,
			}))
		: FALLBACK_TILES.map((t) => ({ ...t, href: `/products?category=${t.slug}` }));

	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{tiles.map((tile) => (
						<YnsLink
							prefetch="eager"
							key={tile.slug}
							href={tile.href}
							className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border block"
						>
							<Image
								src={tile.image}
								alt={tile.name}
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/40"
							/>
							<div className="absolute inset-0 flex items-end justify-center pb-12">
								<h3 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-[0.12em] uppercase text-[var(--bone)] drop-shadow-lg">
									{tile.name}
								</h3>
							</div>
							<div className="absolute bottom-5 left-1/2 -translate-x-1/2">
								<div className="flex items-center justify-center h-10 w-10 rounded-full bg-[var(--bone)]/90 text-foreground transition-transform group-hover:rotate-90">
									<Plus className="h-4 w-4" />
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
