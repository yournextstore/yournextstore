"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
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
	const [selectedIndex, setSelectedIndex] = useState(0);
	const selectedVariant = useSelectedVariant(variants);

	// Jump to the selected variant's first photograph when the variant changes (no effect needed).
	const searchParamsKey = searchParams.toString();
	const previousKey = useRef(searchParamsKey);
	if (previousKey.current !== searchParamsKey) {
		previousKey.current = searchParamsKey;
		const firstVariantImage =
			selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
		const index = firstVariantImage ? images.indexOf(firstVariantImage) : -1;
		setSelectedIndex(index >= 0 ? index : 0);
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
