import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";

/** Collection descriptions arrive as plain text or TipTap JSON; flatten either to one line. */
export function plainText(value: unknown): string {
	if (typeof value === "string") return value.replace(/\s+/g, " ").trim();
	if (value && typeof value === "object") {
		const node = value as { text?: unknown; content?: unknown };
		const own = typeof node.text === "string" ? node.text : "";
		const children = Array.isArray(node.content) ? node.content.map(plainText).join(" ") : "";
		return `${own} ${children}`.replace(/\s+/g, " ").trim();
	}
	return "";
}

/** Bundled editorial photos (generated, listed in NOTICE.md); product slots keep the store's images. */
export const editorial = {
	hero: "/images/pexels/hero-shadows.jpg",
	feature: "/images/pexels/bag-and-hat.jpg",
	aboutLeft: "/images/pexels/black-tote.jpg",
	aboutRight: "/images/pexels/still-life.jpg",
};

type BrowseProduct = { images: string[]; variants: { price: string }[] };

/** Photographed, priced products first; the rest keep their order at the end. */
export function photographedFirst<P extends BrowseProduct>(products: readonly P[]): P[] {
	const leads = (p: P) => p.images.length > 0 && p.variants.some((v) => Number(v.price) > 0);
	return [...products.filter(leads), ...products.filter((p) => !leads(p))];
}

/** Everything the home page draws, in one cached read. */
export async function getHomeData() {
	"use cache";
	cacheLife("minutes");

	const [me, collections, categories, products] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.collectionBrowse({ limit: 10 }).catch(() => ({ data: [] })),
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		commerce.productBrowse({ active: true, limit: 24 }).catch(() => ({ data: [] })),
	]);
	// Lead with a collection that has products in it; an empty one would open on a blank page.
	const filled = collections.data.filter((c) => c.active && c.productCollections.length > 0);
	const heroCollection = filled[0] ?? null;
	// Names for the about page's running strip: what the store actually carries.
	const words = [
		...categories.data.filter((c) => !c.parentId).map((c) => c.name),
		...filled.map((c) => c.name),
	];

	return {
		storeName: me?.store.name || "Your Next Store",
		storeDescription: me?.store.settings?.storeDescription || null,
		hero: heroCollection ? { href: `/collection/${heroCollection.slug}`, label: heroCollection.name } : null,
		words: [...new Set(words)],
		products: photographedFirst(products.data).slice(0, 10),
	};
}
