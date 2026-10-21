"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
		return Math.max(index, 0);
	}, [selectedVariant, images]);

	// Start on the selected variant's photo: choosing a variant navigates, and the page can remount
	// the gallery, so a jump on change alone would land back on the first image.
	const [selectedIndex, setSelectedIndex] = useState(variantImageIndex);

	// Jump to the selected variant's image when the variant changes (avoids useEffect). The previous
	// key lives in state, not a ref: a variant change renders inside a transition, and a discarded
	// render would move a ref while dropping the index update.
	const searchParamsKey = searchParams.toString();
	const [prevSearchParamsKey, setPrevSearchParamsKey] = useState(searchParamsKey);
	if (prevSearchParamsKey !== searchParamsKey) {
		setPrevSearchParamsKey(searchParamsKey);
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

	if (displayImages.length === 0) {
		return (
			<div className="md:sticky md:top-20 md:self-start">
				<div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-roledescription="carousel"
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="outline-none md:sticky md:top-20 md:self-start"
		>
			{/* The original's Embla image carousel: one rounded frame, white dots over its bottom edge. */}
			<div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
				{isVideoUrl(displayImages[selectedIndex] ?? "") ? (
					<video
						className="absolute inset-0 h-full w-full object-cover"
						src={displayImages[selectedIndex]}
						muted
						loop
						autoPlay
						playsInline
						controls
					/>
				) : (
					<YNSMedia
						src={displayImages[selectedIndex] ?? ""}
						alt={`${productName} - View ${selectedIndex + 1}`}
						fill
						sizes="(min-width: 768px) 33vw, 100vw"
						className="object-cover"
						priority
						fetchPriority="high"
					/>
				)}
				{displayImages.length > 1 && (
					<div className="absolute inset-x-0 bottom-2 flex flex-wrap justify-center">
						{displayImages.length > 10 ? (
							<span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
								{selectedIndex + 1} / {displayImages.length}
							</span>
						) : (
							displayImages.map((image, index) => (
								<button
									key={`${image}-${index}`}
									type="button"
									onClick={() => setSelectedIndex(index)}
									aria-label={`Show image ${index + 1}`}
									aria-current={selectedIndex === index}
									className="group/dot flex h-6 w-6 items-center justify-center"
								>
									<span
										className={cn(
											"h-3 w-3 rounded-full bg-white shadow-sm ring-1 ring-black/25 transition-opacity duration-300",
											selectedIndex === index ? "opacity-100" : "opacity-50 group-hover/dot:opacity-80",
										)}
									/>
								</button>
							))
						)}
					</div>
				)}
			</div>
		</section>
	);
}
