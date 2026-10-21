"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { YNSMedia } from "@/lib/yns-media";

/** One rounded photograph with small square arrow buttons in its corner, as in the original. */
export function FeaturedGallery({ images, productName }: { images: string[]; productName: string }) {
	const [index, setIndex] = useState(0);
	const image = images[index];
	const step = (direction: 1 | -1) => setIndex((i) => (i + direction + images.length) % images.length);

	return (
		<div className="relative aspect-4/5 overflow-hidden rounded-md bg-secondary">
			{image && (
				<YNSMedia
					src={image}
					alt={productName}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover"
				/>
			)}
			{images.length > 1 && (
				<div className="absolute right-4 bottom-4 flex gap-1.5">
					<button
						type="button"
						onClick={() => step(-1)}
						aria-label="Previous image"
						className="inline-flex size-8 items-center justify-center rounded-sm bg-white text-foreground shadow-sm"
					>
						<ArrowLeftIcon aria-hidden className="size-4" strokeWidth={1.5} />
					</button>
					<button
						type="button"
						onClick={() => step(1)}
						aria-label="Next image"
						className="inline-flex size-8 items-center justify-center rounded-sm bg-white text-foreground shadow-sm"
					>
						<ArrowRightIcon aria-hidden className="size-4" strokeWidth={1.5} />
					</button>
				</div>
			)}
		</div>
	);
}
