import type { APIProductGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import type { Plate } from "@/lib/editorial";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CatalogSource = BrowseProduct | FullProduct;

/**
 * One archive record, flattened on the server so the client archive (facets, sort, grid/list)
 * filters plain data and formats nothing. Prices are the store's display prices (gross on a
 * tax-inclusive store) in minor units.
 */
export type Piece = {
	id: string;
	slug: string;
	href: string;
	name: string;
	no: string;
	category: { name: string; slug: string } | null;
	image: string | null;
	images: string[];
	price: number;
	priceLabel: string;
	compareLabel: string | null;
	stock: "in" | "low" | "out";
	options: { label: string; values: string[] }[];
	detail: string | null;
	excerpt: string | null;
	createdAt: number;
	quickAdd: {
		variantId: string;
		sku: string | null;
		price: string;
		priceGross: string | null;
		images: string[];
	} | null;
};

export function stills(images: readonly string[]) {
	return images.filter((image) => !isVideoUrl(image));
}

/** The whole active catalogue, oldest first; the archive, the hero and the menus share it. */
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, limit: 100, orderBy: "createdAt", orderDirection: "asc" })
		.catch(() => ({ data: [] as BrowseProduct[] }));
	return data;
}

/** Register numbers ("No. 014") follow the order pieces entered the catalogue. */
async function getRegisterNumbers() {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	return Object.fromEntries(
		products.map((product, index) => [product.id, String(index + 1).padStart(3, "0")]),
	);
}

function sentenceCase(value: string) {
	const lower = value.toLocaleLowerCase();
	return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
}

/** Category names sometimes arrive lower-case; headings want a capital. */
export function displayName(value: string) {
	return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

export type SummaryBlock = { kind: "para" | "head"; text: string };
export type SpecRow = [label: string, value: string];

/**
 * Splits a plain-text summary into the record's prose and its ledger. Lines shaped like
 * `KEY: value` with an upper-case key and a short value become ledger rows; a long value
 * under such a key ("OPIS: …") is prose. Short lines without a full stop read as subheads.
 */
export function parseSummary(summary: string | null | undefined, productName: string) {
	const name = productName.replace(/\s+/g, " ").trim().toLowerCase();
	const lines = (summary ?? "")
		.split(/\r?\n/)
		.map((line) => line.replace(/\s+/g, " ").trim())
		.filter((line) => line && line.toLowerCase() !== name);

	// A short opening line without a full stop repeats a title, not prose.
	while (lines[0] && lines[0].length <= 60 && !/[.!?]$/.test(lines[0]) && !lines[0].includes(":")) {
		lines.shift();
	}

	const specs: SpecRow[] = [];
	const blocks: SummaryBlock[] = [];
	for (const line of lines) {
		const match = /^([^:]{2,28}):\s*(.+)$/.exec(line);
		const key = match?.[1]?.trim();
		const value = match?.[2]?.trim();
		if (key && value && key === key.toLocaleUpperCase() && /\p{L}/u.test(key)) {
			if (value.length <= 80) {
				specs.push([sentenceCase(key), value]);
			} else {
				blocks.push({ kind: "para", text: value });
			}
			continue;
		}
		const isHead = line.length <= 40 && !/[.!?:,]$/.test(line) && blocks.length > 0;
		blocks.push({ kind: isHead ? "head" : "para", text: line });
	}
	return { blocks, specs };
}

function optionGroups(product: CatalogSource) {
	const groups = new Map<string, string[]>();
	for (const variant of product.variants) {
		for (const { variantValue } of variant.combinations) {
			const label = variantValue.variantType.label;
			const values = groups.get(label) ?? [];
			if (!values.includes(variantValue.value)) values.push(variantValue.value);
			groups.set(label, values);
		}
	}
	return [...groups.entries()].map(([label, values]) => ({ label, values }));
}

const LOW_STOCK = 2;

export function toPiece(
	product: CatalogSource,
	config: Awaited<ReturnType<typeof getStoreConfig>>,
	no: string | undefined,
): Piece {
	const { currency, locale, taxBehavior } = config;
	const variants = product.variants;
	const prices = variants.map((variant) => BigInt(displayPrice(variant, taxBehavior)));
	const min = prices.reduce((a, b) => (b < a ? b : a), prices[0] ?? BigInt(0));
	const max = prices.reduce((a, b) => (b > a ? b : a), prices[0] ?? BigInt(0));
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	const only = variants.length === 1 ? variants[0] : null;
	const listPrice = only ? displayPrice(only, taxBehavior, "originalPrice") : null;
	const compareLabel = only && listPrice && BigInt(listPrice) > min ? fmt(BigInt(listPrice)) : null;

	const stocks = variants.map((variant) => variant.stock);
	const soldOut = stocks.length > 0 && stocks.every((stock) => stock === 0);
	const tracked = stocks.filter((stock): stock is number => stock !== null);
	const low = !soldOut && tracked.length === stocks.length && tracked.reduce((a, b) => a + b, 0) <= LOW_STOCK;

	const images = stills([
		...product.images,
		...variants.flatMap((variant) => variant.images).filter((image) => !product.images.includes(image)),
	]);
	const options = optionGroups(product);
	const { specs, blocks } = parseSummary(product.summary, product.name);
	const firstPara = blocks.find((block) => block.kind === "para")?.text ?? null;
	const excerpt = firstPara && firstPara.length > 160 ? `${firstPara.slice(0, 157).trimEnd()}…` : firstPara;
	const optionLine = options.find((group) => group.values.length > 1);

	// A single-variant record deep-links to that variant; a bare link would show the default.
	const search =
		only && only.combinations.length > 0
			? `?${new URLSearchParams(
					only.combinations.map((c) => [c.variantValue.variantType.label, c.variantValue.value]),
				).toString()}`
			: "";

	return {
		id: product.id,
		slug: product.slug,
		href: `/product/${product.slug}${search}`,
		name: product.name,
		no: no ?? product.id.slice(-3).toUpperCase(),
		category: product.category ? { name: product.category.name, slug: product.category.slug } : null,
		image: images[0] ?? null,
		images,
		price: Number(min),
		priceLabel: min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`,
		compareLabel,
		stock: soldOut ? "out" : low ? "low" : "in",
		options,
		detail: optionLine
			? `${displayName(optionLine.label)} · ${optionLine.values.length} options`
			: (specs.find(([, value]) => value.length <= 32)?.[1] ?? null),
		excerpt,
		createdAt: new Date(product.createdAt).getTime(),
		quickAdd:
			only && only.stock !== 0
				? {
						variantId: only.id,
						sku: only.sku ?? null,
						price: only.price,
						priceGross: "priceGross" in only ? (only.priceGross ?? null) : null,
						images: only.images,
					}
				: null,
	};
}

export async function toPieces(products: readonly CatalogSource[]) {
	const [config, numbers] = await Promise.all([getStoreConfig(), getRegisterNumbers()]);
	return products.map((product) => toPiece(product, config, numbers[product.id]));
}

/** Every active piece as archive records (newest entries last, like the register). */
export async function getArchivePieces() {
	"use cache";
	cacheLife("minutes");
	return toPieces(await getCatalogProducts());
}

export type Department = { name: string; slug: string; count: number; image: string | null };

/** Top-level categories that hold pieces, largest first. */
export async function getDepartments(): Promise<Department[]> {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const bySlug = new Map<string, Department>();
	for (const product of products) {
		const category = product.category;
		if (!category || category.parentId) continue;
		const entry = bySlug.get(category.slug) ?? {
			name: displayName(category.name),
			slug: category.slug,
			count: 0,
			image: typeof category.image === "string" ? category.image : null,
		};
		bySlug.set(category.slug, { ...entry, count: entry.count + 1 });
	}
	return [...bySlug.values()].sort((a, b) => b.count - a.count);
}

/** One photograph per pictured piece (its first), for the plates of a department or collection. */
export function editorialShots(products: readonly CatalogSource[]) {
	const seen = new Set<string>();
	return [...products]
		.map((product) => ({ product, photos: stills(product.images) }))
		.filter(({ photos }) => photos.length > 0)
		.flatMap(({ product, photos }) => {
			const src = photos[0];
			if (!src || seen.has(src)) return [];
			seen.add(src);
			return [{ src, name: product.name, slug: product.slug }];
		});
}

export async function getStoreIdentity() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	const settings = me?.store.settings;
	return {
		storeName: settings?.storeName || me?.store.name || "Your Next Store",
		storeDescription: settings?.storeDescription || null,
		contactFormEnabled: settings?.enabledTools?.contactForm ?? false,
		blogEnabled: settings?.enabledTools?.blog ?? false,
	};
}

/**
 * The hero's plates: bundled photographs captioned as numbered plates, each opening a
 * department (largest first, wrapping), or the whole archive when the store has none.
 */
export async function heroTiles(
	plates: readonly Plate[],
	firstNumber = 1,
): Promise<{ label: string; href: string; src: string }[]> {
	const departments = await getDepartments();
	return plates.map((plate, index) => {
		const department = departments.length > 0 ? departments[index % departments.length] : null;
		return {
			label: `plate ${String(firstNumber + index).padStart(2, "0")}`,
			href: department ? `/category/${department.slug}` : "/products",
			src: plate.src,
		};
	});
}
