import Image from "next/image";
import { YnsLink } from "../yns-link";

export function CtaBanner() {
	return (
		<section className="py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-10">
					<h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-light text-foreground max-w-2xl mx-auto">
						Because you need time for yourself. Blend beauty in you
					</h2>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-flex items-center justify-center h-12 px-8 mt-6 bg-foreground text-primary-foreground text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
					>
						Shop All Products
					</YnsLink>
				</div>

				<div className="relative aspect-[21/9] rounded-xl overflow-hidden">
					<Image src="/scraped-8.jpg" alt="Care for your skin" fill className="object-cover" sizes="100vw" />
					<div className="absolute inset-0 bg-black/20" />
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
						<p className="text-sm tracking-widest uppercase mb-2 opacity-80">Care for Your Skin</p>
						<h3 className="font-heading text-3xl sm:text-4xl font-light mb-4">Made for sensitive skin</h3>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="text-sm font-medium tracking-wide uppercase underline underline-offset-4"
						>
							Shop All Products
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
