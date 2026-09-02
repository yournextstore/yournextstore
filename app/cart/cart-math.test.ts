import { expect, test } from "bun:test";
import {
	type Cart,
	type CartLineItem,
	cartReducer,
	getCartDisplaySubtotal,
	getLineItemUnitPrice,
} from "@/app/cart/cart-math";

const lineItem = (
	overrides: Partial<CartLineItem["productVariant"]["product"]> = {},
	extra: Partial<CartLineItem> = {},
): CartLineItem => ({
	quantity: 1,
	productVariant: {
		id: "v-1",
		price: "1000",
		images: [],
		product: {
			id: "p-1",
			name: "Product",
			slug: "product",
			images: [],
			...overrides,
		},
	},
	...extra,
});

test("getLineItemUnitPrice returns the variant price for regular products", () => {
	expect(getLineItemUnitPrice(lineItem(), "exclusive")).toBe(1000n);
});

test("getLineItemUnitPrice reconstructs legacy fixed-bundle prices from constituents", () => {
	// 25% discount is encoded as "25000" (per-hundred-thousand scaling).
	const item = lineItem({
		type: "bundle",
		bundleDiscountPercentage: "25000",
		bundleProducts: [
			{ quantity: 2, variant: { price: "10000" } }, // 2 × (10000 - 2500) = 15000
			{ quantity: 1, variant: { price: "4000" } }, //  1 × (4000 - 1000)  =  3000
		],
	});
	expect(getLineItemUnitPrice(item, "exclusive")).toBe(18000n);
});

test("getLineItemUnitPrice truncates (never rounds up) BigInt discount math", () => {
	// 999 × 33333 / 100000 = 332.99667 → BigInt division truncates to 332.
	const item = lineItem({
		type: "bundle",
		bundleDiscountPercentage: "33333",
		bundleProducts: [{ quantity: 1, variant: { price: "999" } }],
	});
	expect(getLineItemUnitPrice(item, "exclusive")).toBe(999n - 332n);
});

test("getLineItemUnitPrice uses the server-computed price for configurable bundles", () => {
	// setSelections marks a configurable bundle — constituents must NOT be re-priced client-side.
	const item = lineItem(
		{
			type: "bundle",
			bundleDiscountPercentage: "25000",
			bundleProducts: [{ quantity: 5, variant: { price: "99999" } }],
		},
		{ setSelections: [{ quantity: 1 }] },
	);
	expect(getLineItemUnitPrice(item, "exclusive")).toBe(1000n);
});

test("getLineItemUnitPrice returns the gross price for an inclusive store", () => {
	const item = lineItem();
	item.productVariant.priceGross = "1230";
	expect(getLineItemUnitPrice(item, "inclusive")).toBe(1230n);
});

test("getLineItemUnitPrice falls back to net when a line carries no gross twin", () => {
	// Optimistic lines built client-side, and older API payloads, are net-only.
	expect(getLineItemUnitPrice(lineItem(), "inclusive")).toBe(1000n);
});

test("getLineItemUnitPrice discounts legacy bundle constituents in the displayed basis", () => {
	const item = lineItem({
		type: "bundle",
		bundleDiscountPercentage: "25000",
		bundleProducts: [{ quantity: 2, variant: { price: "10000", priceGross: "12300" } }],
	});
	expect(getLineItemUnitPrice(item, "inclusive")).toBe(2n * (12300n - 3075n));
});

test("getCartDisplaySubtotal prefers the API totals over a local sum", () => {
	const cart: Cart = {
		id: "c-1",
		lineItems: [{ ...lineItem(), quantity: 3 }],
		subtotal: 2500,
		subtotalNet: 2500,
		subtotalGross: 3075,
	};
	expect(getCartDisplaySubtotal(cart, "exclusive")).toBe(2500n);
	expect(getCartDisplaySubtotal(cart, "inclusive")).toBe(3075n);
});

test("getCartDisplaySubtotal sums display prices when the cart has no totals", () => {
	const cart: Cart = { id: "local", lineItems: [{ ...lineItem(), quantity: 3 }] };
	expect(getCartDisplaySubtotal(cart, "exclusive")).toBe(3000n);
	expect(getCartDisplaySubtotal(null, "exclusive")).toBe(0n);
});

test("cartReducer drops the server totals so the subtotal never mixes bases", () => {
	const cart: Cart = { id: "c-1", lineItems: [lineItem()], subtotal: 1000, subtotalGross: 1230 };
	const next = cartReducer(cart, { type: "INCREASE", variantId: "v-1" });
	expect(next?.subtotal).toBeNull();
	expect(next?.subtotalGross).toBeNull();
	// …and the fallback sum is now the one the sidebar shows.
	expect(getCartDisplaySubtotal(next, "exclusive")).toBe(2000n);
});

test("cartReducer ADD_ITEM creates a local cart from null state", () => {
	const next = cartReducer(null, { type: "ADD_ITEM", item: lineItem() });
	expect(next).toEqual({
		id: "local",
		lineItems: [lineItem()],
		subtotal: null,
		subtotalNet: null,
		subtotalGross: null,
	});
});

test("cartReducer ignores non-add actions on null state", () => {
	expect(cartReducer(null, { type: "INCREASE", variantId: "v-1" })).toBeNull();
});

test("cartReducer ADD_ITEM merges quantities for an existing variant", () => {
	const state: Cart = { id: "c-1", lineItems: [lineItem()] };
	const next = cartReducer(state, { type: "ADD_ITEM", item: { ...lineItem(), quantity: 2 } });
	expect(next?.lineItems).toHaveLength(1);
	expect(next?.lineItems[0]?.quantity).toBe(3);
});

test("cartReducer INCREASE and DECREASE adjust only the targeted variant", () => {
	const other: CartLineItem = {
		...lineItem(),
		productVariant: { ...lineItem().productVariant, id: "v-2" },
	};
	const state: Cart = { id: "c-1", lineItems: [{ ...lineItem(), quantity: 2 }, other] };

	const increased = cartReducer(state, { type: "INCREASE", variantId: "v-1" });
	expect(increased?.lineItems[0]?.quantity).toBe(3);
	expect(increased?.lineItems[1]?.quantity).toBe(1);

	const decreased = cartReducer(state, { type: "DECREASE", variantId: "v-1" });
	expect(decreased?.lineItems[0]?.quantity).toBe(1);
});

test("cartReducer DECREASE removes the line when quantity would hit zero", () => {
	const state: Cart = { id: "c-1", lineItems: [lineItem()] };
	const next = cartReducer(state, { type: "DECREASE", variantId: "v-1" });
	expect(next?.lineItems).toHaveLength(0);
});

test("cartReducer REMOVE drops the line entirely regardless of quantity", () => {
	const state: Cart = { id: "c-1", lineItems: [{ ...lineItem(), quantity: 5 }] };
	const next = cartReducer(state, { type: "REMOVE", variantId: "v-1" });
	expect(next?.lineItems).toHaveLength(0);
});
