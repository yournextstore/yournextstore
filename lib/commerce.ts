import { Commerce } from "commerce-kit";

export const commerce = Commerce({
	token: process.env.YNS_API_KEY,
});

const meGetCached = async (token?: string) => {
	"use cache: remote";

	const commerce = Commerce({ token });
	return commerce.meGet();
};

export const getSubdomainPublicUrl = async () => {
	const tenant = process.env.NEXT_PUBLIC_YNS_API_TENANT;
	if (tenant) {
		const tenantHost = new URL(tenant).host;
		const [subdomain, ...base] = tenantHost.split(".");
		const apiHost = base.join(".");
		if (subdomain && apiHost) {
			return {
				subdomain,
				publicUrl: `https://${apiHost}`,
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
