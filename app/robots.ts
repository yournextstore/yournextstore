import type { MetadataRoute } from "next";
import { getCanonicalUrl, meGetCached } from "@/lib/commerce";
import { FILTER_KEYS } from "@/lib/listing-routes";
import { storeRobotsGroups } from "@/lib/robots-rules";

// A sort order or a filter makes a listing render per request on a `…-filtered` route, and every combination is a
// new URL showing products the plain listing already links to. Keep crawlers off them; `page` stays crawlable, since
// pagination is how they reach the products past the first page. Two patterns per key, so `?sort=` and `&sort=`
// match but `?resort=` doesn't. Built from FILTER_KEYS, so a filter added there is blocked here too.
const UNCRAWLED_LISTING_PARAMS = ["sort", ...FILTER_KEYS];

const listingDisallows = () => UNCRAWLED_LISTING_PARAMS.flatMap((key) => [`/*?${key}=`, `/*&${key}=`]);

export default async function robots(): Promise<MetadataRoute.Robots> {
	const baseUrl = getCanonicalUrl();
	// The merchant's own rules (Settings → SEO) follow the store's. A failed read leaves them out for now rather
	// than failing robots.txt; the read is cached and tagged, so a saved change shows up without a deploy.
	const me = await meGetCached().catch(() => null);

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/checkout", "/order/", "/search", "/api/", ...listingDisallows()],
			},
			...storeRobotsGroups(me?.store.settings),
		],
		sitemap: `${baseUrl}/sitemap.xml`,
		host: baseUrl,
	};
}
