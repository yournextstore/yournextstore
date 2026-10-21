import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The theme's pixel type scale (`text-t14` … `text-t56`) reads as a colour to tailwind-merge
// unless it is registered as a font size; `cn("text-t56 text-white")` would drop the size.
const twMerge = extendTailwindMerge({
	extend: { classGroups: { "font-size": [{ text: ["t11", "t14", "t16", "t18", "t24", "t30", "t56"] }] } },
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
