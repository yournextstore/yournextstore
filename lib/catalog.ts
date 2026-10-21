import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";

export type BrowseProduct = APIProductsBrowseResult["data"][number];

export type Shelf = { title: string; href: string; products: BrowseProduct[] };

const ROW = 5;
// A shelf needs most of a row; a short one leaves a gap at the end of the line.
const MIN_SHELF = 4;

type Pickable = Pick<BrowseProduct, "images" | "variants">;

const hasPhoto = (p: Pickable) =>
	(p.images?.length ?? 0) > 0 || p.variants.some((v) => (v.images?.length ?? 0) > 0);
const lowestPrice = (p: Pickable) =>
	Math.min(...p.variants.map((v) => Number(v.price)).filter((n) => n > 0), Number.POSITIVE_INFINITY);

/** Photographed, priced products first, keeping the store's order within each group. */
export function photographedFirst<T extends Pickable>(products: T[]) {
	const score = (p: T) => (hasPhoto(p) ? 0 : 2) + (Number.isFinite(lowestPrice(p)) ? 0 : 1);
	return products
		.map((product, index) => ({ product, index }))
		.sort((a, b) => score(a.product) - score(b.product) || a.index - b.index)
		.map(({ product }) => product);
}

/**
 * Home rows (original BooksSection): "New Arrivals", then top-level categories with a nearly full
 * shelf, topped up with two price-ordered rows so a thin catalogue still reads as a stocked shop.
 * Only photographed, priced products go on a shelf. Four rows at most.
 */
export async function getHomeShelves(): Promise<Shelf[]> {
	"use cache";
	cacheLife("minutes");
	const browse = async (params: Parameters<typeof commerce.productBrowse>[0]) => {
		const [error, result] = await try_(commerce.productBrowse({ active: true, limit: 24, ...params }));
		return error ? [] : result.data;
	};
	const shelfOf = (products: BrowseProduct[]) =>
		photographedFirst(products)
			.filter((p) => hasPhoto(p) && Number.isFinite(lowestPrice(p)))
			.slice(0, ROW);
	const byPrice = (products: BrowseProduct[], dir: 1 | -1) =>
		products
			.filter((p) => hasPhoto(p) && Number.isFinite(lowestPrice(p)))
			.map((product, index) => ({ product, index }))
			.sort((a, b) => dir * (lowestPrice(a.product) - lowestPrice(b.product)) || a.index - b.index)
			.map(({ product }) => product)
			.slice(0, ROW);
	const [catError, categories] = await try_(commerce.categoriesBrowse({ active: true, limit: 50 }));
	const topLevel = catError ? [] : categories.data.filter((c) => !c.parentId);
	const [newest, categoryRows] = await Promise.all([
		browse({ orderBy: "createdAt", orderDirection: "desc" }),
		Promise.all(
			topLevel.map(async (category) => ({
				title: category.name,
				href: `/category/${category.slug}`,
				products: shelfOf(await browse({ category: category.slug })),
			})),
		),
	]);
	const rows: Shelf[] = [
		{ title: "New Arrivals", href: "/products?sort=newest", products: shelfOf(newest) },
		...categoryRows.filter((row) => row.products.length >= MIN_SHELF),
		{ title: "Little Finds", href: "/products?sort=price-asc", products: byPrice(newest, 1) },
		{ title: "Special Editions", href: "/products?sort=price-desc", products: byPrice(newest, -1) },
	];
	return rows.filter((row) => row.products.length >= MIN_SHELF).slice(0, 4);
}
