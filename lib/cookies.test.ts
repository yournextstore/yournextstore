import { expect, test } from "bun:test";
import { parseCartCookie } from "@/lib/cookies";

test("parseCartCookie accepts a valid cart cookie payload", () => {
	expect(parseCartCookie(JSON.stringify({ id: "cart-123" }))).toEqual({ id: "cart-123" });
});

test("parseCartCookie returns null for missing values", () => {
	expect(parseCartCookie(undefined)).toBeNull();
	expect(parseCartCookie(null)).toBeNull();
	expect(parseCartCookie("")).toBeNull();
});

test("parseCartCookie returns null for malformed JSON", () => {
	expect(parseCartCookie("{not json")).toBeNull();
});

test("parseCartCookie returns null for well-formed JSON of the wrong shape", () => {
	expect(parseCartCookie("null")).toBeNull();
	expect(parseCartCookie('"cart-123"')).toBeNull();
	expect(parseCartCookie("{}")).toBeNull();
	expect(parseCartCookie(JSON.stringify({ id: 42 }))).toBeNull();
});
