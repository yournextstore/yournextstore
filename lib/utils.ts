import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The theme's type scale (globals.css): without this, tailwind-merge reads `text-body` as a
// colour and silently drops the colour or the size when both reach cn().
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [{ text: ["hero", "page", "pdp", "section", "quote", "piece", "body", "small"] }],
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

/** Category names entered in lower case read as labels with a capital first letter. */
export function labelCase(name: string) {
	const trimmed = name.trim();
	return trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1);
}
