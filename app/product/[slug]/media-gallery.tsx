"use client";

import { useRef, useState } from "react";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type MediaGalleryProps = {
	images: string[];
	productName: string;
};

function Media({ src, alt, priority }: { src: string; alt: string; priority: boolean }) {
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
		<YNSMedia
			src={src}
			alt={alt}
			fill
			priority={priority}
			sizes="(max-width: 1023px) 100vw, 50vw"
			className="object-cover"
		/>
	);
}

/**
 * The original gives the photograph the whole right half of the page. Here every photograph
 * stacks down that half on desktop; on phones they become a swipe row with a "1 / 3" counter.
 */
export function MediaGallery({ images, productName }: MediaGalleryProps) {
	const rowRef = useRef<HTMLDivElement>(null);
	const [index, setIndex] = useState(0);

	if (images.length === 0) {
		return <div className="aspect-[4/5] bg-panel lg:h-svh" />;
	}

	const onScroll = () => {
		const row = rowRef.current;
		if (!row) return;
		setIndex(Math.round(row.scrollLeft / Math.max(row.clientWidth, 1)));
	};

	return (
		<section aria-label={`${productName} photographs`} className="relative">
			{/* Phones and tablets */}
			<div
				ref={rowRef}
				onScroll={onScroll}
				className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:hidden"
			>
				{images.map((src, i) => (
					<div key={src} className="relative aspect-[4/5] w-full shrink-0 snap-start bg-panel">
						<Media src={src} alt={`${productName}, view ${i + 1}`} priority={i === 0} />
					</div>
				))}
			</div>
			{images.length > 1 && (
				<p className="absolute bottom-3 right-4 text-foot text-black tabular-nums lg:hidden">
					{index + 1} / {images.length}
				</p>
			)}
			{/* Desktop */}
			<div className="hidden lg:block">
				{images.map((src, i) => (
					<div
						key={src}
						className={i === 0 ? "relative h-svh min-h-[36rem] bg-panel" : "relative aspect-square bg-panel"}
					>
						<Media src={src} alt={`${productName}, view ${i + 1}`} priority={i === 0} />
					</div>
				))}
			</div>
		</section>
	);
}
