import { expect, mock, test } from "bun:test";
import type { APIProductGetByIdResult } from "commerce-kit";
import { renderToString } from "react-dom/server";

// lib/commerce asserts YNS_API_KEY at import time — stub it before the dynamic import.
process.env.YNS_API_KEY ??= "test-key";

const commerceModule = await import("@/lib/commerce");
const settings: { logo: { imageUrl: string }; socials?: Record<string, string | null> } = {
	logo: { imageUrl: "https://cdn.example/logo.png" },
};
const me = { store: { name: "Acme", settings } };
mock.module("@/lib/commerce", () => ({ ...commerceModule, meGetCached: async () => me }));

const { apiStructuredData, buildProductBreadcrumbJsonLd, JsonLdScript, StoreJsonLd } = await import(
	"@/lib/json-ld"
);

const product = (variants: Array<{ price: string; stock: number | null }>) =>
	({
		id: "prod_1",
		slug: "sneaker",
		name: "Sneaker",
		summary: "A shoe",
		images: [],
		category: { name: "Shoes", slug: "shoes" },
		variants: variants.map((variant, index) => ({ ...variant, sku: `sku-${index}` })),
	}) as unknown as APIProductGetByIdResult;

test("a product name can't end the JSON-LD script tag", () => {
	const html = renderToString(<JsonLdScript data={{ name: "</script><!--<script>alert(1)" }} />);
	expect(html.match(/<script/gi)).toHaveLength(1);
	expect(html.match(/<\/script/gi)).toHaveLength(1);
	const json = html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
	expect(JSON.parse(json)).toEqual({ name: "</script><!--<script>alert(1)" });
});

test("the API's structured data is rendered as the API sent it, or not at all", () => {
	const order = { "@context": "https://schema.org", "@type": "Order", orderNumber: "ord_1" };
	expect(apiStructuredData({ id: "ord_1", structuredData: order })).toBe(order);
	expect(apiStructuredData({ id: "ord_1", structuredData: null })).toBeNull();
	expect(apiStructuredData({ id: "ord_1" })).toBeNull();
});

test("product breadcrumb links the category page", () => {
	const { itemListElement } = buildProductBreadcrumbJsonLd(product([{ price: "1999", stock: 1 }])) as {
		itemListElement: Array<{ name: string; item?: string }>;
	};
	expect(itemListElement[1]?.name).toBe("Shoes");
	expect(itemListElement[1]?.item).toEndWith("/category/shoes");
});
// The store's Organization, as the layout renders it: the first of StoreJsonLd's nodes.
const storeOrganization = async () => {
	const html = renderToString(await StoreJsonLd());
	const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1] ?? "{}";
	return JSON.parse(json) as Record<string, unknown>;
};

test("organization lists the store's https social profiles as sameAs", async () => {
	settings.socials = {
		instagram: "https://instagram.com/acme",
		facebook: " https://facebook.com/acme ",
		x: "@acme",
		youtube: "http://youtube.com/@acme",
		tiktok: "tiktok.com/@acme",
		linkedin: null,
		email: "https://acme.example/contact",
	};
	expect(await storeOrganization()).toMatchObject({
		"@type": "Organization",
		sameAs: ["https://instagram.com/acme", "https://facebook.com/acme"],
	});
});

test("organization has no sameAs without a valid social profile", async () => {
	settings.socials = { instagram: "@acme", facebook: null };
	expect(await storeOrganization()).not.toHaveProperty("sameAs");

	delete settings.socials;
	expect(await storeOrganization()).not.toHaveProperty("sameAs");
});
