"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
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

function Frame({
	src,
	alt,
	priority,
	sizes,
}: {
	src: string;
	alt: string;
	priority?: boolean;
	sizes: string;
}) {
	return isVideoUrl(src) ? (
		<video
			className="absolute inset-0 h-full w-full object-cover"
			src={src}
			muted
			loop
			autoPlay
			playsInline
		/>
	) : (
		<YNSMedia src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
	);
}

/**
 * The original shows one large photograph beside the buy box. Catalogue shots here are tall
 * portraits, so the wide two-thirds column shows them in pairs (one on phones), with a
 * thumbnail rail to jump through the rest.
 */
export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const [index, setIndex] = useState(0);
	const selectedVariant = useSelectedVariant(variants);
	const count = images.length;

	// Jump to the selected variant's first photo when the selection changes (no effect needed).
	const key = searchParams.toString();
	const previousKey = useRef(key);
	if (previousKey.current !== key) {
		previousKey.current = key;
		const first =
			selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
		const at = first ? images.indexOf(first) : -1;
		setIndex(at >= 0 ? at : 0);
	}

	if (count === 0) {
		return <div className="aspect-[4/5] bg-secondary lg:col-span-2 lg:aspect-[4/3]" />;
	}

	const step = (delta: number) => setIndex((current) => (current + delta + count) % count);
	const first = images[index] ?? images[0] ?? "";
	const second = count > 1 ? (images[(index + 1) % count] ?? null) : null;

	return (
		<section
			aria-label="Product photos"
			className="min-w-0 lg:sticky lg:top-6 lg:col-span-2 lg:self-start"
			onKeyDown={(event) => {
				if (event.key === "ArrowLeft") step(-1);
				if (event.key === "ArrowRight") step(1);
			}}
		>
			<div className="relative">
				<div className={cn("grid gap-2", second ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
					<div
						className={cn("relative bg-secondary", second ? "aspect-[4/5] lg:aspect-[2/3]" : "aspect-[4/5]")}
					>
						<Frame
							src={first}
							alt={`${productName}, photo ${index + 1} of ${count}`}
							priority
							sizes="(max-width: 1024px) 100vw, 33vw"
						/>
					</div>
					{second && (
						<div className="relative aspect-[2/3] bg-secondary max-lg:hidden">
							<Frame
								src={second}
								alt={`${productName}, photo ${((index + 1) % count) + 1} of ${count}`}
								sizes="33vw"
							/>
						</div>
					)}
				</div>
				{count > 1 && (
					<>
						<button
							type="button"
							onClick={() => step(-1)}
							aria-label="Previous photo"
							className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 transition-colors hover:bg-white"
						>
							<ChevronLeft className="h-5 w-5" aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={() => step(1)}
							aria-label="Next photo"
							className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 transition-colors hover:bg-white"
						>
							<ChevronRight className="h-5 w-5" aria-hidden="true" />
						</button>
						<p className="absolute bottom-3 left-3 bg-white px-2 py-1 text-xs tabular-nums">
							{index + 1} / {count}
						</p>
					</>
				)}
			</div>
			{count > 1 && (
				<div className="mt-3 grid grid-cols-1">
					<div className="flex min-w-0 gap-2 overflow-x-auto pb-2">
						{images.map((image, i) => (
							<button
								key={`${image}-${i}`}
								type="button"
								onClick={() => setIndex(i)}
								aria-label={`Show photo ${i + 1}`}
								aria-current={i === index ? "true" : undefined}
								className={cn(
									"relative aspect-[2/3] w-16 shrink-0 overflow-hidden bg-secondary transition-opacity",
									i === index
										? "outline outline-1 outline-offset-2 outline-black"
										: "opacity-60 hover:opacity-100",
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
				</div>
			)}
		</section>
	);
}
