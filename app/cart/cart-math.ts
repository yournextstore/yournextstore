export type CartLineItem = {
	quantity: number;
	productVariant: {
		id: string;
		price: string;
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
				variant: { price: string };
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
};

/** Get the effective unit price for a line item, computing bundle price from constituents if needed. */
export function getLineItemUnitPrice(item: CartLineItem): bigint {
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
		let total = 0n;
		for (const bp of product.bundleProducts) {
			let net = BigInt(bp.variant.price);
			if (product.bundleDiscountPercentage) {
				const discount = (net * BigInt(product.bundleDiscountPercentage)) / 100_000n;
				net = net - discount;
			}
			total += net * BigInt(bp.quantity);
		}
		return total;
	}
	return BigInt(item.productVariant.price);
}

export type CartAction =
	| { type: "INCREASE"; variantId: string }
	| { type: "DECREASE"; variantId: string }
	| { type: "REMOVE"; variantId: string }
	| { type: "ADD_ITEM"; item: CartLineItem };

// Pure reducer for INSTANT local feedback only. After every mutation the caller
// REPLACES this with the server-returned cart (syncCart) — plain state, no rebase,
// so a local mutation can never be re-applied on top of the authoritative cart.
export function cartReducer(state: Cart | null, action: CartAction): Cart | null {
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
