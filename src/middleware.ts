import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decrypt, updateSession } from "./lib/auth";

const ProtectedPaths = ["/orders"];

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isProtectedPath = ProtectedPaths.some((p) => pathname.startsWith(p));

	if (!isProtectedPath) {
		return NextResponse.next();
	}

	const session = request.cookies.get("session")?.value;
	if (!session) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	const data = await decrypt(session);
	if (!data || data.expires < Date.now()) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return updateSession(request);
}

export const config = {
	matcher: ["/orders"],
};
