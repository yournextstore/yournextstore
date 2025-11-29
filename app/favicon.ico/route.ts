import { redirect } from "next/navigation";
import { getStoreFaviconUrl, meGetCached } from "@/lib/commerce";

export async function GET() {
	const me = await meGetCached();
	const faviconUrl = getStoreFaviconUrl(me.store.settings);

	redirect(faviconUrl ?? "/logo.svg");
}
