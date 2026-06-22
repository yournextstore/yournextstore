import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const FALLBACK_TILES = [
	{
		slug: "mattresses",
		name: "Mattresses",
		caption: "Hand-tufted, eight-way tied",
		image: "/scraped-4.jpg",
	},
	{
		slug: "bedding",
		name: "Bedding",
		caption: "Cotton, linen & wool",
		image: "/scraped-3.jpg",
	},
	{
		slug: "pillows",
		name: "Pillows",
		caption: "Bolsters, shams & rolls",
		image: "/scraped-5.jpg",
	},
];

export async function CollectionTiles() {
	"use cache";
	cacheLife("hours");

	const { data } = await commerce.collectionBrowse({ limit: 3 });

	const tiles =
		data.length > 0
			? data.slice(0, 3).map((c, i) => ({
					slug: c.slug,
					href: `/collection/${c.slug}`,
					name: c.name,
					caption: FALLBACK_TILES[i]?.caption ?? "Shop the collection",
					image: FALLBACK_TILES[i]?.image ?? "/scraped-3.jpg",
				}))
			: FALLBACK_TILES.map((t) => ({ ...t, href: `/products` }));

	return (
		<section className="bg-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="flex items-end justify-between mb-10">
					<div>
						<span className="heritage-smallcaps text-[var(--oxblood)]">The Goods</span>
						<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl tracking-[-0.01em] text-[var(--ink)]">
							Three families. <em className="italic">One workshop.</em>
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="hidden sm:inline-block heritage-smallcaps text-[var(--ink)] hover:text-[var(--oxblood)] transition-colors"
					>
						All goods →
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7">
					{tiles.map((tile, idx) => (
						<YnsLink key={tile.slug} href={tile.href} prefetch={"eager"} className="group block">
							<div className="relative aspect-[4/5] overflow-hidden bg-[var(--secondary)]">
								<Image
									src={tile.image}
									alt={tile.name}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
								/>
								<div
									aria-hidden="true"
									className="absolute inset-0"
									style={{
										background:
											idx === 2
												? "linear-gradient(180deg, transparent 40%, rgba(63,28,30,0.45) 100%)"
												: "linear-gradient(180deg, transparent 50%, rgba(15,14,12,0.35) 100%)",
									}}
								/>
								<span className="absolute top-4 left-4 heritage-smallcaps text-[var(--cream)]/85 bg-[rgba(15,14,12,0.35)] backdrop-blur-sm px-2 py-1">
									№ {String(idx + 1).padStart(2, "0")}
								</span>
							</div>
							<div className="mt-4 flex items-end justify-between">
								<div>
									<h3 className="font-display text-2xl tracking-tight text-[var(--ink)] group-hover:text-[var(--oxblood)] transition-colors">
										{tile.name}
									</h3>
									<p className="mt-1 text-sm italic text-[var(--ink)]/65">{tile.caption}</p>
								</div>
								<span className="heritage-smallcaps text-[var(--ink)]/70 group-hover:text-[var(--oxblood)] transition-colors">
									Shop
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
