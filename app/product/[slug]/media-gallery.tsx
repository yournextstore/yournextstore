"use client";

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

	if (displayImages.length === 0) {
		return <div className="aspect-square bg-photon-wash" />;
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the thumbnail buttons inside.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="grid w-full gap-[var(--main-gap)] outline-none"
		>
			{/* Photon shows the whole photograph: contained in a square, never cropped. */}
			<div className="relative aspect-square w-full">
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
						alt={`${productName}, view ${selectedIndex + 1}`}
						fill
						sizes="(max-width: 480px) 100vw, 50vw"
						className="object-contain"
						priority
					/>
				)}
			</div>

			{displayImages.length > 1 && (
				<div className="flex flex-wrap gap-[var(--main-gap)]">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index ? "true" : undefined}
							className={cn(
								"relative aspect-square w-[calc(25%-0.5rem)] cursor-pointer border-2",
								selectedIndex === index ? "border-black" : "border-transparent opacity-70 hover:opacity-100",
							)}
						>
							{isVideoUrl(image) ? (
								<video
									className="absolute inset-0 h-full w-full object-contain"
									src={image}
									muted
									playsInline
								/>
							) : (
								<YNSMedia src={image} alt="" fill sizes="25vw" className="object-contain" />
							)}
						</button>
					))}
				</div>
			)}
		</section>
	);
}
