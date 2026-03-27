import { type NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_YNS_API_TENANT;

async function handler(request: NextRequest) {
	if (!API_URL) {
		return NextResponse.json({ error: "NEXT_PUBLIC_YNS_API_TENANT is not configured" }, { status: 500 });
	}

	const url = new URL(request.nextUrl.pathname + request.nextUrl.search, API_URL);

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
