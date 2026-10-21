import { cacheLife } from "next/cache";
import Link from "next/link";
import { editorial, getFilledCollections, getTopCategories, plainText } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { YNSMedia } from "@/lib/yns-media";

async function getShelf() {
	"use cache";
	cacheLife("hours");
	const [collections, categories, products] = await Promise.all([
		getFilledCollections(),
		getTopCategories(),
		commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
	]);
	// Collections first, topped up with categories that have products, each on an editorial photo.
	const stocked = categories.filter((category) => products.data.some((p) => p.categoryId === category.id));
	const tiles = [
		...collections.map((c) => ({
			key: `collection-${c.slug}`,
			href: `/collection/${c.slug}`,
			name: c.name,
			description: plainText(c.description),
		})),
		...stocked.map((c) => ({
			key: `category-${c.slug}`,
			href: `/category/${c.slug}`,
			name: c.name,
			description: plainText(c.description),
		})),
	].slice(0, 3);
	return {
		onlyCollections: tiles.every((tile) => tile.key.startsWith("collection-")),
		tiles: tiles.map((tile, index) => ({
			...tile,
			image: editorial.shelf[index % editorial.shelf.length] ?? editorial.hero,
		})),
	};
}

export async function CollectionsShelf() {
	const { tiles: shelf, onlyCollections } = await getShelf();
	if (shelf.length === 0) return null;

	return (
		<section className="mx-auto max-w-6xl px-5 py-4 sm:py-14">
			<h2 className="font-display text-3xl font-bold tracking-tight">
				{onlyCollections ? "Shop by collection" : "Browse the shop"}
			</h2>
			<div className={`mt-7 grid gap-5 ${shelf.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
				{shelf.map((collection) => (
					<Link key={collection.key} href={collection.href} className="group block">
						<div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-tile">
							<YNSMedia
								src={collection.image}
								alt=""
								fill
								sizes="(max-width: 640px) 100vw, 540px"
								className="object-cover transition duration-300 group-hover:scale-[1.03]"
							/>
						</div>
						<h3 className="mt-3 text-[17px] font-semibold group-hover:underline group-hover:underline-offset-4">
							{collection.name}
						</h3>
						{collection.description ? (
							<p className="mt-1 line-clamp-2 text-[14px] text-muted-foreground">{collection.description}</p>
						) : null}
					</Link>
				))}
			</div>
		</section>
	);
}
