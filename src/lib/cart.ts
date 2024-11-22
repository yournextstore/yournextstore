import { safeJsonParse } from "@/lib/utils";
import { type UnsafeUnwrappedCookies, cookies } from "next/headers";

export const CART_COOKIE = "yns_cart";

export type CartCookieJson = { id: string; linesCount: number };

export async function setCartCookieJson(cartCookieJson: CartCookieJson) {
	try {
		(await cookies()).set(CART_COOKIE, JSON.stringify(cartCookieJson));
	} catch (error) {
		console.error("Failed to set cart cookie", error);
	}
}

export function clearCartCookie(): void {
	(cookies() as unknown as UnsafeUnwrappedCookies).set(CART_COOKIE, "", {
		maxAge: 0,
	});
}

export async function getCartCookieJson(): Promise<null | CartCookieJson> {
	const cookiesValue = await cookies();
	const cartCookieJson = safeJsonParse(
		(cookiesValue as unknown as UnsafeUnwrappedCookies).get(CART_COOKIE)?.value,
	);

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
