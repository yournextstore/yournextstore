import { headers } from "next/headers";

export const PREVIEW_HOST_MARKER = "yournextstore-demo";
export const PREVIEW_HOST_SUFFIX = "yournextstore.vercel.app";

export type DemoVariant = {
	id: string;
	price: string;
	stock: number | null;
	images: string[];
	calculatedPrice: string | null;
};

export type DemoProduct = {
	id: string;
	name: string;
	slug: string;
	summary: string;
	images: string[];
	tag: string | null;
	variants: DemoVariant[];
};

type DemoSeed = {
	slug: string;
	name: string;
	price: string;
	summary: string;
	image: string;
	tag?: string;
};

const DEMO_SEEDS: readonly DemoSeed[] = [
	{
		slug: "demo-1",
		name: "Maison No. 01 — Travertine",
		price: "8800",
		summary: "Hand-poured amber candle layered with bergamot, vetiver, and warm cedar.",
		image: "/scraped-0.jpg",
		tag: "Bestseller",
	},
	{
		slug: "demo-2",
		name: "Maison No. 02 — Linen Light",
		price: "9200",
		summary: "Bottled fragrance with raw vanilla, orris root, and soft musk.",
		image: "/scraped-1.jpg",
		tag: "New",
	},
	{
		slug: "demo-3",
		name: "Maison No. 03 — Ember",
		price: "11400",
		summary: "Smoked glass pillar candle infused with tonka and burnt amber.",
		image: "/scraped-2.jpg",
		tag: "Limited",
	},
	{
		slug: "demo-4",
		name: "Maison No. 04 — Sunlit Reading",
		price: "7400",
		summary: "Travertine taper with notes of fig leaf and warm plaster.",
		image: "/scraped-3.jpg",
	},
	{
		slug: "demo-5",
		name: "Maison No. 05 — Botanical Study",
		price: "6800",
		summary: "Diffuser oil with sandalwood, fresh bergamot peel, and dried tonka.",
		image: "/scraped-4.jpg",
	},
	{
		slug: "demo-6",
		name: "Maison No. 06 — Alabaster Ritual",
		price: "9800",
		summary: "Bath salts in handcrafted ceramic, brushed brass dish included.",
		image: "/scraped-5.jpg",
	},
	{
		slug: "demo-7",
		name: "Maison No. 07 — Brass Match Cloche",
		price: "4800",
		summary: "Polished brass match holder with twelve extra-long fire matches.",
		image: "/scraped-0.jpg",
	},
	{
		slug: "demo-8",
		name: "Maison No. 08 — Linen Bound Library",
		price: "5600",
		summary: "Linen-bound book of fragrance reflections, edition of 500.",
		image: "/scraped-1.jpg",
	},
];

function makeProduct(seed: DemoSeed): DemoProduct {
	return {
		id: seed.slug,
		name: seed.name,
		slug: seed.slug,
		summary: seed.summary,
		images: [seed.image],
		tag: seed.tag ?? null,
		variants: [
			{
				id: `${seed.slug}-v0`,
				price: seed.price,
				stock: 42,
				images: [seed.image],
				calculatedPrice: seed.price,
			},
		],
	};
}

export const DEMO_PRODUCTS: DemoProduct[] = DEMO_SEEDS.map(makeProduct);

export function isPreviewHost(host: string | null | undefined): boolean {
	if (!host) return false;
	const h = host.toLowerCase();
	return h.includes(PREVIEW_HOST_MARKER) || h.endsWith(PREVIEW_HOST_SUFFIX);
}

export async function isPreview(
	searchParams: Record<string, string | string[] | undefined> | undefined,
): Promise<boolean> {
	if (!searchParams) return false;
	const flag = searchParams.preview;
	const flagValue = Array.isArray(flag) ? flag[0] : flag;
	if (flagValue !== "1") return false;
	const headerList = await headers();
	const host = headerList.get("host");
	return isPreviewHost(host);
}

export function previewHref(href: string, preview: boolean): string {
	if (!preview) return href;
	if (href.startsWith("http")) {
		try {
			const url = new URL(href);
			url.searchParams.set("preview", "1");
			return url.toString();
		} catch {}
	}
	const separator = href.includes("?") ? "&" : "?";
	return `${href}${separator}preview=1`;
}

export function getDemoProductBySlug(slug: string): DemoProduct | null {
	return DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null;
}
