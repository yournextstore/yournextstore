import { headers } from "next/headers";
import { cache } from "react";

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

	const baseUrl = process.env.NEXT_PUBLIC_YNS_API_TENANT;
	if (!baseUrl) {
		console.error("NEXT_PUBLIC_YNS_API_TENANT is not set");
		return null;
	}

	try {
		const response = await fetch(`${baseUrl}/api/auth/get-session`, {
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
