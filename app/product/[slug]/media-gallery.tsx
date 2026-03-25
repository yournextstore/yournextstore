"use client";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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

	// Track previous searchParams to reset index when variant changes (avoids useEffect)
	const searchParamsKey = searchParams.toString();
	const prevSearchParamsKey = useRef(searchParamsKey);
	if (prevSearchParamsKey.current !== searchParamsKey) {
		prevSearchParamsKey.current = searchParamsKey;
		setSelectedIndex(0);
	}

	// Compute which images to display based on selected variant
	const displayImages = useMemo(() => {
		// Find selected variant based on URL params
		const selectedVariant = variants.find((v) =>
			v.combinations.every(
				(c) => searchParams.get(c.variantValue.variantType.label) === c.variantValue.value,
			),
		);

		// If variant selected and has images, show those
		if (selectedVariant?.images.length) {
			return selectedVariant.images;
		}

		// Fallback to all images
		return images;
	}, [variants, searchParams, images]);

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
				<div className="flex aspect-square items-center justify-center border border-border/80 bg-[var(--surface-soft)]">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	return (
		<div
			tabIndex={0}
			onKeyDown={handleKeyDown}
			className="flex flex-col gap-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:sticky lg:top-28 lg:self-start"
		>
			<div className="group relative aspect-square overflow-hidden border border-border/80 bg-[var(--surface-soft)]">
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
						src={displayImages[selectedIndex]}
						alt={`${productName} - View ${selectedIndex + 1}`}
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className={cn(
							"object-cover transition-transform duration-500",
							isZoomed && "scale-150 cursor-zoom-out",
						)}
						onClick={() => setIsZoomed(!isZoomed)}
						priority
					/>
				)}

				{displayImages.length > 1 && (
					<div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 border border-border/70 bg-background/92 backdrop-blur-sm hover:bg-background"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 border border-border/70 bg-background/92 backdrop-blur-sm hover:bg-background"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>
				)}

				{!isVideoUrl(displayImages[selectedIndex] ?? "") && (
					<div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
						<div className="flex items-center gap-2 border border-border/70 bg-background/92 px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-foreground/72 backdrop-blur-sm">
							<ZoomIn className="h-3.5 w-3.5" />
							Click to zoom
						</div>
					</div>
				)}

				{displayImages.length > 1 && (
					<div className="absolute bottom-4 left-4 border border-border/70 bg-background/92 px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-foreground/72 backdrop-blur-sm">
						{selectedIndex + 1} / {displayImages.length}
					</div>
				)}
			</div>

			{displayImages.length > 1 && (
				<div className="flex gap-3 overflow-x-auto p-2 -m-2">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"relative aspect-square w-20 shrink-0 overflow-hidden border transition-all duration-200",
								selectedIndex === index
									? "border-foreground"
									: "border-border/80 opacity-60 hover:opacity-100",
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
		</div>
	);
}
