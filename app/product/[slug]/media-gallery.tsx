"use client";

import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
	const [isZoomed, setIsZoomed] = useState(false);

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
			<div className="product-gallery">
				<div className="gallery-main gallery-empty">
					<p className="muted">No images yet</p>
				</div>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section aria-label="Product media gallery" onKeyDown={handleKeyDown} className="product-gallery">
			<div className="gallery-main" data-zoomed={isZoomed || undefined}>
				{isVideoUrl(current) ? (
					<video className="gallery-video" src={current} muted loop autoPlay playsInline controls />
				) : (
					<button
						type="button"
						className="gallery-zoom-target"
						onClick={() => setIsZoomed(!isZoomed)}
						aria-label={isZoomed ? "Zoom out" : "Zoom in"}
					>
						<YNSMedia
							src={current}
							alt={`${productName} - View ${selectedIndex + 1}`}
							fill
							sizes="(max-width: 1023px) 100vw, 55vw"
							className="object-cover"
							priority
							fetchPriority="high"
						/>
						<span className="gallery-zoom" aria-hidden>
							{isZoomed ? <ZoomOut size={17} aria-hidden /> : <ZoomIn size={17} aria-hidden />}
						</span>
					</button>
				)}
				{displayImages.length > 1 && (
					<div className="gallery-arrows">
						<button
							type="button"
							className="icon-button"
							onClick={handlePrevious}
							aria-label="Previous image"
						>
							<ChevronLeft size={18} aria-hidden />
						</button>
						<button type="button" className="icon-button" onClick={handleNext} aria-label="Next image">
							<ChevronRight size={18} aria-hidden />
						</button>
					</div>
				)}
			</div>

			{displayImages.length > 1 && (
				<>
					<div className="gallery-thumbnails">
						{displayImages.map((image, index) => (
							<button
								key={`${image}-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-pressed={selectedIndex === index}
								aria-label={`Show image ${index + 1}`}
							>
								<span className="media">
									{isVideoUrl(image) ? (
										<video className="gallery-video" src={image} muted playsInline />
									) : (
										<YNSMedia src={image} alt="" fill sizes="84px" className="object-cover" />
									)}
								</span>
							</button>
						))}
					</div>
					<div className="gallery-dots" aria-hidden>
						{displayImages.map((image, index) => (
							<span key={`${image}-dot-${index}`} data-active={index === selectedIndex || undefined} />
						))}
					</div>
				</>
			)}
		</section>
	);
}
