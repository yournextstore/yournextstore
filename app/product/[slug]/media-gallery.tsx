"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { ChevronIcon } from "@/components/icons";
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
			<div className="md:col-span-7">
				<div className="flex aspect-square items-center justify-center bg-secondary">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";
	const hasMany = displayImages.length > 1;

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className={cn(
				"grid grid-cols-1 gap-4 outline-none md:col-span-7 md:gap-8 md:self-start",
				hasMany && "md:grid-cols-7",
			)}
		>
			<div className={cn("flex flex-col items-center gap-6", hasMany && "md:col-span-6 md:col-start-2")}>
				<div className="relative aspect-square w-full overflow-hidden bg-white">
					{isVideoUrl(current) ? (
						<video
							className="absolute inset-0 size-full object-cover"
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
							sizes="(max-width: 768px) 100vw, 520px"
							className={cn(
								"object-cover transition-transform duration-500",
								isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in",
							)}
							onClick={() => setIsZoomed(!isZoomed)}
							priority
							fetchPriority="high"
						/>
					)}
				</div>
				{hasMany && (
					<div className="flex items-center gap-16">
						<button
							type="button"
							onClick={handlePrevious}
							aria-label="Previous image"
							className="flex size-9 items-center justify-center rounded-full border border-border bg-white transition-colors hover:bg-secondary"
						>
							<ChevronIcon className="size-4 rotate-90" />
						</button>
						<button
							type="button"
							onClick={handleNext}
							aria-label="Next image"
							className="flex size-9 items-center justify-center rounded-full border border-border bg-white transition-colors hover:bg-secondary"
						>
							<ChevronIcon className="size-4 -rotate-90" />
						</button>
					</div>
				)}
			</div>

			{hasMany && (
				<div className="no-scrollbar flex gap-3 overflow-x-auto p-1 md:-order-1 md:col-span-1 md:flex-col md:gap-4 md:overflow-visible md:p-0">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"relative aspect-square w-16 shrink-0 overflow-hidden bg-white md:w-full",
								selectedIndex === index
									? "border-2 border-ink"
									: "border-2 border-transparent hover:border-border",
							)}
						>
							{isVideoUrl(image) ? (
								<video className="absolute inset-0 size-full object-cover" src={image} muted playsInline />
							) : (
								<YNSMedia src={image} alt="" fill sizes="80px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			)}
		</section>
	);
}
