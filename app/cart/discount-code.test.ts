import { describe, expect, test } from "bun:test";
import type { Cart } from "@/app/cart/cart-math";
import {
	appliedCouponOf,
	type CouponFacts,
	cartDiscountOf,
	refusedCodeMessage,
} from "@/app/cart/discount-code";

const config = { currency: "PLN", locale: "en-US" };
const emptyCart = (totals: Partial<Cart> = {}): Cart => ({ id: "cart-1", lineItems: [], ...totals });

describe("appliedCouponOf", () => {
	test("is null without a cart or a coupon", () => {
		expect(appliedCouponOf(null, config)).toBeNull();
		expect(appliedCouponOf(emptyCart(), config)).toBeNull();
		const withoutCoupon = { ...emptyCart(), coupon: null };
		expect(appliedCouponOf(withoutCoupon, config)).toBeNull();
	});

	test("labels a percentage coupon", () => {
		const cart = { ...emptyCart(), coupon: { code: "LATO10", type: "percentage", value: "10000" } };
		expect(appliedCouponOf(cart, config)).toEqual({ code: "LATO10", label: "10% off" });
	});

	test("labels a fixed coupon as money", () => {
		const cart = { ...emptyCart(), coupon: { code: "MINUS20", type: "fixed", value: "2000" } };
		const applied = appliedCouponOf(cart, config);
		expect(applied?.code).toBe("MINUS20");
		expect(applied?.label).toMatch(/^PLN\s20\.00 off$/);
	});
});

describe("cartDiscountOf", () => {
	test("is the pre-discount subtotal minus the discounted one, per tax behaviour", () => {
		const cart = emptyCart({ subtotalGross: 12300, subtotalNet: 10000, subtotal: 11070 });
		expect(cartDiscountOf(cart, "inclusive")).toBe(BigInt(1230));
		expect(cartDiscountOf({ ...cart, subtotal: 9000 }, "exclusive")).toBe(BigInt(1000));
	});

	test("is null when totals are missing or nothing is taken off", () => {
		expect(cartDiscountOf(null, "inclusive")).toBeNull();
		expect(cartDiscountOf(emptyCart({ subtotalGross: null, subtotal: null }), "inclusive")).toBeNull();
		expect(cartDiscountOf(emptyCart({ subtotalGross: 12300, subtotal: 12300 }), "inclusive")).toBeNull();
	});
});

describe("refusedCodeMessage", () => {
	const now = new Date("2026-09-16T12:00:00Z");
	const coupon = (overrides: Partial<CouponFacts> = {}): CouponFacts => ({
		startDate: null,
		endDate: null,
		maxUses: null,
		timesRedeemed: 0,
		minProductCount: null,
		maxProductCount: null,
		...overrides,
	});

	test("says the code doesn't exist", () => {
		expect(refusedCodeMessage(null, 1, now)).toBe("This code doesn't exist");
	});

	test("says the code has expired", () => {
		expect(refusedCodeMessage(coupon({ endDate: "2026-09-01T00:00:00Z" }), 1, now)).toBe(
			"This code has expired",
		);
	});

	test("says the code isn't active yet", () => {
		expect(refusedCodeMessage(coupon({ startDate: "2026-10-01T00:00:00Z" }), 1, now)).toBe(
			"This code isn't active yet",
		);
	});

	test("says the code is used up", () => {
		expect(refusedCodeMessage(coupon({ maxUses: 5, timesRedeemed: 5 }), 1, now)).toBe(
			"This code has already been used up",
		);
	});

	test("explains the item-count limits", () => {
		expect(refusedCodeMessage(coupon({ minProductCount: 3 }), 1, now)).toBe(
			"Add at least 3 items to your cart to use this code",
		);
		expect(refusedCodeMessage(coupon({ maxProductCount: 2 }), 4, now)).toBe(
			"This code works with up to 2 items in your cart",
		);
	});

	test("falls back to the cart not qualifying", () => {
		expect(refusedCodeMessage(coupon(), 1, now)).toBe("This code doesn't apply to the items in your cart");
	});
});
