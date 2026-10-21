"use client";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
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
			<div className="flex aspect-square w-full flex-1 items-center justify-center bg-secondary lg:sticky lg:top-36 lg:aspect-auto lg:h-[620px]">
				<p className="text-muted-foreground">No images available</p>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		// The original's layout: a 60px column of thumbnails beside one tall photograph.
		<section
			aria-roledescription="carousel"
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="flex w-full min-w-0 flex-1 flex-col-reverse gap-4 outline-none lg:sticky lg:top-36 lg:h-[620px] lg:flex-row lg:items-start"
		>
			{displayImages.length > 1 && (
				<div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:w-[60px] lg:shrink-0 lg:grid-cols-1 lg:gap-4 lg:overflow-visible lg:pb-0">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"relative aspect-square w-[60px] shrink-0 overflow-hidden border bg-secondary transition-all hover:brightness-75",
								selectedIndex === index ? "border-primary brightness-75" : "border-border/40",
							)}
						>
							{isVideoUrl(image) ? (
								<video className="absolute inset-0 size-full object-cover" src={image} muted playsInline />
							) : (
								<YNSMedia src={image} alt="" fill sizes="60px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			)}

			<div className="group relative aspect-square w-full overflow-hidden bg-secondary lg:aspect-auto lg:size-full lg:flex-1">
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
						sizes="(max-width: 1024px) 100vw, 55vw"
						className={cn(
							// Square studio shots in the tall desktop frame: contained and multiplied into the
							// panel, so the photo's own backdrop melts into it instead of being cropped.
							"object-cover object-center transition-transform duration-500 lg:object-contain lg:mix-blend-multiply lg:brightness-110 lg:contrast-[1.06] lg:[mask-image:radial-gradient(circle_closest-side,#000_80%,transparent)]",
							isZoomed && "scale-150 cursor-zoom-out",
						)}
						onClick={() => setIsZoomed(!isZoomed)}
						priority
						fetchPriority="high"
					/>
				)}

				{!isVideoUrl(current) && (
					<button
						type="button"
						onClick={() => setIsZoomed(!isZoomed)}
						aria-label={isZoomed ? "Zoom out" : "Zoom in"}
						aria-pressed={isZoomed}
						className="absolute top-4 right-4 flex size-12 items-center justify-center rounded-full bg-background text-primary transition-colors duration-300 hover:bg-primary hover:text-background"
					>
						<ZoomIn className="size-6" strokeWidth={1.5} />
					</button>
				)}

				{displayImages.length > 1 && (
					<div className="absolute inset-x-4 bottom-4 flex justify-between lg:hidden">
						<Button
							variant="secondary"
							size="icon"
							className="size-10 rounded-full bg-background shadow-md hover:bg-background"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
							aria-label="Previous image"
						>
							<ChevronLeft className="size-5" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="size-10 rounded-full bg-background shadow-md hover:bg-background"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							aria-label="Next image"
						>
							<ChevronRight className="size-5" />
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
