"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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
			<div className="flex flex-col gap-4 lg:sticky lg:top-40 lg:self-start">
				<div className="flex aspect-[7/8] items-center justify-center rounded-form bg-card">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="flex min-w-0 flex-col-reverse gap-4 outline-none sm:flex-row lg:sticky lg:top-40 lg:self-start"
		>
			{/* Thumbnails: a column at the left from sm (the original), a row underneath on phones */}
			{displayImages.length > 1 && (
				<div className="no-scrollbar -m-1 flex min-w-0 gap-3 overflow-x-auto p-1 sm:max-h-[580px] sm:w-[4.5rem] sm:shrink-0 sm:flex-col sm:overflow-y-auto sm:overflow-x-visible">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"relative aspect-[7/8] w-16 shrink-0 overflow-hidden rounded-form bg-card transition-all duration-200",
								selectedIndex === index
									? "ring-2 ring-primary ring-offset-2 ring-offset-background"
									: "opacity-70 hover:opacity-100",
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
								<YNSMedia src={image} alt="" fill sizes="64px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			)}

			{/* Main image */}
			<div className="group relative aspect-[7/8] min-w-0 flex-1 overflow-hidden rounded-form bg-card">
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
						alt={`${productName} — image ${selectedIndex + 1}`}
						fill
						sizes="(max-width: 1024px) 100vw, 520px"
						className={cn(
							"object-cover transition-transform duration-500",
							isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in",
						)}
						onClick={() => setIsZoomed(!isZoomed)}
						priority
						fetchPriority="high"
					/>
				)}

				{displayImages.length > 1 && (
					<div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
						<button
							type="button"
							className="inline-flex size-10 items-center justify-center rounded-full bg-surface text-ink shadow-card transition-colors hover:bg-primary hover:text-primary-foreground"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
							aria-label="Previous image"
						>
							<ChevronLeft className="size-5" aria-hidden="true" />
						</button>
						<button
							type="button"
							className="inline-flex size-10 items-center justify-center rounded-full bg-surface text-ink shadow-card transition-colors hover:bg-primary hover:text-primary-foreground"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							aria-label="Next image"
						>
							<ChevronRight className="size-5" aria-hidden="true" />
						</button>
					</div>
				)}
			</div>
		</section>
	);
}
