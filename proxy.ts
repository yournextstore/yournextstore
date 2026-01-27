import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { commerce } from "./lib/commerce";

export async function proxy(request: NextRequest) {
	const { store, publicUrl } = await commerce.meGet();
	const destinationUrl = new URL(publicUrl);

	// Clone the request headers and set the correct x-forwarded-host
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-forwarded-host", destinationUrl.host);
	requestHeaders.set("origin", destinationUrl.toString());

	// Rewrite to the destination with updated headers
	const url = new URL(
		`/${store.subdomain}${request.nextUrl.pathname}${request.nextUrl.search}`,
		destinationUrl,
	);

	return NextResponse.rewrite(url, {
		request: {
			headers: requestHeaders,
		},
	});
}

export const config = {
	matcher: ["/checkout/:path*"],
};
