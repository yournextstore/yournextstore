"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
			<div className="mx-auto flex aspect-[3/4] w-full max-w-md items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
				<p className="text-muted-foreground">No images available</p>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section aria-label="Product media gallery" onKeyDown={handleKeyDown} className="w-full outline-none">
			<div className="group relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
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
						sizes="(max-width: 640px) 100vw, 448px"
						className="object-contain"
						priority
						fetchPriority="high"
					/>
				)}

				{displayImages.length > 1 && (
					<div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
						<Button
							variant="secondary"
							size="icon"
							className="size-10 rounded-full bg-background/90 shadow-sm hover:bg-background"
							onClick={handlePrevious}
							aria-label="Previous image"
						>
							<ChevronLeft className="size-5" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="size-10 rounded-full bg-background/90 shadow-sm hover:bg-background"
							onClick={handleNext}
							aria-label="Next image"
						>
							<ChevronRight className="size-5" />
						</Button>
					</div>
				)}
			</div>

			{/* Mobile: pill dots (a counter when the gallery is long). */}
			{displayImages.length > 1 &&
				(displayImages.length > 8 ? (
					<p className="mt-4 text-center text-sm text-muted-foreground sm:hidden">
						{selectedIndex + 1} / {displayImages.length}
					</p>
				) : (
					<div className="mt-3 flex justify-center gap-1 sm:hidden">
						{displayImages.map((image, index) => (
							<button
								key={`${image}-dot-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show image ${index + 1}`}
								aria-current={selectedIndex === index}
								className="flex h-6 min-w-6 items-center justify-center"
							>
								<span
									aria-hidden="true"
									className={cn(
										"h-2.5 rounded-full transition-all",
										selectedIndex === index
											? "w-7 bg-foreground"
											: "w-2.5 bg-neutral-300 dark:bg-neutral-700",
									)}
								/>
							</button>
						))}
					</div>
				))}

			{/* Desktop: five-up thumbnail grid. */}
			{displayImages.length > 1 && (
				<div className="mx-auto mt-4 hidden max-w-md grid-cols-5 gap-3 sm:grid">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"group/thumb relative aspect-[3/4] overflow-hidden rounded-lg border-2 bg-neutral-100 transition dark:bg-neutral-900",
								selectedIndex === index
									? "border-foreground opacity-100 shadow-[0_0_0_2px_color-mix(in_oklab,var(--foreground)_25%,transparent)]"
									: "border-transparent opacity-70 hover:opacity-100",
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
								<YNSMedia
									src={image}
									alt=""
									fill
									sizes="88px"
									className="object-cover transition-transform duration-300 group-hover/thumb:scale-105"
								/>
							)}
						</button>
					))}
				</div>
			)}
		</section>
	);
}
