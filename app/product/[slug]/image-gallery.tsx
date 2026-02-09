"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { YNSImage } from "@/lib/yns-image";

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

type ImageGalleryProps = {
	images: string[];
	productName: string;
	variants: Variant[];
};

export function ImageGallery({ images, productName, variants }: ImageGalleryProps) {
	const searchParams = useSearchParams();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);

	// Track previous searchParams to reset index when variant changes (avoids useEffect)
	const searchParamsKey = searchParams.toString();
	const prevSearchParamsKey = useRef(searchParamsKey);
	if (prevSearchParamsKey.current !== searchParamsKey) {
		prevSearchParamsKey.current = searchParamsKey;
		setSelectedIndex(0);
	}

	// Compute which images to display based on selected variant
	const displayImages = useMemo(() => {
		// Find selected variant based on URL params
		const selectedVariant = variants.find((v) =>
			v.combinations.every(
				(c) => searchParams.get(c.variantValue.variantType.label) === c.variantValue.value,
			),
		);

		// If variant selected and has images, show those
		if (selectedVariant?.images.length) {
			return selectedVariant.images;
		}

		// Fallback to all images
		return images;
	}, [variants, searchParams, images]);

	const handlePrevious = () => {
		setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
	};

	if (displayImages.length === 0) {
		return (
			<div className="flex flex-col gap-6">
				<div className="aspect-[3/4] bg-zinc-100 flex items-center justify-center">
					<p className="text-xs tracking-[0.2em] uppercase text-zinc-400">No images available</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Main Image */}
			<div className="group relative aspect-[3/4] overflow-hidden bg-zinc-100">
				<YNSImage
					src={displayImages[selectedIndex]}
					alt={`${productName} - View ${selectedIndex + 1}`}
					fill
					className={cn(
						"object-cover transition-transform duration-700",
						isZoomed && "scale-150 cursor-zoom-out",
					)}
					onClick={() => setIsZoomed(!isZoomed)}
					priority
				/>

				{/* Navigation Arrows - minimal style */}
				{displayImages.length > 1 && (
					<div className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
						<button
							type="button"
							className="w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white transition-colors"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
						>
							<ChevronLeft className="h-4 w-4 text-zinc-900" />
						</button>
						<button
							type="button"
							className="w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white transition-colors"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
						>
							<ChevronRight className="h-4 w-4 text-zinc-900" />
						</button>
					</div>
				)}

				{/* Image Counter - museum style */}
				{displayImages.length > 1 && (
					<div className="absolute bottom-6 left-6">
						<p className="text-xs tracking-[0.2em] uppercase text-zinc-500 bg-white/90 px-3 py-1.5">
							{String(selectedIndex + 1).padStart(2, "0")} / {String(displayImages.length).padStart(2, "0")}
						</p>
					</div>
				)}
			</div>

			{/* Thumbnails - clean row */}
			{displayImages.length > 1 && (
				<div className="flex gap-3">
					{displayImages.map((image, index) => (
						<button
							key={image}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"relative aspect-[3/4] w-20 overflow-hidden transition-all duration-300",
								selectedIndex === index ? "opacity-100" : "opacity-40 hover:opacity-70",
							)}
						>
							<YNSImage
								src={image}
								alt={`${productName} thumbnail ${index + 1}`}
								fill
								className="object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
