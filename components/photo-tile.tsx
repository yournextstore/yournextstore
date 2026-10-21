import Link from "next/link";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's one building block: a photograph filling its box edge to edge, with a plain
 * caption in the bottom-left corner. Captions sit in ink on a soft paper wash so they read on
 * any catalogue photo.
 */
export function PhotoTile({
	image,
	href,
	caption,
	sizes,
	className,
	priority = false,
	mono = false,
	captionClassName,
}: {
	image: string | null;
	href?: string;
	caption?: React.ReactNode;
	sizes: string;
	className?: string;
	priority?: boolean;
	/** Black-and-white, like the original's hero film. */
	mono?: boolean;
	captionClassName?: string;
}) {
	const body = (
		<>
			{image ? (
				<YNSMedia
					src={image}
					alt=""
					fill
					sizes={sizes}
					priority={priority}
					className={cn(
						"object-cover transition-transform duration-700 ease-out",
						href && "group-hover:scale-[1.02]",
						mono && "grayscale contrast-[1.05]",
					)}
				/>
			) : (
				<div className="absolute inset-0 bg-panel" />
			)}
			{caption ? (
				<div
					className={cn(
						"absolute inset-x-0 bottom-0 bg-linear-to-t from-[#f4efe8]/70 to-transparent px-3 pb-3 pt-16 text-black md:px-[2vw] md:pb-[2vw]",
						captionClassName,
					)}
				>
					<div className="text-tile">{caption}</div>
				</div>
			) : null}
		</>
	);

	const boxClass = cn("group relative block overflow-hidden bg-panel", className);
	return href ? (
		<Link href={href} className={boxClass}>
			{body}
		</Link>
	) : (
		<div className={boxClass}>{body}</div>
	);
}
