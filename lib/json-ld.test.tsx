import { expect, mock, test } from "bun:test";
import type { APIProductGetByIdResult } from "commerce-kit";
import { renderToString } from "react-dom/server";

// lib/commerce asserts YNS_API_KEY at import time — stub it before the dynamic import.
process.env.YNS_API_KEY ??= "test-key";

const storeConfig = { currency: "usd", locale: "en-US", taxBehavior: "exclusive" as const };
mock.module("@/lib/store-config", () => ({ getStoreConfig: async () => storeConfig }));

const commerceModule = await import("@/lib/commerce");
const me = { store: { name: "Acme", settings: { logo: { imageUrl: "https://cdn.example/logo.png" } } } };
mock.module("@/lib/commerce", () => ({ ...commerceModule, meGetCached: async () => me }));

const { buildBlogPostingJsonLd, buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } =
	await import("@/lib/json-ld");

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

test("product offer prices follow the currency's decimals", async () => {
	storeConfig.currency = "jpy";
	const jpy = await buildProductJsonLd(product([{ price: "1999", stock: 3 }]), null, null);
	expect(jpy.offers).toMatchObject({ "@type": "Offer", price: 1999, priceCurrency: "JPY" });

	storeConfig.currency = "usd";
	const usd = await buildProductJsonLd(product([{ price: "1999", stock: 3 }]), null, null);
	expect(usd.offers).toMatchObject({ price: 19.99, priceCurrency: "USD" });
});

test("aggregate offer reads availability from the variants", async () => {
	storeConfig.currency = "usd";
	const someInStock = await buildProductJsonLd(
		product([
			{ price: "1999", stock: 0 },
			{ price: "2500", stock: null },
		]),
		null,
		null,
	);
	expect(someInStock.offers).toMatchObject({
		"@type": "AggregateOffer",
		lowPrice: 19.99,
		highPrice: 25,
		availability: "https://schema.org/InStock",
	});

	const soldOut = await buildProductJsonLd(
		product([
			{ price: "1999", stock: 0 },
			{ price: "2500", stock: 0 },
		]),
		null,
		null,
	);
	expect(soldOut.offers).toMatchObject({ availability: "https://schema.org/OutOfStock" });
	expect(soldOut.brand).toBeUndefined();
});

test("variants that share one price make a single Offer", async () => {
	storeConfig.currency = "usd";
	const jsonLd = await buildProductJsonLd(
		product([
			{ price: "1999", stock: 2 },
			{ price: "1999", stock: 0 },
			{ price: "1999", stock: null },
		]),
		null,
		null,
	);
	expect(jsonLd.offers).toMatchObject({ "@type": "Offer", price: 19.99 });
	expect((jsonLd.offers as { url: string }).url).toEndWith("/product/sneaker");
});

test("aggregate offer links the product page", async () => {
	storeConfig.currency = "usd";
	const jsonLd = await buildProductJsonLd(
		product([
			{ price: "1999", stock: 1 },
			{ price: "2500", stock: 1 },
		]),
		null,
		null,
	);
	expect(jsonLd.offers).toMatchObject({ "@type": "AggregateOffer", offerCount: 2 });
	expect((jsonLd.offers as { url: string }).url).toEndWith("/product/sneaker");
});

test("a product name can't end the JSON-LD script tag", () => {
	const html = renderToString(<JsonLdScript data={{ name: "</script><!--<script>alert(1)" }} />);
	expect(html.match(/<script/gi)).toHaveLength(1);
	expect(html.match(/<\/script/gi)).toHaveLength(1);
	const json = html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
	expect(JSON.parse(json)).toEqual({ name: "</script><!--<script>alert(1)" });
});

test("product names its brand, not its category", async () => {
	storeConfig.currency = "usd";
	const jsonLd = await buildProductJsonLd(product([{ price: "1999", stock: 3 }]), null, "Kiln Studio");
	expect(jsonLd.brand).toEqual({ "@type": "Brand", name: "Kiln Studio" });
});

test("product breadcrumb links the category page", () => {
	const { itemListElement } = buildProductBreadcrumbJsonLd(product([{ price: "1999", stock: 1 }])) as {
		itemListElement: Array<{ name: string; item?: string }>;
	};
	expect(itemListElement[1]?.name).toBe("Shoes");
	expect(itemListElement[1]?.item).toEndWith("/category/shoes");
});

test("blog posting names the store as author and publisher", async () => {
	const post = {
		slug: "hello",
		title: "Hello",
		image: null,
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-02T00:00:00.000Z",
		publishedAt: null,
		seo: null,
	} as unknown as Parameters<typeof buildBlogPostingJsonLd>[0];
	const jsonLd = await buildBlogPostingJsonLd(post);
	const organization = { "@type": "Organization", name: "Acme", logo: "https://cdn.example/logo.png" };
	expect(jsonLd).toMatchObject({
		"@type": "BlogPosting",
		datePublished: "2026-01-01T00:00:00.000Z",
		author: organization,
		publisher: organization,
	});
	expect(jsonLd.mainEntityOfPage).toMatchObject({ "@type": "WebPage", "@id": jsonLd.url });
	expect(jsonLd.image).toBeUndefined();
});
