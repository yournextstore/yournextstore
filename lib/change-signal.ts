import { createHmac, timingSafeEqual } from "node:crypto";

// The platform tells this storefront when store data changed, so cached reads can live for days
// and a page is rebuilt only after a change (app/api/revalidate/route.ts). Each cached read is
// tagged with the kinds of data it shows; the signal names the kinds that changed.

/** The kinds of data a page can show. The platform sends these names. */
export const CACHE_KINDS = [
	// The store's own settings (name, menu, currencies). Sent only when settings change.
	"store",
	"product",
	"category",
	"collection",
	"brand",
	"review",
	"legal",
	"page",
	"post",
] as const;
export type CacheKind = (typeof CACHE_KINDS)[number];

/** The cache tag of one kind: what a cached read is labelled with and what the signal invalidates. */
export const cacheKindTag = (kind: CacheKind) => `yns-${kind}`;

const isCacheKind = (value: unknown): value is CacheKind => CACHE_KINDS.some((kind) => kind === value);

/** A signal older than this is refused, so a captured call cannot be replayed later. */
const MAX_AGE_MS = 5 * 60 * 1000;

const sign = (secret: string, timestamp: number, body: string) =>
	createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");

const sameSignature = (given: string, expected: string) => {
	const a = Buffer.from(given);
	const b = Buffer.from(expected);
	return a.length === b.length && timingSafeEqual(a, b);
};

type SignalCheck =
	| { ok: true; kinds: readonly CacheKind[] }
	| { ok: false; status: 400 | 401; reason: string };

/**
 * Checks a change signal and returns the kinds it names. A storefront without a secret refuses
 * every call: an open route would let anyone force rebuilds.
 */
export const readChangeSignal = ({
	secret,
	timestampHeader,
	signatureHeader,
	body,
	now = Date.now(),
}: {
	secret: string | undefined;
	timestampHeader: string | null;
	signatureHeader: string | null;
	body: string;
	now?: number;
}): SignalCheck => {
	if (!secret) {
		return { ok: false, status: 401, reason: "No signing secret is set on this storefront" };
	}
	const timestamp = Number(timestampHeader);
	if (!timestampHeader || !Number.isFinite(timestamp) || Math.abs(now - timestamp) > MAX_AGE_MS) {
		return { ok: false, status: 401, reason: "Missing or expired timestamp" };
	}
	if (!signatureHeader || !sameSignature(signatureHeader, sign(secret, timestamp, body))) {
		return { ok: false, status: 401, reason: "Wrong signature" };
	}
	const parsed: unknown = (() => {
		try {
			return JSON.parse(body);
		} catch {
			return null;
		}
	})();
	const kinds =
		typeof parsed === "object" && parsed !== null && "kinds" in parsed && Array.isArray(parsed.kinds)
			? parsed.kinds
			: null;
	if (!kinds) {
		return { ok: false, status: 400, reason: 'Expected a body like {"kinds": ["product"]}' };
	}
	// Unknown kinds are skipped, not refused: a newer platform may name one this template does not cache.
	return { ok: true, kinds: [...new Set(kinds.filter(isCacheKind))] };
};
