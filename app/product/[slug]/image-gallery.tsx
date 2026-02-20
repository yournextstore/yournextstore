"use client";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
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

	const searchParamsKey = searchParams.toString();
	const prevSearchParamsKey = useRef(searchParamsKey);
	if (prevSearchParamsKey.current !== searchParamsKey) {
		prevSearchParamsKey.current = searchParamsKey;
		setSelectedIndex(0);
	}

	const displayImages = useMemo(() => {
		const selectedVariant = variants.find((v) =>
			v.combinations.every(
				(c) => searchParams.get(c.variantValue.variantType.label) === c.variantValue.value,
			),
		);

		if (selectedVariant?.images.length) {
			return selectedVariant.images;
		}

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
			<div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
				<div className="aspect-square bg-secondary flex items-center justify-center">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3 lg:sticky lg:top-28 lg:self-start">
			{/* Main Image */}
			<div className="group relative aspect-square overflow-hidden bg-secondary">
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

				{displayImages.length > 1 && (
					<div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 bg-background/90 shadow-lg backdrop-blur-sm hover:bg-background"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 bg-background/90 shadow-lg backdrop-blur-sm hover:bg-background"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
						>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>
				)}

				<div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
					<div className="flex items-center gap-2 bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
						<ZoomIn className="h-3.5 w-3.5" />
						Click to zoom
					</div>
				</div>

				{displayImages.length > 1 && (
					<div className="absolute bottom-4 left-4 bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
						{selectedIndex + 1} / {displayImages.length}
					</div>
				)}
			</div>

			{/* Thumbnails */}
			{displayImages.length > 1 && (
				<div className="flex gap-2 overflow-x-auto p-1 -m-1">
					{displayImages.map((image, index) => (
						<button
							key={image}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"relative aspect-square w-20 shrink-0 overflow-hidden transition-all duration-200",
								selectedIndex === index
									? "ring-2 ring-foreground ring-offset-1 ring-offset-background"
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
