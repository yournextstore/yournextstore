"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
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
			<div className="flex flex-col gap-4 md:sticky md:top-24 md:self-start">
				<div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-contrast-100">
					<p className="text-contrast-500">No images available</p>
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
			className="flex flex-col gap-4 outline-none md:sticky md:top-24 md:self-start"
		>
			{/* Main Image */}
			<div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-contrast-100">
				{isVideoUrl(displayImages[selectedIndex] ?? "") ? (
					<video
						className="absolute inset-0 w-full h-full object-cover"
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
						sizes="(min-width: 48rem) 50vw, 100vw"
						className="object-cover"
						priority
						fetchPriority="high"
					/>
				)}

				{/* Navigation Arrows */}
				{displayImages.length > 1 && (
					<div className="absolute right-3 bottom-3 flex gap-1.5">
						<button
							type="button"
							onClick={handlePrevious}
							aria-label="Previous image"
							className="flex size-10 items-center justify-center rounded-full bg-background/90 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
						>
							<ArrowLeft className="size-5" strokeWidth={1.5} />
						</button>
						<button
							type="button"
							onClick={handleNext}
							aria-label="Next image"
							className="flex size-10 items-center justify-center rounded-full bg-background/90 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
						>
							<ArrowRight className="size-5" strokeWidth={1.5} />
						</button>
					</div>
				)}
			</div>

			{/* Thumbnails */}
			{displayImages.length > 1 && (
				<div className="-m-1 flex gap-2 overflow-x-auto p-1">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"relative size-12 shrink-0 overflow-hidden rounded-lg border-2 bg-contrast-100 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime md:size-16",
								selectedIndex === index
									? "border-foreground"
									: "border-transparent opacity-70 hover:opacity-100",
							)}
						>
							{isVideoUrl(image) ? (
								<video
									className="absolute inset-0 w-full h-full object-cover"
									src={image}
									muted
									playsInline
								/>
							) : (
								<YNSMedia
									src={image}
									alt={`${productName} thumbnail ${index + 1}`}
									fill
									sizes="64px"
									className="object-cover"
								/>
							)}
						</button>
					))}
				</div>
			)}
		</section>
	);
}
