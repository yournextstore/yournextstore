import Image from "next/image";
import { YnsLink } from "../yns-link";

export function TextWithImages() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
			<div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-center">
				<span className="font-heading text-3xl sm:text-4xl lg:text-6xl font-light tracking-wide">
					Make you look
				</span>
				<YnsLink
					prefetch={"eager"}
					href="#products"
					className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden inline-block shrink-0"
				>
					<Image src="/scraped-5.jpg" alt="Beauty texture" fill className="object-cover" sizes="80px" />
				</YnsLink>
				<span className="font-heading text-3xl sm:text-4xl lg:text-6xl font-light tracking-wide">and</span>
				<span className="font-heading text-3xl sm:text-4xl lg:text-6xl font-light italic tracking-wide text-primary">
					feel glowy
				</span>
				<YnsLink
					prefetch={"eager"}
					href="#products"
					className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden inline-block shrink-0"
				>
					<Image src="/scraped-11.jpg" alt="Lipstick product" fill className="object-cover" sizes="80px" />
				</YnsLink>
				<span className="font-heading text-3xl sm:text-4xl lg:text-6xl font-light tracking-wide">
					and healthy
				</span>
				<YnsLink
					prefetch={"eager"}
					href="#products"
					className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden inline-block shrink-0"
				>
					<Image src="/scraped-0.jpg" alt="Skincare product" fill className="object-cover" sizes="80px" />
				</YnsLink>
			</div>
		</section>
	);
}
