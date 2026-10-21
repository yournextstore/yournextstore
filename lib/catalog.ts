import type { APICollectionGetByIdResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { encodeVts } from "@/lib/vts";

// The page has no pagination, so a smart collection renders one browse page. 100 is the API's max.
const SMART_COLLECTION_LIMIT = 100;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// The SDK throws on a 404 despite its `| null` type.
export async function getCollectionData(slug: string) {
	"use cache";
	cacheLife("minutes");
	const [error, collection] = await try_(commerce.collectionGet({ idOrSlug: slug }));
	return error ? null : collection;
}

// Only a `manual` collection keeps its members in the join table that `collectionGet` returns —
// the smart filters are evaluated against the whole catalog when the storefront asks for them.
// Re-expressing each one as the equivalent product browse keeps those collections from
// rendering as an empty grid. Cached, which also pins the `Date.now()` below to the entry.
export async function getCollectionProducts(collection: APICollectionGetByIdResult) {
	"use cache";
	cacheLife("minutes");
	const { filter } = collection;

	if (filter.type === "manual") {
		const ids = collection.productCollections.map((pc) => pc.product.id);
		// One product deleted since it joined must not fail the page.
		return (
			await Promise.all(ids.map((id) => commerce.productGet({ idOrSlug: id }).catch(() => null)))
		).filter((product) => product !== null);
	}

	if (filter.type === "variantValues") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			vts: encodeVts(filter.values),
		});
		return data;
	}

	if (filter.type === "dynamicPrice") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			priceMin: filter.min ?? undefined,
			priceMax: filter.max ?? undefined,
		});
		return data;
	}

	const { data } = await commerce.productBrowse({
		active: true,
		limit: SMART_COLLECTION_LIMIT,
		orderBy: "createdAt",
		orderDirection: "desc",
	});

	// A rolling "new arrivals" window has no browse equivalent, so the age bound is applied here.
	if (typeof filter.days !== "number") {
		return data;
	}
	const cutoff = Date.now() - filter.days * MS_PER_DAY;
	return data.filter((product) => new Date(product.createdAt).getTime() >= cutoff);
}

const FEATURED_SLUGS = ["featured", "bestsellers", "best-sellers", "top-picks"];
const RECOMMENDED_SLUGS = ["recommended", "new-arrivals", "new", "new-in"];

export type Shelf = {
	title: string;
	href: string;
	navLabel: string;
	products: Awaited<ReturnType<typeof getCollectionProducts>>;
};

/**
 * The original's two home shelves, "Featured" and "Recommended", become two collections:
 * a bestsellers-like one and a new-arrivals-like one when the store has them, otherwise
 * the first two collections, otherwise the newest products.
 */
export async function getShelves(): Promise<{ featured: Shelf; recommended: Shelf }> {
	"use cache";
	cacheLife("minutes");
	const { data: collections } = await commerce.collectionBrowse({ limit: 50 });
	const bySlugs = (slugs: string[]) => collections.find((c) => slugs.includes(c.slug));
	const featuredRef = bySlugs(FEATURED_SLUGS) ?? collections[0];
	const recommendedRef =
		bySlugs(RECOMMENDED_SLUGS) ?? collections.find((c) => c.id !== featuredRef?.id) ?? undefined;

	const fallback = async (title: string, navLabel: string, offset: number): Promise<Shelf> => {
		const { data } = await commerce.productBrowse({ active: true, limit: 100 });
		return { title, navLabel, href: "/products", products: picturedFirst(data).slice(offset) };
	};

	const toShelf = async (
		ref: (typeof collections)[number] | undefined,
		title: string,
		navLabel: string,
		offset: number,
	): Promise<Shelf> => {
		if (!ref) return fallback(title, navLabel, offset);
		const collection = await getCollectionData(ref.slug);
		if (!collection) return fallback(title, navLabel, offset);
		const products = await getCollectionProducts(collection);
		if (products.length === 0) return fallback(title, navLabel, offset);
		return { title, navLabel: collection.name, href: `/collection/${collection.slug}`, products };
	};

	const [featured, recommended] = await Promise.all([
		toShelf(featuredRef, "Featured Products", "Featured", 0),
		toShelf(recommendedRef, "Recommended Products", "Recommended", 6),
	]);
	return { featured, recommended };
}

/** Top-level categories (parents) for navigation; the shape categories hang under them. */
export async function getTopCategories() {
	"use cache";
	cacheLife("hours");
	const { data } = await commerce.categoriesBrowse({ limit: 50 });
	return data.filter((c) => !c.parentId);
}

/** Bundled banner photographs (see NOTICE.md) for the banner slots. */
export const BANNER_IMAGES = {
	home: { src: "/images/pexels/banner-hat-bag.jpg", alt: "Tortoiseshell glasses resting on a stone ledge" },
	about: {
		src: "/images/pexels/banner-vase.jpg",
		alt: "An optician's fitting table with a mirror and glasses",
	},
	listing: { src: "/images/pexels/banner-hanger.jpg", alt: "A wall display of eyeglass frames" },
} as const;

/** Photographed products first, so a shelf never opens on an empty tile. */
export function picturedFirst<T extends { images?: string[] | null }>(products: T[]): T[] {
	return [...products.filter((p) => p.images?.[0]), ...products.filter((p) => !p.images?.[0])];
}
