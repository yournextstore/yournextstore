"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import type { BlurPreview } from "@/lib/blur-placeholder";
import { useUrlQuery } from "@/lib/url-query";
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
	/** Blurred preview of the first image (lib/blur-placeholder.ts), shown until the photo loads. */
	preview?: BlurPreview | null;
};

export function MediaGallery({ images, productName, variants, preview = null }: MediaGalleryProps) {
	const searchParams = useUrlQuery();

	// The gallery always shows the full image set (product + every variant image). When a
	// variant is selected we don't filter the list — that would hide the other thumbnails —
	// we just jump the active image to that variant's first photo within the full gallery.
	const displayImages = images;

	const selectedVariant = useSelectedVariant(variants);

	// Only variants with real combinations drive the gallery jump.
	const firstVariantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const variantImageIndex = firstVariantImage ? Math.max(images.indexOf(firstVariantImage), 0) : 0;

	// Start on the selected variant's photo when the query is already known (a client navigation into the page);
	// after a full load the query arrives with hydration and the jump below picks it up.
	const [selectedIndex, setSelectedIndex] = useState(variantImageIndex);
	const [isZoomed, setIsZoomed] = useState(false);

	// Jump to the selected variant's image when the query changes (avoids useEffect). The previous key lives in
	// state, not a ref, so a render React discards can't move it without the index update.
	const searchParamsKey = searchParams.toString();
	const [prevSearchParamsKey, setPrevSearchParamsKey] = useState(searchParamsKey);
	if (prevSearchParamsKey !== searchParamsKey) {
		setPrevSearchParamsKey(searchParamsKey);
		setSelectedIndex(variantImageIndex);
	}

	const handlePrevious = () => {
		setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
	};

	// Keyboard navigation: ArrowLeft / ArrowRight (scoped to gallery container)
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (displayImages.length <= 1) return;

		if (e.key === "ArrowLeft") {
			e.preventDefault();
			handlePrevious();
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			handleNext();
		}
	};

	if (displayImages.length === 0) {
		return (
			<div className="flex flex-col gap-6">
				<div className="aspect-[3/4] bg-zinc-100 flex items-center justify-center">
					<p className="text-xs tracking-[0.2em] uppercase text-zinc-400">No images available</p>
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
			className="flex flex-col gap-6 outline-none"
		>
			{/* Main Image */}
			<div className="group relative aspect-[3/4] overflow-hidden bg-zinc-100">
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
						preview={preview}
						alt={`${productName} - View ${selectedIndex + 1}`}
						fill
						// Half of the max-w-7xl (1280 px) container on desktop, not half of any viewport width.
						sizes="(max-width: 1024px) 100vw, min(50vw, 640px)"
						className={cn(
							"object-cover transition-transform duration-700",
							isZoomed && "scale-150 cursor-zoom-out",
						)}
						onClick={() => setIsZoomed(!isZoomed)}
						priority
						fetchPriority="high"
					/>
				)}

				{/* Navigation Arrows - minimal style */}
				{displayImages.length > 1 && (
					<div className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
						<button
							type="button"
							className="w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white transition-colors"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
							aria-label="Previous image"
						>
							<ChevronLeft className="h-4 w-4 text-zinc-900" />
						</button>
						<button
							type="button"
							className="w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white transition-colors"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							aria-label="Next image"
						>
							<ChevronRight className="h-4 w-4 text-zinc-900" />
						</button>
					</div>
				)}

				{/* Image Counter - museum style */}
				{displayImages.length > 1 && (
					<div className="absolute bottom-6 left-6">
						<p className="text-xs tracking-[0.2em] uppercase text-zinc-500 bg-white/90 px-3 py-1.5">
							{String(selectedIndex + 1).padStart(2, "0")} / {String(displayImages.length).padStart(2, "0")}
						</p>
					</div>
				)}
			</div>

			{/* Thumbnails - clean row */}
			{displayImages.length > 1 && (
				<div className="flex gap-3">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"relative aspect-[3/4] w-20 overflow-hidden transition-all duration-300",
								selectedIndex === index ? "opacity-100" : "opacity-40 hover:opacity-70",
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
									sizes="80px"
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
