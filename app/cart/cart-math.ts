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
			type?: string;
			bundleDiscountPercentage?: string | null;
			bundleProducts?: Array<{
				quantity: number;
				variant: { price: string; priceGross?: string | null };
			}>;
		};
	};
	// Present (non-empty) on configurable-bundle lines: the customer's chosen components.
	// Its presence is how we tell a configurable bundle from a legacy fixed one.
	setSelections?: Array<{ quantity: number }>;
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
};

/**
 * The effective unit price for a line item, in the basis the shopper should see,
 * computing the bundle price from its constituents if needed.
 */
export function getLineItemUnitPrice(item: CartLineItem, taxBehavior: TaxBehavior): bigint {
	const { product } = item.productVariant;
	// Configurable bundles are priced server-side from the customer's selections; the per-unit price
	// is already on productVariant.price. Only the legacy fixed-bundle shape (no selections) needs
	// client-side reconstruction from its constituents.
	const isConfigurable = (item.setSelections?.length ?? 0) > 0;
	if (
		!isConfigurable &&
		product.type === "bundle" &&
		product.bundleProducts &&
		product.bundleProducts.length > 0
	) {
		return product.bundleProducts.reduce((total, bp) => {
			const unit = BigInt(displayPrice(bp.variant, taxBehavior));
			const discount = product.bundleDiscountPercentage
				? (unit * BigInt(product.bundleDiscountPercentage)) / 100_000n
				: 0n;
			return total + (unit - discount) * BigInt(bp.quantity);
		}, 0n);
	}
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
