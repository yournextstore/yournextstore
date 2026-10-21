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
		return <div className="aspect-[4/5] rounded-lg bg-[#e9e2d6]" />;
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		// The original's layout: a column of thumbnails beside one tall photo (thumbnails below on phones).
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="grid gap-4 outline-none md:grid-cols-8 lg:gap-6"
		>
			<div className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-[#e9e2d6] md:order-2 md:col-span-6">
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
						sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, (min-width: 768px) 70vw, calc(100vw - 48px)"
						className="object-cover"
						priority
						fetchPriority="high"
					/>
				)}

				{displayImages.length > 1 && (
					<div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-lg bg-white/90 shadow hover:bg-white"
							onClick={handlePrevious}
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-lg bg-white/90 shadow hover:bg-white"
							onClick={handleNext}
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>
				)}
			</div>

			{displayImages.length > 1 && (
				<div className="md:relative md:order-1 md:col-span-2">
					<div className="grid grid-cols-4 gap-4 md:absolute md:inset-0 md:flex md:flex-col md:gap-6 md:overflow-y-auto">
						{displayImages.map((image, index) => (
							<button
								key={`${image}-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show image ${index + 1}`}
								aria-current={selectedIndex === index}
								className={cn(
									"relative aspect-[4/5] shrink-0 overflow-hidden rounded-lg bg-[#e9e2d6] transition md:w-full",
									selectedIndex === index ? "opacity-100" : "opacity-60 hover:opacity-100",
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
										sizes="(min-width: 768px) 160px, 22vw"
										className="object-cover"
									/>
								)}
							</button>
						))}
					</div>
				</div>
			)}
		</section>
	);
}
