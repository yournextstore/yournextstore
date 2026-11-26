import { badRequest, cartJson, parseDiscount, readCartBody } from "@/app/api/cart/request";
import { applyCartDiscount, removeCartDiscount } from "@/lib/cart";

// Route handlers for the reason in `../items/route.ts`.

/** Apply a discount code to the cart. */
export async function POST(request: Request) {
	const body = await readCartBody(request);
	if (body instanceof Response) {
		return body;
	}
	const discount = parseDiscount(body);
	if (!discount) {
		return badRequest();
	}
	return cartJson(await applyCartDiscount(discount.code, discount.itemCount));
}

/** Remove the cart's discount code. Takes a JSON body too, so the same cross-site guard applies. */
export async function DELETE(request: Request) {
	const body = await readCartBody(request);
	if (body instanceof Response) {
		return body;
	}
	return cartJson(await removeCartDiscount());
}
