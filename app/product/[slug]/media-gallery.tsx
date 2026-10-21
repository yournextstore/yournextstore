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
			<div className="flex aspect-[4/5] items-center justify-center rounded-lg bg-secondary lg:sticky lg:top-28 lg:self-start">
				<p className="text-muted-foreground">No images available</p>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";
	const arrow =
		"flex h-10 w-10 items-center justify-center rounded-full bg-card/95 text-foreground shadow-md transition-colors hover:bg-card";

	return (
		// The original's gallery: a column of thumbnails beside a rounded main photo with round
		// arrows and a "1 / N" pill; on phones the thumbnails run underneath.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="flex min-w-0 flex-col gap-3 outline-none lg:sticky lg:top-28 lg:grid lg:grid-cols-[84px_minmax(0,1fr)] lg:gap-4 lg:self-start"
		>
			{displayImages.length > 1 && (
				<div className="relative order-2 lg:order-1">
					<ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-0 lg:absolute lg:inset-0 lg:flex-col lg:gap-3 lg:overflow-y-auto lg:px-1 lg:py-1">
						{displayImages.map((image, index) => (
							<li key={`${image}-${index}`} className="shrink-0">
								<button
									type="button"
									onClick={() => setSelectedIndex(index)}
									aria-label={`Show image ${index + 1}`}
									aria-current={selectedIndex === index}
									className={cn(
										"relative block aspect-[4/5] w-16 overflow-hidden rounded-md border-2 transition-all lg:w-full",
										selectedIndex === index
											? "border-foreground"
											: "border-transparent opacity-80 hover:opacity-100",
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
										<YNSMedia src={image} alt="" fill sizes="84px" className="object-cover" />
									)}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			<div
				className={cn(
					"relative order-1 aspect-[4/5] overflow-hidden rounded-lg bg-secondary lg:order-2",
					displayImages.length <= 1 && "lg:col-span-2",
				)}
			>
				{isVideoUrl(current) ? (
					<video
						className="absolute inset-0 h-full w-full object-cover"
						src={current}
						muted
						loop
						autoPlay
						playsInline
					/>
				) : (
					<YNSMedia
						src={current}
						alt={`${productName}, image ${selectedIndex + 1}`}
						fill
						sizes="(min-width: 1024px) 45vw, 100vw"
						className="object-cover"
						priority
						fetchPriority="high"
					/>
				)}

				{displayImages.length > 1 && (
					<>
						<div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
							<button type="button" onClick={handlePrevious} aria-label="Previous image" className={arrow}>
								<ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
							</button>
							<button type="button" onClick={handleNext} aria-label="Next image" className={arrow}>
								<ChevronRight className="h-5 w-5" strokeWidth={1.5} />
							</button>
						</div>
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-card/90 px-3 py-1 text-sm tabular-nums">
							{selectedIndex + 1} / {displayImages.length}
						</div>
					</>
				)}
			</div>
		</section>
	);
}
