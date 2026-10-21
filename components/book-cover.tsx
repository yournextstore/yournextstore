import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * A catalogue photo dressed as a book cover on the shelf: portrait crop, a shaded
 * spine on the left edge and a soft drop shadow. Keeps the bookshop mood with any
 * store's photography.
 */
export function BookCover({
	src,
	alt,
	sizes,
	priority = false,
	className,
}: {
	src: string | undefined;
	alt: string;
	sizes: string;
	priority?: boolean;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative aspect-[2/3] h-full overflow-hidden rounded-r-[3px] rounded-l-[1px] bg-rule shadow-[4px_6px_14px_-4px_rgb(0_0_0/0.35)]",
				className,
			)}
		>
			{src &&
				(isVideoUrl(src) ? (
					<video
						className="absolute inset-0 h-full w-full object-cover"
						src={src}
						muted
						loop
						autoPlay
						playsInline
					/>
				) : (
					<YNSMedia src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
				))}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/0.28)_0%,rgb(255_255_255/0.22)_3%,rgb(0_0_0/0.12)_6%,transparent_11%,transparent_96%,rgb(0_0_0/0.12)_100%)]"
			/>
		</div>
	);
}
