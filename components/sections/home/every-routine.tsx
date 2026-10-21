import Image from "next/image";
import Link from "next/link";
import { getCategories, getCollections, getProducts, PHOTOS, picturedFirst } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type Tile = { href: string; label: string; image: string | null };

/**
 * The original's "for EVERY goal" grid: two wide tiles (collections, then categories, over bundled
 * Pexels photos) and three small ones (the store's own pictured products), each with a white label chip.
 */
export async function EveryRoutine() {
	const [collections, categories, products] = await Promise.all([
		getCollections(),
		getCategories(),
		getProducts(24),
	]);
	const wide: Tile[] = [
		...collections.map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
		...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
	]
		.slice(0, PHOTOS.wide.length)
		.map((tile, index) => ({ ...tile, image: PHOTOS.wide[index] ?? null }));
	const small: Tile[] = picturedFirst(products)
		.filter((p) => p.images[0])
		.slice(0, 5 - wide.length)
		.map((p) => ({ href: `/product/${p.slug}`, label: p.name, image: p.images[0] ?? null }));
	const tiles = [...wide, ...small];
	if (tiles.length === 0) return null;

	return (
		<section aria-labelledby="every-routine" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
			<h2
				id="every-routine"
				className="section-title mb-12 text-center text-[2rem] text-ink lg:mb-14 lg:text-heading-xl"
			>
				Essentials for <span className="stroke-word">Every</span> Routine
			</h2>
			<ul className="grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-5">
				{tiles.map((tile, index) => {
					const isWide = index < wide.length;
					return (
						<li
							key={tile.href}
							className={cn(
								isWide ? "col-span-2 lg:col-span-3" : "col-span-1 lg:col-span-2",
								!isWide &&
									tiles.length - wide.length === 3 &&
									index === tiles.length - 1 &&
									"col-span-2 lg:col-span-2",
							)}
						>
							<Link
								href={tile.href}
								className={cn(
									"group relative block overflow-hidden rounded-sm bg-tile",
									isWide ? "aspect-[3/2]" : "aspect-[3/2] lg:aspect-[3/2]",
								)}
							>
								{tile.image &&
									(isWide ? (
										<Image
											src={tile.image}
											alt=""
											fill
											sizes="(max-width: 1024px) 100vw, 560px"
											className="object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									) : (
										<YNSMedia
											src={tile.image}
											alt=""
											fill
											sizes="(max-width: 1024px) 50vw, 370px"
											className="object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									))}
								<span className="absolute bottom-2.5 left-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-sm bg-white px-2 py-1 text-xs font-medium uppercase tracking-wide text-ink">
									{tile.label}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
