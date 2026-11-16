import type { Metadata } from "next";

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

/**
 * Whether the merchant hid this product, collection, category or post from search engines ("Hide from search
 * engines" in its SEO tab). The Store API returns the choice as `seo.noindex`; the pinned commerce-kit types don't
 * know the field yet, so it is read by shape. A hidden page stays reachable: it only carries `noindex` and is left
 * out of the sitemap.
 */
export function isHiddenFromSearch(entity: unknown): boolean {
	return isRecord(entity) && isRecord(entity.seo) && entity.seo.noindex === true;
}

/** The page metadata of a hidden page: `noindex`, links still followed. Empty for every other page. */
export function hiddenFromSearchMetadata(entity: unknown): Pick<Metadata, "robots"> {
	return isHiddenFromSearch(entity) ? { robots: { index: false, follow: true } } : {};
}
