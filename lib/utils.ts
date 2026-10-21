import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The theme's heading sizes (`text-h1` … `text-h5`) would otherwise read as colours to
// tailwind-merge, and `cn("text-h2", "text-white")` would silently drop the size.
const twMerge = extendTailwindMerge({
	extend: { classGroups: { "font-size": [{ text: ["h1", "h2", "h3", "h4", "h5"] }] } },
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
