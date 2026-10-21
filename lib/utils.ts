import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The theme's type-scale tokens (`text-gf-h3`, …) read as colours to tailwind-merge
// unless they are registered as font sizes.
const twMerge = extendTailwindMerge({
	extend: { theme: { text: ["gf-h2", "gf-h3", "gf-h4", "gf-h5", "gf-h6", "gf-sm", "gf-xs"] } },
});

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
