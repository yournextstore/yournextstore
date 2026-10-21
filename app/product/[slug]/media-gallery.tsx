"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
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

function Media({
	src,
	alt,
	sizes,
	priority,
	className,
	controls,
}: {
	src: string;
	alt: string;
	sizes: string;
	priority?: boolean;
	className?: string;
	controls?: boolean;
}) {
	if (isVideoUrl(src)) {
		return (
			<video
				className={cn("absolute inset-0 h-full w-full object-cover", className)}
				src={src}
				muted
				loop
				autoPlay
				playsInline
				controls={controls}
			/>
		);
	}
	return (
		<YNSMedia
			src={src}
			alt={alt}
			fill
			sizes={sizes}
			priority={priority}
			fetchPriority={priority ? "high" : undefined}
			className={className}
		/>
	);
}

/**
 * Mobile: a swipeable row with dots. Desktop: one large 4:5 image that opens a lightbox,
 * with a thumbnail strip underneath.
 */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const searchParams = useSearchParams();

	const selectedVariant = useSelectedVariant(variants);
	const firstVariantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const variantImageIndex = firstVariantImage ? Math.max(0, images.indexOf(firstVariantImage)) : 0;

	// Start on the selected variant's photo: choosing a variant navigates, and the page can remount
	// the gallery, so a jump on change alone would land back on the first image.
	const [selectedIndex, setSelectedIndex] = useState(variantImageIndex);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const scrollerRef = useRef<HTMLDivElement>(null);

	const show = (index: number) => {
		setSelectedIndex(index);
		const scroller = scrollerRef.current;
		if (scroller) {
			scroller.scrollTo({ left: index * scroller.clientWidth, behavior: "smooth" });
		}
	};

	// Jump to the selected variant's image when the variant changes (avoids useEffect). The previous
	// key lives in state, not a ref: a variant change renders inside a transition, and a discarded
	// render would move a ref while dropping the index update.
	const searchParamsKey = searchParams.toString();
	const [prevSearchParamsKey, setPrevSearchParamsKey] = useState(searchParamsKey);
	if (prevSearchParamsKey !== searchParamsKey) {
		setPrevSearchParamsKey(searchParamsKey);
		setSelectedIndex(variantImageIndex);
	}

	const step = (delta: number) => setSelectedIndex((i) => (i + delta + images.length) % images.length);

	if (images.length === 0) {
		return <div className="aspect-[4/5] rounded-xl bg-muted" />;
	}

	const current = images[selectedIndex] ?? images[0] ?? "";

	return (
		<section aria-label="Product images">
			{/* Mobile carousel */}
			<div className="md:hidden">
				<div
					ref={scrollerRef}
					onScroll={(e) => {
						const el = e.currentTarget;
						const index = Math.round(el.scrollLeft / el.clientWidth);
						if (index !== selectedIndex) {
							setSelectedIndex(index);
						}
					}}
					className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-xl"
				>
					{images.map((image, index) => (
						<div
							key={`${image}-${index}`}
							className="relative aspect-[4/5] w-full shrink-0 snap-start bg-muted"
						>
							<Media
								src={image}
								alt={`${productName}, image ${index + 1} of ${images.length}`}
								sizes="(max-width: 767px) calc(100vw - 40px), 50vw"
								priority={index === 0}
								className="object-cover"
							/>
						</div>
					))}
				</div>
				{images.length > 1 && images.length <= 8 && (
					<div className="mt-3 flex justify-center">
						{images.map((image, index) => (
							<button
								key={`dot-${image}-${index}`}
								type="button"
								aria-label={`Show image ${index + 1}`}
								aria-current={index === selectedIndex ? "true" : undefined}
								onClick={() => show(index)}
								className="flex h-6 w-6 items-center justify-center"
							>
								<span
									className={cn(
										"h-2 w-2 rounded-full transition-colors",
										index === selectedIndex ? "bg-primary" : "bg-muted-foreground/30",
									)}
								/>
							</button>
						))}
					</div>
				)}
				{images.length > 8 && (
					<div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
						<button
							type="button"
							aria-label="Previous image"
							onClick={() => show((selectedIndex - 1 + images.length) % images.length)}
							className="flex h-8 w-8 items-center justify-center text-foreground"
						>
							<ChevronLeft className="h-4 w-4" aria-hidden="true" />
						</button>
						<span className="tabular-nums" aria-live="polite">
							{selectedIndex + 1} / {images.length}
						</span>
						<button
							type="button"
							aria-label="Next image"
							onClick={() => show((selectedIndex + 1) % images.length)}
							className="flex h-8 w-8 items-center justify-center text-foreground"
						>
							<ChevronRight className="h-4 w-4" aria-hidden="true" />
						</button>
					</div>
				)}
			</div>

			{/* Desktop: large image + thumbnails */}
			<div className="hidden md:block">
				<button
					type="button"
					onClick={() => setLightboxOpen(true)}
					aria-label={`Enlarge image ${selectedIndex + 1} of ${productName}`}
					className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-xl bg-muted"
				>
					<Media
						src={current}
						alt=""
						sizes="(max-width: 1279px) 50vw, 584px"
						priority
						className="object-cover"
					/>
				</button>
				{images.length > 1 && (
					<div className="scrollbar-hide -m-1 mt-3 flex gap-2 overflow-x-auto p-1">
						{images.map((image, index) => (
							<button
								key={`thumb-${image}-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show image ${index + 1}`}
								aria-pressed={selectedIndex === index}
								className={cn(
									"relative h-20 w-16 shrink-0 cursor-pointer overflow-hidden rounded bg-muted transition-opacity hover:opacity-80",
									selectedIndex === index && "ring-2 ring-primary ring-offset-2 ring-offset-background",
								)}
							>
								<Media src={image} alt="" sizes="64px" className="object-cover" />
							</button>
						))}
					</div>
				)}
			</div>

			<DialogPrimitive.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
				<DialogPrimitive.Portal>
					<DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/60 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
					<DialogPrimitive.Popup
						onKeyDown={(e) => {
							if (e.key === "ArrowLeft") step(-1);
							if (e.key === "ArrowRight") step(1);
						}}
						className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-lg bg-background p-4 shadow-xl transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 sm:p-6"
					>
						<DialogPrimitive.Title className="sr-only">{productName}</DialogPrimitive.Title>
						<DialogPrimitive.Description className="sr-only">
							Image {selectedIndex + 1} of {images.length}. Use the arrow keys to browse.
						</DialogPrimitive.Description>
						<DialogPrimitive.Close
							aria-label="Close"
							className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background"
						>
							<X className="h-4 w-4" aria-hidden="true" />
						</DialogPrimitive.Close>
						<div className="relative h-[70vh] w-full">
							<Media
								src={current}
								alt={`${productName}, image ${selectedIndex + 1}`}
								sizes="(max-width: 1024px) 90vw, 960px"
								className="object-contain"
								controls
							/>
							{images.length > 1 && (
								<>
									<button
										type="button"
										aria-label="Previous image"
										onClick={() => step(-1)}
										className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
									>
										<ChevronLeft className="h-5 w-5" aria-hidden="true" />
									</button>
									<button
										type="button"
										aria-label="Next image"
										onClick={() => step(1)}
										className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
									>
										<ChevronRight className="h-5 w-5" aria-hidden="true" />
									</button>
								</>
							)}
						</div>
						{images.length > 1 && (
							<div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto p-1">
								{images.map((image, index) => (
									<button
										key={`lb-${image}-${index}`}
										type="button"
										onClick={() => setSelectedIndex(index)}
										aria-label={`Show image ${index + 1}`}
										aria-pressed={selectedIndex === index}
										className={cn(
											"relative h-16 w-14 shrink-0 cursor-pointer overflow-hidden rounded bg-muted transition-opacity hover:opacity-80",
											selectedIndex === index && "ring-2 ring-primary ring-offset-2 ring-offset-background",
										)}
									>
										<Media src={image} alt="" sizes="56px" className="object-cover" />
									</button>
								))}
							</div>
						)}
					</DialogPrimitive.Popup>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>
		</section>
	);
}
