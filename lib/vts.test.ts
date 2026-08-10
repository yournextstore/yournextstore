import { expect, test } from "bun:test";
import { encodeVts, parseVts } from "@/lib/vts";

test("encodeVts produces the documented wire format", () => {
	expect(encodeVts({ Color: ["red", "blue"], Size: ["m"] })).toBe("Color*red.blue!Size*m");
});

test("encodeVts skips types with no values", () => {
	expect(encodeVts({ Color: [], Size: ["m"] })).toBe("Size*m");
	expect(encodeVts({})).toBe("");
});

test("parseVts round-trips what encodeVts produces", () => {
	const record = { Color: ["red", "blue"], Size: ["m", "l"] };
	expect(parseVts(encodeVts(record))).toEqual(record);
});

test("parseVts returns an empty record for null or empty input", () => {
	expect(parseVts(null)).toEqual({});
	expect(parseVts("")).toEqual({});
});

test("parseVts drops malformed segments instead of throwing", () => {
	// No value separator, empty values, dangling separators.
	expect(parseVts("Color")).toEqual({});
	expect(parseVts("Color*")).toEqual({});
	expect(parseVts("Color*.!Size*m")).toEqual({ Size: ["m"] });
	expect(parseVts("!!Size*m!")).toEqual({ Size: ["m"] });
});

test("parseVts truncates at a second type separator (JS split limit drops the remainder)", () => {
	expect(parseVts("Color*red*blue")).toEqual({ Color: ["red"] });
});
