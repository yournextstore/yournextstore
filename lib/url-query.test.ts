import { expect, test } from "bun:test";
import { variantHash, variantQueryOf } from "@/lib/url-query";

const chosen = (hash: string, search: string) =>
	Object.fromEntries(new URLSearchParams(variantQueryOf(hash, search)));

test("the variant is read from after the #", () => {
	expect(chosen("#Colour=Black&Size=M", "")).toEqual({ Colour: "Black", Size: "M" });
});

test("an old link with the variant in the query still selects it", () => {
	expect(chosen("", "?Colour=Black&Size=M")).toEqual({ Colour: "Black", Size: "M" });
});

test("the # wins when an address carries both", () => {
	expect(chosen("#Colour=Red", "?Colour=Black&utm_source=newsletter")).toEqual({ Colour: "Red" });
});

test("a plain anchor is not a variant", () => {
	expect(chosen("#reviews", "")).toEqual({});
	expect(chosen("#reviews", "?Colour=Black")).toEqual({ Colour: "Black" });
	expect(chosen("", "")).toEqual({});
});

test("what the page writes reads back the same, spaces and accents included", () => {
	const params = new URLSearchParams();
	params.set("Schlafbereich", "140x200 cm");
	params.set("Farbe", "Hellgrün");
	const hash = variantHash(params);

	expect(hash.startsWith("#")).toBe(true);
	expect(hash).not.toContain("?");
	expect(chosen(hash, "")).toEqual({ Schlafbereich: "140x200 cm", Farbe: "Hellgrün" });
});

test("no chosen option writes no # at all", () => {
	expect(variantHash(new URLSearchParams())).toBe("");
});
