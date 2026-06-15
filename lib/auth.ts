import { headers } from "next/headers";
import { cache } from "react";
import { getSubdomainPublicUrl } from "@/lib/commerce";

interface Session {
	user: {
		id: string;
		name: string;
		email: string;
		image?: string | null;
		emailVerified: boolean;
		createdAt: string;
		updatedAt: string;
	};
	session: {
		id: string;
		userId: string;
		token: string;
		expiresAt: string;
		createdAt: string;
		updatedAt: string;
	};
}

export const getSession = cache(async (): Promise<Session | null> => {
	const reqHeaders = await headers();
	const cookie = reqHeaders.get("cookie");

	if (!cookie) {
		return null;
	}

	// better-auth lives on the apex (global users), not the tenant subdomain.
	const { publicUrl } = await getSubdomainPublicUrl();

	try {
		const response = await fetch(`${publicUrl}/api/auth/get-session`, {
			headers: { cookie },
		});

		if (!response.ok) {
			return null;
		}

		const session: Session = await response.json();
		return session;
	} catch {
		return null;
	}
});
