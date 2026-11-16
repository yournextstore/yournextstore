import { expect, test } from "bun:test";
import { hiddenFromSearchMetadata, isHiddenFromSearch } from "@/lib/hidden-from-search";

test("a page the merchant hid is noindex, with its links still followed", () => {
	const product = { slug: "outlet-candle", seo: { title: "Outlet candle", noindex: true } };
	expect(isHiddenFromSearch(product)).toBe(true);
	expect(hiddenFromSearchMetadata(product)).toEqual({ robots: { index: false, follow: true } });
});

test("every other page adds nothing to its metadata", () => {
	const pages = [
		{ slug: "candle", seo: { title: "Candle" } },
		{ slug: "candle", seo: { noindex: false } },
		{ slug: "candle", seo: { noindex: "true" } },
		{ slug: "candle", seo: null },
		{ slug: "candle" },
		null,
		undefined,
	];
	for (const page of pages) {
		expect(isHiddenFromSearch(page)).toBe(false);
		expect(hiddenFromSearchMetadata(page)).toEqual({});
	}
});
