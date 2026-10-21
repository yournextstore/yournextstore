import { expect, test } from "bun:test";
import { isCartNotFoundError, parseCartCookie } from "@/lib/cookies";

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

test("isCartNotFoundError matches the API's missing-cart error", () => {
	expect(isCartNotFoundError(new Error("Cart not found"))).toBe(true);
	expect(isCartNotFoundError(new Error("cart not found"))).toBe(true);
});

test("isCartNotFoundError ignores other failures", () => {
	expect(isCartNotFoundError(new Error("fetch failed"))).toBe(false);
	expect(isCartNotFoundError(new Error("YNS API request failed: 500 Internal Server Error"))).toBe(false);
	expect(isCartNotFoundError("Cart not found")).toBe(false);
	expect(isCartNotFoundError(null)).toBe(false);
});
