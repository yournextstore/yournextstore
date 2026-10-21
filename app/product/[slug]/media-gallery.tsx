"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
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

	if (displayImages.length === 0) {
		return <div className="mx-auto aspect-square w-full max-w-xl bg-muted" />;
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="relative mx-auto w-full max-w-xl"
		>
			<div className="relative aspect-square overflow-hidden bg-muted">
				{isVideoUrl(current) ? (
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
						alt={`${productName}, image ${selectedIndex + 1} of ${displayImages.length}`}
						fill
						sizes="(max-width: 768px) 100vw, 576px"
						className="object-cover"
						priority
					/>
				)}
			</div>

			{/* The original's carousel HUD: a ruled pill hanging off the bottom edge. */}
			{displayImages.length > 1 && (
				<div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center">
					<div className="pointer-events-auto flex items-center rounded-full border border-border bg-background p-1">
						<button
							type="button"
							onClick={handlePrevious}
							aria-label="Previous image"
							className="flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-foreground/20"
						>
							<svg
								aria-hidden
								viewBox="0 0 16 16"
								className="size-4 -scale-x-100"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path d="M1 8h13M9 3l5 5-5 5" />
							</svg>
						</button>
						<p className="relative mx-2 grid h-8 grid-cols-2 gap-px rounded-full bg-foreground text-micro font-semibold text-background tabular-nums after:absolute after:inset-y-3 after:left-1/2 after:w-px after:bg-background/30">
							<span className="flex items-center py-2 pr-2 pl-3">{selectedIndex + 1}</span>
							<span className="flex items-center py-2 pr-3 pl-2">{displayImages.length}</span>
							<span className="sr-only">
								Image {selectedIndex + 1} of {displayImages.length}
							</span>
						</p>
						<button
							type="button"
							onClick={handleNext}
							aria-label="Next image"
							className="flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-foreground/20"
						>
							<svg
								aria-hidden
								viewBox="0 0 16 16"
								className="size-4"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path d="M1 8h13M9 3l5 5-5 5" />
							</svg>
						</button>
					</div>
				</div>
			)}
		</section>
	);
}
