import { cartDisplaySubtotal, displayPrice, type TaxBehavior } from "@/lib/pricing";

export type CartLineItem = {
	quantity: number;
	productVariant: {
		id: string;
		price: string;
		/** Gross twin of `price`; absent on optimistic lines built before the server replies. */
		priceGross?: string | null;
		images: string[];
		product: {
			id: string;
			name: string;
			slug: string;
			images: string[];
		};
	};
};

export type Cart = {
	id: string;
	lineItems: CartLineItem[];
	// Authoritative money totals (minor units) as the API computed them. `null` when the
	// store prices through Stripe Tax, and cleared by `cartReducer` because an optimistic
	// local mutation invalidates them — see `withoutStaleTotals`.
	subtotal?: number | null;
	subtotalNet?: number | null;
	subtotalGross?: number | null;
	coupon?: { code: string; type: string; value: string } | null;
};

/** Unit price in the shopper's basis. The API already prices bundle lines. */
export function getLineItemUnitPrice(item: CartLineItem, taxBehavior: TaxBehavior): bigint {
	return BigInt(displayPrice(item.productVariant, taxBehavior));
}

/**
 * The cart subtotal a shopper should see: the API's own total when the cart is the
 * server's, otherwise a local sum of display prices (optimistic, in-flight carts).
 */
export function getCartDisplaySubtotal(cart: Cart | null, taxBehavior: TaxBehavior): bigint {
	const fromApi = cartDisplaySubtotal(cart, taxBehavior);
	if (fromApi !== null) {
		return BigInt(Math.round(fromApi));
	}
	return (cart?.lineItems ?? []).reduce(
		(sum, item) => sum + getLineItemUnitPrice(item, taxBehavior) * BigInt(item.quantity),
		0n,
	);
}

/**
 * Drop the server's money totals. Any local mutation makes them stale, and a stale total
 * is worse than none: without them the cart falls back to summing display prices, which
 * keeps the subtotal in the same net/gross basis instead of flipping mid-mutation.
 */
const withoutStaleTotals = (cart: Cart): Cart => ({
	...cart,
	subtotal: null,
	subtotalNet: null,
	subtotalGross: null,
});

export type CartAction =
	| { type: "INCREASE"; variantId: string }
	| { type: "DECREASE"; variantId: string }
	| { type: "REMOVE"; variantId: string }
	| { type: "ADD_ITEM"; item: CartLineItem };

// Pure reducer for INSTANT local feedback only. After every mutation the caller
// REPLACES this with the server-returned cart (syncCart) — plain state, no rebase,
// so a local mutation can never be re-applied on top of the authoritative cart.
export function cartReducer(state: Cart | null, action: CartAction): Cart | null {
	const next = applyCartAction(state, action);
	return next && next !== state ? withoutStaleTotals(next) : next;
}

function applyCartAction(state: Cart | null, action: CartAction): Cart | null {
	if (!state) {
		if (action.type === "ADD_ITEM") {
			return { id: "local", lineItems: [action.item] };
		}
		return state;
	}

	switch (action.type) {
		case "INCREASE":
			return {
				...state,
				lineItems: state.lineItems.map((item) =>
					item.productVariant.id === action.variantId ? { ...item, quantity: item.quantity + 1 } : item,
				),
			};

		case "DECREASE":
			return {
				...state,
				lineItems: state.lineItems
					.map((item) => {
						if (item.productVariant.id === action.variantId) {
							if (item.quantity - 1 <= 0) {
								return null;
							}
							return { ...item, quantity: item.quantity - 1 };
						}
						return item;
					})
					.filter((item): item is CartLineItem => item !== null),
			};

		case "REMOVE":
			return {
				...state,
				lineItems: state.lineItems.filter((item) => item.productVariant.id !== action.variantId),
			};

		case "ADD_ITEM": {
			const existingItem = state.lineItems.find(
				(item) => item.productVariant.id === action.item.productVariant.id,
			);

			if (existingItem) {
				return {
					...state,
					lineItems: state.lineItems.map((item) =>
						item.productVariant.id === action.item.productVariant.id
							? { ...item, quantity: item.quantity + action.item.quantity }
							: item,
					),
				};
			}

			return {
				...state,
				lineItems: [...state.lineItems, action.item],
			};
		}

		default:
			return state;
	}
}
