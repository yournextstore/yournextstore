import { cookies } from "next/headers";

export const CART_COOKIE = "yns_cart";
export type CartCookieJson = { id: string };

export async function setCartCookie(cartCookieJson: CartCookieJson) {
	try {
		(await cookies()).set(CART_COOKIE, JSON.stringify(cartCookieJson), {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			partitioned: true,
			path: "/",
		});
	} catch (error) {
		console.error("Failed to set cart cookie", error);
	}
}

export async function clearCartCookie(): Promise<void> {
	(await cookies()).set(CART_COOKIE, "", {
		maxAge: 0,
		secure: true,
		sameSite: "none",
		partitioned: true,
		path: "/",
	});
}

export async function getCartCookieJson(): Promise<null | CartCookieJson> {
	const cartCookieJson_ = (await cookies()).get(CART_COOKIE)?.value;
	try {
		const cartCookieJson = cartCookieJson_ ? JSON.parse(cartCookieJson_) : null;
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
