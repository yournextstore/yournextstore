import { getImageProps } from "next/image";
import { redirect } from "next/navigation";
import { getStoreFaviconUrl, meGetCached } from "@/lib/commerce";

export async function GET() {
	const me = await meGetCached();
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";

	// Same 64px optimizer URL as the <link rel="icon"> in app/layout.tsx: a few KB from
	// this origin instead of a redirect out to the blob host.
	redirect(getImageProps({ src: faviconUrl, width: 64, height: 64, alt: "" }).props.src);
}
