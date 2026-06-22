"use client";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
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

	const variantImageIndex = useMemo(() => {
		const selectedVariant = variants.find(
			(v) =>
				v.combinations.length > 0 &&
				v.combinations.every(
					(c) => searchParams.get(c.variantValue.variantType.label) === c.variantValue.value,
				),
		);

		const firstVariantImage = selectedVariant?.images[0];
		if (!firstVariantImage) return 0;

		const index = images.indexOf(firstVariantImage);
		return index >= 0 ? index : 0;
	}, [variants, searchParams, images]);

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
			<div className="flex flex-col gap-4 lg:sticky lg:top-32 lg:self-start">
				<div className="aspect-square neo-border bg-[var(--color-surface-variant)] flex items-center justify-center">
					<p className="text-[var(--color-on-surface-variant)]">No images available</p>
				</div>
			</div>
		);
	}

	const arrowBtn =
		"h-10 w-10 flex items-center justify-center neo-border bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)] transition-colors";

	return (
		<div
			tabIndex={0}
			onKeyDown={handleKeyDown}
			className="flex flex-col gap-4 outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 lg:sticky lg:top-32 lg:self-start"
		>
			<div className="group relative aspect-square neo-border overflow-hidden bg-[var(--color-surface-variant)]">
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
						<button
							type="button"
							className={arrowBtn}
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5" />
						</button>
						<button
							type="button"
							className={arrowBtn}
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5" />
						</button>
					</div>
				)}

				{!isVideoUrl(displayImages[selectedIndex] ?? "") && (
					<div className="absolute bottom-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
						<div className="label-caps inline-flex items-center gap-2 neo-border bg-[var(--color-surface-container-lowest)] px-3 py-1.5">
							<ZoomIn className="h-3.5 w-3.5" />
							Zoom
						</div>
					</div>
				)}

				{displayImages.length > 1 && (
					<div className="absolute bottom-3 left-3 label-caps neo-border bg-[var(--color-surface-container-lowest)] px-2 py-1.5">
						{selectedIndex + 1} / {displayImages.length}
					</div>
				)}
			</div>

			{displayImages.length > 1 && (
				<div className="flex gap-2 overflow-x-auto">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"relative aspect-square w-20 shrink-0 overflow-hidden neo-border transition-all bg-[var(--color-surface-variant)]",
								selectedIndex === index
									? "neo-shadow translate-x-[-2px] translate-y-[-2px]"
									: "opacity-70 hover:opacity-100",
							)}
							aria-label={`View image ${index + 1}`}
							aria-pressed={selectedIndex === index}
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
