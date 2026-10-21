import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The FreshCart type scale (text-fc-*) is unknown to tailwind-merge, which would read it as a
// colour and drop either the size or the colour when both pass through cn().
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [{ "text-fc": ["sm", "base", "md", "lg", "xl", "2xl", "3xl", "5xl"] }],
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
