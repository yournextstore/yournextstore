import { cookies } from "next/headers";
import { safeJsonParse } from "@/lib/utils";

export const CART_COOKIE = "yns_cart";

export type CartCookieJson = { id: string; linesCount: number };

export function setCartCookieJson(cartCookieJson: CartCookieJson): void {
	try {
		cookies().set(CART_COOKIE, JSON.stringify(cartCookieJson));
	} catch (error) {
		console.error("Failed to set cart cookie", error);
	}
}

export function clearCartCookie(): void {
	cookies().set(CART_COOKIE, "", { maxAge: 0 });
}

export function getCartCookieJson(): null | CartCookieJson {
	const cartCookieJson = safeJsonParse(cookies().get(CART_COOKIE)?.value);
	if (
		!cartCookieJson ||
		typeof cartCookieJson !== "object" ||
		!("id" in cartCookieJson) ||
		!("linesCount" in cartCookieJson) ||
		typeof cartCookieJson.id !== "string" ||
		typeof cartCookieJson.linesCount !== "number"
	) {
		return null;
	}
	return cartCookieJson as CartCookieJson;
}
