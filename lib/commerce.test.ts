import { afterEach, beforeEach, expect, test } from "bun:test";

// lib/commerce asserts YNS_API_KEY at import time — stub it before the dynamic import.
process.env.YNS_API_KEY ??= "test-key";
const { getCanonicalUrl } = await import("@/lib/commerce");

const ENV_KEYS = ["NEXT_PUBLIC_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL"] as const;
const saved: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

beforeEach(() => {
	for (const key of ENV_KEYS) {
		saved[key] = process.env[key];
		delete process.env[key];
	}
});

afterEach(() => {
	for (const key of ENV_KEYS) {
		if (saved[key] === undefined) {
			delete process.env[key];
		} else {
			process.env[key] = saved[key];
		}
	}
});

test("getCanonicalUrl prefers NEXT_PUBLIC_URL and strips a trailing slash", () => {
	process.env.NEXT_PUBLIC_URL = "https://store.example.com/";
	process.env.VERCEL_PROJECT_PRODUCTION_URL = "prod.vercel.app";
	expect(getCanonicalUrl()).toBe("https://store.example.com");
});

test("getCanonicalUrl falls back to the Vercel production URL", () => {
	process.env.VERCEL_PROJECT_PRODUCTION_URL = "prod.vercel.app";
	process.env.VERCEL_URL = "preview.vercel.app";
	expect(getCanonicalUrl()).toBe("https://prod.vercel.app");
});

test("getCanonicalUrl falls back to the deployment URL", () => {
	process.env.VERCEL_URL = "preview.vercel.app";
	expect(getCanonicalUrl()).toBe("https://preview.vercel.app");
});

test("getCanonicalUrl defaults to localhost with no env configured", () => {
	expect(getCanonicalUrl()).toBe("http://localhost:3000");
});
