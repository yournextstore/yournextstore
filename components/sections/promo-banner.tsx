import Image from "next/image";
import { YnsLink } from "../yns-link";

export function PromoBanner() {
	return (
		<section className="relative overflow-hidden bg-[#f5f5f0] py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left: Image collage */}
					<div className="grid grid-cols-3 gap-3">
						<div className="col-span-2 row-span-2 relative aspect-[3/4] overflow-hidden">
							<Image
								src="/scraped-5.png"
								alt="Summer collection"
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 66vw, 33vw"
							/>
						</div>
						<div className="relative aspect-square overflow-hidden">
							<Image
								src="/scraped-6.png"
								alt="Summer wear"
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 33vw, 16vw"
							/>
						</div>
						<div className="relative aspect-square overflow-hidden">
							<Image
								src="/scraped-7.png"
								alt="Summer style"
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 33vw, 16vw"
							/>
						</div>
					</div>

					{/* Right: Text content */}
					<div className="lg:pl-12">
						<p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Brand new</p>
						<h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
							Summer wear
						</h2>
						<p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
							Check out our comfy crewnecks, lightweight khakis, breathable tanktops and more.
						</p>
						<div className="flex flex-wrap gap-4">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-primary-foreground text-sm uppercase tracking-widest font-medium hover:bg-foreground/90 transition-colors"
							>
								Shop Tops
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center h-12 px-8 border border-foreground text-foreground text-sm uppercase tracking-widest font-medium hover:bg-foreground hover:text-primary-foreground transition-colors"
							>
								Shop All
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
