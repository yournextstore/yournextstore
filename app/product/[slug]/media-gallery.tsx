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
			<div className="sheet-panel flex aspect-[5/4] items-center justify-center lg:sticky lg:top-24 lg:self-start">
				<p className="mono text-[0.75rem] text-faint">no photograph on file</p>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="flex min-w-0 flex-col gap-4 outline-none lg:sticky lg:top-24 lg:self-start"
		>
			{/* The photograph pasted onto a ruled sheet, two strips of tape holding it down. */}
			<div className="sheet-panel group p-[clamp(1rem,4%,2rem)]">
				<span className="margin-line" aria-hidden="true" />
				<div className="pasted -rotate-[0.8deg]">
					<div className="relative aspect-[4/3] overflow-hidden bg-kraft-2">
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
								alt={`${productName} — image ${selectedIndex + 1}`}
								fill
								sizes="(max-width: 1024px) 100vw, 560px"
								className={cn(
									"object-cover transition-transform duration-500",
									isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in",
								)}
								onClick={() => setIsZoomed(!isZoomed)}
								priority
							/>
						)}
					</div>
				</div>
				<p className="mono mt-4 flex justify-between gap-4 text-[0.68rem] text-faint">
					<span className="min-w-0 truncate">
						fig. {selectedIndex + 1} — {productName.toLowerCase()}
					</span>
					{displayImages.length > 1 && (
						<span>
							{selectedIndex + 1} / {displayImages.length}
						</span>
					)}
				</p>
				{displayImages.length > 1 && (
					<div className="absolute inset-x-3 top-[45%] flex -translate-y-1/2 justify-between opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
						<button
							type="button"
							className="icon-btn bg-sheet"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
							aria-label="Previous image"
						>
							<ChevronLeft className="size-4" aria-hidden="true" />
						</button>
						<button
							type="button"
							className="icon-btn bg-sheet"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							aria-label="Next image"
						>
							<ChevronRight className="size-4" aria-hidden="true" />
						</button>
					</div>
				)}
			</div>

			{displayImages.length > 1 && (
				<div className="no-scrollbar -m-1 flex min-w-0 gap-2.5 overflow-x-auto p-1">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"relative aspect-square w-16 shrink-0 overflow-hidden rounded-md border bg-sheet p-1 transition-all duration-200",
								selectedIndex === index ? "border-ink" : "border-line opacity-70 hover:opacity-100",
							)}
						>
							<span className="relative block size-full overflow-hidden">
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
							</span>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
