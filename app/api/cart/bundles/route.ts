import { badRequest, cartJson, parseBundle, readCartBody } from "@/app/api/cart/request";
import { addCartBundle } from "@/lib/cart";

/** Add a bundle with the shopper's selections. A route handler for the reason in `../items/route.ts`. */
export async function POST(request: Request) {
	const body = await readCartBody(request);
	if (body instanceof Response) {
		return body;
	}
	const bundle = parseBundle(body);
	if (!bundle) {
		return badRequest();
	}
	return cartJson(await addCartBundle(bundle.bundleId, bundle.selections));
}
