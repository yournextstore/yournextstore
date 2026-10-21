import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";

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

// One browse backs every home section, so the sections can share products without repeating any.
async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] }));
	return data;
}

export type CatalogProduct = Awaited<ReturnType<typeof getCatalogProducts>>[number];

export function productStill(product: { images: readonly string[] }) {
	return product.images.find((image) => !isVideoUrl(image)) ?? null;
}

/**
 * The home page's products: new arrivals are the newest, featured the rest (fuller galleries
 * first). No product appears twice.
 */
export async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const pictured = products.filter((product) => productStill(product));
	const editorial = [
		...pictured.filter((product) => product.images.length >= 2),
		...pictured.filter((product) => product.images.length < 2),
	];
	const arrivals = [...pictured]
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, 6);
	const taken = new Set(arrivals.map((product) => product.id));
	const featured = editorial.filter((product) => !taken.has(product.id)).slice(0, 6);
	return { arrivals, featured };
}
