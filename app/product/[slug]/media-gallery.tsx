"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { isVideoUrl } from "@/lib/utils";
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

function Arrow({ flip = false }: { flip?: boolean }) {
	return (
		<svg
			aria-hidden="true"
			className={flip ? "rotate-180" : undefined}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
		>
			<path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	);
}

/**
 * The original's product stage: one photograph at a time across the full width and the full
 * viewport height, on a light-grey ground, with two white circle buttons in the bottom-left corner.
 */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const selectedVariant = useSelectedVariant(variants);

	// Only variants with real combinations drive the gallery jump.
	const firstVariantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const variantImageIndex = firstVariantImage ? Math.max(images.indexOf(firstVariantImage), 0) : 0;

	// Start on the selected variant's photo: choosing a variant navigates, and the page can remount
	// the gallery, so a jump on change alone would land back on the first image.
	const [selectedIndex, setSelectedIndex] = useState(variantImageIndex);

	// Jump to the selected variant's first photograph when the variant changes (no effect needed). The
	// previous key lives in state, not a ref: a variant change renders inside a transition, and a
	// discarded render would move a ref while dropping the index update.
	const searchParamsKey = searchParams.toString();
	const [previousKey, setPreviousKey] = useState(searchParamsKey);
	if (previousKey !== searchParamsKey) {
		setPreviousKey(searchParamsKey);
		setSelectedIndex(variantImageIndex);
	}

	const count = images.length;
	const go = (delta: number) => setSelectedIndex((current) => (current + delta + count) % count);

	return (
		<section
			aria-label={`${productName} images`}
			className="relative h-[85svh] bg-lightgray md:h-screen"
			onKeyDown={(event) => {
				if (count <= 1) return;
				if (event.key === "ArrowLeft") go(-1);
				if (event.key === "ArrowRight") go(1);
			}}
		>
			<div className="h-full overflow-hidden">
				<div
					className="flex h-full transition-transform duration-700 ease-out"
					style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
				>
					{count === 0 && <div className="h-full w-full shrink-0" />}
					{images.map((image, index) => (
						<div
							key={`${image}-${index}`}
							className="relative h-full w-full shrink-0"
							aria-hidden={index !== selectedIndex}
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
									alt={index === 0 ? productName : `${productName}, view ${index + 1}`}
									fill
									sizes="100vw"
									priority={index === 0}
									fetchPriority={index === 0 ? "high" : undefined}
									className="object-cover"
								/>
							)}
						</div>
					))}
				</div>
			</div>
			{count > 1 && (
				<div className="absolute bottom-8 left-4 flex gap-3 md:left-8">
					<button
						type="button"
						onClick={() => go(-1)}
						className="flex aspect-square w-[2.875rem] items-center justify-center rounded-full bg-white duration-200 hover:bg-white/70"
						aria-label="Previous image"
					>
						<Arrow flip />
					</button>
					<button
						type="button"
						onClick={() => go(1)}
						className="flex aspect-square w-[2.875rem] items-center justify-center rounded-full bg-white duration-200 hover:bg-white/70"
						aria-label="Next image"
					>
						<Arrow />
					</button>
				</div>
			)}
		</section>
	);
}
