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

const MAX_INITIAL_IMAGES = 5;

function Media({
	src,
	alt,
	sizes,
	priority,
}: {
	src: string;
	alt: string;
	sizes: string;
	priority?: boolean;
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
 * Solace gallery. From 768px: a wide first image (29:20) over a two-column grid of portraits
 * (29:34), five at first and two more per "See more images". Phones: a swipe track with the
 * original's thin progress bar. The selected variant's own photo moves to the front.
 */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const selectedVariant = useSelectedVariant(variants);
	const [extra, setExtra] = useState(0);
	const [progress, setProgress] = useState(0);
	const trackRef = useRef<HTMLDivElement>(null);

	const variantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const ordered = variantImage ? [variantImage, ...images.filter((image) => image !== variantImage)] : images;

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const update = () => {
			const max = track.scrollWidth - track.clientWidth;
			setProgress(max > 0 ? track.scrollLeft / max : 0);
		};
		update();
		track.addEventListener("scroll", update, { passive: true });
		return () => track.removeEventListener("scroll", update);
	}, []);

	if (ordered.length === 0) {
		return <div className="aspect-[29/20] w-full bg-secondary" />;
	}

	const visible = ordered.slice(0, MAX_INITIAL_IMAGES + extra);
	const barWidth = 100 / ordered.length;

	return (
		<div className="flex flex-col justify-center gap-4">
			<div className="hidden grid-cols-2 gap-1 md:grid">
				{visible.map((image, index) => (
					<div
						key={image}
						className={cn(
							"relative w-full shrink-0 bg-secondary",
							index === 0 ? "col-span-2 aspect-[29/20] max-h-[33.75rem]" : "aspect-[29/34] max-h-[27.5rem]",
						)}
					>
						<Media
							src={image}
							alt={index === 0 ? productName : ""}
							sizes={index === 0 ? "(min-width: 900px) 780px, 100vw" : "(min-width: 900px) 390px, 50vw"}
							priority={index === 0}
						/>
					</div>
				))}
			</div>
			{ordered.length > visible.length && (
				<button
					type="button"
					onClick={() => setExtra((n) => n + 2)}
					className="pill pill-tonal mx-auto hidden [--pill-h:2.5rem] md:inline-flex"
				>
					See more images
				</button>
			)}

			<div className="relative md:hidden">
				<div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
					{ordered.map((image, index) => (
						<div
							key={image}
							className="relative aspect-[29/34] max-h-[25rem] w-full shrink-0 snap-start bg-secondary"
						>
							<Media src={image} alt={index === 0 ? productName : ""} sizes="100vw" priority={index === 0} />
						</div>
					))}
				</div>
				{ordered.length > 1 && (
					<div aria-hidden="true" className="absolute right-3 bottom-3 left-3 h-1 bg-white/40">
						<div
							className="absolute h-full bg-white transition-[left] duration-200 ease-out"
							style={{ width: `${barWidth}%`, left: `${progress * (100 - barWidth)}%` }}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
