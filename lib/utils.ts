import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The theme's type scale (text-body-md, text-heading-xl, …) is unknown to tailwind-merge, which
// would otherwise read those classes as colours and drop one of a size/colour pair.
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [
				{
					text: [
						"body-xs",
						"body-sm",
						"body-md",
						"body-lg",
						"body-xl",
						"heading-xl",
						"heading-2xl",
						"heading-3xl",
						"heading-4xl",
						"heading-5xl",
						"heading-6xl",
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
