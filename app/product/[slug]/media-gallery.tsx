"use client";

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

/**
 * Fluid's product media: one rounded square that swipes between photos (a "1 / 4" pill below it on
 * phones), with a row of square thumbnails on desktop. Built on scroll snapping, so touch, trackpad
 * and keyboard scrolling all move it without a carousel library.
 */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const trackRef = useRef<HTMLDivElement | null>(null);
	const trackPlacedRef = useRef(false);

	const selectedVariant = useSelectedVariant(variants);
	const firstVariantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const variantImageIndex = firstVariantImage ? Math.max(0, images.indexOf(firstVariantImage)) : 0;

	// Start on the selected variant's photo: choosing a variant navigates, and the page can remount
	// the gallery, so a jump on change alone would land back on the first image.
	const [selectedIndex, setSelectedIndex] = useState(variantImageIndex);

	const goTo = (index: number) => {
		const track = trackRef.current;
		setSelectedIndex(index);
		track?.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
	};

	// Jump to the selected variant's photo when the variant changes (no effect needed). The previous
	// key lives in state, not a ref: a variant change renders inside a transition, and a discarded
	// render would move a ref while dropping the index update.
	const searchParamsKey = searchParams.toString();
	const [prevSearchParamsKey, setPrevSearchParamsKey] = useState(searchParamsKey);
	if (prevSearchParamsKey !== searchParamsKey) {
		setPrevSearchParamsKey(searchParamsKey);
		if (variantImageIndex !== selectedIndex) {
			setSelectedIndex(variantImageIndex);
			queueMicrotask(() => {
				const track = trackRef.current;
				track?.scrollTo({ left: variantImageIndex * track.clientWidth, behavior: "smooth" });
			});
		}
	}

	if (images.length === 0) {
		return <div className="aspect-square rounded-lg bg-secondary" />;
	}

	return (
		<section aria-label={`${productName} photos`} className="lg:sticky lg:top-24 lg:self-start">
			<div
				ref={(track) => {
					trackRef.current = track;
					// A gallery that mounts on a variant's photo scrolls the track there once.
					if (track && !trackPlacedRef.current) {
						trackPlacedRef.current = true;
						track.scrollLeft = selectedIndex * track.clientWidth;
					}
				}}
				onScroll={(e) => {
					const track = e.currentTarget;
					const index = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
					if (index !== selectedIndex) {
						setSelectedIndex(index);
					}
				}}
				className="flex aspect-square snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-lg bg-secondary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{images.map((image, index) => (
					<div key={`${image}-${index}`} className="relative h-full w-full shrink-0 snap-start">
						{isVideoUrl(image) ? (
							<video
								className="absolute inset-0 size-full object-cover"
								src={image}
								muted
								loop
								autoPlay
								playsInline
								controls
							/>
						) : (
							<YNSMedia
								src={image}
								alt={index === 0 ? productName : `${productName}, photo ${index + 1}`}
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
								priority={index === 0}
								fetchPriority={index === 0 ? "high" : undefined}
							/>
						)}
					</div>
				))}
			</div>

			{images.length > 1 && (
				<>
					<p className="mt-3 flex justify-center lg:hidden">
						<span className="rounded-full border border-foreground px-2.5 py-0.5 text-sm tabular-nums">
							{selectedIndex + 1} / {images.length}
						</span>
					</p>
					<div className="mt-4 hidden flex-wrap gap-3 lg:flex">
						{images.map((image, index) => (
							<button
								key={`${image}-${index}`}
								type="button"
								onClick={() => goTo(index)}
								aria-label={`Show photo ${index + 1}`}
								aria-current={selectedIndex === index ? "true" : undefined}
								className={cn(
									"relative size-[5.5rem] overflow-hidden rounded-md border-2 p-0.5 transition-colors",
									selectedIndex === index ? "border-foreground" : "border-transparent hover:border-accent",
								)}
							>
								<span className="relative block size-full overflow-hidden rounded-sm bg-secondary">
									{isVideoUrl(image) ? (
										<video
											className="absolute inset-0 size-full object-cover"
											src={image}
											muted
											playsInline
										/>
									) : (
										<YNSMedia src={image} alt="" fill sizes="88px" className="object-cover" />
									)}
								</span>
							</button>
						))}
					</div>
				</>
			)}
		</section>
	);
}
