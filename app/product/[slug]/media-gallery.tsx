"use client";

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
		return <div className="aspect-[4/5] bg-surface" />;
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		<section aria-label={`${productName} images`} onKeyDown={handleKeyDown} className="outline-none">
			<div className="relative aspect-[4/5] overflow-hidden bg-surface">
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
						key={current}
						src={current}
						alt={`${productName} — view ${selectedIndex + 1} of ${displayImages.length}`}
						fill
						sizes="(max-width: 1024px) 100vw, 58vw"
						className="animate-in fade-in object-cover duration-500"
						priority
						fetchPriority="high"
					/>
				)}
			</div>

			{displayImages.length > 1 && (
				<ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
					{displayImages.map((image, index) => (
						<li key={`${image}-${index}`}>
							<button
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show view ${index + 1}`}
								aria-pressed={selectedIndex === index}
								className={cn(
									"relative block aspect-square w-full overflow-hidden bg-surface transition-shadow duration-300",
									"after:absolute after:inset-0 after:transition-shadow",
									selectedIndex === index
										? "after:shadow-[inset_0_0_0_2px_var(--walnut)]"
										: "after:shadow-[inset_0_0_0_1px_var(--border)] hover:after:shadow-[inset_0_0_0_1px_var(--line-strong)]",
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
										sizes="(max-width: 640px) 33vw, 15vw"
										className="object-cover"
									/>
								)}
							</button>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
