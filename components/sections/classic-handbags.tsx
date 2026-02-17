import Image from "next/image";
import { YnsLink } from "../yns-link";

export function ClassicHandbags() {
	return (
		<section className="bg-cream py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Image collage */}
					<div className="relative grid grid-cols-3 gap-3 h-[300px] sm:h-[400px]">
						<div className="relative col-span-1 overflow-hidden">
							<Image
								src="/scraped-2.png"
								alt="Handbag"
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 33vw, 17vw"
							/>
						</div>
						<div className="relative col-span-1 overflow-hidden">
							<Image
								src="/scraped-3.png"
								alt="Handbag"
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 33vw, 17vw"
							/>
						</div>
						<div className="relative col-span-1 overflow-hidden">
							<Image
								src="/scraped-4.png"
								alt="Handbag"
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 33vw, 17vw"
							/>
						</div>
					</div>

					{/* Text content */}
					<div className="lg:pl-8">
						<span className="text-xs tracking-widest uppercase text-muted-foreground">Limited Edition</span>
						<h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl text-foreground">
							Classic handbags
						</h2>
						<p className="mt-4 text-muted-foreground leading-relaxed max-w-md">
							Fierce elegance is about authenticity, refinement, beauty and grace. It&apos;s a powerful lady
							like class with a touch of sophisticated sass that creates a sleek and commanding presence.
						</p>
						<div className="mt-8 flex flex-wrap gap-4">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center px-8 py-3 bg-navy text-white text-xs tracking-widest uppercase hover:bg-navy-light transition-colors"
							>
								Shop Handbags
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center px-8 py-3 border border-navy text-navy text-xs tracking-widest uppercase hover:bg-navy hover:text-white transition-colors"
							>
								Shop Totes
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
