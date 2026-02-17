import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-navy min-h-[70vh] sm:min-h-[80vh] flex items-center">
			{/* Background image */}
			<Image
				src="/scraped-0.png"
				alt=""
				fill
				priority
				className="object-cover object-center opacity-40"
				sizes="100vw"
			/>
			{/* Gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#3d4259]/80 via-[#3d4259]/50 to-transparent" />

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
				<div className="max-w-xl">
					<h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl italic text-white leading-tight">
						Fierce. Elegant.
					</h1>
					<p className="mt-4 text-lg sm:text-xl text-white/80 font-light">Handbags for the modern woman.</p>
					<div className="mt-8 flex gap-4">
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="inline-flex items-center justify-center px-8 py-3 bg-white text-navy text-sm tracking-widest uppercase hover:bg-white/90 transition-colors"
						>
							Shop Now
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
