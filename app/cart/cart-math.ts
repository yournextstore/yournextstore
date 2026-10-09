import { cartDisplaySubtotal, displayPrice, type TaxBehavior } from "@/lib/pricing";

export type CartLineItem = {
	quantity: number;
	/** The plan this line renews on; absent or null for a one-time purchase. */
	subscriptionPlanId?: string | null;
	subscriptionPlan?: SubscriptionPlanLabel | null;
	productVariant: {
		id: string;
		price: string;
		/** Gross twin of `price`; absent on optimistic lines built before the server replies. */
		priceGross?: string | null;
		images: string[];
		/** The option values this variant stands for; empty for a product without options. */
		combinations?: { variantValue: { value: string } }[];
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

type SubscriptionPlanLabel = { name: string; discountPercent: number };

/** "Every month · Save 10%". The merchant names a plan after its cadence, so the name says how often. */
export const planLabel = (plan: SubscriptionPlanLabel) =>
	plan.discountPercent > 0 ? `${plan.name} · Save ${plan.discountPercent}%` : plan.name;

/**
 * A cart line is one variant on one plan: the API keeps a one-time line and a subscription
 * line of the same variant apart, so the variant id alone doesn't identify a line.
 */
export const lineKey = (variantId: string, subscriptionPlanId?: string | null) =>
	`${variantId}:${subscriptionPlanId ?? ""}`;

export const itemKey = (item: CartLineItem) => lineKey(item.productVariant.id, item.subscriptionPlanId);

/** "100 ml" or "Oat / Bath": the options that tell two lines of one product apart. */
export const lineOptions = (item: CartLineItem) =>
	(item.productVariant.combinations ?? []).map(({ variantValue }) => variantValue.value).join(" / ");

export type CartAction =
	| { type: "INCREASE"; key: string }
	| { type: "DECREASE"; key: string }
	| { type: "REMOVE"; key: string }
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
					itemKey(item) === action.key ? { ...item, quantity: item.quantity + 1 } : item,
				),
			};

		case "DECREASE":
			return {
				...state,
				lineItems: state.lineItems
					.map((item) => {
						if (itemKey(item) === action.key) {
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
				lineItems: state.lineItems.filter((item) => itemKey(item) !== action.key),
			};

		case "ADD_ITEM": {
			const key = itemKey(action.item);
			const existingItem = state.lineItems.find((item) => itemKey(item) === key);

			if (existingItem) {
				return {
					...state,
					lineItems: state.lineItems.map((item) =>
						itemKey(item) === key ? { ...item, quantity: item.quantity + action.item.quantity } : item,
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
