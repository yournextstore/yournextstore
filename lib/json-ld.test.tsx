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

const { apiStructuredData, buildBlogPostingJsonLd, buildProductBreadcrumbJsonLd, JsonLdScript } =
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

const blogPost = {
	slug: "hello",
	title: "Hello",
	createdAt: "2026-01-01T00:00:00.000Z",
} as unknown as Parameters<typeof buildBlogPostingJsonLd>[0];

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
	const { publisher } = await buildBlogPostingJsonLd(blogPost);
	expect(publisher).toMatchObject({ sameAs: ["https://instagram.com/acme", "https://facebook.com/acme"] });
});

test("organization has no sameAs without a valid social profile", async () => {
	settings.socials = { instagram: "@acme", facebook: null };
	expect((await buildBlogPostingJsonLd(blogPost)).publisher).not.toHaveProperty("sameAs");

	delete settings.socials;
	expect((await buildBlogPostingJsonLd(blogPost)).publisher).not.toHaveProperty("sameAs");
});
