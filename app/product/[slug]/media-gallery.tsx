"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
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
	/** The left column's category list; it shares the sticky sidebar with the thumbnails. */
	sidebar?: ReactNode;
};

/**
 * The original's product media: every photograph stacked down the centre column, with a sticky
 * sidebar of small portrait thumbnails that scroll to their photograph and outline the one in view.
 */
export function MediaGallery({ images, productName, variants, sidebar }: MediaGalleryProps) {
	const selectedVariant = useSelectedVariant(variants);
	const variantFirst =
		selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
	// A chosen variant's own photograph leads the stack; the rest keep their order.
	const ordered =
		variantFirst && images.includes(variantFirst)
			? [variantFirst, ...images.filter((image) => image !== variantFirst)]
			: images;

	const [active, setActive] = useState(0);
	const refs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const nodes = refs.current.filter((node): node is HTMLDivElement => node !== null);
		if (nodes.length < 2) return;
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((entry) => entry.isIntersecting);
				const first = visible[0];
				if (first) setActive(Number((first.target as HTMLElement).dataset.index));
			},
			{ rootMargin: "-30% 0px -60% 0px" },
		);
		nodes.map((node) => observer.observe(node));
		return () => observer.disconnect();
	}, []);

	return (
		<>
			<div className="below-header sticky hidden min-w-64 justify-between self-start lg:flex">
				<div className="min-w-0">{sidebar}</div>
				{ordered.length > 1 && (
					<div className="mr-4 ml-4 flex flex-col gap-4">
						{ordered.map((image, index) => (
							<button
								key={image}
								type="button"
								aria-label={`Show image ${index + 1}`}
								aria-current={active === index}
								onClick={() => refs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" })}
								className={cn(
									"relative h-14 w-12 overflow-hidden border-2 bg-tint",
									active === index ? "border-black" : "border-white",
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
									<YNSMedia src={image} alt="" fill sizes="48px" className="object-cover" />
								)}
							</button>
						))}
					</div>
				)}
			</div>

			<div className="min-w-0 flex-1 lg:mx-16">
				{ordered.length === 0 ? (
					<div className="flex aspect-[4/5] items-center justify-center bg-tint text-ink-soft">
						No images available
					</div>
				) : (
					ordered.map((image, index) => (
						<div
							key={image}
							ref={(node) => {
								refs.current[index] = node;
							}}
							data-index={index}
							className="relative mb-4 aspect-[4/5] scroll-mt-28 overflow-hidden bg-tint"
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
									sizes="(max-width: 1024px) 100vw, 45vw"
									className="object-cover"
									priority={index === 0}
									fetchPriority={index === 0 ? "high" : undefined}
								/>
							)}
						</div>
					))
				)}
			</div>
		</>
	);
}
