import { badRequest, cartJson, parseLine, readCartBody } from "@/app/api/cart/request";
import { addCartLine, setCartLineQuantity } from "@/lib/cart";

// Cart writes are route handlers, not server actions: a cookie set in a server action makes
// Next re-render the whole current page and send it with the result (the first add creates
// the cart and sets `yns_cart`), and the router runs actions one at a time.

/** Add a line (or add to its quantity). */
export async function POST(request: Request) {
	const body = await readCartBody(request);
	if (body instanceof Response) {
		return body;
	}
	const line = parseLine(body, 1);
	if (!line) {
		return badRequest();
	}
	return cartJson(await addCartLine(line.variantId, line.quantity, line.subscriptionPlanId, line.properties));
}

/** Set a line's absolute quantity; 0 removes it. */
export async function PATCH(request: Request) {
	const body = await readCartBody(request);
	if (body instanceof Response) {
		return body;
	}
	const line = parseLine(body, 0);
	if (!line) {
		return badRequest();
	}
	return cartJson(
		await setCartLineQuantity(line.variantId, line.quantity, line.subscriptionPlanId, line.properties),
	);
}
