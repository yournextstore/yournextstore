"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ZoomInIcon } from "lucide-react";
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
	onSale?: boolean;
};

function Media({
	src,
	alt,
	sizes,
	priority,
	className,
}: {
	src: string;
	alt: string;
	sizes: string;
	priority?: boolean;
	className?: string;
}) {
	return isVideoUrl(src) ? (
		<video
			className={cn("absolute inset-0 h-full w-full", className)}
			src={src}
			muted
			loop
			autoPlay
			playsInline
		/>
	) : (
		<YNSMedia
			src={src}
			alt={alt}
			fill
			sizes={sizes}
			priority={priority}
			fetchPriority={priority ? "high" : undefined}
			className={className}
		/>
	);
}

/** Sticky 3:4 photograph with a thumbnail row; a click opens the lightbox, as in the original. */
export function MediaGallery({ images, productName, variants, onSale = false }: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const [lightbox, setLightbox] = useState(false);

	const selectedVariant = useSelectedVariant(variants);
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

	const count = images.length;
	const go = (delta: number) => setSelectedIndex((index) => (index + delta + count) % count);
	const current = images[selectedIndex] ?? "";

	if (count === 0) {
		return <div className="aspect-[3/4] bg-tile md:sticky md:top-36 md:self-start" />;
	}

	return (
		<div className="min-w-0 self-start md:sticky md:top-36">
			<Dialog.Root open={lightbox} onOpenChange={setLightbox}>
				<Dialog.Trigger
					className="group relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-tile"
					aria-label="Open image gallery"
				>
					<Media
						src={current}
						alt={`${productName}, image ${selectedIndex + 1} of ${count}`}
						sizes="(max-width: 768px) 100vw, 528px"
						priority
						className="object-cover transition duration-300 group-hover:scale-[1.01]"
					/>
					{onSale && (
						<span className="absolute left-4 top-4 bg-ink px-3 py-1 text-small font-semibold text-paper">
							Sale
						</span>
					)}
					<span className="absolute bottom-3 right-3 bg-paper/85 p-2 text-ink opacity-0 backdrop-blur transition group-hover:opacity-100">
						<ZoomInIcon aria-hidden className="size-4" strokeWidth={2} />
					</span>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/80 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
					<Dialog.Popup
						className="fixed inset-0 z-[70] flex items-center justify-center outline-none"
						onKeyDown={(e) => {
							if (e.key === "ArrowLeft") go(-1);
							if (e.key === "ArrowRight") go(1);
						}}
					>
						<Dialog.Title className="sr-only">{productName}</Dialog.Title>
						<Dialog.Description className="sr-only">Product images</Dialog.Description>
						<figure className="relative z-10 w-full max-w-3xl px-5">
							<div className="relative h-[80vh] w-full">
								<Media
									src={current}
									alt={`${productName}, image ${selectedIndex + 1} of ${count}`}
									sizes="(max-width: 768px) 100vw, 768px"
									className="object-contain"
								/>
							</div>
							<figcaption className="mt-3 text-center text-small text-white/70">
								{selectedIndex + 1} / {count}
							</figcaption>
						</figure>
						<Dialog.Close
							className="absolute right-5 top-5 z-10 bg-white/10 p-2.5 text-white hover:bg-white/20"
							aria-label="Close gallery"
						>
							✕
						</Dialog.Close>
						{count > 1 && (
							<>
								<button
									type="button"
									onClick={() => go(-1)}
									className="absolute left-4 z-10 bg-white/10 px-3.5 py-3 text-xl text-white hover:bg-white/20"
									aria-label="Previous image"
								>
									‹
								</button>
								<button
									type="button"
									onClick={() => go(1)}
									className="absolute right-4 z-10 bg-white/10 px-3.5 py-3 text-xl text-white hover:bg-white/20"
									aria-label="Next image"
								>
									›
								</button>
							</>
						)}
					</Dialog.Popup>
				</Dialog.Portal>
			</Dialog.Root>

			{count > 1 && (
				<div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
					{images.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-pressed={selectedIndex === index}
							aria-label={`Show image ${index + 1}`}
							className={cn(
								"relative aspect-square w-20 shrink-0 overflow-hidden border-2 bg-tile transition",
								selectedIndex === index ? "border-brand" : "border-transparent hover:border-line",
							)}
						>
							<Media src={image} alt="" sizes="80px" className="object-cover" />
						</button>
					))}
				</div>
			)}
		</div>
	);
}
