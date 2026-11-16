import { expect, test } from "bun:test";

// lib/commerce asserts YNS_API_KEY at import time — stub it before the dynamic import.
process.env.YNS_API_KEY ??= "test-key";

const { browseAll, slugParams, PLACEHOLDER_SLUG } = await import("@/lib/catalog-paths");

/** A browse endpoint over `count` numbered items, recording the offsets it was asked for. */
const endpoint = (count: number) => {
	const offsets: number[] = [];
	const browse = async ({ limit, offset }: { limit: number; offset: number }) => {
		offsets.push(offset);
		const size = Math.max(0, Math.min(limit, count - offset));
		return { data: Array.from({ length: size }, (_, i) => offset + i), meta: { count } };
	};
	return { browse, offsets };
};

test("a catalog larger than the default ceiling is read in full when the caller raises it", async () => {
	const { browse } = endpoint(12_345);
	const items = await browseAll(browse, 25_000);
	expect(items).toHaveLength(12_345);
	expect(new Set(items).size).toBe(12_345);
	expect(items[0]).toBe(0);
	expect(items.at(-1)).toBe(12_344);
});

test("the read stops at its ceiling", async () => {
	const defaultCeiling = endpoint(12_345);
	expect(await browseAll(defaultCeiling.browse)).toHaveLength(5000);
	expect(Math.max(...defaultCeiling.offsets)).toBe(4900);

	const raised = endpoint(60_000);
	expect(await browseAll(raised.browse, 25_000)).toHaveLength(25_000);
});

test("a small catalog is one request", async () => {
	const { browse, offsets } = endpoint(37);
	expect(await browseAll(browse, 25_000)).toHaveLength(37);
	expect(offsets).toEqual([0]);
});

test("only the first 5,000 addresses are prerendered, however many the sitemap lists", async () => {
	const slugs = Array.from({ length: 12_000 }, (_, i) => `product-${i}`);
	const params = await slugParams(Promise.resolve(slugs), (slug) => slug);
	expect(params).toHaveLength(5000);
	expect(params[0]).toEqual({ slug: "product-0" });
});

test("an empty or failed list still gives the placeholder", async () => {
	expect(await slugParams(Promise.resolve([]), (slug: string) => slug)).toEqual([{ slug: PLACEHOLDER_SLUG }]);
	expect(await slugParams(Promise.reject(new Error("API down")), (slug: string) => slug)).toEqual([
		{ slug: PLACEHOLDER_SLUG },
	]);
});
