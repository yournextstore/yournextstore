import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { pickEditorial } from "@/lib/editorial";
import { isVideoUrl } from "@/lib/utils";

export type CatalogProduct = APIProductsBrowseResult["data"][number];

/** Flattens a TipTap document (or a plain string) into its visible text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object") return "";
	const node = value as { type?: unknown; text?: unknown; content?: unknown };
	if (typeof node.text === "string") return node.text;
	const children = Array.isArray(node.content) ? node.content.map(richTextToPlain) : [];
	const inline = node.type === "paragraph" || node.type === "heading";
	return children
		.filter(Boolean)
		.join(inline ? "" : " ")
		.trim();
}

export const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

// One browse of the catalog backs the menu, the hero and every "no image of its own" fallback.
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] }));
	return picturedFirst(data);
}

type Pictured = {
	images?: readonly string[] | null;
	variants?: readonly { images?: readonly string[] | null }[];
};

const isPictured = (product: Pictured) =>
	Boolean(firstStill(product.images) ?? product.variants?.map((v) => firstStill(v.images)).find(Boolean));

/** Products with a photograph (their own or a variant's) first, the rest after; order otherwise kept. */
export function picturedFirst<T extends Pictured>(products: readonly T[]): T[] {
	return [...products.filter(isPictured), ...products.filter((product) => !isPictured(product))];
}

export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.name || "Your Next Store";
}

export type MenuLink = { href: string; label: string; image?: string | null };

export type MenuItem = {
	href: string;
	label: string;
	/** Sub-categories → a text grid; otherwise a few of the category's products → an image grid. */
	submenu:
		| { variant: "text"; columns: { href: string; label: string; links: MenuLink[] }[] }
		| { variant: "image"; links: MenuLink[] }
		| null;
};

/** The mega menu: up to five top-level categories that have products, each with its dropdown. */
export async function getMenu(): Promise<MenuItem[]> {
	"use cache";
	cacheLife("hours");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	const all = categories.data;
	const childrenOf = (id: string) => all.filter((category) => category.parentId === id);
	const productsIn = (id: string) => products.filter((product) => product.category?.id === id);
	const hasProducts = (id: string): boolean =>
		productsIn(id).length > 0 || childrenOf(id).some((child) => hasProducts(child.id));

	return all
		.filter((category) => !category.parentId && hasProducts(category.id))
		.slice(0, 5)
		.map((category) => {
			const children = childrenOf(category.id).filter((child) => hasProducts(child.id));
			const href = `/category/${category.slug}`;
			if (children.length > 0) {
				return {
					href,
					label: category.name,
					submenu: {
						variant: "text" as const,
						columns: children.map((child) => ({
							href: `${href}/${child.slug}`,
							label: child.name,
							links: childrenOf(child.id).map((leaf) => ({
								href: `${href}/${child.slug}/${leaf.slug}`,
								label: leaf.name,
							})),
						})),
					},
				};
			}
			const links = productsIn(category.id)
				.slice(0, 5)
				.map((product) => ({
					href: `/product/${product.slug}`,
					label: product.name,
					image: firstStill(product.images),
				}));
			return {
				href,
				label: category.name,
				submenu: links.length > 0 ? { variant: "image" as const, links } : null,
			};
		});
}

export type CategoryTile = {
	id: string;
	name: string;
	href: string;
	image: string | null;
	description: string;
};

/** Top-level categories that have products, each pictured by its own image or an editorial photograph. */
export async function getCategoryTiles(limit: number): Promise<CategoryTile[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	const stocked = categories.data
		.filter((category) => !category.parentId && products.some((p) => p.category?.id === category.id))
		.slice(0, limit);
	const photos = pickEditorial(
		stocked.map((category) => `${category.name} ${category.slug}`),
		"tile",
	);
	return stocked.map((category, index) => ({
		id: category.id,
		name: category.name,
		href: `/category/${category.slug}`,
		image: category.image ?? photos[index] ?? null,
		description: richTextToPlain(category.description),
	}));
}

export type HeroSlide = {
	id: string;
	title: string;
	subtitle: string;
	ctaText: string;
	ctaHref: string;
	image: string;
	imageAlt: string;
	product: CatalogProduct;
};

/**
 * The hero carousel: one slide per category (up to four), each led by the category's
 * name, pictured by its own image or an editorial photograph and pinned with a card for one
 * of its products.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	const withProducts = categories.data
		.filter((category) => !category.parentId)
		.flatMap((category) => {
			const featured = products.find((p) => p.category?.id === category.id && firstStill(p.images));
			return featured ? [{ category, featured }] : [];
		})
		.slice(0, 4);
	const photos = pickEditorial(
		withProducts.map(({ category }) => `${category.name} ${category.slug}`),
		"hero",
	);
	return withProducts.flatMap(({ category, featured }, index) => {
		const image = category.image ?? photos[index];
		if (!image) return [];
		const description = richTextToPlain(category.description);
		return [
			{
				id: category.id,
				title: category.name,
				subtitle:
					description && description.length > 24
						? description
						: `Discover ${category.name.toLowerCase()} picked for the way you live, from everyday essentials to new favourites`,
				ctaText: `Shop ${category.name}`,
				ctaHref: `/category/${category.slug}`,
				image,
				imageAlt: "",
				product: featured,
			},
		];
	});
}
