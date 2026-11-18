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

test("asks the platform's keyless suggest endpoint with a GET", async () => {
	answer(async () => Response.json({ items: [item] }));

	expect(await fetchSearchSuggestions("tee & co")).toEqual([item]);
	expect(requested).toEqual(["/_public/suggest?q=tee%20%26%20co"]);
});

test("returns null, not an empty list, when the suggestions could not be fetched", async () => {
	answer(async () => new Response("Bad gateway", { status: 502 }));
	expect(await fetchSearchSuggestions("tee")).toBeNull();

	answer(async () => new Response("<html>", { status: 200 }));
	expect(await fetchSearchSuggestions("tee")).toBeNull();

	answer(() => Promise.reject(new TypeError("Failed to fetch")));
	expect(await fetchSearchSuggestions("tee")).toBeNull();
});
