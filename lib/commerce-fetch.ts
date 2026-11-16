import { try_ } from "safe-try";

export type CommerceFetch = (url: string, init: RequestInit) => Promise<Response>;

/** Answers that say "try again later", not "this request is wrong". */
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

/** Waits before the 1st, 2nd and 3rd retry. */
const RETRY_DELAYS_MS = [500, 1000, 2000];

/** The longest a `Retry-After` header can hold a request, so one answer can't stall a build. */
const MAX_RETRY_AFTER_MS = 30_000;

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** A dropped connection (undici's TypeError "fetch failed"), never a code bug. */
const isNetworkError = (error: Error) =>
	error instanceof TypeError && /fetch failed|terminated|network/i.test(error.message);

/**
 * `Retry-After` in seconds. The HTTP-date form is ignored: reading the clock outside "use cache"
 * makes a prerender fail, and the backoff is close enough.
 */
const retryAfterMs = (response: Response) => {
	const seconds = Number(response.headers.get("Retry-After"));
	return Number.isFinite(seconds) && seconds >= 0 ? Math.min(seconds * 1000, MAX_RETRY_AFTER_MS) : null;
};

/**
 * Wraps the fetch the Commerce SDK uses so a read survives a short Store API failure. A build
 * prerenders many pages at once, and one 500 used to fail the whole build. A GET is retried on
 * 429, 500, 502, 503, 504 and on network errors, up to 3 times. Writes are never retried: they may
 * have taken effect before the error.
 */
export const createRetryingFetch = (
	fetchImpl: CommerceFetch,
	{ delaysMs = RETRY_DELAYS_MS, sleep = defaultSleep } = {},
): CommerceFetch => {
	const attemptFetch = async (url: string, init: RequestInit, attempt: number): Promise<Response> => {
		const delayMs = delaysMs[attempt];
		if ((init.method ?? "GET").toUpperCase() !== "GET" || delayMs === undefined) {
			return fetchImpl(url, init);
		}
		const [error, response] = await try_(fetchImpl(url, init));
		if (error) {
			if (!isNetworkError(error)) throw error;
			await sleep(delayMs);
			return attemptFetch(url, init, attempt + 1);
		}
		if (!RETRYABLE_STATUSES.has(response.status)) return response;
		// Free the connection: this answer is never read.
		await response.body?.cancel();
		await sleep((response.status === 429 ? retryAfterMs(response) : null) ?? delayMs);
		return attemptFetch(url, init, attempt + 1);
	};
	return (url, init) => attemptFetch(url, init, 0);
};
