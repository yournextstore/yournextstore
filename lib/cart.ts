import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { clearCartCookie, getCartCookieJson, isCartNotFoundError } from "@/lib/cookies";

/** The shopper's cart from the `yns_cart` cookie, or `null` when there is none or it can't be read. */
export async function readCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return null;
	}

	const [error, cart] = await try_(commerce.cartGet({ cartId: cartCookie.id }));
	if (error) {
		// Expected after a completed checkout (Back restores the page from bfcache and
		// reconciles) or an expired cart. Drop the dead cookie so the layout stops looking
		// it up on every request; a transient failure keeps it, the cart may still exist.
		if (isCartNotFoundError(error)) {
			await clearCartCookie();
			return null;
		}
		console.error("cart: cartGet failed", { cartId: cartCookie.id, error });
		return null;
	}
	return cart;
}
