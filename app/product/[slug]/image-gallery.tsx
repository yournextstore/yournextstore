"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";
import { Button } from "@/components/ui/button";
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
			<div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
				<div className="aspect-square product-card-bg rounded-2xl flex items-center justify-center">
					<div className="text-center">
						<MaterialIcon name="spa" className="text-primary text-7xl mb-2" />
						<p className="text-gray-400">No images available</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
			{/* Main Image */}
			<div className="group relative aspect-square overflow-hidden rounded-2xl product-card-bg">
				<YNSImage
					src={displayImages[selectedIndex]}
					alt={`${productName} - View ${selectedIndex + 1}`}
					fill
					className={cn(
						"object-cover transition-transform duration-500",
						isZoomed && "scale-150 cursor-zoom-out",
					)}
					onClick={() => setIsZoomed(!isZoomed)}
					priority
				/>

				{/* Navigation Arrows */}
				{displayImages.length > 1 && (
					<div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-full bg-dark-accent/90 text-white shadow-lg backdrop-blur-sm hover:bg-primary border-0"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
						>
							<MaterialIcon name="chevron_left" className="text-xl" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-full bg-dark-accent/90 text-white shadow-lg backdrop-blur-sm hover:bg-primary border-0"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
						>
							<MaterialIcon name="chevron_right" className="text-xl" />
						</Button>
					</div>
				)}

				{/* Zoom Indicator */}
				<div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
					<div className="flex items-center gap-2 rounded-full bg-dark-accent/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
						<MaterialIcon name="zoom_in" className="text-sm" />
						Click to zoom
					</div>
				</div>

				{/* Image Counter */}
				{displayImages.length > 1 && (
					<div className="absolute bottom-4 left-4 rounded-full bg-dark-accent/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
						{selectedIndex + 1} / {displayImages.length}
					</div>
				)}
			</div>

			{/* Thumbnails */}
			{displayImages.length > 1 && (
				<div className="flex gap-3 overflow-x-auto p-2 -m-2">
					{displayImages.map((image, index) => (
						<button
							key={image}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg transition-all duration-200",
								selectedIndex === index
									? "ring-2 ring-primary ring-offset-2 ring-offset-background-dark"
									: "opacity-60 hover:opacity-100",
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
