"use client";

import { useRef, useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type Variant = {
	id: string;
	images: string[];
	combinations: {
		variantValue: {
			value: string;
			variantType: { label: string };
		};
	}[];
};

/** Desktop shows the lead photo and a two-up grid of the next ones. */
const DESKTOP_LIMIT = 9;

function Media({
	src,
	alt,
	sizes,
	priority = false,
	className,
}: {
	src: string;
	alt: string;
	sizes: string;
	priority?: boolean;
	className?: string;
}) {
	return isVideoUrl(src) ? (
		<video className="absolute inset-0 size-full object-cover" src={src} muted loop autoPlay playsInline />
	) : (
		<YNSMedia
			src={src}
			alt={alt}
			fill
			sizes={sizes}
			priority={priority}
			className={cn("object-cover", className)}
		/>
	);
}

/**
 * The product's photos as tiles over the photo ground: one large, then two by two on desktop;
 * a swipe row with a counter on phones. Choosing an option brings its photos to the front.
 */
export function MediaGallery({
	images,
	productName,
	variants,
}: {
	images: string[];
	productName: string;
	variants: Variant[];
}) {
	const selected = useSelectedVariant(variants);
	const lead = selected && selected.combinations.length > 0 ? selected.images : [];
	const ordered = [...lead, ...images.filter((image) => !lead.includes(image))];
	const [current, setCurrent] = useState(0);
	const railRef = useRef<HTMLDivElement>(null);

	if (ordered.length === 0) {
		return <div className="aspect-[3/4] rounded-photo-lg bg-photo" />;
	}

	const desktop = ordered.slice(0, DESKTOP_LIMIT);
	const [first, ...rest] = desktop;

	return (
		<section aria-label={`${productName} photos`} className="min-w-0">
			{/* Phones: a full-bleed swipe row, rounded at the foot like a sheet. */}
			<div className="relative -mx-4 lg:hidden">
				<div
					ref={railRef}
					onScroll={(event) => {
						const rail = event.currentTarget;
						setCurrent(Math.round(rail.scrollLeft / Math.max(rail.clientWidth, 1)));
					}}
					className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-b-photo [scrollbar-width:none]"
				>
					{ordered.map((image, index) => (
						<div
							key={`${image}-${index}`}
							className="relative aspect-square w-full shrink-0 snap-start bg-photo"
						>
							<Media
								src={image}
								alt={index === 0 ? productName : `${productName}, photo ${index + 1}`}
								sizes="100vw"
								priority={index === 0}
							/>
						</div>
					))}
				</div>
				{ordered.length > 1 ? (
					<span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium tabular-nums text-[#111214] backdrop-blur-md">
						{Math.min(current + 1, ordered.length)} / {ordered.length}
					</span>
				) : null}
			</div>

			{/* Desktop: the lead photo, then two by two. */}
			<div className="hidden grid-cols-2 gap-2 lg:grid">
				{first ? (
					<div className="relative col-span-2 aspect-[4/5] overflow-hidden rounded-photo-lg bg-photo">
						<Media src={first} alt={productName} sizes="(max-width: 1023px) 100vw, 58vw" priority />
					</div>
				) : null}
				{rest.map((image, index) => (
					<div
						key={`${image}-${index}`}
						className="relative aspect-[3/4] overflow-hidden rounded-photo-lg bg-photo"
					>
						<Media src={image} alt={`${productName}, photo ${index + 2}`} sizes="29vw" />
					</div>
				))}
			</div>
		</section>
	);
}
