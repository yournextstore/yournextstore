"use client";

import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type Variant = {
	id: string;
	images: string[];
	combinations: {
		variantValue: {
			value: string;
			variantType: {
				label: string;
			};
		};
	}[];
};

type MediaGalleryProps = {
	images: string[];
	productName: string;
	variants: Variant[];
};

/**
 * The original's product media: every photograph stacked down the wide column. Phones get the
 * same set as a swipe row so the details panel is not pushed below a wall of images. A selected
 * variant's photograph moves to the front.
 */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const selectedVariant = useSelectedVariant(variants);
	const variantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const ordered =
		variantImage && images.includes(variantImage)
			? [variantImage, ...images.filter((image) => image !== variantImage)]
			: images;

	if (ordered.length === 0) {
		return (
			<div className="col-span-12 lg:col-span-7 xl:col-span-8">
				<div className="flex aspect-[4/5] items-center justify-center rounded-md bg-secondary">
					<p className="text-body text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	return (
		<section aria-label={`${productName} photographs`} className="col-span-12 lg:col-span-7 xl:col-span-8">
			<ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-5 lg:overflow-visible lg:px-0">
				{ordered.map((image, index) => (
					<li
						key={image}
						className={`relative aspect-[4/5] shrink-0 snap-center overflow-hidden rounded-md bg-secondary lg:w-full ${ordered.length > 1 ? "w-[85%]" : "w-full"}`}
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
								alt={`${productName}, photograph ${index + 1} of ${ordered.length}`}
								fill
								sizes="(max-width: 1024px) 85vw, (max-width: 1280px) 55vw, 800px"
								className="object-cover"
								priority={index === 0}
							/>
						)}
					</li>
				))}
			</ul>
		</section>
	);
}
