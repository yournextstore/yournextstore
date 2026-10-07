import { expect, mock, test } from "bun:test";
import type { APIProductGetByIdResult } from "commerce-kit";

// lib/commerce asserts YNS_API_KEY at import time — stub it before the dynamic import.
process.env.YNS_API_KEY ??= "test-key";

const storeConfig = { currency: "usd", locale: "en-US", taxBehavior: "exclusive" as const };
mock.module("@/lib/store-config", () => ({ getStoreConfig: async () => storeConfig }));

const { buildProductBreadcrumbJsonLd, buildProductJsonLd } = await import("@/lib/json-ld");

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
	const jpy = await buildProductJsonLd(product([{ price: "1999", stock: 3 }]), null);
	expect(jpy.offers).toMatchObject({ "@type": "Offer", price: 1999, priceCurrency: "JPY" });

	storeConfig.currency = "usd";
	const usd = await buildProductJsonLd(product([{ price: "1999", stock: 3 }]), null);
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
	);
	expect(soldOut.offers).toMatchObject({ availability: "https://schema.org/OutOfStock" });
	expect(soldOut.brand).toBeUndefined();
});

test("product breadcrumb links the category page", () => {
	const { itemListElement } = buildProductBreadcrumbJsonLd(product([{ price: "1999", stock: 1 }])) as {
		itemListElement: Array<{ name: string; item?: string }>;
	};
	expect(itemListElement[1]?.name).toBe("Shoes");
	expect(itemListElement[1]?.item).toEndWith("/category/shoes");
});
