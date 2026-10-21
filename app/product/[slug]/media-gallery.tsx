"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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

	const pad = (value: number) => String(value).padStart(2, "0");
	const current = displayImages[selectedIndex] ?? "";

	if (displayImages.length === 0) {
		return (
			<div className="hatch flex aspect-[2/3] items-end border border-line p-3.5">
				<span className="plate-label">no photograph on file</span>
			</div>
		);
	}

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-roledescription="carousel"
			aria-label="Photographs"
			onKeyDown={handleKeyDown}
			className="grid grid-cols-1 gap-3 outline-none md:sticky md:top-24 md:self-start"
		>
			<div className="hatch group relative flex aspect-[2/3] min-w-0 items-end overflow-hidden border border-line p-3.5">
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
						alt={`${productName}, photograph ${selectedIndex + 1} of ${displayImages.length}`}
						fill
						sizes="(max-width: 768px) 100vw, 500px"
						className="object-cover"
						priority
					/>
				)}
				<span className="plate-label relative">
					plate {pad(selectedIndex + 1)} / {pad(displayImages.length)}
				</span>
				{displayImages.length > 1 ? (
					<span className="absolute bottom-3 right-3 flex gap-1.5">
						<button
							type="button"
							onClick={handlePrevious}
							aria-label="Previous photograph"
							className="pin-btn !size-8"
						>
							<ChevronLeft aria-hidden className="size-4" strokeWidth={1.5} />
						</button>
						<button
							type="button"
							onClick={handleNext}
							aria-label="Next photograph"
							className="pin-btn !size-8"
						>
							<ChevronRight aria-hidden className="size-4" strokeWidth={1.5} />
						</button>
					</span>
				) : null}
			</div>

			{displayImages.length > 1 ? (
				<div className="no-scrollbar -mx-4 flex min-w-0 gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show photograph ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"hatch relative aspect-[2/3] w-[52px] shrink-0 cursor-pointer overflow-hidden border transition",
								selectedIndex === index ? "border-acc" : "border-line opacity-70 hover:opacity-100",
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
								<YNSMedia src={image} alt="" fill sizes="52px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			) : null}
		</section>
	);
}
