import type { APICartCreateBody } from "commerce-kit";
import type {
	addCartBundle,
	addCartLine,
	applyCartDiscount,
	removeCartDiscount,
	setCartLineQuantity,
} from "@/lib/cart";

// The browser side of the cart writes in `app/api/cart/*`. Route handlers, not server
// actions: a cookie set in a server action (the first add creates the cart and sets
// `yns_cart`) makes Next re-render the whole page and hold the result until it is done,
// and the router runs actions one at a time.

type Result<F extends (...args: never[]) => unknown> = Awaited<ReturnType<F>>;

// One write at a time, in the order they were made, the way the router ran the server
// actions. Two adds in flight at once would each create a cart when there is none yet, and
// the second cookie would drop the first add; quantity writes must land in order too.
let queue: Promise<unknown> = Promise.resolve();

/** Rejects on a network error or a non-OK answer; the caller decides what the shopper sees. */
function send<T>(method: "POST" | "PATCH" | "DELETE", path: string, body: unknown = {}) {
	const request = async () => {
		const response = await fetch(path, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		if (!response.ok) {
			throw new Error(`cart: ${method} ${path} answered ${response.status}`);
		}
		return (await response.json()) as T;
	};
	const result = queue.then(request);
	queue = result.catch(() => undefined);
	return result;
}

// Line writes carry no message: a failed request is a failed write, and the caller
// reconciles the cart and tells the shopper.
const lineFailed = () => ({ success: false, cart: null });

export function addToCart(
	variantId: string,
	quantity = 1,
	subscriptionPlanId?: string | null,
	properties?: APICartCreateBody["properties"],
) {
	return send<Result<typeof addCartLine>>("POST", "/api/cart/items", {
		variantId,
		quantity,
		subscriptionPlanId,
		properties,
	}).catch((): Result<typeof addCartLine> => lineFailed());
}

export function setCartQuantity(
	variantId: string,
	quantity: number,
	subscriptionPlanId?: string | null,
	properties?: APICartCreateBody["properties"],
) {
	return send<Result<typeof setCartLineQuantity>>("PATCH", "/api/cart/items", {
		variantId,
		quantity: Math.max(quantity, 0),
		subscriptionPlanId,
		properties,
	}).catch((): Result<typeof setCartLineQuantity> => lineFailed());
}

// The bundle and discount writes reject on a failed request: their callers catch it and
// show their own message.
export function addBundleToCart(
	bundleId: string,
	selections: Array<{ variantId: string; groupId: string; quantity: number }>,
) {
	return send<Result<typeof addCartBundle>>("POST", "/api/cart/bundles", { bundleId, selections });
}

export function applyDiscountCode(code: string, itemCount: number) {
	return send<Result<typeof applyCartDiscount>>("POST", "/api/cart/discount", { code, itemCount });
}

export function removeDiscountCode() {
	return send<Result<typeof removeCartDiscount>>("DELETE", "/api/cart/discount");
}
