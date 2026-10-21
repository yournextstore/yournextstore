"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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
	const [isZoomed, setIsZoomed] = useState(false);

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
		return (
			<div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
				<div className="flex aspect-square items-center justify-center rounded-lg border border-border bg-card">
					<p className="text-steel">No images available</p>
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
			className="flex min-w-0 flex-col gap-4 outline-none lg:sticky lg:top-24 lg:self-start"
		>
			<div className="relative lg:px-0">
				{/* Main image in the original's white rounded card */}
				<div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-card">
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
							sizes="(max-width: 1024px) 100vw, 400px"
							className={cn(
								"cursor-zoom-in object-cover transition-transform duration-500",
								isZoomed && "scale-150 cursor-zoom-out",
							)}
							onClick={() => setIsZoomed(!isZoomed)}
							priority
						/>
					)}
					{displayImages.length > 1 && (
						<div className="absolute bottom-3 left-3 rounded bg-card/90 px-2 py-1 text-xs text-ink">
							{selectedIndex + 1} / {displayImages.length}
						</div>
					)}
				</div>

				{/* Chevrons sit outside the card on desktop, like the original's slick arrows */}
				{displayImages.length > 1 && (
					<>
						<button
							type="button"
							onClick={handlePrevious}
							aria-label="Previous image"
							className="absolute top-1/2 left-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-ink shadow lg:-left-12 lg:bg-transparent lg:shadow-none"
						>
							<ChevronLeft className="h-7 w-7" strokeWidth={1.5} />
						</button>
						<button
							type="button"
							onClick={handleNext}
							aria-label="Next image"
							className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-ink shadow lg:-right-12 lg:bg-transparent lg:shadow-none"
						>
							<ChevronRight className="h-7 w-7" strokeWidth={1.5} />
						</button>
					</>
				)}
			</div>

			{/* Thumbnails */}
			{displayImages.length > 1 && (
				<div className="flex gap-3 overflow-x-auto p-1 -m-1 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"relative aspect-square w-20 shrink-0 overflow-hidden rounded-md bg-card transition-opacity sm:w-auto",
								selectedIndex === index ? "ring-2 ring-main" : "opacity-70 hover:opacity-100",
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
								<YNSMedia src={image} alt="" fill sizes="100px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			)}
		</section>
	);
}
