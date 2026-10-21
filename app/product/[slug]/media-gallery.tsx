"use client";

import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
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
	const [isZoomed, setIsZoomed] = useState(false);

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

	const touchStart = useRef<{ x: number; y: number } | null>(null);
	const swiped = useRef(false);

	if (displayImages.length === 0) {
		return <div className="aspect-square rounded-xl bg-gray-100" aria-hidden />;
	}

	const current = displayImages[selectedIndex] ?? "";
	const currentIsVideo = isVideoUrl(current);

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="flex min-w-0 flex-col gap-4"
		>
			{currentIsVideo ? (
				<div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
					<video
						className="absolute inset-0 h-full w-full object-cover"
						src={current}
						muted
						loop
						autoPlay
						playsInline
						controls
					/>
				</div>
			) : (
				<button
					type="button"
					aria-label={`Click to zoom, ${productName}`}
					className="relative aspect-square w-full cursor-zoom-in touch-pan-y overflow-hidden rounded-xl bg-gray-100"
					onClick={() => {
						if (swiped.current) {
							swiped.current = false;
							return;
						}
						setIsZoomed(true);
					}}
					onTouchStart={(e) => {
						const t = e.touches[0];
						if (t) touchStart.current = { x: t.clientX, y: t.clientY };
						swiped.current = false;
					}}
					onTouchEnd={(e) => {
						const start = touchStart.current;
						const t = e.changedTouches[0];
						touchStart.current = null;
						if (!start || !t || displayImages.length <= 1) return;
						const dx = t.clientX - start.x;
						if (Math.abs(dx) < 50 || Math.abs(t.clientY - start.y) > 75) return;
						swiped.current = true;
						if (dx < 0) handleNext();
						else handlePrevious();
					}}
				>
					<YNSMedia
						src={current}
						alt={`${productName}, view ${selectedIndex + 1}`}
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
						priority
					/>
					<span className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5 text-sm text-gray-700 backdrop-blur-sm">
						<ZoomIn className="size-4" aria-hidden />
						Click to zoom
					</span>
				</button>
			)}

			{displayImages.length > 1 && (
				<div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"relative size-20 shrink-0 overflow-hidden rounded-xl border-2 bg-gray-100 transition-colors",
								selectedIndex === index ? "border-gray-600" : "border-transparent hover:border-gray-300",
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
								<YNSMedia src={image} alt="" fill sizes="80px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			)}

			<Dialog open={isZoomed} onOpenChange={setIsZoomed}>
				<DialogContent
					showCloseButton={false}
					className="flex h-[100svh] max-h-none w-screen max-w-none items-center justify-center rounded-none border-0 bg-black/90 p-0 shadow-none sm:max-w-none"
				>
					<DialogTitle className="sr-only">{productName}</DialogTitle>
					<DialogDescription className="sr-only">Zoomed product image</DialogDescription>
					<div className="relative h-full w-full">
						<YNSMedia
							src={current}
							alt={productName}
							fill
							sizes="100vw"
							className="object-contain p-4 sm:p-12"
						/>
					</div>
					<DialogClose asChild>
						<Button
							variant="ghost"
							size="icon-lg"
							aria-label="Close zoom"
							className="absolute top-4 right-4 text-white hover:bg-white/10 hover:text-white"
						>
							<X className="size-6" aria-hidden />
						</Button>
					</DialogClose>
					{displayImages.length > 1 && (
						<>
							<Button
								variant="ghost"
								size="icon-lg"
								aria-label="Previous image"
								onClick={handlePrevious}
								className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
							>
								<ChevronLeft className="size-6" aria-hidden />
							</Button>
							<Button
								variant="ghost"
								size="icon-lg"
								aria-label="Next image"
								onClick={handleNext}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
							>
								<ChevronRight className="size-6" aria-hidden />
							</Button>
						</>
					)}
				</DialogContent>
			</Dialog>
		</section>
	);
}
