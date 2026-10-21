"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { BookCover } from "@/components/book-cover";
import { cn } from "@/lib/utils";

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

	const wrapperClass = "mx-auto w-full max-w-[20rem] md:w-2/5 md:max-w-none md:shrink-0 md:self-start";

	if (displayImages.length === 0) {
		return (
			<div className={wrapperClass}>
				<div className="flex h-88 items-center justify-center rounded bg-muted p-8 md:h-96 lg:p-16 xl:h-[28rem]">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section aria-label="Product media gallery" onKeyDown={handleKeyDown} className={wrapperClass}>
			{/* Original image wrapper: muted panel, the cover grows a little on hover. */}
			<div className="relative rounded bg-muted p-8 lg:p-16">
				<div className="flex h-72 justify-center transition-transform duration-500 hover:scale-110 md:h-80 xl:h-96">
					<BookCover
						key={current}
						src={current}
						alt={`${productName} - View ${selectedIndex + 1}`}
						priority
						sizes="(min-width: 1280px) 256px, (min-width: 768px) 214px, 192px"
					/>
				</div>
				{displayImages.length > 1 && (
					<>
						<button
							type="button"
							onClick={handlePrevious}
							aria-label="Previous image"
							className="absolute top-1/2 left-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow hover:bg-background"
						>
							<ChevronLeft aria-hidden="true" className="h-5 w-5" />
						</button>
						<button
							type="button"
							onClick={handleNext}
							aria-label="Next image"
							className="absolute top-1/2 right-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow hover:bg-background"
						>
							<ChevronRight aria-hidden="true" className="h-5 w-5" />
						</button>
						<p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs tabular-nums">
							{selectedIndex + 1} / {displayImages.length}
						</p>
					</>
				)}
			</div>

			{displayImages.length > 1 && displayImages.length <= 12 && (
				<div className="mt-3 flex gap-3 overflow-x-auto p-1">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"flex h-20 w-16 shrink-0 items-center justify-center rounded bg-muted p-1.5 transition-opacity",
								selectedIndex === index ? "ring-2 ring-mint" : "opacity-70 hover:opacity-100",
							)}
						>
							<BookCover src={image} alt="" sizes="48px" />
						</button>
					))}
				</div>
			)}
		</section>
	);
}
