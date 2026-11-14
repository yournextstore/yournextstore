import { describe, expect, test } from "bun:test";
import { createHmac } from "node:crypto";
import { CACHE_KINDS, cacheKindTag, readChangeSignal } from "./change-signal";

const secret = "store-secret";
const now = 1_700_000_000_000;
const sign = (timestamp: number, body: string, key = secret) =>
	createHmac("sha256", key).update(`${timestamp}.${body}`).digest("hex");

const signal = (body: string, overrides: Partial<Parameters<typeof readChangeSignal>[0]> = {}) =>
	readChangeSignal({
		secret,
		timestampHeader: String(now),
		signatureHeader: sign(now, body),
		body,
		now,
		...overrides,
	});

describe("readChangeSignal", () => {
	test("accepts a signed signal and returns the kinds it names", () => {
		expect(signal('{"kinds":["product","collection"]}')).toEqual({
			ok: true,
			kinds: ["product", "collection"],
		});
	});

	test("skips kinds this template does not know and repeats", () => {
		expect(signal('{"kinds":["product","product","warehouse"]}')).toEqual({ ok: true, kinds: ["product"] });
	});

	test("refuses every call when the storefront has no secret", () => {
		const result = signal('{"kinds":["product"]}', { secret: undefined });
		expect(result).toMatchObject({ ok: false, status: 401 });
	});

	test("refuses a wrong or missing signature", () => {
		const body = '{"kinds":["product"]}';
		expect(signal(body, { signatureHeader: sign(now, body, "another-secret") })).toMatchObject({
			ok: false,
			status: 401,
		});
		expect(signal(body, { signatureHeader: null })).toMatchObject({ ok: false, status: 401 });
		expect(signal(body, { signatureHeader: "short" })).toMatchObject({ ok: false, status: 401 });
	});

	test("refuses a body that was changed after signing", () => {
		const result = signal('{"kinds":["post"]}', { signatureHeader: sign(now, '{"kinds":["product"]}') });
		expect(result).toMatchObject({ ok: false, status: 401 });
	});

	test("refuses a signal older than five minutes, or without a timestamp", () => {
		const body = '{"kinds":["product"]}';
		const old = now - 6 * 60 * 1000;
		expect(signal(body, { timestampHeader: String(old), signatureHeader: sign(old, body) })).toMatchObject({
			ok: false,
			status: 401,
		});
		expect(signal(body, { timestampHeader: null })).toMatchObject({ ok: false, status: 401 });
		expect(signal(body, { timestampHeader: "soon" })).toMatchObject({ ok: false, status: 401 });
	});

	test("answers 400 for a signed body that is not a list of kinds", () => {
		expect(signal("not json")).toMatchObject({ ok: false, status: 400 });
		expect(signal('{"kinds":"product"}')).toMatchObject({ ok: false, status: 400 });
	});
});

describe("cacheKindTag", () => {
	test("gives every kind its own tag", () => {
		const tags = CACHE_KINDS.map(cacheKindTag);
		expect(new Set(tags).size).toBe(CACHE_KINDS.length);
		expect(cacheKindTag("product")).toBe("yns-product");
	});
});
