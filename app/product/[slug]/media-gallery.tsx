"use client";

import { useMemo, useRef, useState } from "react";
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
	priority = false,
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
			className="object-cover object-center"
		/>
	);
}

/**
 * Penny's image grid: three tall photographs side by side from lg (its 3-image layout, which
 * suits a store shot in 2:3 portrait), any further photos in a rail beneath. Phones swipe
 * through the whole gallery. A selected variant's own photos move to the front.
 */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const selectedVariant = useSelectedVariant(variants);
	const [active, setActive] = useState(0);
	const railRef = useRef<HTMLDivElement>(null);

	const ordered = useMemo(() => {
		const own = selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images : [];
		return [
			...own.filter((image) => images.includes(image)),
			...images.filter((image) => !own.includes(image)),
		];
	}, [images, selectedVariant]);

	if (ordered.length === 0) {
		return (
			<div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
				<div className="flex aspect-[4/5] items-center justify-center bg-gray-100 sm:rounded-lg lg:aspect-[3/1]">
					<p className="text-gray-500">No images available</p>
				</div>
			</div>
		);
	}

	const lead = ordered.slice(0, 3);
	const rest = ordered.slice(3);
	const columns =
		lead.length === 1 ? "lg:grid-cols-1" : lead.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

	return (
		<div className="mt-6">
			{/* Phones and tablets: one swipeable row of every photo with a position counter. */}
			<div className="relative mx-auto max-w-2xl sm:px-6 lg:hidden">
				<div
					ref={railRef}
					onScroll={(event) => {
						const rail = event.currentTarget;
						setActive(Math.round(rail.scrollLeft / rail.clientWidth));
					}}
					className="flex snap-x snap-mandatory overflow-x-auto sm:rounded-lg [&::-webkit-scrollbar]:hidden"
					style={{ scrollbarWidth: "none" }}
				>
					{ordered.map((image, index) => (
						<div key={image} className="relative aspect-[4/5] w-full shrink-0 snap-start bg-gray-100">
							<Media
								src={image}
								alt={index === 0 ? productName : ""}
								sizes="(min-width: 640px) 640px, 100vw"
								priority={index === 0}
							/>
						</div>
					))}
				</div>
				{ordered.length > 1 && (
					<p
						aria-live="polite"
						className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900 sm:left-10"
					>
						{Math.min(active, ordered.length - 1) + 1} / {ordered.length}
					</p>
				)}
			</div>

			{/* lg+: Penny's grid. */}
			<div className={cn("mx-auto hidden max-w-7xl gap-x-8 px-8 lg:grid", columns)}>
				{lead.map((image, index) => (
					<div
						key={image}
						className={cn(
							"relative overflow-hidden rounded-lg bg-gray-100",
							lead.length === 1 ? "aspect-[2/1]" : "aspect-[3/4]",
						)}
					>
						<Media
							src={image}
							alt={index === 0 ? productName : ""}
							sizes={lead.length === 1 ? "1216px" : "(min-width: 1280px) 384px, 30vw"}
							priority={index === 0}
						/>
					</div>
				))}
			</div>
			{rest.length > 0 && (
				<div className="mx-auto hidden max-w-7xl px-8 lg:block">
					<ul aria-label="More photos" className="mt-8 flex gap-4 overflow-x-auto pb-2">
						{rest.map((image) => (
							<li
								key={image}
								className="relative aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-md bg-gray-100"
							>
								<Media src={image} alt="" sizes="160px" />
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
