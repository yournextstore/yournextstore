import { afterEach, expect, mock, test } from "bun:test";
import { fetchSearchSuggestions } from "@/lib/search-suggest";

const realFetch = globalThis.fetch;
const requested: string[] = [];

const answer = (response: () => Promise<Response>) => {
	globalThis.fetch = mock((input: string | URL | Request) => {
		requested.push(String(input));
		return response();
	}) as unknown as typeof fetch;
};

afterEach(() => {
	globalThis.fetch = realFetch;
	requested.length = 0;
});

const item = { id: "p1", name: "Classic Tee", slug: "classic-tee", image: null, summary: "Soft cotton" };

test("asks the platform's keyless suggest endpoint with a GET, for queries, categories, brands and prices", async () => {
	answer(async () =>
		Response.json({
			items: [{ ...item, variants: [{ price: "1000", priceGross: "1230", junk: 1 }, { nope: true }] }],
			queries: ["tee white", 7],
			categories: [
				{ id: "c1", name: "Tees", slug: "tees", path: ["clothes", "tees"] },
				{ id: "c2", name: "Old", slug: "old" },
				{ name: "broken" },
			],
			brands: [{ id: "b1", name: "Teeco", slug: "teeco", image: null }],
		}),
	);

	expect(await fetchSearchSuggestions("tee & co")).toEqual({
		// Only the price fields are kept.
		products: [{ ...item, variants: [{ price: "1000", priceGross: "1230" }] }],
		queries: ["tee white"],
		categories: [
			{ id: "c1", name: "Tees", slug: "tees", path: ["clothes", "tees"] },
			// No path from the platform: the category's own slug.
			{ id: "c2", name: "Old", slug: "old", path: ["old"] },
		],
		brands: [{ id: "b1", name: "Teeco", slug: "teeco" }],
	});
	expect(requested).toEqual(["/_public/suggest?q=tee+%26+co&include=queries%2Ccategories%2Cbrands%2Cprice"]);
});

test("reads an older platform's answer: products only, without prices", async () => {
	answer(async () => Response.json({ items: [item] }));

	expect(await fetchSearchSuggestions("tee")).toEqual({
		products: [{ ...item, variants: [] }],
		queries: [],
		categories: [],
		brands: [],
	});
});

test("returns null, not empty suggestions, when they could not be fetched", async () => {
	answer(async () => new Response("Bad gateway", { status: 502 }));
	expect(await fetchSearchSuggestions("tee")).toBeNull();

	answer(async () => new Response("<html>", { status: 200 }));
	expect(await fetchSearchSuggestions("tee")).toBeNull();

	answer(() => Promise.reject(new TypeError("Failed to fetch")));
	expect(await fetchSearchSuggestions("tee")).toBeNull();
});
