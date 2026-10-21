"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
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

/**
 * Portrait slides on a horizontal rail: on desktop the next slide peeks in at the right, round
 * arrow buttons sit over the edges (filled black while there is somewhere to go) and a row of
 * numbers underneath marks the current slide. Phones get the same rail edge to edge, swiped,
 * with the numbers laid over the photograph.
 */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const trackRef = useRef<HTMLDivElement>(null);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(images.length > 1);
	const selectedVariant = useSelectedVariant(variants);
	const single = images.length <= 1;

	const scrollToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
		const track = trackRef.current;
		const slide = track?.children[index];
		if (!track || !(slide instanceof HTMLElement)) return;
		track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior });
	};

	// Selecting a variant jumps the rail to that variant's first photograph.
	const searchKey = searchParams.toString();
	const firstVariantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run when the selection in the URL changes
	useEffect(() => {
		if (!firstVariantImage) return;
		const index = images.indexOf(firstVariantImage);
		if (index >= 0) scrollToIndex(index);
	}, [searchKey, firstVariantImage, images]);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const update = () => {
			setCanPrev(track.scrollLeft > 1);
			setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
			const slides = Array.from(track.children);
			const nearest = slides.reduce(
				(best, slide, index) => {
					const distance = Math.abs((slide as HTMLElement).offsetLeft - track.offsetLeft - track.scrollLeft);
					return distance < best.distance ? { index, distance } : best;
				},
				{ index: 0, distance: Number.POSITIVE_INFINITY },
			);
			setSelectedIndex(nearest.index);
		};
		update();
		track.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update, { passive: true });
		return () => {
			track.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	if (images.length === 0) {
		return (
			<div className="flex aspect-[3/4] w-full items-center justify-center bg-grayscale-50">
				<p className="text-grayscale-500">No images available</p>
			</div>
		);
	}

	return (
		<section
			aria-roledescription="carousel"
			aria-label={`${productName} photographs`}
			className="relative overflow-hidden"
			onKeyDown={(e) => {
				if (e.key === "ArrowLeft") scrollToIndex(Math.max(0, selectedIndex - 1));
				if (e.key === "ArrowRight") scrollToIndex(Math.min(images.length - 1, selectedIndex + 1));
			}}
		>
			<div className="relative flex items-center lg:mb-6">
				{!single && (
					<button
						type="button"
						onClick={() => scrollToIndex(Math.max(0, selectedIndex - 1))}
						disabled={!canPrev}
						aria-label="Previous image"
						className={cn(
							"absolute left-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-foreground transition-colors max-lg:hidden",
							canPrev ? "bg-foreground text-background" : "bg-transparent text-foreground",
						)}
					>
						<ArrowLeftIcon className="size-6" />
					</button>
				)}
				<div ref={trackRef} className="no-scrollbar flex w-full snap-x snap-mandatory gap-4 overflow-x-auto">
					{images.map((image, index) => (
						<div
							key={`${image}-${index}`}
							className="relative aspect-[3/4] w-full shrink-0 snap-start overflow-hidden bg-grayscale-50 md:max-w-[80%]"
						>
							{isVideoUrl(image) ? (
								<video
									className="absolute inset-0 h-full w-full object-cover"
									src={image}
									muted
									loop
									autoPlay
									playsInline
								/>
							) : (
								<YNSMedia
									src={image}
									alt={`${productName}, image ${index + 1}`}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 45vw"
									className="object-cover"
									priority={index === 0}
									fetchPriority={index === 0 ? "high" : undefined}
								/>
							)}
						</div>
					))}
				</div>
				{!single && (
					<button
						type="button"
						onClick={() => scrollToIndex(Math.min(images.length - 1, selectedIndex + 1))}
						disabled={!canNext}
						aria-label="Next image"
						className={cn(
							"absolute right-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-foreground transition-colors max-lg:hidden",
							canNext ? "bg-foreground text-background" : "bg-transparent text-foreground",
						)}
					>
						<ArrowRightIcon className="size-6" />
					</button>
				)}
			</div>
			{!single && (
				<div className="flex justify-center max-lg:absolute max-lg:bottom-4 max-lg:w-full">
					{images.map((image, index) => (
						<button
							key={`${image}-dot-${index}`}
							type="button"
							onClick={() => scrollToIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={index === selectedIndex}
							className="min-h-6 min-w-6 px-1.5"
						>
							<span
								className={cn(
									"border-b px-0.5 transition-colors",
									index === selectedIndex ? "border-foreground" : "border-transparent",
								)}
							>
								{index + 1}
							</span>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
