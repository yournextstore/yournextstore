import { expect, mock, test } from "bun:test";

// lib/commerce asserts YNS_API_KEY at import time — stub it before the dynamic import.
process.env.YNS_API_KEY ??= "test-key";

// The sitemap is a cached function; outside Next there is no cache scope for these two to act on.
const nextCache = await import("next/cache");
mock.module("next/cache", () => ({ ...nextCache, cacheLife: () => {} }));
const cacheTags = await import("@/lib/cache-tags");
mock.module("@/lib/cache-tags", () => ({ ...cacheTags, tagKinds: () => {} }));

const commerceModule = await import("@/lib/commerce");
mock.module("@/lib/commerce", () => ({
	...commerceModule,
	meGetCached: async () => ({ store: { settings: { enabledTools: { blog: true, contactForm: false } } } }),
}));

// What the Store API lists, as lib/catalog-paths.ts hands it on: one hidden entry of each kind.
const date = "2026-11-01T10:00:00.000Z";
const catalogPaths = await import("@/lib/catalog-paths");
mock.module("@/lib/catalog-paths", () => ({
	...catalogPaths,
	getAllProducts: async () => [
		{ slug: "candle", updatedAt: date, images: [], hidden: false },
		{ slug: "outlet-candle", updatedAt: date, images: [], hidden: true },
	],
	getAllCollections: async () => [
		{ slug: "gifts", lastModified: date, hidden: false },
		{ slug: "press-samples", lastModified: date, hidden: true },
	],
	getAllCategories: async () => [
		{ path: "home/candles", lastModified: date, hidden: false },
		{ path: "home/archive", lastModified: date, hidden: true },
	],
	getAllLegalPages: async () => [],
	getAllPosts: async () => [
		{ slug: "gift-guide", lastModified: date, hidden: false },
		{ slug: "internal-note", lastModified: date, hidden: true },
	],
}));

const { default: sitemap } = await import("@/app/sitemap");
// Paths only: the host comes from the environment, which lib/commerce.test.ts varies.
const urls = (await sitemap()).map((entry) => new URL(entry.url).pathname);

test("pages the merchant hid from search engines are left out", () => {
	expect(urls).not.toContain("/product/outlet-candle");
	expect(urls).not.toContain("/collection/press-samples");
	expect(urls).not.toContain("/category/home/archive");
	expect(urls).not.toContain("/blog/internal-note");
});

test("every other page is still listed", () => {
	expect(urls).toContain("/product/candle");
	expect(urls).toContain("/collection/gifts");
	expect(urls).toContain("/category/home/candles");
	expect(urls).toContain("/blog");
	expect(urls).toContain("/blog/gift-guide");
});
