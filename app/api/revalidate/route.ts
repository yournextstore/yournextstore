import { revalidateTag } from "next/cache";
import { cacheKindTag, readChangeSignal } from "@/lib/change-signal";

// The platform calls this when store data changed. Each named kind is marked stale: a page that
// shows it is served once more as it is and rebuilt in the background on that visit. Pages
// nobody visits are not rebuilt.
export async function POST(request: Request) {
	const body = await request.text();
	const signal = readChangeSignal({
		secret: process.env.YNS_REVALIDATE_SECRET,
		timestampHeader: request.headers.get("x-yns-timestamp"),
		signatureHeader: request.headers.get("x-yns-signature"),
		body,
	});
	if (!signal.ok) {
		return Response.json({ error: signal.reason }, { status: signal.status });
	}
	signal.kinds.map((kind) => revalidateTag(cacheKindTag(kind), "max"));
	return Response.json({ revalidated: signal.kinds }, { headers: { "Cache-Control": "private, no-store" } });
}
