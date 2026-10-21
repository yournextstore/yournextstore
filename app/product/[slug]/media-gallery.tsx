"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { ArrowCircle } from "@/components/isle";
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
	/** Classes for the photos' block (the big photo, from 1024px). */
	className?: string;
	/** Classes for the row of small pictures (from 1024px). */
	thumbsClassName?: string;
};

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
		<video className="absolute inset-0 size-full object-cover" src={src} muted loop autoPlay playsInline />
	) : (
		<YNSMedia src={src} alt={alt} fill sizes={sizes} className="object-cover" priority={priority} />
	);
}

/**
 * The product's photos, as in the original. On phones they are stacked. From 1024px they are a
 * slideshow: one big photo split into two invisible halves (previous / next, each showing its
 * round arrow on hover or focus), and every photo small in a row beside it, the current one
 * dimmed. It wraps around, and ← → work while focus is inside.
 */
export function MediaGallery({
	images,
	productName,
	variants,
	className,
	thumbsClassName,
}: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const selectedVariant = useSelectedVariant(variants);
	const count = images.length;

	// Jump to the selected variant's first photo when the variant changes (no effect needed).
	const searchParamsKey = searchParams.toString();
	const previousKey = useRef(searchParamsKey);
	if (previousKey.current !== searchParamsKey) {
		previousKey.current = searchParamsKey;
		const first =
			selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
		const index = first ? images.indexOf(first) : -1;
		setSelectedIndex(index >= 0 ? index : 0);
	}

	const step = (by: number) => setSelectedIndex((current) => (current + by + count) % count);

	if (count === 0) {
		return <div className={cn("aspect-square rounded-sm bg-white lg:aspect-auto", className)} />;
	}

	return (
		<>
			<section
				aria-label={`${productName} photos`}
				onKeyDown={(e) => {
					if (count < 2) return;
					if (e.key === "ArrowLeft") {
						e.preventDefault();
						step(-1);
					} else if (e.key === "ArrowRight") {
						e.preventDefault();
						step(1);
					}
				}}
				className={cn("relative flex flex-col gap-3 lg:block", className)}
			>
				{images.map((image, index) => (
					<div
						key={`${image}-${index}`}
						className={cn(
							"relative aspect-square overflow-hidden rounded-sm bg-white",
							"lg:absolute lg:inset-0 lg:aspect-auto lg:transition-opacity lg:duration-400",
							index === selectedIndex ? "lg:opacity-100" : "lg:pointer-events-none lg:opacity-0",
						)}
						aria-hidden={index !== selectedIndex ? "true" : undefined}
					>
						<Media
							src={image}
							alt={index === 0 ? productName : `${productName}, photo ${index + 1}`}
							sizes="(width >= 64rem) 57vw, 100vw"
							priority={index === 0}
						/>
					</div>
				))}

				{count > 1 &&
					([-1, 1] as const).map((direction) => (
						<button
							key={direction}
							type="button"
							onClick={() => step(direction)}
							aria-label={direction === -1 ? "Previous photo" : "Next photo"}
							className={cn(
								"group absolute inset-y-0 z-1 hidden w-1/2 cursor-pointer items-center justify-center outline-none lg:flex",
								direction === -1 ? "left-0" : "right-0",
							)}
						>
							<span
								className={cn(
									"rounded-full opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-white motion-reduce:translate-x-0",
									direction === -1 ? "translate-x-1" : "-translate-x-1",
								)}
							>
								<ArrowCircle tone="light" direction={direction === -1 ? "left" : "right"} />
							</span>
						</button>
					))}
				{count > 1 && (
					<p className="sr-only" aria-live="polite">
						Photo {selectedIndex + 1} of {count}
					</p>
				)}
			</section>

			{count > 1 && (
				<ul
					aria-label="Photos"
					className={cn("scroll-row -mr-3 flex gap-3 pr-3 max-lg:hidden", thumbsClassName)}
				>
					{images.map((image, index) => (
						<li key={`${image}-${index}`} className="w-[calc((100vw-156px)/4+24px)] flex-none">
							<button
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show photo ${index + 1} of ${count}`}
								aria-current={index === selectedIndex ? "true" : undefined}
								className="relative block aspect-square w-full overflow-hidden rounded-sm bg-white transition-opacity aria-[current=true]:opacity-40"
							>
								<Media src={image} alt="" sizes="25vw" />
							</button>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
