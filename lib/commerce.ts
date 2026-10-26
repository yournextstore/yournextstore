import { Commerce } from "commerce-kit";
import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { invariant } from "@/lib/invariant";

// Override the API host (defaults to yns.store / yns.cx by key prefix). Useful for
// pointing at a dev deployment, e.g. YNS_API_URL=https://dev.axelgrubba.com
const endpoint = process.env.YNS_API_URL || undefined;

// Fail loudly at boot — without the key every SDK call surfaces as an opaque API error.
invariant(
	process.env.YNS_API_KEY,
	"Missing YNS_API_KEY environment variable. Add it to .env.local (see .env.example).",
);

const client = Commerce({
	token: process.env.YNS_API_KEY,
	endpoint,
});

/**
 * A full catalogue page (100 products) is a multi-megabyte response, and during a build hundreds of prerenders fetch
 * at once; a body can arrive corrupted (`SyntaxError: Bad control character` while the API's own response is clean).
 * Callers turn an error into an empty list, which "use cache" then keeps in a static page for hours, so a browse
 * read retries twice on a parse or network error first.
 */
const RETRIES = 2;

async function withRetry<T>(request: () => Promise<T>, attempt = 0): Promise<T> {
	try {
		return await request();
	} catch (error) {
		// A corrupted body (SyntaxError) or a dropped connection (undici's TypeError "fetch failed"), never a code bug.
		const transient =
			error instanceof SyntaxError ||
			(error instanceof TypeError && /fetch failed|terminated|network/i.test(error.message));
		if (!transient || attempt >= RETRIES) throw error;
		await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
		return withRetry(request, attempt + 1);
	}
}

const browse = client.productBrowse.bind(client);

export const commerce = Object.assign(client, {
	productBrowse: (...args: Parameters<typeof browse>) => withRetry(() => browse(...args)),
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

// Memoized per isolate: the proxy calls this on every proxied request, and the
// fallback branch is a network round trip that "use cache" does not shield in
// the middleware runtime. The result is deployment-constant, so caching the
// promise is safe; a rejection clears it so a transient failure can retry.
let subdomainPublicUrlPromise: ReturnType<typeof resolveSubdomainPublicUrl> | null = null;
export const getSubdomainPublicUrl = () => {
	subdomainPublicUrlPromise ??= resolveSubdomainPublicUrl().catch((error) => {
		subdomainPublicUrlPromise = null;
		throw error;
	});
	return subdomainPublicUrlPromise;
};

const resolveSubdomainPublicUrl = async () => {
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
