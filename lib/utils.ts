import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The theme's type scale (`text-sal-*`) would otherwise read as colours and be dropped by `cn()`.
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [
				{ text: ["sal-xs", "sal-sm", "sal-nav", "sal-md", "sal-base", "sal-lg", "sal-xl", "sal-hero"] },
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
