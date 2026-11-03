import { describe, expect, test } from "bun:test";
import { markdownPath, prefersMarkdown } from "./markdown";

describe("prefersMarkdown", () => {
	test("gives browsers and wildcard clients HTML", () => {
		expect(prefersMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")).toBe(false);
		expect(prefersMarkdown("*/*")).toBe(false);
		expect(prefersMarkdown("text/*")).toBe(false);
		expect(prefersMarkdown(null)).toBe(false);
	});

	test("gives agents that name Markdown or plain text Markdown", () => {
		expect(prefersMarkdown("text/markdown")).toBe(true);
		expect(prefersMarkdown("text/plain")).toBe(true);
		expect(prefersMarkdown("text/markdown, text/html, */*")).toBe(true);
		expect(prefersMarkdown("text/html;q=0.5, text/plain")).toBe(true);
	});

	test("weighs quality values, then order", () => {
		expect(prefersMarkdown("text/html, text/markdown")).toBe(false);
		expect(prefersMarkdown("text/markdown;q=0.9, text/html")).toBe(false);
		expect(prefersMarkdown("text/markdown;q=0")).toBe(false);
		expect(prefersMarkdown("text/markdown;q=0, text/plain;q=0.5")).toBe(true);
	});
});

describe("markdownPath", () => {
	test("maps the platform-owned pages to their Markdown routes", () => {
		expect(markdownPath("/")).toBe("/md");
		expect(markdownPath("/search")).toBe("/md/search");
		expect(markdownPath("/product/blue-mug")).toBe("/md/product/blue-mug");
		expect(markdownPath("/collection/summer")).toBe("/md/collection/summer");
	});

	test("has no Markdown version for pages that live only in the storefront", () => {
		expect(markdownPath("/cart")).toBeNull();
		expect(markdownPath("/about-us")).toBeNull();
		expect(markdownPath("/product/a/b")).toBeNull();
	});
});
