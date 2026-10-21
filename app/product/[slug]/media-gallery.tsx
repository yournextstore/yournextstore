"use client";

import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { cn, isVideoUrl } from "@/lib/utils";
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
 * The original's gallery: every photograph as a 4:5 tile, two to a row, no carousel. The
 * selected variant's photograph moves to the front; an odd count lets the lead tile span the row.
 */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const selectedVariant = useSelectedVariant(variants);
	const lead =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const ordered =
		lead && images.includes(lead) ? [lead, ...images.filter((image) => image !== lead)] : images;

	if (ordered.length === 0) {
		return (
			<div className="grid aspect-[4/5] place-items-center rounded-xl border border-line bg-surface">
				<p className="text-muted-foreground">No images yet</p>
			</div>
		);
	}

	const spanLead = ordered.length % 2 === 1;

	return (
		<ul aria-label={`${productName} photographs`} className="grid gap-4 sm:grid-cols-2">
			{ordered.map((image, index) => (
				<li
					key={image}
					className={cn(
						"relative overflow-hidden rounded-xl border border-line bg-surface",
						index === 0 && spanLead ? "aspect-[4/5] sm:col-span-2 sm:aspect-[5/4]" : "aspect-[4/5]",
					)}
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
							sizes={
								index === 0 && spanLead
									? "(min-width: 1024px) 55vw, 100vw"
									: "(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
							}
							className="object-cover"
						/>
					)}
				</li>
			))}
		</ul>
	);
}
