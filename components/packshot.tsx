import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * A catalogue photo placed the way the original places its cut-out furniture: centred on a
 * light-grey stage at a fraction of the tile's width. The `jam-packshot` treatment multiplies
 * the photo's own studio sweep into the stage and fades its edges, so square shots read as
 * free-standing pieces.
 */
export function Packshot({
	src,
	alt,
	sizes,
	className,
	priority = false,
}: {
	src: string | null | undefined;
	alt: string;
	sizes: string;
	className?: string;
	priority?: boolean;
}) {
	if (!src) {
		return <div aria-hidden className={cn("aspect-square", className)} />;
	}
	return (
		<div className={cn("relative aspect-square", className)}>
			{isVideoUrl(src) ? (
				<video
					className="jam-packshot absolute inset-0 h-full w-full object-cover"
					src={src}
					muted
					loop
					autoPlay
					playsInline
				/>
			) : (
				<YNSMedia
					src={src}
					alt={alt}
					fill
					sizes={sizes}
					priority={priority}
					className="jam-packshot object-cover"
				/>
			)}
		</div>
	);
}
