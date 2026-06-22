import Image from "next/image";
import { YnsLink } from "../yns-link";

export function ImageCardBanner() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<YnsLink
				prefetch={"eager"}
				href="#products"
				className="group relative block aspect-[2/1] sm:aspect-[3/1] rounded-lg overflow-hidden"
			>
				<Image
					src="/scraped-7.jpg"
					alt="Made for sensitive skin"
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-105"
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
				<div className="absolute bottom-0 left-0 p-6 sm:p-10">
					<p className="text-white/70 text-xs tracking-[0.15em] uppercase mb-1">Care for Your Skin</p>
					<h3 className="font-heading text-2xl sm:text-4xl font-light text-white tracking-wide">
						Made for sensitive skin
					</h3>
					<span className="inline-block mt-4 text-xs font-medium tracking-[0.15em] uppercase text-white border-b border-white/50 pb-0.5">
						Shop All Products
					</span>
				</div>
			</YnsLink>
		</section>
	);
}
