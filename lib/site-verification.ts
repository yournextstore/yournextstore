import type { Metadata } from "next";

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const codeOf = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

/**
 * The store's search engine verification codes as Next metadata: `<meta name="google-site-verification">` and
 * `<meta name="msvalidate.01">` (Bing) in every page's head. The merchant enters them under Settings → SEO and
 * the Store API returns them as `settings.siteVerification`; the pinned commerce-kit types don't know the field
 * yet, so it is read by shape. Undefined when no code is set, so the head carries no empty tag.
 */
export function siteVerificationMetadata(settings: unknown): Metadata["verification"] | undefined {
	const stored = isRecord(settings) ? settings.siteVerification : undefined;
	if (!isRecord(stored)) {
		return undefined;
	}
	const google = codeOf(stored.google);
	const bing = codeOf(stored.bing);
	if (!google && !bing) {
		return undefined;
	}
	return {
		...(google ? { google } : {}),
		...(bing ? { other: { "msvalidate.01": bing } } : {}),
	};
}
