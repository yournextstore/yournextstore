import Image from "next/image";
import { YnsLink } from "../yns-link";

export function CtaBanner() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="relative rounded-lg overflow-hidden">
				<div className="relative aspect-[21/9] sm:aspect-[3/1]">
					<Image src="/scraped-5.jpg" alt="Beauty products" fill className="object-cover" sizes="100vw" />
					<div className="absolute inset-0 bg-foreground/30" />
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
						<h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-light text-white tracking-wide max-w-2xl leading-snug">
							Because you need time for yourself. Blend beauty in you
						</h2>
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="mt-6 inline-flex items-center justify-center h-11 px-8 bg-white text-foreground text-xs font-medium tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
						>
							Shop All Products
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
