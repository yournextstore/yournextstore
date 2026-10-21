"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
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
			<div className="flex aspect-[9/10] items-center justify-center bg-sand lg:sticky lg:top-[5.5rem] lg:self-start">
				<p className="text-copy text-plum">No images available</p>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-roledescription="carousel"
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="relative outline-none lg:sticky lg:top-[5.5rem] lg:self-start"
		>
			{/* Horizon's gallery is a full-bleed half-page photograph, no frame. */}
			<div className="group relative aspect-[9/10] overflow-hidden bg-sand">
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
					<div className="absolute inset-x-4 top-1/2 hidden -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100 lg:flex">
						<Button
							variant="secondary"
							size="icon"
							className="size-10 rounded-full bg-background text-ink shadow-soft hover:bg-background"
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
							className="size-10 rounded-full bg-background text-ink shadow-soft hover:bg-background"
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

				{/* Desktop: the original's small vertical thumbnail stack, bottom left over the photograph. */}
				{displayImages.length > 1 && (
					<div className="absolute bottom-8 left-8 hidden max-h-[60%] flex-col gap-2 overflow-y-auto lg:flex">
						{displayImages.map((image, index) => (
							<button
								key={`${image}-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show image ${index + 1}`}
								aria-current={selectedIndex === index ? "true" : undefined}
								className={cn(
									"relative size-12 shrink-0 overflow-hidden rounded-md border bg-sand transition-opacity",
									selectedIndex === index ? "border-ink" : "border-transparent opacity-70 hover:opacity-100",
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
									<YNSMedia src={image} alt="" fill sizes="48px" className="object-cover" />
								)}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Mobile: dots under the photograph (a counter once there are too many to fit). */}
			{displayImages.length > 1 &&
				(displayImages.length <= 8 ? (
					<div className="flex justify-center gap-1 py-2 lg:hidden">
						{displayImages.map((image, index) => (
							<button
								key={`dot-${image}-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show image ${index + 1}`}
								aria-current={selectedIndex === index ? "true" : undefined}
								className="flex size-6 items-center justify-center"
							>
								<span
									className={cn("size-2 rounded-full", selectedIndex === index ? "bg-ink" : "bg-field")}
								/>
							</button>
						))}
					</div>
				) : (
					<p className="py-2 text-center text-fine text-plum lg:hidden">
						{selectedIndex + 1} / {displayImages.length}
					</p>
				))}
		</section>
	);
}
