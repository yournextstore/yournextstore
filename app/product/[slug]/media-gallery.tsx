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
			<div className="flex aspect-[4/3] items-center justify-center bg-card">
				<p className="text-muted-foreground">No images available</p>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-roledescription="carousel"
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="p-5 outline-none"
		>
			<div className="group relative aspect-square sm:aspect-[4/3]">
				{isVideoUrl(current) ? (
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
						sizes="(max-width: 1024px) 100vw, 760px"
						className="object-contain"
						priority
						fetchPriority="high"
					/>
				)}
				{displayImages.length > 1 && (
					<>
						<button
							type="button"
							onClick={handlePrevious}
							aria-label="Previous image"
							className="absolute top-1/2 left-0 flex size-10 -translate-y-1/2 items-center justify-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:text-foreground"
						>
							<ChevronLeft aria-hidden className="size-6" strokeWidth={1.25} />
						</button>
						<button
							type="button"
							onClick={handleNext}
							aria-label="Next image"
							className="absolute top-1/2 right-0 flex size-10 -translate-y-1/2 items-center justify-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:text-foreground"
						>
							<ChevronRight aria-hidden className="size-6" strokeWidth={1.25} />
						</button>
					</>
				)}
			</div>

			{displayImages.length > 1 && (
				<ul className="mt-5 flex justify-center gap-[10px] overflow-x-auto px-[2px] py-[2px]">
					{displayImages.map((image, index) => (
						<li key={`${image}-${index}`} className="shrink-0">
							<button
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show image ${index + 1}`}
								aria-current={selectedIndex === index}
								className={cn(
									"relative block h-[60px] w-20 overflow-hidden rounded-[4px] border bg-card p-[5px] transition-colors",
									selectedIndex === index ? "border-primary" : "border-border hover:border-[#b2b2b2]",
								)}
							>
								{isVideoUrl(image) ? (
									<video className="h-full w-full object-contain" src={image} muted playsInline />
								) : (
									<span className="relative block h-full w-full">
										<YNSMedia src={image} alt="" fill sizes="80px" className="object-contain" />
									</span>
								)}
							</button>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
