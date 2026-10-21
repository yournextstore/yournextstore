import type { EditorialImage } from "@/lib/editorial";
import { TOOLBAR_CONTROL } from "@/lib/listing-styles";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original listing opens on a wide, rounded campaign photo. A collection or category that has
 * its own picture shows it; otherwise a bundled editorial photo fills the strip.
 */
export function ListingBanner({ image, alt = "" }: { image: EditorialImage | string; alt?: string }) {
	const { src, position } = typeof image === "string" ? { src: image, position: undefined } : image;
	return (
		<header className="mb-3">
			<div className="relative aspect-[4/1] min-h-[10rem] w-full overflow-hidden rounded-md bg-[#e9e6e1]">
				<YNSMedia
					src={src}
					alt={alt}
					fill
					priority
					sizes="(min-width: 1280px) 1200px, 100vw"
					className="object-cover"
					style={position ? { objectPosition: position } : undefined}
				/>
			</div>
		</header>
	);
}

export function ListingBannerSkeleton() {
	return (
		<header className="mb-3">
			<div className="aspect-[4/1] min-h-[10rem] w-full animate-pulse rounded-md bg-well" />
		</header>
	);
}

/** Static stand-in for the sort + filters controls, the same boxes, so nothing shifts when they land. */
export function ToolbarFallback({ filters = true, sort = true }: { filters?: boolean; sort?: boolean }) {
	return (
		<div className="flex items-center gap-2" aria-hidden>
			{sort && <span className={`${TOOLBAR_CONTROL} w-36`} />}
			{filters && <span className={`${TOOLBAR_CONTROL} w-[5.25rem]`} />}
		</div>
	);
}
