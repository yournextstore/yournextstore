import type { APIProductsBrowseResult } from "commerce-kit";
import { headers } from "next/headers";

export const PREVIEW_HOST_MARKER = "yournextstore-demo";
export const PREVIEW_HOST_SUFFIX = "yournextstore.vercel.app";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type ColorOption = { value: string; label: string; colorValue: string | null };
type SizeOption = { value: string; label: string };

const NOW = "2026-05-13T00:00:00.000Z";
const STORE_ID = "demo-store";

const makeVariant = (id: string, price: string, images: string[], color: ColorOption, size: SizeOption) => ({
	id,
	createdAt: NOW,
	updatedAt: NOW,
	storeId: STORE_ID,
	description: null,
	price,
	images,
	sku: id.toUpperCase(),
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
	productId: id.split("-v-")[0] ?? id,
	attributes: null,
	originalPrice: price,
	prePromotionPrice: null,
	combinations: [
		{
			createdAt: NOW,
			updatedAt: NOW,
			productVariantId: id,
			variantValueId: `${id}-color`,
			variantValue: {
				id: `${id}-color-v`,
				value: color.value,
				colorValue: color.colorValue,
				variantType: {
					id: "color",
					type: "color" as const,
					label: "Color",
				},
			},
		},
		{
			createdAt: NOW,
			updatedAt: NOW,
			productVariantId: id,
			variantValueId: `${id}-size`,
			variantValue: {
				id: `${id}-size-v`,
				value: size.value,
				colorValue: null,
				variantType: {
					id: "size",
					type: "string" as const,
					label: "Size",
				},
			},
		},
	],
	prices: [],
});

const makeProduct = (args: {
	id: string;
	slug: string;
	name: string;
	summary: string;
	price: string;
	image: string;
	colorLabel: string;
	colorValue: string;
}): BrowseProduct => {
	const variantId = `${args.id}-v-1`;
	return {
		id: args.id,
		name: args.name,
		createdAt: NOW,
		updatedAt: NOW,
		type: "product",
		slug: args.slug,
		status: "published",
		flags: null,
		storeId: STORE_ID,
		brandId: null,
		summary: args.summary,
		content: null,
		images: [args.image],
		badge: null,
		bundleDiscountPercentage: null,
		seo: null,
		stripeTaxCode: null,
		categoryId: "demo-tops",
		category: {
			id: "demo-tops",
			name: "Tops",
			image: null,
			createdAt: NOW,
			updatedAt: NOW,
			slug: "tops",
			active: true,
			storeId: STORE_ID,
			description: null,
			position: "0",
			seo: null,
			longDescription: null,
			parentId: null,
		},
		productTaxRate: null,
		productCollections: [],
		bundleProducts: [],
		tr: [],
		variants: [
			makeVariant(
				variantId,
				args.price,
				[args.image],
				{ value: args.colorLabel, label: args.colorLabel, colorValue: args.colorValue },
				{ value: "S", label: "S" },
			),
			makeVariant(
				`${args.id}-v-2`,
				args.price,
				[args.image],
				{ value: args.colorLabel, label: args.colorLabel, colorValue: args.colorValue },
				{ value: "M", label: "M" },
			),
			makeVariant(
				`${args.id}-v-3`,
				args.price,
				[args.image],
				{ value: args.colorLabel, label: args.colorLabel, colorValue: args.colorValue },
				{ value: "L", label: "L" },
			),
		],
		subscriptionPlanProducts: [],
	} satisfies BrowseProduct;
};

export const DEMO_PRODUCTS: BrowseProduct[] = [
	makeProduct({
		id: "demo-1",
		slug: "demo-1",
		name: "Cropped Cotton Shirt — Lilac",
		summary:
			"A sculptural cropped button-up in pearlescent lilac cotton with patch pockets and tonal stitching. Cut for a relaxed, boxy fit.",
		price: "21000",
		image: "/scraped-0.jpg",
		colorLabel: "Lilac",
		colorValue: "#B69CD8",
	}),
	makeProduct({
		id: "demo-2",
		slug: "demo-2",
		name: "High-Waisted Wide-Leg Trouser",
		summary:
			"Matte charcoal wool blend with a clean front and tailored break. Wide leg, mid-rise, ankle length.",
		price: "32500",
		image: "/scraped-1.jpg",
		colorLabel: "Onyx",
		colorValue: "#1A1A1A",
	}),
	makeProduct({
		id: "demo-3",
		slug: "demo-3",
		name: "Pistachio Leather Tote",
		summary: "Compact daily carry in vegetable-tanned pistachio leather with brushed gold fittings.",
		price: "42000",
		image: "/scraped-2.jpg",
		colorLabel: "Pistachio",
		colorValue: "#C7D9B5",
	}),
	makeProduct({
		id: "demo-4",
		slug: "demo-4",
		name: "Silk Cherry Print Scarf",
		summary:
			"Hand-rolled silk twill with a painterly cherry-on-cream motif. Wear knotted, draped, or as a top.",
		price: "14500",
		image: "/scraped-3.jpg",
		colorLabel: "Cream",
		colorValue: "#F4F4F6",
	}),
	makeProduct({
		id: "demo-5",
		slug: "demo-5",
		name: "Sculpted Travertine Blouse",
		summary:
			"Featherweight ivory poplin with sculptural pleating at the shoulder. Half-tucked, undone, effortless.",
		price: "23000",
		image: "/scraped-4.jpg",
		colorLabel: "Ivory",
		colorValue: "#FFFFFF",
	}),
	makeProduct({
		id: "demo-6",
		slug: "demo-6",
		name: "Cropped Lavender Denim Shirt",
		summary:
			"Structured lavender denim with patch pockets and contrast topstitch. Boxy crop, mother-of-pearl buttons.",
		price: "28500",
		image: "/scraped-5.jpg",
		colorLabel: "Lavender",
		colorValue: "#B69CD8",
	}),
	makeProduct({
		id: "demo-7",
		slug: "demo-7",
		name: "Bandeau Top — Onyx",
		summary: "Sculpted matte jersey bandeau. Hidden underwire, seam-free finish, designed to layer.",
		price: "9800",
		image: "/scraped-1.jpg",
		colorLabel: "Onyx",
		colorValue: "#1A1A1A",
	}),
	makeProduct({
		id: "demo-8",
		slug: "demo-8",
		name: "Platform Sandal — Noir",
		summary: "Chunky platform in patent black leather with a buckled ankle strap. Italian-made.",
		price: "39500",
		image: "/scraped-2.jpg",
		colorLabel: "Noir",
		colorValue: "#1A1A1A",
	}),
];

export async function isPreview(
	searchParams: Record<string, string | string[] | undefined>,
): Promise<boolean> {
	const flag = searchParams.preview;
	const flagValue = Array.isArray(flag) ? flag[0] : flag;
	if (flagValue !== "1") {
		return false;
	}

	const hdrs = await headers();
	const host = (hdrs.get("host") ?? "").toLowerCase();
	if (!host) {
		return false;
	}

	return host.includes(PREVIEW_HOST_MARKER) || host.endsWith(PREVIEW_HOST_SUFFIX);
}

export function previewHref(href: string, preview: boolean): string {
	if (!preview) {
		return href;
	}
	if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
		return href;
	}
	const [base, hash = ""] = href.split("#");
	const sep = base?.includes("?") ? "&" : "?";
	const hashPart = hash ? `#${hash}` : "";
	return `${base ?? ""}${sep}preview=1${hashPart}`;
}

export function findDemoProductBySlug(slug: string): BrowseProduct | undefined {
	return DEMO_PRODUCTS.find((p) => p.slug === slug);
}
