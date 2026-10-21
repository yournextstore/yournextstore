import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * Amerta's product media: every photo stacked down the left column on desktop, a swipeable
 * row on phones. Server-rendered (no selected-variant state), so it never streams in late.
 */
export function MediaGallery({ images, productName }: { images: string[]; productName: string }) {
	if (images.length === 0) {
		return <div className="aspect-square bg-tile" aria-hidden="true" />;
	}

	return (
		<section aria-label={`${productName} photos`}>
			<ul className="rail -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:flex-col lg:gap-20 lg:overflow-visible">
				{images.map((image, index) => (
					<li
						key={image}
						className="relative aspect-square w-[88%] shrink-0 snap-start overflow-hidden bg-tile sm:w-full"
					>
						{isVideoUrl(image) ? (
							<video
								className="absolute inset-0 h-full w-full object-cover"
								src={image}
								muted
								loop
								autoPlay
								playsInline
							/>
						) : (
							<YNSMedia
								src={image}
								alt={index === 0 ? productName : `${productName}, view ${index + 1}`}
								fill
								priority={index === 0}
								fetchPriority={index === 0 ? "high" : undefined}
								sizes="(max-width: 640px) 88vw, (max-width: 1024px) 100vw, 608px"
								className="object-cover"
							/>
						)}
					</li>
				))}
			</ul>
		</section>
	);
}
