"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
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
	soldOut?: boolean;
};

export function MediaGallery({ images, productName, variants, soldOut = false }: MediaGalleryProps) {
	const searchParams = useSearchParams();

	// The gallery always shows the full image set (product + every variant image). When a
	// variant is selected we don't filter the list — that would hide the other thumbnails —
	// we just jump the active image to that variant's first photo within the full gallery.
	const displayImages = images;

	const selectedVariant = useSelectedVariant(variants);

	const variantImageIndex = useMemo(() => {
		// Only variants with real combinations drive the gallery jump.
		const firstVariantImage =
			selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
		if (!firstVariantImage) return 0;

		const index = images.indexOf(firstVariantImage);
		return Math.max(index, 0);
	}, [selectedVariant, images]);

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

	const current = displayImages[selectedIndex] ?? "";
	const soldOutBadge = soldOut ? (
		<span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground ring-1 ring-line">
			Sold out
		</span>
	) : null;

	if (displayImages.length === 0) {
		return (
			<div className="relative flex aspect-square items-center justify-center rounded-lg bg-card">
				<p className="text-sm text-faint">No image</p>
				{soldOutBadge}
			</div>
		);
	}

	return (
		<div className="min-w-0">
			<div className="relative aspect-square overflow-hidden rounded-lg bg-card">
				{isVideoUrl(current) ? (
					<video
						className={cn("absolute inset-0 h-full w-full object-cover", soldOut && "opacity-60")}
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
						alt={displayImages.length > 1 ? `${productName}, image ${selectedIndex + 1}` : productName}
						fill
						sizes="(max-width: 768px) 100vw, 520px"
						className={cn("object-cover", soldOut && "opacity-60")}
						priority
						fetchPriority="high"
					/>
				)}
				{soldOutBadge}
			</div>

			{displayImages.length > 1 && (
				<div className="mt-3 flex gap-2 overflow-x-auto">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`Show image ${index + 1}`}
							aria-current={selectedIndex === index ? "true" : undefined}
							className={cn(
								"relative h-16 w-16 shrink-0 overflow-hidden rounded border bg-card transition",
								selectedIndex === index ? "border-foreground" : "border-line hover:border-foreground",
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
								<YNSMedia src={image} alt="" fill sizes="64px" className="object-cover" />
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
