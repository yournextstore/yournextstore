import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's left column: every photograph stacked on a halftone field, a big back arrow
 * over the first. Each 2:3 photo stands inside its frame with the dots around it. Phones get a
 * sideways swipe rail instead of a tall stack.
 */
export function ProductPhotos({ images, productName }: { images: string[]; productName: string }) {
	return (
		<div className="halftone relative min-w-0 bg-white">
			<Link
				href="/products"
				className="absolute top-3 left-3 z-10 flex h-12 w-14 items-center justify-center bg-white/0 text-black hover:text-swag-blue lg:top-5 lg:left-5"
			>
				<ArrowLeft className="h-12 w-12 stroke-[1.5]" aria-hidden />
				<span className="sr-only">Back to the catalogue</span>
			</Link>
			<ul className="flex snap-x snap-mandatory scroll-px-0 overflow-x-auto lg:flex-col lg:overflow-visible">
				{images.map((src, index) => (
					<li key={src} className="relative aspect-[4/5] w-[86%] shrink-0 snap-start sm:w-[60%] lg:w-full">
						<span className="absolute top-[7%] left-1/2 aspect-[2/3] h-[86%] -translate-x-1/2 overflow-hidden bg-swag-gray">
							{isVideoUrl(src) ? (
								<video className="h-full w-full object-cover" src={src} muted loop autoPlay playsInline />
							) : (
								<YNSMedia
									src={src}
									alt={index === 0 ? productName : `${productName}, photo ${index + 1}`}
									fill
									sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 30vw"
									className="object-cover"
									priority={index === 0}
								/>
							)}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
