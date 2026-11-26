import { describe, expect, test } from "bun:test";
import { metaDescription, richTextPlain, truncateAtWord } from "@/lib/seo-text";

describe("metaDescription", () => {
	test("puts a multi-paragraph summary on one line", () => {
		expect(metaDescription("Zestaw w pudełku.\r\n\r\nGotowy do wręczenia.")).toBe(
			"Zestaw w pudełku. Gotowy do wręczenia.",
		);
	});

	test("cuts a long summary at a word, under 160 characters", () => {
		const long = "Naturalny olejek eteryczny z lawendy zachwyca subtelnym aromatem, ".repeat(5);
		const description = metaDescription(long) ?? "";
		expect(description.length).toBeLessThanOrEqual(160);
		expect(description.endsWith("…")).toBe(true);
		expect(description).not.toContain(", …");
	});

	test("is undefined for an empty or blank summary", () => {
		expect(metaDescription(null)).toBeUndefined();
		expect(metaDescription(" \n ")).toBeUndefined();
	});
});

describe("truncateAtWord", () => {
	test("keeps text that fits", () => {
		expect(truncateAtWord("Krótki opis", 300)).toBe("Krótki opis");
	});
});

describe("richTextPlain", () => {
	test("joins the text of every block", () => {
		expect(
			richTextPlain({
				type: "doc",
				content: [
					{ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Miody" }] },
					{
						type: "paragraph",
						content: [
							{ type: "text", text: "Prosto " },
							{ type: "text", text: "z Podlasia." },
						],
					},
				],
			}),
		).toBe("Miody Prosto z Podlasia.");
	});

	test("passes a plain string through", () => {
		expect(richTextPlain("  Opis \n kolekcji ")).toBe("Opis kolekcji");
	});

	test("is empty for no content", () => {
		expect(richTextPlain(null)).toBe("");
	});
});

describe("richTextPlain runs and breaks", () => {
	test("keeps a word split across marked runs whole, and parts words at a line break", () => {
		expect(
			richTextPlain({
				type: "doc",
				content: [
					{
						type: "paragraph",
						content: [
							{ type: "text", text: "Pod", marks: [{ type: "bold" }] },
							{ type: "text", text: "lasie" },
							{ type: "hardBreak" },
							{ type: "text", text: "Poznań" },
						],
					},
				],
			}),
		).toBe("Podlasie Poznań");
	});
});
