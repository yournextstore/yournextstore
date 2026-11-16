import { expect, test } from "bun:test";
import { fillSeoPattern, productSeoFromPatterns } from "@/lib/seo-patterns";

const values = { product_name: "Juniper Candle", category: "Candles", store_name: "NORR", year: "2026" };

test("every variable is filled in", () => {
	expect(fillSeoPattern("{product_name} - {category} | {store_name}", values)).toBe(
		"Juniper Candle - Candles | NORR",
	);
	expect(fillSeoPattern("Buy {product_name} at {store_name} in {year}.", values)).toBe(
		"Buy Juniper Candle at NORR in 2026.",
	);
});

test("an empty variable takes its separator along", () => {
	const uncategorised = { ...values, category: "" };
	expect(fillSeoPattern("{product_name} - {category} | {store_name}", uncategorised)).toBe(
		"Juniper Candle | NORR",
	);
	expect(fillSeoPattern("{category} · {product_name}", uncategorised)).toBe("Juniper Candle");
	expect(fillSeoPattern("{product_name} | {category}", uncategorised)).toBe("Juniper Candle");
});

test("separators inside a name are left alone", () => {
	const hyphenated = { ...values, product_name: "Extra-Large Candle: Juniper, 2-wick" };
	expect(fillSeoPattern("{product_name} | {store_name}", hyphenated)).toBe(
		"Extra-Large Candle: Juniper, 2-wick | NORR",
	);
});

test("a name that is not a variable stays as written, and a pattern that fills to nothing is no pattern", () => {
	expect(fillSeoPattern("{product} | {store_name}", values)).toBe("{product} | NORR");
	expect(fillSeoPattern("{category}", { ...values, category: "" })).toBeUndefined();
});

test("a store's patterns give the product its title and description", () => {
	const settings = {
		seoPatterns: {
			productTitle: "{product_name} | {store_name}",
			productDescription: " {product_name}, {year} ",
		},
	};
	expect(productSeoFromPatterns(settings, values)).toEqual({
		title: "Juniper Candle | NORR",
		description: "Juniper Candle, 2026",
	});
});

test("a store with one pattern, none, or settings of another shape leaves the rest to the page", () => {
	expect(productSeoFromPatterns({ seoPatterns: { productTitle: "{product_name}" } }, values)).toEqual({
		title: "Juniper Candle",
	});
	expect(
		productSeoFromPatterns({ seoPatterns: { productTitle: "  ", productDescription: null } }, values),
	).toEqual({});
	expect(productSeoFromPatterns({ seoPatterns: null }, values)).toEqual({});
	expect(productSeoFromPatterns({ seoPatterns: "x" }, values)).toEqual({});
	expect(productSeoFromPatterns({}, values)).toEqual({});
	expect(productSeoFromPatterns(null, values)).toEqual({});
});
