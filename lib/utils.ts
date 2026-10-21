import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The theme's type scale (globals.css) is unknown to tailwind-merge, which would read
// `text-b-sm` as a colour and silently drop it next to `text-foreground`.
const sizes = (prefix: string, steps: string[]) => steps.map((step) => `${prefix}-${step}`);
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [
				{
					text: [
						...sizes("b", ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "8xl"]),
						...sizes("d", ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "5xl", "7xl"]),
						...sizes("l", ["2xs", "xs", "sm", "md", "6xl"]),
					],
				},
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
