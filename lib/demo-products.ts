import type { APIProductsBrowseResult } from "commerce-kit";
import { headers } from "next/headers";

export const PREVIEW_HOST_MARKER = "yournextstore-demo";
export const PREVIEW_HOST_SUFFIX = "yournextstore.vercel.app";

type Product = APIProductsBrowseResult["data"][number];

const NOW = "2026-01-01T00:00:00.000Z";
const STORE_ID = "demo-store";

type DemoInput = {
	slug: string;
	name: string;
	price: string;
	image: string;
	summary: string;
	categoryName: string;
	categorySlug: string;
};

function makeDemoProduct({
	slug,
	name,
	price,
	image,
	summary,
	categoryName,
	categorySlug,
}: DemoInput): Product {
	const id = `demo-${slug}`;
	const variantId = `demo-variant-${slug}`;
	const categoryId = `demo-category-${categorySlug}`;
	return {
		id,
		name,
		createdAt: NOW,
		updatedAt: NOW,
		type: "product",
		slug,
		status: "published",
		flags: null,
		storeId: STORE_ID,
		brandId: null,
		summary,
		content: null,
		images: [image],
		badge: null,
		bundleDiscountPercentage: null,
		seo: null,
		stripeTaxCode: null,
		categoryId,
		category: {
			id: categoryId,
			name: categoryName,
			image: null,
			createdAt: NOW,
			updatedAt: NOW,
			slug: categorySlug,
			active: true,
			storeId: STORE_ID,
			description: null,
			position: "1",
			seo: null,
			longDescription: null,
			parentId: null,
		},
		productTaxRate: null,
		productCollections: [],
		bundleProducts: [],
		tr: [],
		subscriptionPlanProducts: [],
		variants: [
			{
				id: variantId,
				createdAt: NOW,
				updatedAt: NOW,
				storeId: STORE_ID,
				description: null,
				price,
				images: [image],
				sku: slug.toUpperCase(),
				barcode: null,
				calculatedPrice: price,
				stock: 12,
				depth: null,
				width: null,
				height: null,
				weight: null,
				digital: null,
				shippable: true,
				externalId: null,
				productId: id,
				attributes: null,
				originalPrice: price,
				combinations: [],
				prices: [],
				prePromotionPrice: null,
			},
		],
	} satisfies Product;
}

export const DEMO_PRODUCTS: Product[] = [
	makeDemoProduct({
		slug: "demo-1",
		name: "Travertine Pedestal Vase",
		price: "18800",
		image: "/scraped-0.jpg",
		summary: "Hand-carved stone vessel with a sun-washed finish, made for slow living.",
		categoryName: "Living",
		categorySlug: "living",
	}),
	makeDemoProduct({
		slug: "demo-2",
		name: "Boucle Lounge Chair",
		price: "146000",
		image: "/scraped-1.jpg",
		summary: "A curved seat in oat boucle, gently sculpted for unhurried afternoons.",
		categoryName: "Living",
		categorySlug: "living",
	}),
	makeDemoProduct({
		slug: "demo-3",
		name: "Stoneware Coffee Set",
		price: "8400",
		image: "/scraped-2.jpg",
		summary: "Wheel-thrown cups and saucers in cream and clay, finished by hand.",
		categoryName: "Kitchen",
		categorySlug: "kitchen",
	}),
	makeDemoProduct({
		slug: "demo-4",
		name: "Hand-Glazed Clay Bowl",
		price: "6200",
		image: "/scraped-3.jpg",
		summary: "Earthen serving bowl glazed in burnt umber and warm parchment.",
		categoryName: "Kitchen",
		categorySlug: "kitchen",
	}),
	makeDemoProduct({
		slug: "demo-5",
		name: "Alabaster Pendant Light",
		price: "32400",
		image: "/scraped-4.jpg",
		summary: "A sculptural alabaster shade that pours a soft honey halo into the room.",
		categoryName: "Lighting",
		categorySlug: "lighting",
	}),
	makeDemoProduct({
		slug: "demo-6",
		name: "Linen Throw in Ochre",
		price: "11800",
		image: "/scraped-5.jpg",
		summary: "Hand-loomed cotton-linen throw, washed for a lived-in softness.",
		categoryName: "Outdoor",
		categorySlug: "outdoor",
	}),
	makeDemoProduct({
		slug: "demo-7",
		name: "Olive Wood Cutting Board",
		price: "7400",
		image: "/scraped-2.jpg",
		summary: "Raw-oak board with a grain that tells its own quiet story.",
		categoryName: "Kitchen",
		categorySlug: "kitchen",
	}),
	makeDemoProduct({
		slug: "demo-8",
		name: "Clay Olive Jar",
		price: "9600",
		image: "/scraped-5.jpg",
		summary: "A terracotta vessel shaped on the wheel and fired by a single maker.",
		categoryName: "Outdoor",
		categorySlug: "outdoor",
	}),
];

export function getDemoProduct(slug: string): Product | undefined {
	return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export async function isPreview(
	searchParams: Record<string, string | string[] | undefined>,
): Promise<boolean> {
	if (searchParams.preview !== "1") {
		return false;
	}
	const h = await headers();
	const host = (h.get("host") ?? "").toLowerCase();
	if (!host) return false;
	return host.includes(PREVIEW_HOST_MARKER) || host.endsWith(PREVIEW_HOST_SUFFIX);
}

export function previewHref(href: string, isPreview: boolean): string {
	if (!isPreview) return href;
	if (href.startsWith("http://") || href.startsWith("https://")) return href;
	if (href.startsWith("#")) return href;
	const separator = href.includes("?") ? "&" : "?";
	return `${href}${separator}preview=1`;
}
