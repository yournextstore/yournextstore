import { expect, test } from "bun:test";
import { type Cart, type CartLineItem, cartReducer, getLineItemUnitPrice } from "@/app/cart/cart-math";

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
	expect(getLineItemUnitPrice(lineItem())).toBe(1000n);
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
	expect(getLineItemUnitPrice(item)).toBe(18000n);
});

test("getLineItemUnitPrice truncates (never rounds up) BigInt discount math", () => {
	// 999 × 33333 / 100000 = 332.99667 → BigInt division truncates to 332.
	const item = lineItem({
		type: "bundle",
		bundleDiscountPercentage: "33333",
		bundleProducts: [{ quantity: 1, variant: { price: "999" } }],
	});
	expect(getLineItemUnitPrice(item)).toBe(999n - 332n);
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
	expect(getLineItemUnitPrice(item)).toBe(1000n);
});

test("cartReducer ADD_ITEM creates a local cart from null state", () => {
	const next = cartReducer(null, { type: "ADD_ITEM", item: lineItem() });
	expect(next).toEqual({ id: "local", lineItems: [lineItem()] });
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
