import { NextResponse } from "next/server";
import { getStoreFaviconUrl, meGetCached } from "@/lib/commerce";

export async function GET() {
	const me = await meGetCached();
	const storeName = me.store.settings?.storeName || "Your Next Store";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";

	const manifest = {
		name: storeName,
		short_name: storeName,
		start_url: "/",
		display: "standalone" as const,
		background_color: "#ffffff",
		theme_color: "#000000",
		icons: [
			{
				src: faviconUrl,
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: faviconUrl,
				sizes: "512x512",
				type: "image/png",
			},
		],
	};

	return NextResponse.json(manifest, {
		headers: {
			"Content-Type": "application/manifest+json",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
