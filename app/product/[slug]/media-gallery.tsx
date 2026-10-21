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
	if (isVideoUrl(src)) {
		return (
			<video
				className="absolute inset-0 h-full w-full object-cover"
				src={src}
				muted
				loop
				autoPlay
				playsInline
			/>
		);
	}
	return <YNSMedia src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />;
}

/**
 * Blueprint's product gallery: a column of thumbnails beside one 3:4 photo on desktop, a swipe
 * row with dots on phones. Selecting a variant jumps to that variant's first photo.
 */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const rowRef = useRef<HTMLUListElement>(null);

	const selectedVariant = useSelectedVariant(variants);
	const firstVariantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const variantImageIndex = firstVariantImage ? Math.max(0, images.indexOf(firstVariantImage)) : 0;

	// Jump to the selected variant's image when the variant changes (no effect needed).
	const searchParamsKey = searchParams.toString();
	const prevSearchParamsKey = useRef(searchParamsKey);
	if (prevSearchParamsKey.current !== searchParamsKey) {
		prevSearchParamsKey.current = searchParamsKey;
		setSelectedIndex(variantImageIndex);
	}

	if (images.length === 0) {
		return <div className="aspect-[3/4] bg-neutral-lightest" />;
	}

	const goTo = (index: number) => {
		setSelectedIndex(index);
		const row = rowRef.current;
		if (row) row.scrollTo({ left: row.clientWidth * index, behavior: "smooth" });
	};

	const current = images[selectedIndex] ?? images[0] ?? "";

	return (
		<section
			aria-label={`${productName} photos`}
			className="md:sticky md:top-[calc(var(--header-height)+1.5rem)]"
		>
			{/* Phones: swipe row with dots. */}
			<div className="relative -mx-4 md:hidden">
				<ul
					ref={rowRef}
					onScroll={(event) => {
						const row = event.currentTarget;
						const index = Math.round(row.scrollLeft / row.clientWidth);
						if (index !== selectedIndex) setSelectedIndex(index);
					}}
					className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
				>
					{images.map((image, index) => (
						<li
							key={`${image}-${index}`}
							className="relative aspect-[3/4] w-full shrink-0 snap-start bg-neutral-lightest"
						>
							<Media
								src={image}
								alt={index === 0 ? productName : `${productName}, photo ${index + 1}`}
								sizes="100vw"
								priority={index === 0}
							/>
						</li>
					))}
				</ul>
				{images.length > 8 && (
					<p
						aria-live="polite"
						className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs tabular-nums"
					>
						{selectedIndex + 1} / {images.length}
					</p>
				)}
				{images.length > 1 && images.length <= 8 && (
					<div className="absolute inset-x-0 bottom-2 flex justify-center">
						{images.map((image, index) => (
							<button
								key={`dot-${image}-${index}`}
								type="button"
								onClick={() => goTo(index)}
								aria-label={`Show photo ${index + 1}`}
								aria-current={index === selectedIndex}
								className="flex size-6 items-center justify-center"
							>
								<span
									className={cn(
										"size-2 rounded-full transition-colors",
										index === selectedIndex ? "bg-black" : "bg-black/25",
									)}
								/>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Tablet and up: thumbnails beside one photo. */}
			<div className="hidden gap-4 md:flex">
				{images.length > 1 && (
					<ul className="no-scrollbar flex max-h-[min(80vh,46rem)] w-[4.5rem] shrink-0 flex-col gap-3 overflow-y-auto p-0.5 xl:w-20">
						{images.map((image, index) => (
							<li key={`thumb-${image}-${index}`}>
								<button
									type="button"
									onClick={() => setSelectedIndex(index)}
									aria-label={`Show photo ${index + 1}`}
									aria-current={index === selectedIndex}
									className={cn(
										"relative block aspect-[3/4] w-full overflow-hidden rounded-sm border bg-neutral-lightest transition-colors",
										index === selectedIndex
											? "border-black"
											: "border-transparent hover:border-neutral-lighter",
									)}
								>
									<Media src={image} alt="" sizes="80px" />
								</button>
							</li>
						))}
					</ul>
				)}
				<div className="relative aspect-[3/4] flex-1 overflow-hidden bg-neutral-lightest">
					<Media
						src={current}
						alt={selectedIndex === 0 ? productName : `${productName}, photo ${selectedIndex + 1}`}
						sizes="(max-width: 1024px) 45vw, 38vw"
						priority
					/>
				</div>
			</div>
		</section>
	);
}
