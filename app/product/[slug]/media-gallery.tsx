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
			<div className="flex aspect-square items-center justify-center rounded-[13px] bg-tile sm:rounded-[20px]">
				<p className="text-muted-foreground">No images available</p>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";

	return (
		// The original's layout: thumbnails in a column beside the photo on desktop, in a row under it on phones.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="flex flex-col gap-3 outline-none lg:grid lg:grid-cols-[111px_minmax(0,1fr)] lg:gap-3.5 xl:grid-cols-[152px_minmax(0,1fr)]"
		>
			<div className="group relative aspect-square overflow-hidden rounded-[13px] bg-tile sm:rounded-[20px] lg:order-2 lg:aspect-[444/530]">
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
						alt={`${productName} - View ${selectedIndex + 1}`}
						fill
						sizes="(max-width: 768px) 100vw, 40vw"
						className={cn(
							"object-cover transition-transform duration-500",
							isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in",
						)}
						onClick={() => setIsZoomed(!isZoomed)}
						priority
						fetchPriority="high"
					/>
				)}
				{displayImages.length > 1 && (
					<div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
						<button
							type="button"
							className="flex size-10 items-center justify-center rounded-full bg-white/90 shadow-md"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
							aria-label="Previous image"
						>
							<ChevronLeft className="size-5" />
						</button>
						<button
							type="button"
							className="flex size-10 items-center justify-center rounded-full bg-white/90 shadow-md"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							aria-label="Next image"
						>
							<ChevronRight className="size-5" />
						</button>
					</div>
				)}
			</div>

			{displayImages.length > 1 && (
				<div className="relative lg:order-1">
					<ul className="no-scrollbar flex gap-3 overflow-x-auto lg:absolute lg:inset-0 lg:flex-col lg:gap-3.5 lg:overflow-y-auto lg:overflow-x-hidden">
						{displayImages.map((image, index) => (
							<li key={`${image}-${index}`} className="shrink-0">
								<button
									type="button"
									onClick={() => setSelectedIndex(index)}
									aria-label={`Show image ${index + 1}`}
									aria-current={selectedIndex === index}
									className={cn(
										"relative block aspect-[111/106] w-[calc((100vw-3.5rem)/3)] max-w-[111px] overflow-hidden rounded-[13px] border bg-tile transition-colors lg:aspect-[152/167] lg:w-full lg:max-w-none xl:rounded-[20px]",
										selectedIndex === index ? "border-black" : "border-transparent hover:border-black/20",
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
										<YNSMedia src={image} alt="" fill sizes="152px" className="object-cover" />
									)}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</section>
	);
}
