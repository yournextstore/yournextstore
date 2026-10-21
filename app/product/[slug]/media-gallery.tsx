"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
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

export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const [selectedIndex, setSelectedIndex] = useState(0);

	// The gallery always shows the full image set (product + every variant image). When a
	// variant is selected we don't filter the list — that would hide the other thumbnails —
	// we just jump the active image to that variant's first photo within the full gallery.
	const displayImages = images;

	const selectedVariant = useSelectedVariant(variants);

	const variantImageIndex = useMemo(() => {
		// Only variants with real combinations drive the gallery jump.
		const firstVariantImage =
			selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
		if (!firstVariantImage) return 0;

		const index = images.indexOf(firstVariantImage);
		return index >= 0 ? index : 0;
	}, [selectedVariant, images]);

	// Jump to the selected variant's image when the variant changes (avoids useEffect)
	const searchParamsKey = searchParams.toString();
	const prevSearchParamsKey = useRef(searchParamsKey);
	if (prevSearchParamsKey.current !== searchParamsKey) {
		prevSearchParamsKey.current = searchParamsKey;
		setSelectedIndex(variantImageIndex);
	}

	const handlePrevious = useCallback(() => {
		setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
	}, [displayImages.length]);

	const handleNext = useCallback(() => {
		setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
	}, [displayImages.length]);

	// Keyboard navigation: ArrowLeft / ArrowRight (scoped to gallery container)
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (displayImages.length <= 1) return;

			if (e.key === "ArrowLeft") {
				e.preventDefault();
				handlePrevious();
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				handleNext();
			}
		},
		[displayImages.length, handlePrevious, handleNext],
	);

	const current = displayImages[selectedIndex] ?? "";

	// Two flex items for the product panel: the thumbnail column (a row under the picture on
	// small screens) and the picture itself on the original's #f8f8f8 well.
	return (
		<>
			{displayImages.length > 1 && (
				<div className="relative order-2 shrink-0 bg-white md:order-none md:w-[150px]">
					{/* On desktop the column takes the panel's height and scrolls, as in the original. */}
					<div className="flex gap-[5px] overflow-x-auto p-2.5 md:absolute md:inset-0 md:flex-col md:overflow-x-visible md:overflow-y-auto">
						{displayImages.map((image, index) => (
							<button
								key={`${image}-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show image ${index + 1} of ${displayImages.length}`}
								aria-pressed={selectedIndex === index}
								className={cn(
									"relative h-[100px] w-[100px] shrink-0 overflow-hidden border bg-white md:w-full",
									selectedIndex === index ? "border-[#a6a5a5]" : "border-border hover:border-ring",
								)}
							>
								{isVideoUrl(image) ? (
									<video
										className="absolute inset-0 h-full w-full object-cover"
										src={image}
										muted
										playsInline
									/>
								) : (
									<YNSMedia src={image} alt="" fill sizes="130px" className="object-cover" />
								)}
							</button>
						))}
					</div>
				</div>
			)}
			<section
				aria-label="Product images"
				onKeyDown={handleKeyDown}
				className="relative order-1 h-[300px] w-full overflow-hidden bg-[#f8f8f8] outline-none sm:h-[400px] md:order-none md:h-auto md:min-h-[440px] md:w-auto md:grow md:basis-[400px]"
			>
				{current === "" ? (
					<p className="absolute inset-0 flex items-center justify-center text-muted-foreground">
						No images available
					</p>
				) : isVideoUrl(current) ? (
					<video
						className="absolute inset-0 h-full w-full object-cover"
						src={current}
						muted
						loop
						autoPlay
						playsInline
						controls
					/>
				) : (
					<YNSMedia
						src={current}
						alt={`${productName}, view ${selectedIndex + 1}`}
						fill
						sizes="(max-width: 768px) 100vw, 45vw"
						className="object-cover"
						priority
					/>
				)}
			</section>
		</>
	);
}
