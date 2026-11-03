import { expect, test } from "bun:test";
import {
	cartDisplaySubtotal,
	displayAmount,
	displayPrice,
	displayTierPrice,
	listingPrice,
	orderDisplayShipping,
	priceRange,
} from "@/lib/pricing";

const variant = {
	price: "1000",
	priceGross: "1230",
	originalPrice: "2000",
	originalPriceGross: "2460",
	omnibusPrice: "1500",
	omnibusPriceGross: "1845",
	prePromotionPrice: null,
	prePromotionPriceGross: null,
};

test("displayPrice returns the net price for an exclusive store", () => {
	expect(displayPrice(variant, "exclusive")).toBe("1000");
	expect(displayPrice(variant, "exclusive", "originalPrice")).toBe("2000");
});

test("displayPrice returns the gross price for an inclusive store", () => {
	expect(displayPrice(variant, "inclusive")).toBe("1230");
	expect(displayPrice(variant, "inclusive", "originalPrice")).toBe("2460");
	expect(displayPrice(variant, "inclusive", "omnibusPrice")).toBe("1845");
});

test("displayPrice falls back to net when the gross twin is missing", () => {
	// Older API payloads (and nested shapes the API does not gross up) carry net only.
	expect(displayPrice({ price: "999" }, "inclusive")).toBe("999");
	expect(displayPrice({ price: "999", originalPrice: "1200" }, "inclusive", "originalPrice")).toBe("1200");
});

test("displayPrice returns null when the net field is null", () => {
	expect(displayPrice(variant, "inclusive", "prePromotionPrice")).toBeNull();
	expect(displayPrice(variant, "exclusive", "prePromotionPrice")).toBeNull();
	expect(displayPrice({ price: "1" }, "inclusive", "omnibusPrice")).toBeNull();
});

test("displayAmount picks the side of a loose net/gross pair", () => {
	expect(displayAmount("1000", "1230", "exclusive")).toBe("1000");
	expect(displayAmount("1000", "1230", "inclusive")).toBe("1230");
});

test("displayAmount falls back to net when the gross twin is missing", () => {
	expect(displayAmount("1000", null, "inclusive")).toBe("1000");
	expect(displayAmount("1000", undefined, "inclusive")).toBe("1000");
});

test("displayAmount is null when there is no net amount", () => {
	// A bundle priced by percentage carries neither fixed-price field.
	expect(displayAmount(null, null, "inclusive")).toBeNull();
	expect(displayAmount(undefined, "1230", "inclusive")).toBeNull();
	expect(displayAmount(null, null, "exclusive")).toBeNull();
});

test("displayTierPrice follows the store's tax behavior", () => {
	const tier = { price: "800", priceGross: "984" };
	expect(displayTierPrice(tier, "exclusive")).toBe("800");
	expect(displayTierPrice(tier, "inclusive")).toBe("984");
	expect(displayTierPrice({ price: "800" }, "inclusive")).toBe("800");
});

test("priceRange spans the displayed prices", () => {
	const variants = [
		{ price: "1000", priceGross: "1230" },
		{ price: "500", priceGross: "615" },
		{ price: "3000", priceGross: "3690" },
	];
	expect(priceRange(variants, "exclusive")).toEqual({ min: 500n, max: 3000n });
	expect(priceRange(variants, "inclusive")).toEqual({ min: 615n, max: 3690n });
});

test("priceRange is zero for an empty variant list", () => {
	expect(priceRange([], "inclusive")).toEqual({ min: 0n, max: 0n });
});

test("priceRange skips variants whose field is null", () => {
	const variants = [
		{ price: "10", originalPrice: "40", originalPriceGross: "49" },
		{ price: "20", originalPrice: null },
	];
	expect(priceRange(variants, "inclusive", "originalPrice")).toEqual({ min: 49n, max: 49n });
});

test("cartDisplaySubtotal picks the gross or net total by tax behavior", () => {
	const cart = { subtotal: 1230, subtotalNet: 1000, subtotalGross: 1230 };
	expect(cartDisplaySubtotal(cart, "inclusive")).toBe(1230);
	expect(cartDisplaySubtotal(cart, "exclusive")).toBe(1000);
});

test("cartDisplaySubtotal falls back to the behavior-following subtotal", () => {
	expect(cartDisplaySubtotal({ subtotal: 777 }, "inclusive")).toBe(777);
	expect(cartDisplaySubtotal({ subtotal: 777, subtotalGross: null }, "inclusive")).toBe(777);
});

test("cartDisplaySubtotal is null without totals (Stripe Tax, or a local cart)", () => {
	expect(cartDisplaySubtotal(null, "inclusive")).toBeNull();
	expect(
		cartDisplaySubtotal({ subtotal: null, subtotalNet: null, subtotalGross: null }, "exclusive"),
	).toBeNull();
	expect(cartDisplaySubtotal({}, "exclusive")).toBeNull();
});

test("listingPrice marks the lowest price as a starting price only when variants differ", () => {
	expect(listingPrice([], "exclusive")).toBeNull();
	expect(listingPrice([{ price: "1400" }, { price: "1400" }], "exclusive")).toEqual({
		amount: 1400n,
		from: false,
		compareAt: null,
	});
	expect(listingPrice([{ price: "2400" }, { price: "1400" }], "exclusive")).toEqual({
		amount: 1400n,
		from: true,
		compareAt: null,
	});
	expect(listingPrice([{ price: "0" }], "exclusive")).toEqual({ amount: 0n, from: false, compareAt: null });
});

test("listingPrice strikes through the cheapest variant's price before a promotion", () => {
	expect(
		listingPrice(
			[{ price: "17999", originalPrice: "25713", priceGross: "22139", originalPriceGross: "31627" }],
			"exclusive",
		),
	).toEqual({ amount: 17999n, from: false, compareAt: 25713n });
	expect(
		listingPrice(
			[{ price: "17999", originalPrice: "25713", priceGross: "22139", originalPriceGross: "31627" }],
			"inclusive",
		),
	).toEqual({ amount: 22139n, from: false, compareAt: 31627n });
	expect(
		listingPrice(
			[
				{ price: "9000", originalPrice: "9000" },
				{ price: "8000", originalPrice: "10000" },
			],
			"exclusive",
		),
	).toEqual({ amount: 8000n, from: true, compareAt: 10000n });
	expect(listingPrice([{ price: "1400", originalPrice: "1400" }], "exclusive")?.compareAt).toBeNull();
});

test("orderDisplayShipping shows free delivery as 0 even though the rate lists a price", () => {
	const shipping = { price: "1220", priceGross: "1500" };
	expect(orderDisplayShipping({ shipping, shippingGross: 0 }, "inclusive")).toBe(0n);
	expect(orderDisplayShipping({ shipping, shippingGross: 0 }, "exclusive")).toBe(0n);
});

test("orderDisplayShipping shows the charged delivery cost in the store's basis", () => {
	const shipping = { price: "1220", priceGross: "1500" };
	expect(orderDisplayShipping({ shipping, shippingGross: 1500 }, "inclusive")).toBe(1500n);
	expect(orderDisplayShipping({ shipping, shippingGross: 1500 }, "exclusive")).toBe(1220n);
});

test("orderDisplayShipping falls back to the rate when the order has no shipping total", () => {
	const shipping = { price: "1220", priceGross: "1500" };
	expect(orderDisplayShipping({ shipping, shippingGross: null }, "inclusive")).toBe(1500n);
	expect(orderDisplayShipping({ shipping: { price: "1220" } }, "exclusive")).toBe(1220n);
	expect(orderDisplayShipping({ shipping: null, shippingGross: 1500 }, "inclusive")).toBe(0n);
});
