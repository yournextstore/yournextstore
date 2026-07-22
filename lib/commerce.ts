import { Commerce } from "commerce-kit";
import { cacheLife } from "next/cache";
import { try_ } from "safe-try";

// Override the API host (defaults to yns.store / yns.cx by key prefix). Useful for
// pointing at a dev deployment, e.g. YNS_API_URL=https://dev.axelgrubba.com
const endpoint = process.env.YNS_API_URL || undefined;

export const commerce = Commerce({
	token: process.env.YNS_API_KEY,
	endpoint,
});

// Plain "use cache" (not "remote") so store settings can be part of the static
// shell — remote-cached entries defer to request time and block prerendering
// for everything that depends on them (metadata, <html lang>, nav links).
export const meGetCached = async (token?: string) => {
	"use cache";

	const commerce = Commerce({ token, endpoint });
	return commerce.meGet();
};

// Store name + description for page-level metadata. Same cache posture as the
// root layout's getStoreMetadata so it stays in the static shell.
export async function getStoreSeo() {
	"use cache";
	cacheLife("hours");

	const [error, me] = await try_(meGetCached());
	if (error) {
		return { storeName: "Your Next Store", storeDescription: null };
	}
	return {
		storeName: me.store.name || "Your Next Store",
		storeDescription: me.store.settings?.storeDescription || null,
	};
}

export function getStoreFaviconUrl(
	settings: Awaited<ReturnType<typeof commerce.meGet>>["store"]["settings"],
) {
	const faviconUrl =
		settings?.favicon?.imageUrl ??
		(typeof settings?.logo === "string" ? settings.logo : settings?.logo?.imageUrl) ??
		null;

	return faviconUrl;
}

export function getCanonicalUrl(): string {
	if (process.env.NEXT_PUBLIC_URL) {
		return process.env.NEXT_PUBLIC_URL.replace(/\/$/, "");
	}
	if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	}
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	return "http://localhost:3000";
}

export const getSubdomainPublicUrl = async () => {
	const tenant = process.env.NEXT_PUBLIC_YNS_API_TENANT;
	if (tenant) {
		const tenantUrl = new URL(tenant);
		const [subdomain, ...base] = tenantUrl.host.split(".");
		const apiHost = base.join(".");
		if (subdomain && apiHost) {
			return {
				subdomain,
				// Preserve the tenant's scheme/port so local http backends work (not just https).
				publicUrl: `${tenantUrl.protocol}//${apiHost}`,
			};
		}
	}

	// fallback to fetching from the API if env variable is not set or invalid
	const {
		store: { subdomain },
		publicUrl,
	} = await meGetCached(process.env.YNS_API_KEY);
	return { subdomain, publicUrl };
};
