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
 * The original shows every photograph full width, one under another, with the soft corners
 * that square off on hover. A selected variant's own photo moves to the top.
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
		return <div className="aspect-[4/5] w-full rounded-lg bg-secondary" />;
	}

	return (
		<div className="flex flex-col gap-3 md:gap-6">
			{ordered.map((src, index) => (
				<div
					key={src}
					className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-secondary transition-all duration-300 hover:rounded-none"
				>
					{isVideoUrl(src) ? (
						<video
							className="absolute inset-0 h-full w-full object-cover"
							src={src}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={src}
							alt={index === 0 ? productName : `${productName}, view ${index + 1}`}
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
							priority={index === 0}
						/>
					)}
				</div>
			))}
		</div>
	);
}
