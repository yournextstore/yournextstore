import { cacheLife } from "next/cache";
import Image from "next/image";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

type Tile = {
	href: string;
	eyebrow: string;
	title: string;
	image: string;
};

const fallbackTiles: Tile[] = [
	{ href: "/products", eyebrow: "Capsule 001", title: "Painted Silks", image: "/scraped-0.jpg" },
	{ href: "/products", eyebrow: "Capsule 002", title: "Linen Foundations", image: "/scraped-1.jpg" },
	{ href: "/products", eyebrow: "Capsule 003", title: "Heritage Knitwear", image: "/scraped-2.jpg" },
];

export async function CollectionTiles() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 3 });

	const tiles: Tile[] =
		collections.data.length > 0
			? collections.data.slice(0, 3).map((c, i) => ({
					href: `/collection/${c.slug}`,
					eyebrow: `Capsule 00${i + 1}`,
					title: c.name,
					image: fallbackTiles[i]?.image ?? "/scraped-0.jpg",
				}))
			: fallbackTiles;

	return (
		<section className="bg-background">
			<div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-12">
					{tiles.map((tile) => (
						<YnsLink
							prefetch={"eager"}
							key={`${tile.href}-${tile.title}`}
							href={tile.href}
							className="group block"
						>
							<div className="relative aspect-[3/4] overflow-hidden bg-secondary">
								<Image
									src={tile.image}
									alt={tile.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
								/>
								<div
									aria-hidden
									className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
								/>
							</div>
							<div className="pt-5 flex items-baseline justify-between">
								<div>
									<p className="font-eyebrow text-[10px] text-muted-foreground mb-1.5">{tile.eyebrow}</p>
									<h3 className="font-serif text-[26px] sm:text-[30px] font-light tracking-tight text-foreground">
										{tile.title}
									</h3>
								</div>
								<span className="font-eyebrow text-[10px] text-foreground/70 editorial-underline">
									Discover
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
