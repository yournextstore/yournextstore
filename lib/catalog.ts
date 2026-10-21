import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";

export type CatalogProduct = APIProductsBrowseResult["data"][number];

export const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

/** The store's display name and switches the chrome reads. */
export async function getStoreBrand() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	const name = me?.store.settings?.storeName || me?.store.name || "Your Next Store";
	return {
		name,
		description: me?.store.settings?.storeDescription?.trim() || "",
		blog: me?.store.settings?.enabledTools?.blog ?? false,
		contact: me?.store.settings?.enabledTools?.contactForm ?? false,
	};
}

/** One cached browse of the catalogue backs every home section. */
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, limit: 100 })
		.catch(() => ({ data: [] as CatalogProduct[] }));
	return data;
}

export type MenuCategory = { name: string; slug: string; count: number; image: string | null };

/**
 * Top-level categories with their product counts (sub-categories roll up into their parent,
 * because a category browse includes its children). Ordered as the store orders them.
 */
export async function getMenuCategories(): Promise<MenuCategory[]> {
	"use cache";
	cacheLife("minutes");
	const [facets, products] = await Promise.all([
		commerce.productFilters().catch(() => ({ categories: [] as { name: string; slug: string }[] })),
		getCatalogProducts(),
	]);
	const childSlugs = new Set(
		products.flatMap((product) => (product.category?.parentId ? [product.category.slug] : [])),
	);
	const topLevel = facets.categories.filter((category) => !childSlugs.has(category.slug));
	const counted = await Promise.all(
		topLevel.map(async (category) => {
			const result = await commerce
				.productBrowse({ active: true, category: category.slug, limit: 1 })
				.catch(() => null);
			return {
				name: category.name,
				slug: category.slug,
				count: result?.meta.count ?? 0,
				image: firstStill(result?.data[0]?.images),
			};
		}),
	);
	return counted.filter((category) => category.count > 0);
}

/** Three products for "Featured Delights": the first collection with three members, else the newest. */
export async function getFeaturedProducts(count = 3) {
	"use cache";
	cacheLife("minutes");
	const collections = await commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] }));
	const candidate = collections.data.find(
		(collection) => collection.active && collection.productCollections.length >= count,
	);
	if (candidate) {
		const { data } = await commerce
			.productBrowse({ active: true, collection: candidate.slug, limit: count })
			.catch(() => ({ data: [] as CatalogProduct[] }));
		if (data.length >= count) {
			return { products: data, collection: { name: candidate.name, slug: candidate.slug } };
		}
	}
	const products = (await getCatalogProducts())
		.filter((product) => firstStill(product.images))
		.slice(0, count);
	return { products, collection: null };
}

/** The gallery draws on the largest top-level category, so it reads as one family of photographs. */
export async function getGalleryProducts(count = 9) {
	"use cache";
	cacheLife("minutes");
	const categories = await getMenuCategories();
	const largest = [...categories].sort((a, b) => b.count - a.count)[0];
	const pool = largest
		? (
				await commerce
					.productBrowse({ active: true, category: largest.slug, limit: 50 })
					.catch(() => ({ data: [] as CatalogProduct[] }))
			).data
		: await getCatalogProducts();
	const withImages = pool.filter((product) => firstStill(product.images));
	const fallback = (await getCatalogProducts()).filter(
		(product) => firstStill(product.images) && !withImages.some((p) => p.id === product.id),
	);
	return [...withImages, ...fallback].slice(0, count);
}

/** Bundled editorial photographs (see NOTICE.md) for the hero, welcome, at-a-glance and about slots. */
export const LIFESTYLE = {
	hero: {
		src: "/images/pexels/hero-tote-chair.jpg",
		alt: "Cakes, croissants and buns laid out on cake stands",
	},
	welcome: {
		src: "/images/pexels/welcome-hat-tote.jpg",
		alt: "Baskets of bread on the counter of a small bakehouse",
	},
	glance: {
		src: "/images/pexels/glance-dining-chair.jpg",
		alt: "A bakery counter case filled with pastries and cookies",
	},
	aboutHero: {
		src: "/images/pexels/about-espresso-chair.jpg",
		alt: "A ball of dough and a rolling pin on a floury bench",
	},
	aboutStory: {
		src: "/images/pexels/about-book-bag.jpg",
		alt: "Sourdough loaves coming out of a brick oven",
	},
} as const;
