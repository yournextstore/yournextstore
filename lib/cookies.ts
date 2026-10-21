import { cookies } from "next/headers";

export const CART_COOKIE = "yns_cart";
export type CartCookieJson = { id: string };

// Shared by set and clear: a partitioned cookie is only removed by a Set-Cookie that
// carries the same Partitioned/SameSite/Secure/Path attributes.
const CART_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	sameSite: "none",
	partitioned: true,
	path: "/",
} as const;

export async function setCartCookie(cartCookieJson: CartCookieJson) {
	try {
		(await cookies()).set(CART_COOKIE, JSON.stringify(cartCookieJson), CART_COOKIE_OPTIONS);
	} catch (error) {
		console.error("Failed to set cart cookie", error);
	}
}

export async function clearCartCookie() {
	try {
		(await cookies()).delete({ name: CART_COOKIE, ...CART_COOKIE_OPTIONS });
	} catch (error) {
		console.error("Failed to clear cart cookie", error);
	}
}

/**
 * True when the API says the cookie's cart no longer exists (checked out, expired, store
 * re-seeded). commerce-kit throws a plain Error carrying only the API message — no status —
 * so the message text is the only signal.
 */
export function isCartNotFoundError(error: unknown) {
	return error instanceof Error && /cart not found/i.test(error.message);
}

/** Pure parser for the cart cookie value — exported separately so it can be unit tested. */
export function parseCartCookie(value: string | undefined | null): CartCookieJson | null {
	if (!value) {
		return null;
	}
	try {
		const cartCookieJson: unknown = JSON.parse(value);
		if (
			!cartCookieJson ||
			typeof cartCookieJson !== "object" ||
			!("id" in cartCookieJson) ||
			typeof cartCookieJson.id !== "string"
		) {
			return null;
		}
		return cartCookieJson as CartCookieJson;
	} catch {
		return null;
	}
}

export async function getCartCookieJson(): Promise<null | CartCookieJson> {
	return parseCartCookie((await cookies()).get(CART_COOKIE)?.value);
}
