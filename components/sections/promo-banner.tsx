import Image from "next/image";
import { YnsLink } from "../yns-link";

export function PromoBanner() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Large banner */}
				<YnsLink
					prefetch={"eager"}
					href="#products"
					className="group relative aspect-[4/3] rounded-lg overflow-hidden"
				>
					<Image
						src="/scraped-13.jpg"
						alt="Show your sparkle"
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
					<div className="absolute bottom-0 left-0 p-6 sm:p-8">
						<p className="text-white/70 text-xs tracking-[0.15em] uppercase mb-1">The Vacation Shop</p>
						<h3 className="font-heading text-2xl sm:text-3xl font-light text-white tracking-wide">
							Show your Sparkle
						</h3>
						<p className="text-white/70 text-xs mt-2 max-w-xs">
							We create safe products that really work and are designed to make you feel good
						</p>
						<span className="inline-block mt-4 text-xs font-medium tracking-[0.15em] uppercase text-white border-b border-white/50 pb-0.5">
							Shop Makeup
						</span>
					</div>
				</YnsLink>

				{/* Small banner */}
				<YnsLink
					prefetch={"eager"}
					href="#products"
					className="group relative aspect-[4/3] rounded-lg overflow-hidden"
				>
					<Image
						src="/scraped-9.jpg"
						alt="Care for your beauty"
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
					<div className="absolute bottom-0 left-0 p-6 sm:p-8">
						<p className="text-white/70 text-xs tracking-[0.15em] uppercase mb-1">The Vacation Shop</p>
						<h3 className="font-heading text-2xl sm:text-3xl font-light text-white tracking-wide">
							Care for Your Beauty
						</h3>
						<p className="text-white/70 text-xs mt-2 max-w-xs">
							We create safe products that really work and are designed to make you feel good
						</p>
						<span className="inline-block mt-4 text-xs font-medium tracking-[0.15em] uppercase text-white border-b border-white/50 pb-0.5">
							Shop Skincare
						</span>
					</div>
				</YnsLink>
			</div>
		</section>
	);
}
