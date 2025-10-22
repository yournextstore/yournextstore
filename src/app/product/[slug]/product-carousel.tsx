"use client";

import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

type ProductCarouselProps = {
	images: string[];
	productName: string;
};

export function ProductCarousel({ images, productName }: ProductCarouselProps) {
	if (images.length === 0) {
		return (
			<div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
				<p className="text-gray-400">No images available</p>
			</div>
		);
	}

	if (images.length === 1) {
		return (
			<div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
				<Image
					src={images[0]}
					alt={productName}
					width={800}
					height={800}
					className="w-full h-full object-cover"
					priority
				/>
			</div>
		);
	}

	return (
		<Carousel className="w-full">
			<CarouselContent>
				{images.map((image, index) => (
					<CarouselItem key={index}>
						<div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
							<Image
								src={image}
								alt={`${productName} - Image ${index + 1}`}
								width={800}
								height={800}
								className="w-full h-full object-cover"
								priority={index === 0}
							/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="left-4" />
			<CarouselNext className="right-4" />
		</Carousel>
	);
}
