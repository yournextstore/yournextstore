"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { Tag } from "@/components/munch/tag";
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
	/** The category name the original prints as a tag over the photo. */
	tag?: string | null;
};

export function MediaGallery({ images, productName, variants, tag }: MediaGalleryProps) {
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
			<div className="w-full px-m lg:sticky lg:top-[calc(var(--header-h)+48px)] lg:max-w-171 lg:px-0">
				<div className="flex aspect-square items-center justify-center rounded-2xl bg-[#f4ebdb]">
					<p className="text-b-sm">No images available</p>
				</div>
			</div>
		);
	}

	const single = displayImages.length === 1;

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="flex w-full min-w-0 gap-2 outline-none lg:sticky lg:top-[calc(var(--header-h)+48px)] lg:max-w-171 lg:self-start"
		>
			{!single && (
				<div className="hidden w-21.25 shrink-0 flex-col gap-2 lg:flex">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1} of ${displayImages.length}`}
							aria-current={selectedIndex === index}
							className={cn(
								"relative size-21.25 overflow-hidden rounded-lg transition-opacity",
								selectedIndex === index ? "ring-[1.5px] ring-brand" : "opacity-70 hover:opacity-100",
							)}
						>
							{isVideoUrl(image) ? (
								<video className="absolute inset-0 size-full object-cover" src={image} muted playsInline />
							) : (
								<YNSMedia src={image} alt="" fill sizes="85px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			)}
			{/* Phones swipe through every photo; from lg only the selected one shows beside the thumbnails. */}
			<div className="no-scrollbar mt-1 flex w-full min-w-0 snap-x snap-mandatory scroll-px-m gap-xs overflow-x-auto px-m lg:mt-0 lg:overflow-visible lg:px-0">
				{displayImages.map((image, index) => (
					<div
						key={`${image}-${index}`}
						className={cn(
							"relative aspect-square shrink-0 snap-center overflow-hidden rounded-2xl bg-[#f4ebdb]",
							single ? "w-full" : "w-[86vw] lg:w-full",
							index !== selectedIndex && "lg:hidden",
						)}
					>
						{isVideoUrl(image) ? (
							<video
								className="absolute inset-0 size-full object-cover"
								src={image}
								muted
								loop
								autoPlay
								playsInline
								controls
							/>
						) : (
							<YNSMedia
								src={image}
								alt={index === 0 ? productName : `${productName}, view ${index + 1}`}
								fill
								sizes="(max-width: 1024px) 86vw, 600px"
								className="object-cover object-bottom"
								priority={index === 0}
								fetchPriority={index === 0 ? "high" : undefined}
							/>
						)}
						{tag && <Tag text={tag} className="absolute top-4 right-4 max-w-[70%]" />}
					</div>
				))}
			</div>
		</section>
	);
}
