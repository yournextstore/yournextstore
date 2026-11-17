import { expect, mock, test } from "bun:test";
import { BUILD_HEADER, createRetryingFetch, withBuildMarker } from "@/lib/commerce-fetch";

const URL_ = "https://yns.cx/api/v1/products/cheese";

const respond = (status: number, headers: Record<string, string> = {}) =>
	new Response(JSON.stringify({ status }), { status, headers });

const setup = (...answers: Array<Response | Error>) => {
	const fetchImpl = mock(async (_url: string, _init: RequestInit) => {
		const answer = answers.shift();
		if (!answer) throw new Error("no answer left");
		if (answer instanceof Error) throw answer;
		return answer;
	});
	const sleep = mock(async (_ms: number) => {});
	return { fetchImpl, sleep, fetch: createRetryingFetch(fetchImpl, { sleep }) };
};

test("retries a GET that answers 500, with backoff", async () => {
	const { fetchImpl, sleep, fetch } = setup(respond(500), respond(502), respond(200));

	const response = await fetch(URL_, { method: "GET" });

	expect(response.status).toBe(200);
	expect(fetchImpl).toHaveBeenCalledTimes(3);
	expect(sleep.mock.calls.map(([ms]) => ms)).toEqual([500, 1000]);
});

test("retries a GET on a dropped connection", async () => {
	const { fetchImpl, fetch } = setup(new TypeError("fetch failed"), respond(200));

	expect((await fetch(URL_, {})).status).toBe(200);
	expect(fetchImpl).toHaveBeenCalledTimes(2);
});

test("returns the last answer after 3 retries", async () => {
	const { fetchImpl, fetch } = setup(respond(500), respond(500), respond(500), respond(503));

	expect((await fetch(URL_, { method: "GET" })).status).toBe(503);
	expect(fetchImpl).toHaveBeenCalledTimes(4);
});

test("waits as long as a 429's Retry-After asks", async () => {
	const { sleep, fetch } = setup(respond(429, { "Retry-After": "3" }), respond(200));

	expect((await fetch(URL_, { method: "GET" })).status).toBe(200);
	expect(sleep.mock.calls.map(([ms]) => ms)).toEqual([3000]);
});

test("never retries a write", async () => {
	const { fetchImpl, fetch } = setup(respond(500));

	expect((await fetch(URL_, { method: "POST", body: "{}" })).status).toBe(500);
	expect(fetchImpl).toHaveBeenCalledTimes(1);
});

test("does not retry an answer that won't change", async () => {
	const { fetchImpl, fetch } = setup(respond(404));

	expect((await fetch(URL_, { method: "GET" })).status).toBe(404);
	expect(fetchImpl).toHaveBeenCalledTimes(1);
});

test("does not retry an error that isn't a network failure", async () => {
	const { fetchImpl, fetch } = setup(new Error("boom"));

	await expect(fetch(URL_, { method: "GET" })).rejects.toThrow("boom");
	expect(fetchImpl).toHaveBeenCalledTimes(1);
});

const BUILD_ID = "019a8f3e-5c2d-7b41-9e0a-3d6f2b8c1a47";

test("marks every call with the build that sent it", async () => {
	const { fetchImpl } = setup(respond(200), respond(200));
	const fetch = withBuildMarker(fetchImpl, BUILD_ID);
	const callerHeaders = { "Content-Type": "application/json" };

	await fetch(URL_, { method: "GET", headers: callerHeaders });
	await fetch(URL_, { method: "POST", body: "{}" });

	const sent = fetchImpl.mock.calls.map(([, init]) => new Headers(init.headers));
	expect(sent.map((headers) => headers.get(BUILD_HEADER))).toEqual([BUILD_ID, BUILD_ID]);
	expect(sent[0]?.get("Content-Type")).toBe("application/json");
	// The caller's headers object is left as it was.
	expect(callerHeaders).toEqual({ "Content-Type": "application/json" });
});

test("sends calls unchanged outside a build", async () => {
	const { fetchImpl } = setup(respond(200));

	await withBuildMarker(fetchImpl, undefined)(URL_, { method: "GET" });

	expect(new Headers(fetchImpl.mock.calls[0]?.[1].headers).has(BUILD_HEADER)).toBe(false);
});

test("a marked read still retries, with the header on every attempt", async () => {
	const { fetchImpl, sleep } = setup(respond(503), respond(200));
	const fetch = createRetryingFetch(withBuildMarker(fetchImpl, BUILD_ID), { sleep });

	expect((await fetch(URL_, { method: "GET" })).status).toBe(200);
	expect(fetchImpl.mock.calls.map(([, init]) => new Headers(init.headers).get(BUILD_HEADER))).toEqual([
		BUILD_ID,
		BUILD_ID,
	]);
});
