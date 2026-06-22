import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const SCRAPED_IMAGES = ["/scraped-1.jpg", "/scraped-3.jpg", "/scraped-4.jpg", "/scraped-5.jpg"] as const;

const FALLBACK_COLLECTIONS = [
	{ name: "Blocks & towers", slug: "products", description: "Geometric stacking systems" },
	{ name: "Wheeled things", slug: "products", description: "Cars, trains, carts" },
	{ name: "Soft objects", slug: "products", description: "Cushioned, painted, plush" },
] as const;

export async function Editorial() {
	"use cache";
	cacheLife("hours");

	const { data: collections } = await commerce.collectionBrowse({ limit: 3 });
	const tiles =
		collections.length > 0
			? collections.map((c, i) => ({
					name: c.name,
					slug: `collection/${c.slug}`,
					description: "Hand-finished in matte pigment",
					image: SCRAPED_IMAGES[i % SCRAPED_IMAGES.length],
				}))
			: FALLBACK_COLLECTIONS.map((c, i) => ({
					...c,
					image: SCRAPED_IMAGES[i % SCRAPED_IMAGES.length],
				}));

	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
			<div className="flex items-end justify-between mb-10 border-b border-[color:var(--border)] pb-6">
				<div>
					<p className="yns-eyebrow text-[color:var(--yns-terracotta)]">Categories</p>
					<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground leading-none">
						Shop by shape
					</h2>
				</div>
				<YnsLink
					prefetch="eager"
					href="/products"
					className="hidden sm:inline-block text-sm font-medium text-foreground/70 hover:text-foreground transition-colors border-b border-foreground/30 hover:border-foreground pb-1"
				>
					All categories →
				</YnsLink>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
				{tiles.map((tile, i) => (
					<YnsLink
						key={tile.slug + i}
						prefetch="eager"
						href={`/${tile.slug}`}
						className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-[color:var(--yns-cream-soft)]"
					>
						<Image
							src={tile.image}
							alt={tile.name}
							fill
							sizes="(max-width: 640px) 100vw, 33vw"
							className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
						<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
							<p className="yns-eyebrow text-white/70">N° 0{i + 1}</p>
							<h3 className="mt-2 font-display text-2xl sm:text-3xl text-white tracking-tight leading-none">
								{tile.name}
							</h3>
							<p className="mt-2 text-sm text-white/80 line-clamp-1">{tile.description}</p>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
