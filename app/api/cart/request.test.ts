import { describe, expect, test } from "bun:test";
import { parseBundle, parseDiscount, parseLine, readCartBody } from "@/app/api/cart/request";

const post = (body: string, contentType?: string) =>
	new Request("https://store.test/api/cart/items", {
		method: "POST",
		body,
		headers: contentType ? { "Content-Type": contentType } : {},
	});

describe("readCartBody", () => {
	test("refuses anything but JSON, so a cross-site form can't write the cart", async () => {
		const result = await readCartBody(post("variantId=v1&quantity=1", "application/x-www-form-urlencoded"));
		expect(result).toBeInstanceOf(Response);
		expect((result as Response).status).toBe(415);
		expect(((await readCartBody(post('{"a":1}', "text/plain"))) as Response).status).toBe(415);
	});

	test("refuses malformed JSON and non-objects", async () => {
		expect(((await readCartBody(post("{nope", "application/json"))) as Response).status).toBe(400);
		expect(((await readCartBody(post("[1]", "application/json"))) as Response).status).toBe(400);
	});

	test("reads a JSON object", async () => {
		expect(await readCartBody(post('{"variantId":"v1"}', "application/json; charset=utf-8"))).toEqual({
			variantId: "v1",
		});
	});
});

describe("parseLine", () => {
	test("an add needs a variant and a quantity of at least 1", () => {
		expect(parseLine({ variantId: "v1", quantity: 2 }, 1)).toEqual({
			variantId: "v1",
			quantity: 2,
			subscriptionPlanId: undefined,
			properties: undefined,
		});
		expect(parseLine({ variantId: "v1", quantity: 0 }, 1)).toBeNull();
		expect(parseLine({ variantId: "", quantity: 1 }, 1)).toBeNull();
		expect(parseLine({ variantId: "v1", quantity: 1.5 }, 1)).toBeNull();
		expect(parseLine({ variantId: "v1", quantity: "1" }, 1)).toBeNull();
	});

	test("a set accepts 0, which removes the line", () => {
		expect(parseLine({ variantId: "v1", quantity: 0, subscriptionPlanId: null }, 0)?.quantity).toBe(0);
		expect(parseLine({ variantId: "v1", quantity: -1 }, 0)).toBeNull();
	});

	test("checks the plan and the line properties", () => {
		const properties = [{ key: "to", type: "text" as const, value: "Ann", label: "Recipient" }];
		expect(parseLine({ variantId: "v1", quantity: 1, subscriptionPlanId: "p1", properties }, 1)).toEqual({
			variantId: "v1",
			quantity: 1,
			subscriptionPlanId: "p1",
			properties,
		});
		expect(parseLine({ variantId: "v1", quantity: 1, subscriptionPlanId: 5 }, 1)).toBeNull();
		expect(
			parseLine({ variantId: "v1", quantity: 1, properties: [{ key: "to", type: "html" }] }, 1),
		).toBeNull();
	});
});

test("parseBundle checks every selection", () => {
	const selection = { variantId: "v1", groupId: "g1", quantity: 1 };
	expect(parseBundle({ bundleId: "b1", selections: [selection] })).toEqual({
		bundleId: "b1",
		selections: [selection],
	});
	expect(parseBundle({ bundleId: "b1", selections: [{ ...selection, quantity: 0 }] })).toBeNull();
	expect(parseBundle({ bundleId: "b1", selections: "all" })).toBeNull();
});

test("parseDiscount needs a code string and a whole item count", () => {
	expect(parseDiscount({ code: "SAVE10", itemCount: 2 })).toEqual({ code: "SAVE10", itemCount: 2 });
	expect(parseDiscount({ code: 10, itemCount: 2 })).toBeNull();
	expect(parseDiscount({ code: "SAVE10", itemCount: -1 })).toBeNull();
});
