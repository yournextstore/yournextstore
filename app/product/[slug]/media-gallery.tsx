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
			<div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
				<div className="flex aspect-square items-center justify-center rounded-md border border-line bg-foam sm:aspect-[4/5]">
					<p className="label-mono text-faint">no photograph yet</p>
				</div>
			</div>
		);
	}

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="flex min-w-0 flex-col gap-5 outline-none lg:sticky lg:top-24 lg:self-start"
		>
			{/* The main photograph, pinned like the hero's poster: foam border, a touch off true. */}
			<div className="-rotate-[0.6deg] rounded-md border border-line bg-foam p-[clamp(8px,1.2vw,14px)] shadow-poster">
				<div className="group relative aspect-square min-w-0 overflow-hidden rounded-[2px] bg-muted sm:aspect-[4/5]">
					{isVideoUrl(displayImages[selectedIndex] ?? "") ? (
						<video
							className="absolute inset-0 h-full w-full object-cover"
							src={displayImages[selectedIndex]}
							muted
							loop
							autoPlay
							playsInline
							controls
						/>
					) : (
						<YNSMedia
							src={displayImages[selectedIndex] ?? ""}
							alt={`${productName} — image ${selectedIndex + 1}`}
							fill
							sizes="(max-width: 1024px) 100vw, 600px"
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
						<>
							<span className="label-mono absolute bottom-3 left-3 rounded-full bg-foam/95 px-2.5 py-1 text-ink tabular-nums">
								{String(selectedIndex + 1).padStart(2, "0")} / {String(displayImages.length).padStart(2, "0")}
							</span>
							<div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
								<button
									type="button"
									className="inline-flex size-10 items-center justify-center rounded-full border-[1.5px] border-ink bg-foam text-ink transition-colors hover:bg-ink hover:text-foam"
									onClick={(e) => {
										e.stopPropagation();
										handlePrevious();
									}}
									aria-label="Previous image"
								>
									<ChevronLeft className="size-5" aria-hidden="true" />
								</button>
								<button
									type="button"
									className="inline-flex size-10 items-center justify-center rounded-full border-[1.5px] border-ink bg-foam text-ink transition-colors hover:bg-ink hover:text-foam"
									onClick={(e) => {
										e.stopPropagation();
										handleNext();
									}}
									aria-label="Next image"
								>
									<ChevronRight className="size-5" aria-hidden="true" />
								</button>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Contact sheet: a sideways row of small prints underneath. */}
			{displayImages.length > 1 && (
				<div className="no-scrollbar -mx-1 flex min-w-0 gap-2.5 overflow-x-auto px-1 py-1.5">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"relative aspect-[4/5] w-[60px] shrink-0 overflow-hidden rounded-[3px] border-[3px] border-foam bg-muted shadow-card transition-all duration-200",
								selectedIndex === index
									? "outline-2 outline-offset-1 outline-denim-deep"
									: "opacity-75 hover:opacity-100",
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
								<YNSMedia src={image} alt="" fill sizes="60px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			)}
		</section>
	);
}
