import { Commerce } from "commerce-kit";

// Where the platform serves this store. The proxy needs it to forward the checkout, the account and
// the other platform-rendered addresses (proxy.ts).
//
// Keep this file free of `next/cache` and of lib/commerce.ts. The proxy runs outside Next's cache:
// `"use cache"` has no effect there, and `cacheTag()` or `cacheLife()` throws, which answers 500 on
// every forwarded address, the checkout included (proxy-address.test.ts).

type PlatformAddress = { subdomain: string; publicUrl: string };

/** From the environment: a fixed value, with no network call. */
const fromEnvironment = (): PlatformAddress | null => {
	const tenant = process.env.NEXT_PUBLIC_YNS_API_TENANT;
	if (!tenant) return null;
	const tenantUrl = new URL(tenant);
	const [subdomain, ...base] = tenantUrl.host.split(".");
	const apiHost = base.join(".");
	if (!subdomain || !apiHost) return null;
	// Preserve the tenant's scheme/port so local http backends work (not just https).
	return { subdomain, publicUrl: `${tenantUrl.protocol}//${apiHost}` };
};

const fromApi = async (): Promise<PlatformAddress> => {
	const {
		store: { subdomain },
		publicUrl,
	} = await Commerce({
		token: process.env.YNS_API_KEY,
		endpoint: process.env.YNS_API_URL || undefined,
	}).meGet();
	return { subdomain, publicUrl };
};

// The API answer never changes within a deployment, so one call per server instance is enough.
// A failed call is not kept: the next request tries again.
let apiAnswer: Promise<PlatformAddress> | null = null;

export const getSubdomainPublicUrl = async (): Promise<PlatformAddress> => {
	const fixed = fromEnvironment();
	if (fixed) return fixed;
	apiAnswer ??= fromApi().catch((error) => {
		apiAnswer = null;
		throw error;
	});
	return apiAnswer;
};
