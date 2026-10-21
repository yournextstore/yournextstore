"use client";

import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
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
			<div className="flex aspect-[4/5] w-full items-center justify-center bg-secondary md:w-1/2">
				<ImageIcon className="size-9 text-muted-foreground" aria-hidden="true" />
				<span className="sr-only">No images available</span>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-roledescription="carousel"
			aria-label="Product image carousel"
			onKeyDown={handleKeyDown}
			className="flex w-full min-w-0 flex-col gap-2 outline-none md:sticky md:top-20 md:w-1/2 md:self-start"
		>
			<div
				className="relative aspect-square touch-pan-y overflow-hidden bg-secondary md:aspect-[4/5]"
				onTouchStart={(e) => {
					touchStartX.current = e.touches[0]?.clientX ?? null;
				}}
				onTouchEnd={(e) => {
					const start = touchStartX.current;
					const end = e.changedTouches[0]?.clientX;
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
						alt={`${productName}, image ${selectedIndex + 1} of ${displayImages.length}`}
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
						priority
					/>
				)}
			</div>

			{displayImages.length > 1 && (
				<div className="flex w-full items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						className="size-8 shrink-0 rounded-none"
						onClick={handlePrevious}
						aria-label="Previous slide"
					>
						<ChevronLeft className="size-4" aria-hidden="true" />
					</Button>
					<div className="flex min-w-0 flex-1 gap-2 overflow-x-auto p-0.5">
						{displayImages.map((image, index) => (
							<button
								key={`${image}-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Slide ${index + 1} of ${displayImages.length}`}
								aria-current={selectedIndex === index}
								className={cn(
									"group relative aspect-[4/5] w-14 shrink-0 overflow-hidden border border-input shadow-sm sm:w-[4.5rem]",
									selectedIndex === index && "ring-1 ring-foreground",
								)}
							>
								<span
									className={cn(
										"absolute inset-0 z-10 bg-zinc-950/20 transition-colors group-hover:bg-zinc-950/40",
										selectedIndex === index && "bg-transparent group-hover:bg-transparent",
									)}
									aria-hidden="true"
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
					<Button
						variant="outline"
						size="icon"
						className="size-8 shrink-0 rounded-none"
						onClick={handleNext}
						aria-label="Next slide"
					>
						<ChevronRight className="size-4" aria-hidden="true" />
					</Button>
				</div>
			)}
		</section>
	);
}
