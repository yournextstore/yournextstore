import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/commerce";
import { FILTER_KEYS } from "@/lib/listing-routes";

// A sort order or a filter makes a listing render per request on a `…-filtered` route, and every combination is a
// new URL showing products the plain listing already links to. Keep crawlers off them; `page` stays crawlable, since
// pagination is how they reach the products past the first page. Two patterns per key, so `?sort=` and `&sort=`
// match but `?resort=` doesn't. Built from FILTER_KEYS, so a filter added there is blocked here too.
const UNCRAWLED_LISTING_PARAMS = ["sort", ...FILTER_KEYS];

const listingDisallows = () => UNCRAWLED_LISTING_PARAMS.flatMap((key) => [`/*?${key}=`, `/*&${key}=`]);

export default function robots(): MetadataRoute.Robots {
	const baseUrl = getCanonicalUrl();

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/checkout", "/order/", "/search", "/api/", ...listingDisallows()],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
		host: baseUrl,
	};
}
