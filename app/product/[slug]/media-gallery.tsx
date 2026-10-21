"use client";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
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
			<div className="grid aspect-square place-items-center rounded-frame bg-stage lg:aspect-[6/5]">
				<p className="text-muted-foreground">No images yet</p>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";
	const many = displayImages.length > 1;

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section aria-label="Product media gallery" onKeyDown={handleKeyDown} className="grid gap-3 outline-none">
			{/* The piece on its stage, inset on the sheet's colour, with a proof's trim marks at the corners. */}
			<figure className="group relative aspect-square overflow-hidden rounded-frame bg-stage lg:aspect-[6/5]">
				<div className="absolute inset-8 lg:inset-x-16 lg:inset-y-12">
					<div className={cn("relative size-full", isZoomed && "overflow-hidden")}>
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
								alt={
									many ? `${productName}, photo ${selectedIndex + 1} of ${displayImages.length}` : productName
								}
								fill
								sizes="(max-width: 1024px) 100vw, 55vw"
								className={cn(
									"object-cover transition-transform duration-300",
									isZoomed ? "scale-[1.8] cursor-zoom-out" : "cursor-zoom-in",
								)}
								onClick={() => setIsZoomed(!isZoomed)}
								priority
							/>
						)}
						<span aria-hidden="true" className="trim trim-tl" />
						<span aria-hidden="true" className="trim trim-tr" />
						<span aria-hidden="true" className="trim trim-bl" />
						<span aria-hidden="true" className="trim trim-br" />
					</div>
				</div>

				{!isVideoUrl(current) && (
					<button
						type="button"
						onClick={() => setIsZoomed(!isZoomed)}
						aria-pressed={isZoomed}
						aria-label="Inspect the detail"
						className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-background transition-colors hover:text-copper"
					>
						<ZoomIn aria-hidden="true" className="size-5" strokeWidth={1.75} />
					</button>
				)}

				{many && (
					<div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
						<button
							type="button"
							className="grid size-10 place-items-center rounded-full bg-background"
							onClick={handlePrevious}
							aria-label="Previous image"
						>
							<ChevronLeft aria-hidden="true" className="size-5" />
						</button>
						<button
							type="button"
							className="grid size-10 place-items-center rounded-full bg-background"
							onClick={handleNext}
							aria-label="Next image"
						>
							<ChevronRight aria-hidden="true" className="size-5" />
						</button>
					</div>
				)}

				<figcaption className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)]">
					<span className="block truncate rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold leading-normal tabular-nums">
						{many ? `Photo ${selectedIndex + 1} of ${displayImages.length}` : productName}
					</span>
				</figcaption>
			</figure>

			{many && (
				<ul className="flex gap-3 overflow-x-auto [scrollbar-width:none]">
					{displayImages.map((image, index) => (
						<li key={`${image}-${index}`} className="shrink-0">
							<button
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-pressed={selectedIndex === index}
								aria-label={`Photo ${index + 1}`}
								className={cn(
									"relative block size-[4.5rem] overflow-hidden rounded-control bg-stage p-2 shadow-[inset_0_0_0_1px_var(--border)]",
									selectedIndex === index && "p-[0.3125rem] shadow-[inset_0_0_0_2px_var(--copper)]",
								)}
							>
								<span className="relative block size-full overflow-hidden rounded-[6px]">
									{isVideoUrl(image) ? (
										<video
											className="absolute inset-0 size-full object-cover"
											src={image}
											muted
											playsInline
										/>
									) : (
										<YNSMedia src={image} alt="" fill sizes="72px" className="object-cover" />
									)}
								</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
