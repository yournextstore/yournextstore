"use client";

import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
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

	const share = async () => {
		const url = window.location.href;
		if (navigator.share) {
			await navigator.share({ title: productName, url }).catch(() => {});
			return;
		}
		await navigator.clipboard?.writeText(url).catch(() => {});
		toast.success("Link copied");
	};

	if (displayImages.length === 0) {
		return (
			<div className="lg:sticky lg:top-20 lg:self-start">
				<div className="flex aspect-[3/4] items-center justify-center rounded-lg border border-border bg-card">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	const current = displayImages[selectedIndex] ?? "";
	const many = displayImages.length > 1;

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="min-w-0 outline-none lg:sticky lg:top-20 lg:grid lg:grid-cols-[88px_minmax(0,1fr)] lg:gap-5 lg:self-start xl:grid-cols-[96px_minmax(0,1fr)]"
		>
			{/* Thumbnail rail (desktop): a column of framed squares, the active one outlined in ink. */}
			{many && (
				<div className="hidden max-h-[min(80vh,700px)] flex-col gap-2 overflow-y-auto p-px lg:flex">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"relative aspect-square w-full shrink-0 overflow-hidden rounded-lg border bg-card transition-colors",
								selectedIndex === index ? "border-foreground" : "border-border hover:border-border-strong",
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
								<YNSMedia src={image} alt="" fill sizes="96px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			)}

			<div className={cn("relative -mx-[clamp(20px,5vw,48px)] sm:mx-0", !many && "lg:col-span-2")}>
				<div className="relative aspect-square overflow-hidden bg-card sm:aspect-[3/4] sm:rounded-lg">
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
							alt={`${productName} — image ${selectedIndex + 1} of ${displayImages.length}`}
							fill
							sizes="(min-width: 1024px) 42vw, 100vw"
							className="object-cover"
							priority
						/>
					)}
				</div>

				<button
					type="button"
					onClick={share}
					className="absolute top-3 right-3 inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-3.5 text-sm font-medium text-foreground shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-colors hover:bg-muted lg:top-2 lg:right-2"
				>
					<Share2 className="h-4 w-4" aria-hidden />
					<span className="hidden sm:inline">Share</span>
					<span className="sr-only sm:hidden">Share</span>
				</button>

				{many && (
					<>
						<button
							type="button"
							onClick={handlePrevious}
							aria-label="Previous image"
							className="absolute top-1/2 left-3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-colors hover:bg-muted sm:flex"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={handleNext}
							aria-label="Next image"
							className="absolute top-1/2 right-3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-colors hover:bg-muted sm:flex"
						>
							<ChevronRight className="h-4 w-4" />
						</button>

						{/* Phones: pill dots like the original's slider, or a counter for long galleries. */}
						<div className="mt-2 flex items-center justify-center gap-1 sm:hidden">
							{displayImages.length <= 8 ? (
								displayImages.map((image, index) => (
									<button
										key={`dot-${image}-${index}`}
										type="button"
										onClick={() => setSelectedIndex(index)}
										aria-label={`Show image ${index + 1}`}
										aria-current={selectedIndex === index}
										className="grid h-6 w-6 place-items-center"
									>
										<span
											className={cn(
												"block h-1.5 rounded-full transition-all",
												selectedIndex === index ? "w-5 bg-foreground" : "w-1.5 bg-border-strong",
											)}
										/>
									</button>
								))
							) : (
								<div className="flex items-center gap-3">
									<button
										type="button"
										onClick={handlePrevious}
										aria-label="Previous image"
										className="grid h-9 w-9 place-items-center rounded-full border border-border"
									>
										<ChevronLeft className="h-4 w-4" />
									</button>
									<span className="text-xs font-medium tabular-nums text-muted-foreground">
										{selectedIndex + 1} / {displayImages.length}
									</span>
									<button
										type="button"
										onClick={handleNext}
										aria-label="Next image"
										className="grid h-9 w-9 place-items-center rounded-full border border-border"
									>
										<ChevronRight className="h-4 w-4" />
									</button>
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</section>
	);
}
