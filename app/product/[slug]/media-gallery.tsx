"use client";

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

const INITIAL_DESKTOP_COUNT = 4;

function Media({
	src,
	alt,
	priority,
	sizes,
}: {
	src: string;
	alt: string;
	priority?: boolean;
	sizes: string;
}) {
	return isVideoUrl(src) ? (
		<video
			className="absolute inset-0 h-full w-full object-cover"
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
			sizes={sizes}
			priority={priority}
			fetchPriority={priority ? "high" : undefined}
			className="object-cover"
		/>
	);
}

/**
 * Pilot's product media: on desktop every photograph stacked in one rounded column (the first
 * four, then "Show more"); on phones a swipeable row with a "1 / 5" counter. Picking a variant
 * brings its first photograph into view.
 */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [index, setIndex] = useState(0);
	const [showAll, setShowAll] = useState(false);
	const selectedVariant = useSelectedVariant(variants);

	const variantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const variantIndex = variantImage ? images.indexOf(variantImage) : -1;

	useEffect(() => {
		const track = trackRef.current;
		if (!track || variantIndex < 0) return;
		track.scrollTo({ left: variantIndex * track.clientWidth, behavior: "smooth" });
	}, [variantIndex]);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const update = () => setIndex(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
		track.addEventListener("scroll", update, { passive: true });
		return () => track.removeEventListener("scroll", update);
	}, []);

	if (images.length === 0) {
		return (
			<div className="flex aspect-4/5 items-center justify-center rounded-md bg-secondary">
				<p className="text-body-sm text-muted-foreground">No images available</p>
			</div>
		);
	}

	const desktopImages = showAll ? images : images.slice(0, INITIAL_DESKTOP_COUNT);
	const hidden = images.length - desktopImages.length;

	return (
		<div>
			{/* Phones and tablets: swipe row */}
			<div className="lg:hidden">
				<section aria-label={`${productName} images`} className="overflow-hidden rounded-md">
					<div ref={trackRef} className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto">
						{images.map((image, i) => (
							<div
								key={`${image}-${i}`}
								className="relative aspect-4/5 w-full shrink-0 snap-center overflow-hidden rounded-md bg-secondary"
							>
								<Media
									src={image}
									alt={i === 0 ? productName : `${productName}, view ${i + 1}`}
									priority={i === 0}
									sizes="100vw"
								/>
							</div>
						))}
					</div>
				</section>
				{images.length > 1 && (
					<p className="mt-3 text-center text-body-sm tabular-nums" aria-live="polite">
						{index + 1} / {images.length}
					</p>
				)}
			</div>

			{/* Desktop: one stacked column */}
			<div className="hidden flex-col gap-2 lg:flex">
				{desktopImages.map((image, i) => (
					<div
						key={`${image}-${i}`}
						className={cn(
							"relative aspect-4/5 overflow-hidden rounded-md bg-secondary",
							variantIndex === i && "ring-1 ring-line",
						)}
					>
						<Media
							src={image}
							alt={i === 0 ? productName : `${productName}, view ${i + 1}`}
							priority={i === 0}
							sizes="(max-width: 1280px) 55vw, 760px"
						/>
					</div>
				))}
				{hidden > 0 && (
					<button
						type="button"
						onClick={() => setShowAll(true)}
						className="mx-auto mt-2 text-body-sm underline underline-offset-4"
					>
						Show more (+{hidden})
					</button>
				)}
			</div>
		</div>
	);
}
