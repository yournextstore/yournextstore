import { type NextRequest, NextResponse } from "next/server";
import { getSubdomainPublicUrl } from "@/lib/commerce";

async function handler(request: NextRequest) {
	// better-auth lives on the apex (global users), not the tenant subdomain — on a
	// tenant subdomain `/api/auth/*` rewrites into `[domain]` and 404s. Target the apex,
	// same as the page proxy in proxy.ts.
	const { publicUrl } = await getSubdomainPublicUrl();

	const url = new URL(request.nextUrl.pathname + request.nextUrl.search, publicUrl);

	const requestHeaders = new Headers(request.headers);
	requestHeaders.delete("host");
	requestHeaders.delete("accept-encoding");

	const body =
		request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : undefined;

	try {
		const response = await fetch(url, {
			method: request.method,
			headers: requestHeaders,
			body,
		});

		const responseHeaders = new Headers(response.headers);
		responseHeaders.delete("content-encoding");
		responseHeaders.delete("content-length");

		return new NextResponse(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		});
	} catch (error) {
		console.error(`[auth proxy] ${request.method} ${url.toString()} failed:`, error);
		return NextResponse.json({ error: "Auth proxy request failed" }, { status: 502 });
	}
}

export { handler as GET, handler as POST };
