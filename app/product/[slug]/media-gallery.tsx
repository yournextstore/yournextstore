"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
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

	const current = displayImages[selectedIndex] ?? "";
	const arrowClass =
		"flex h-full items-center justify-center px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section aria-label="Product images" onKeyDown={handleKeyDown} className="outline-none">
			<div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
				{current ? (
					isVideoUrl(current) ? (
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
							alt={`${productName}, image ${selectedIndex + 1} of ${displayImages.length}`}
							fill
							sizes="(min-width: 1024px) 66vw, 100vw"
							className="h-full w-full object-contain"
							priority
						/>
					)
				) : (
					<div className="flex h-full items-center justify-center text-muted-foreground">
						No images available
					</div>
				)}
				{displayImages.length > 1 ? (
					<div className="absolute bottom-[15%] flex w-full justify-center">
						<div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-600 backdrop-blur-sm dark:border-black dark:bg-neutral-900/80 dark:text-neutral-300">
							<button
								type="button"
								onClick={handlePrevious}
								aria-label="Previous product image"
								className={arrowClass}
							>
								<ArrowLeft className="h-5 w-5" aria-hidden="true" />
							</button>
							<div className="mx-1 h-6 w-px bg-neutral-500" />
							<button
								type="button"
								onClick={handleNext}
								aria-label="Next product image"
								className={arrowClass}
							>
								<ArrowRight className="h-5 w-5" aria-hidden="true" />
							</button>
						</div>
					</div>
				) : null}
			</div>

			{displayImages.length > 1 ? (
				<ul className="my-12 flex flex-wrap items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
					{displayImages.map((image, index) => {
						const isActive = index === selectedIndex;
						return (
							<li key={`${image}-${index}`} className="h-20 w-20">
								<button
									type="button"
									onClick={() => setSelectedIndex(index)}
									aria-label={`Show image ${index + 1}`}
									aria-current={isActive ? "true" : undefined}
									className={cn(
										"relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white hover:border-blue-600 dark:bg-black",
										isActive
											? "border-2 border-blue-600"
											: "border border-neutral-200 dark:border-neutral-800",
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
										<YNSMedia src={image} alt="" fill sizes="80px" className="object-cover" />
									)}
								</button>
							</li>
						);
					})}
				</ul>
			) : null}
		</section>
	);
}
