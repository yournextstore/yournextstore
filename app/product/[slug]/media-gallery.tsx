"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
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
	return (
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
 * The original's gallery: a column of rounded thumbnails beside one tall photo on large
 * screens, a thumbnail row under it on phones. Selecting a variant jumps to its first photo.
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

	// Jump to the selected variant's image when the variant changes (no effect needed). The previous
	// key lives in state, not a ref: a variant change renders inside a transition, and a discarded
	// render would move a ref while dropping the index update.
	const searchParamsKey = searchParams.toString();
	const [prevSearchParamsKey, setPrevSearchParamsKey] = useState(searchParamsKey);
	if (prevSearchParamsKey !== searchParamsKey) {
		setPrevSearchParamsKey(searchParamsKey);
		setSelectedIndex(variantImageIndex);
	}

	if (images.length === 0) {
		return <div className="aspect-[2/3] rounded-lg bg-gray-100" />;
	}

	const current = images[selectedIndex] ?? images[0] ?? "";

	return (
		<section aria-label={`${productName} photos`} className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-5">
			{images.length > 1 && (
				<ul className="no-scrollbar order-last flex min-w-0 gap-4 overflow-x-auto p-0.5 lg:order-none lg:col-span-1 lg:max-h-[min(80vh,42rem)] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible">
					{images.map((image, index) => (
						<li key={`thumb-${image}-${index}`} className="w-20 shrink-0 lg:w-full">
							<button
								type="button"
								onClick={() => setSelectedIndex(index)}
								aria-label={`Show photo ${index + 1}`}
								aria-current={index === selectedIndex}
								className={cn(
									"relative block h-28 w-full overflow-hidden rounded-lg bg-gray-100 transition duration-200 lg:h-32",
									index === selectedIndex
										? "ring-2 ring-sky ring-offset-1"
										: "hover:scale-105 hover:cursor-pointer",
								)}
							>
								<Media src={image} alt="" sizes="96px" />
							</button>
						</li>
					))}
				</ul>
			)}
			<div
				className={cn(
					"relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-100",
					images.length > 1 ? "lg:col-span-4" : "lg:col-span-5",
				)}
			>
				<Media
					src={current}
					alt={selectedIndex === 0 ? productName : `${productName}, photo ${selectedIndex + 1}`}
					sizes="(max-width: 768px) 90vw, 40vw"
					priority
				/>
			</div>
		</section>
	);
}
