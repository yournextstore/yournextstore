import { cacheLife } from "next/cache";
import sharp from "sharp";
import { isVideoUrl } from "@/lib/utils";

const SIZE = 16;

export type BlurPreview = { src: string; blurDataURL: string };

/**
 * A blurred preview for `placeholder="blur"` (about 300 B of base64 in the HTML): it shows at once and the photo
 * fades in over it, instead of popping onto an empty box after navigation. null without an image, for a video, or
 * when the image can't be fetched (then there's no preview).
 */
export async function blurPreview(url: string | undefined): Promise<BlurPreview | null> {
	if (!url || isVideoUrl(url)) return null;
	const blurDataURL = await blurDataUrl(url);
	return blurDataURL ? { src: url, blurDataURL } : null;
}

// Plain "use cache" (not "remote"): the result goes into the prerendered shell, and Blob URLs are immutable.
async function blurDataUrl(url: string): Promise<string | null> {
	"use cache";
	cacheLife("max");
	try {
		const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
		if (!response.ok) return null;
		const preview = await sharp(Buffer.from(await response.arrayBuffer()))
			.resize(SIZE, SIZE, { fit: "inside" })
			.webp({ quality: 50 })
			.toBuffer();
		return `data:image/webp;base64,${preview.toString("base64")}`;
	} catch {
		return null;
	}
}
