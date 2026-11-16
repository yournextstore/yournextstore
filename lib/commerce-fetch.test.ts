import { expect, mock, test } from "bun:test";
import { createRetryingFetch } from "@/lib/commerce-fetch";

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
