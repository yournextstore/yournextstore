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
	const touchStartX = useRef<number | null>(null);

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
			<div className="flex w-full flex-col gap-2 md:sticky md:top-24 md:w-1/2 md:self-start">
				<div className="flex aspect-[4/5] items-center justify-center bg-secondary">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";
	const many = displayImages.length > 1;
	const navButton =
		"inline-flex size-7 shrink-0 items-center justify-center border border-input bg-transparent shadow-sm transition-colors hover:bg-accent disabled:opacity-50 sm:size-8";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-roledescription="carousel"
			aria-label="Product images"
			onKeyDown={handleKeyDown}
			className="flex w-full flex-col gap-2 outline-none md:sticky md:top-24 md:w-1/2 md:self-start"
		>
			{/* Main image: swipe on touch, arrows and thumbnails below (the original's embla layout). */}
			<div
				className="relative aspect-[4/5] overflow-hidden bg-secondary"
				onTouchStart={(event) => {
					touchStartX.current = event.touches[0]?.clientX ?? null;
				}}
				onTouchEnd={(event) => {
					const start = touchStartX.current;
					const end = event.changedTouches[0]?.clientX;
					touchStartX.current = null;
					if (start === null || end === undefined || Math.abs(end - start) < 40) return;
					if (end < start) handleNext();
					else handlePrevious();
				}}
			>
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
						alt={`${productName}, photo ${selectedIndex + 1} of ${displayImages.length}`}
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
						priority
						fetchPriority="high"
					/>
				)}
			</div>

			{many ? (
				<div className="flex w-full items-center gap-2">
					<button type="button" className={navButton} onClick={handlePrevious} aria-label="Previous image">
						<ChevronLeft aria-hidden="true" className="size-3 sm:size-4" />
					</button>
					<div className="flex min-w-0 flex-1 gap-2 overflow-x-auto p-0.5">
						{displayImages.map((image, index) => (
							<button
								key={`${image}-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show photo ${index + 1} of ${displayImages.length}`}
								aria-current={selectedIndex === index}
								className={cn(
									"group relative aspect-square w-14 shrink-0 overflow-hidden border border-input shadow-sm sm:w-[72px]",
									selectedIndex === index && "ring-1 ring-foreground",
								)}
							>
								<span
									aria-hidden="true"
									className={cn(
										"absolute inset-0 z-10 bg-zinc-950/20 transition-colors group-hover:bg-zinc-950/40",
										selectedIndex === index && "bg-transparent group-hover:bg-transparent",
									)}
								/>
								{isVideoUrl(image) ? (
									<video
										className="absolute inset-0 h-full w-full object-cover"
										src={image}
										muted
										playsInline
									/>
								) : (
									<YNSMedia src={image} alt="" fill sizes="72px" className="object-cover" />
								)}
							</button>
						))}
					</div>
					<button type="button" className={navButton} onClick={handleNext} aria-label="Next image">
						<ChevronRight aria-hidden="true" className="size-3 sm:size-4" />
					</button>
				</div>
			) : null}
		</section>
	);
}
