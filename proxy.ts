import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { commerce } from "./lib/commerce";

export async function proxy(request: NextRequest) {
	const { store, publicUrl } = await commerce.meGet();
	const destinationUrl = new URL(publicUrl);
	const storeHost = store.domain || `${store.subdomain}.${destinationUrl.host}`;

	// Clone the request headers and set the correct x-forwarded-host
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-forwarded-host", storeHost);

	// Rewrite to the destination with updated headers
	const url = new URL(`/${store.subdomain}${request.nextUrl.pathname}${request.nextUrl.search}`, publicUrl);

	return NextResponse.rewrite(url, {
		headers: requestHeaders,
	});
}

export const config = {
	matcher: ["/checkout/:path*"],
};
