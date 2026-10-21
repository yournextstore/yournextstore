import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The theme's type steps (`text-eyebrow`, `text-display-*`) would otherwise read as colours and
// silently drop a colour class merged beside them.
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [
				{ text: ["eyebrow", "navlink", "display-hero", "display-section", "display-page", "display-pdp"] },
			],
		},
	},
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
