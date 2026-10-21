"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

/** Up to this many photos stack down the page (the original's default); more switch to preview + thumbnails. */
const STACK_LIMIT = 6;

function Media({
	src,
	alt,
	priority,
	sizes,
	className,
}: {
	src: string;
	alt: string;
	priority?: boolean;
	sizes: string;
	className?: string;
}) {
	return (
		<div className={cn("relative aspect-[2/3] overflow-hidden bg-tile", className)}>
			{isVideoUrl(src) ? (
				<video
					className="absolute inset-0 size-full object-cover"
					src={src}
					muted
					loop
					autoPlay
					playsInline
				/>
			) : (
				<YNSMedia
					src={src}
					alt={alt}
					fill
					priority={priority}
					fetchPriority={priority ? "high" : undefined}
					sizes={sizes}
					className="object-cover"
				/>
			)}
		</div>
	);
}

export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const selectedVariant = useSelectedVariant(variants);
	const railRef = useRef<HTMLDivElement>(null);

	// Only variants with real combinations drive the gallery jump.
	const firstVariantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const variantImageIndex = firstVariantImage ? Math.max(images.indexOf(firstVariantImage), 0) : 0;

	// Start on the selected variant's photo: choosing a variant navigates, and the page can remount
	// the gallery, so a jump on change alone would land back on the first image.
	const [selectedIndex, setSelectedIndex] = useState(variantImageIndex);

	// Jump to the selected variant's first photo when the variant changes (no effect needed). The
	// previous key lives in state, not a ref: a variant change renders inside a transition, and a
	// discarded render would move a ref while dropping the index update.
	const searchParamsKey = searchParams.toString();
	const [prevSearchParamsKey, setPrevSearchParamsKey] = useState(searchParamsKey);
	if (prevSearchParamsKey !== searchParamsKey) {
		setPrevSearchParamsKey(searchParamsKey);
		setSelectedIndex(variantImageIndex);
	}

	// Keep the phone rail on the selected photo (DOM work belongs in an effect, not render).
	useEffect(() => {
		const rail = railRef.current;
		if (!rail || rail.clientWidth === 0) return;
		const target = rail.clientWidth * selectedIndex;
		if (Math.abs(rail.scrollLeft - target) > 4) rail.scrollTo({ left: target, behavior: "smooth" });
	}, [selectedIndex]);

	if (images.length === 0) {
		return (
			<div className="flex aspect-[2/3] items-center justify-center bg-tile">
				<p className="text-muted-foreground">No images available</p>
			</div>
		);
	}

	const alt = (index: number) => `${productName}, photo ${index + 1} of ${images.length}`;

	return (
		<div>
			{/* Phones: a full-width swipe rail, as the original's mobile carousel. */}
			<div className="relative md:hidden">
				<div
					ref={railRef}
					onScroll={(e) => {
						const rail = e.currentTarget;
						setSelectedIndex(Math.round(rail.scrollLeft / rail.clientWidth));
					}}
					className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto"
				>
					{images.map((image, index) => (
						<Media
							key={`${image}-${index}`}
							src={image}
							alt={alt(index)}
							priority={index === 0}
							sizes="100vw"
							className="w-full flex-none snap-center"
						/>
					))}
				</div>
				{images.length > 1 && (
					<p className="absolute right-0 bottom-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium tabular-nums">
						{selectedIndex + 1} / {images.length}
					</p>
				)}
			</div>

			{/* Desktop: every photo stacked, or a preview with thumbnails for long sets. */}
			{images.length <= STACK_LIMIT ? (
				<div className="hidden gap-6 md:grid">
					{images.map((image, index) => (
						<Media
							key={`${image}-${index}`}
							src={image}
							alt={alt(index)}
							priority={index === 0}
							sizes="(max-width: 1440px) 50vw, 640px"
						/>
					))}
				</div>
			) : (
				<div className="hidden flex-col items-center gap-4 md:flex">
					<Media
						src={images[selectedIndex] ?? images[0] ?? ""}
						alt={alt(selectedIndex)}
						priority
						sizes="(max-width: 1440px) 50vw, 640px"
						className="w-full"
					/>
					<div className="flex flex-wrap justify-center gap-2">
						{images.map((image, index) => (
							<button
								key={`${image}-${index}`}
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show photo ${index + 1}`}
								aria-current={index === selectedIndex}
								className={cn(
									"relative w-1/6 min-w-16 overflow-hidden rounded-lg border p-1.5 transition-colors",
									index === selectedIndex ? "border-foreground" : "border-border hover:border-ring",
								)}
							>
								<Media src={image} alt="" sizes="96px" className="rounded-sm" />
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
