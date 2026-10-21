"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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
			<div className="flex aspect-square items-center justify-center rounded-md bg-stage md:sticky md:top-28 md:self-start">
				<p className="text-muted-foreground">No images available</p>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";
	const arrow =
		"flex h-10 w-10 items-center justify-center rounded-md bg-white text-foreground transition-colors hover:bg-accent";

	return (
		// The original's gallery: one rounded grey stage, square white arrow chips at the sides
		// and a thin progress track along the bottom.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="relative aspect-square min-w-0 overflow-hidden rounded-md bg-stage outline-none md:sticky md:top-28 md:self-start"
		>
			{isVideoUrl(current) ? (
				<video
					className="absolute inset-0 h-full w-full object-cover"
					src={current}
					muted
					loop
					autoPlay
					playsInline
				/>
			) : (
				<YNSMedia
					src={current}
					alt={`${productName}, image ${selectedIndex + 1}`}
					fill
					sizes="(min-width: 768px) 55vw, 100vw"
					className="object-cover"
					priority
					fetchPriority="high"
				/>
			)}

			{displayImages.length > 1 && (
				<>
					<div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
						<button type="button" onClick={handlePrevious} aria-label="Previous image" className={arrow}>
							<ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
						</button>
						<button type="button" onClick={handleNext} aria-label="Next image" className={arrow}>
							<ChevronRight className="h-5 w-5" strokeWidth={1.25} />
						</button>
					</div>
					<div className="absolute bottom-5 left-1/2 flex w-40 -translate-x-1/2 gap-0">
						{displayImages.map((image, index) => (
							<button
								key={`${image}-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show image ${index + 1}`}
								aria-current={selectedIndex === index}
								className="flex h-6 flex-1 items-center"
							>
								<span
									className={cn(
										"block h-0.5 w-full transition-colors",
										selectedIndex === index ? "bg-foreground" : "bg-[#c9c9c9]",
									)}
								/>
							</button>
						))}
					</div>
				</>
			)}
		</section>
	);
}
