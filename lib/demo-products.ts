import type { APIProductGetByIdResult } from "commerce-kit";
import { headers } from "next/headers";

export const PREVIEW_HOST_MARKER = "yournextstore-demo";
export const PREVIEW_HOST_SUFFIX = "yournextstore.vercel.app";

type DemoProduct = NonNullable<APIProductGetByIdResult>;

const NOW = "2026-01-01T00:00:00.000Z";
const STORE_ID = "demo-store";

type DemoInput = {
	id: string;
	name: string;
	slug: string;
	summary: string;
	price: string;
	image: string;
};

function buildDemoProduct(input: DemoInput): DemoProduct {
	const variantId = `variant-${input.id}`;
	return {
		id: input.id,
		name: input.name,
		createdAt: NOW,
		updatedAt: NOW,
		type: "product",
		slug: input.slug,
		status: "published",
		flags: null,
		storeId: STORE_ID,
		brandId: null,
		summary: input.summary,
		content: null,
		images: [input.image],
		badge: null,
		bundleDiscountPercentage: null,
		seo: null,
		stripeTaxCode: null,
		categoryId: null,
		category: null,
		productTaxRate: null,
		productCollections: [],
		bundleProducts: [],
		variantsTypes: [],
		tr: [],
		variants: [
			{
				id: variantId,
				createdAt: NOW,
				updatedAt: NOW,
				storeId: STORE_ID,
				description: null,
				price: input.price,
				images: [input.image],
				sku: null,
				barcode: null,
				calculatedPrice: null,
				stock: 99,
				depth: null,
				width: null,
				height: null,
				weight: null,
				digital: null,
				shippable: true,
				externalId: null,
				productId: input.id,
				attributes: null,
				originalPrice: input.price,
				combinations: [],
				prices: [],
				prePromotionPrice: null,
				omnibusPrice: null,
			},
		],
		subscriptionPlanProducts: [],
		volumePricingTiers: [],
	} satisfies DemoProduct;
}

export const DEMO_PRODUCTS: readonly DemoProduct[] = [
	buildDemoProduct({
		id: "demo-1",
		name: "Creator Storefront Kit",
		slug: "demo-1",
		summary: "Plug-and-play storefront templates designed for solo creators selling digital goods.",
		price: "4900",
		image: "/scraped-0.jpg",
	}),
	buildDemoProduct({
		id: "demo-2",
		name: "Brushwork Pro – Procreate Pack",
		slug: "demo-2",
		summary: "120 hand-tuned Procreate brushes for illustration, lettering, and editorial portraits.",
		price: "2900",
		image: "/scraped-1.jpg",
	}),
	buildDemoProduct({
		id: "demo-3",
		name: "Aurora Lightroom Presets",
		slug: "demo-3",
		summary: "A 24-preset Lightroom suite tuned for soft lilac highlights and golden-hour skin tones.",
		price: "1800",
		image: "/scraped-2.jpg",
	}),
	buildDemoProduct({
		id: "demo-4",
		name: "Founder Newsletter OS",
		slug: "demo-4",
		summary: "Notion template for planning, drafting, and shipping a paid newsletter without burnout.",
		price: "3900",
		image: "/scraped-3.jpg",
	}),
	buildDemoProduct({
		id: "demo-5",
		name: "Studio Capsule Course",
		slug: "demo-5",
		summary: "Six-hour video workshop on building a portfolio that converts visitors into paying clients.",
		price: "12900",
		image: "/scraped-4.jpg",
	}),
	buildDemoProduct({
		id: "demo-6",
		name: "Indie Pricing Playbook",
		slug: "demo-6",
		summary: "A 70-page guide and spreadsheet for pricing creative work with confidence and clarity.",
		price: "2400",
		image: "/scraped-5.jpg",
	}),
	buildDemoProduct({
		id: "demo-7",
		name: "Launch Day Mockup Bundle",
		slug: "demo-7",
		summary: "12 editorial mockups for posters, devices, and packaging — drag-and-drop ready in Figma.",
		price: "3400",
		image: "/scraped-0.jpg",
	}),
	buildDemoProduct({
		id: "demo-8",
		name: "Earnings Tracker Suite",
		slug: "demo-8",
		summary: "Spreadsheets to track digital product income, taxes, and growth across platforms.",
		price: "1900",
		image: "/scraped-1.jpg",
	}),
];

export function findDemoProductBySlug(slug: string): DemoProduct | undefined {
	return DEMO_PRODUCTS.find((product) => product.slug === slug);
}

export async function isPreview(
	searchParams: Record<string, string | string[] | undefined>,
): Promise<boolean> {
	if (searchParams.preview !== "1") {
		return false;
	}
	const host = (await headers()).get("host")?.toLowerCase() ?? "";
	return host.includes(PREVIEW_HOST_MARKER) || host.endsWith(PREVIEW_HOST_SUFFIX);
}

export function previewHref(href: string, preview: boolean): string {
	if (!preview) {
		return href;
	}
	const separator = href.includes("?") ? "&" : "?";
	return `${href}${separator}preview=1`;
}

export async function isPreviewHost(): Promise<boolean> {
	const host = (await headers()).get("host")?.toLowerCase() ?? "";
	return host.includes(PREVIEW_HOST_MARKER) || host.endsWith(PREVIEW_HOST_SUFFIX);
}
