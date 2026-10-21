import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isVideoUrl(url: string): boolean {
	try {
		const { pathname } = new URL(url);
		return pathname.endsWith(".mp4") || pathname.endsWith(".webm") || pathname.endsWith(".mov");
	} catch {
		return false;
	}
}

/** Returns the first non-video URL from a media array — useful for thumbnails, OG images, and emails. */
export const getProductThumbnail = (urls: string[]): string | undefined => {
	return urls.find((url) => !isVideoUrl(url));
};

// Mirrors `images.remotePatterns` in next.config.ts. Products imported with images on another
// host (a merchant's old shop) would 400 through the optimizer; those load directly instead.
const OPTIMIZED_HOSTS = [/\.public\.blob\.vercel-storage\.com$/, /(^|\.)yns\.store$/, /(^|\.)yns\.cx$/];

export function isOptimizableImage(src: string) {
	if (!src.startsWith("http")) return true;
	try {
		const { hostname } = new URL(src);
		return OPTIMIZED_HOSTS.some((pattern) => pattern.test(hostname));
	} catch {
		return false;
	}
}
