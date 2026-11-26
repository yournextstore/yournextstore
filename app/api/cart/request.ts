import type { APICartCreateBody } from "commerce-kit";

// Validation for the cart write routes. These replaced server actions, which took typed
// arguments from the router; a route handler gets whatever JSON a client sends.

type Properties = NonNullable<APICartCreateBody["properties"]>;
type Body = Record<string, unknown>;

const MAX_QUANTITY = 9999;

export function cartJson(data: unknown, status = 200) {
	// `private`: one shopper's cart must never sit in a shared cache.
	return Response.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
}

export const badRequest = () => cartJson({ error: "Invalid request" }, 400);

// The cart cookie is `SameSite=None`, so a page on another site can make the browser send it
// here. Only JSON is accepted: a cross-site form can't send it, and a cross-site fetch that
// does needs a CORS preflight these routes never answer.
export async function readCartBody(request: Request): Promise<Body | Response> {
	const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
	if (!contentType.startsWith("application/json")) {
		return cartJson({ error: "Expected application/json" }, 415);
	}
	const body: unknown = await request.json().catch(() => null);
	return isRecord(body) ? body : badRequest();
}

const isRecord = (value: unknown): value is Body =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const isId = (value: unknown): value is string =>
	typeof value === "string" && value.length > 0 && value.length <= 200;

const isCount = (value: unknown, min: number): value is number =>
	Number.isInteger(value) && (value as number) >= min && (value as number) <= MAX_QUANTITY;

const isPlanId = (value: unknown): value is string | null | undefined =>
	value === undefined || value === null || isId(value);

const isProperty = (value: unknown) =>
	isRecord(value) &&
	typeof value.key === "string" &&
	(value.type === "text" || value.type === "file") &&
	typeof value.value === "string" &&
	(value.label === undefined || typeof value.label === "string");

const isProperties = (value: unknown): value is Properties | undefined =>
	value === undefined || (Array.isArray(value) && value.length <= 50 && value.every(isProperty));

/** A line write: `minQuantity` 1 for an add, 0 for a set (0 removes the line). */
export function parseLine(body: Body, minQuantity: number) {
	const { variantId, quantity, subscriptionPlanId, properties } = body;
	if (!isId(variantId) || !isCount(quantity, minQuantity) || !isPlanId(subscriptionPlanId)) {
		return null;
	}
	if (!isProperties(properties)) {
		return null;
	}
	return { variantId, quantity, subscriptionPlanId, properties };
}

export function parseBundle(body: Body) {
	const { bundleId, selections } = body;
	if (!isId(bundleId) || !Array.isArray(selections) || selections.length > 200) {
		return null;
	}
	const valid = selections.every(
		(selection) =>
			isRecord(selection) &&
			isId(selection.variantId) &&
			isId(selection.groupId) &&
			isCount(selection.quantity, 1),
	);
	return valid
		? { bundleId, selections: selections as Array<{ variantId: string; groupId: string; quantity: number }> }
		: null;
}

export function parseDiscount(body: Body) {
	const { code, itemCount } = body;
	if (
		typeof code !== "string" ||
		code.length > 200 ||
		!Number.isInteger(itemCount) ||
		(itemCount as number) < 0
	) {
		return null;
	}
	return { code, itemCount: itemCount as number };
}
