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

/** The original's gallery: one tall photograph on the paper tint and a row of thumbnails under it. */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const selectedVariant = useSelectedVariant(variants);

	// The gallery always shows every image; selecting a variant jumps to its first photo.
	const firstVariantImage =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	const variantImageIndex = firstVariantImage ? Math.max(0, images.indexOf(firstVariantImage)) : 0;

	// Start on the selected variant's photo: choosing a variant navigates, and the page can remount
	// the gallery, so a jump on change alone would land back on the first image.
	const [selectedIndex, setSelectedIndex] = useState(variantImageIndex);

	// Jump to the selected variant's image when the variant changes (avoids useEffect). The previous
	// key lives in state, not a ref: a variant change renders inside a transition, and a discarded
	// render would move a ref while dropping the index update.
	const searchParamsKey = searchParams.toString();
	const [prevSearchParamsKey, setPrevSearchParamsKey] = useState(searchParamsKey);
	if (prevSearchParamsKey !== searchParamsKey) {
		setPrevSearchParamsKey(searchParamsKey);
		setSelectedIndex(variantImageIndex);
	}

	const step = (direction: 1 | -1) =>
		setSelectedIndex((prev) => (prev + direction + images.length) % images.length);

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (images.length <= 1) return;
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			step(-1);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			step(1);
		}
	};

	const current = images[selectedIndex] ?? "";

	if (images.length === 0) {
		return <div className="aspect-[2/3] w-full bg-tint" />;
	}

	return (
		<section aria-label="Product images" onKeyDown={onKeyDown} className="flex min-w-0 flex-col gap-2">
			<div className="group relative aspect-[2/3] w-full overflow-hidden bg-tint">
				{isVideoUrl(current) ? (
					<video
						className="absolute inset-0 h-full w-full object-cover"
						src={current}
						muted
						loop
						autoPlay
						playsInline
						controls
					/>
				) : (
					<YNSMedia
						src={current}
						alt={`${productName} — image ${selectedIndex + 1} of ${images.length}`}
						fill
						sizes="(min-width: 1640px) 790px, (min-width: 1024px) 48vw, 100vw"
						className="object-cover"
						priority
						fetchPriority="high"
					/>
				)}
				{images.length > 1 && (
					<>
						<button
							type="button"
							onClick={() => step(-1)}
							aria-label="Previous image"
							className="absolute top-1/2 left-0 flex h-16 w-11 -translate-y-1/2 cursor-pointer items-center justify-center text-[15px] text-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
						>
							←
						</button>
						<button
							type="button"
							onClick={() => step(1)}
							aria-label="Next image"
							className="absolute top-1/2 right-0 flex h-16 w-11 -translate-y-1/2 cursor-pointer items-center justify-center text-[15px] text-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
						>
							→
						</button>
						<span aria-hidden className="note absolute bottom-2.5 left-3 text-foreground/70">
							{String(selectedIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
						</span>
					</>
				)}
			</div>

			{images.length > 1 && (
				<div className="no-scrollbar flex gap-2 overflow-x-auto">
					{images.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index}
							className={cn(
								"relative aspect-[2/3] w-[64px] flex-none cursor-pointer border transition sm:w-[72px]",
								selectedIndex === index ? "border-foreground" : "border-line opacity-80 hover:opacity-100",
							)}
						>
							{isVideoUrl(image) ? (
								<video
									className="absolute inset-0 h-full w-full object-cover"
									src={image}
									muted
									playsInline
								/>
							) : (
								<YNSMedia src={image} alt="" fill sizes="72px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			)}
		</section>
	);
}
