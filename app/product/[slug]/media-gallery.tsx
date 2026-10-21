"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
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
			<div className="flex aspect-square items-center justify-center rounded-sm border border-border lg:sticky lg:top-4 lg:self-start">
				<p className="text-label text-muted-foreground">No images available</p>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";
	const many = displayImages.length > 1;

	return (
		// A named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="rounded-sm border border-border p-1 outline-none lg:sticky lg:top-4 lg:self-start lg:p-2"
		>
			<div className="flex gap-3">
				{/* The original's thumbnail column, top left inside the frame (desktop). */}
				{many && (
					<div className="hidden w-16 shrink-0 flex-col gap-2 lg:flex">
						{displayImages.map((image, index) => (
							<button
								key={`${image}-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show image ${index + 1}`}
								aria-current={selectedIndex === index}
								className={cn(
									"relative aspect-square w-16 overflow-hidden rounded-sm border bg-background transition-colors",
									selectedIndex === index
										? "border-foreground"
										: "border-border hover:border-muted-foreground",
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
									<YNSMedia src={image} alt="" fill sizes="64px" className="object-contain" />
								)}
							</button>
						))}
					</div>
				)}

				<div className="group relative aspect-square min-w-0 flex-1 overflow-hidden rounded-xs">
					{isVideoUrl(current) ? (
						<video
							className="absolute inset-0 h-full w-full object-contain"
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
								"object-contain transition-transform duration-500",
								isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in",
							)}
							onClick={() => setIsZoomed(!isZoomed)}
							priority
						/>
					)}

					{many && (
						<div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
							<button
								type="button"
								className="inline-flex size-10 items-center justify-center rounded-sm bg-background/90 hover:bg-background"
								onClick={(e) => {
									e.stopPropagation();
									handlePrevious();
								}}
								aria-label="Previous image"
							>
								<ArrowLeftIcon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
							</button>
							<button
								type="button"
								className="inline-flex size-10 items-center justify-center rounded-sm bg-background/90 hover:bg-background"
								onClick={(e) => {
									e.stopPropagation();
									handleNext();
								}}
								aria-label="Next image"
							>
								<ArrowRightIcon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Mobile: the original's black progress bar under the photo. */}
			{many && (
				<div aria-hidden className="relative mx-4 mb-3 mt-2 h-1 rounded-full bg-border lg:hidden">
					<div
						className="absolute inset-y-0 rounded-full bg-primary transition-[left] duration-200"
						style={{
							width: `${100 / displayImages.length}%`,
							left: `${(selectedIndex * 100) / displayImages.length}%`,
						}}
					/>
				</div>
			)}
		</section>
	);
}
