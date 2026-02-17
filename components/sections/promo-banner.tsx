import Image from "next/image";
import { YnsLink } from "../yns-link";

export function PromoBanner() {
	return (
		<section className="relative overflow-hidden bg-secondary">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 items-center">
					{/* Images collage */}
					<div className="relative grid grid-cols-3 gap-2 p-4 sm:p-8">
						<div className="col-span-2 row-span-2 relative aspect-[3/4] overflow-hidden">
							<Image
								src="/scraped-0.png"
								alt="Summer collection"
								fill
								sizes="(max-width: 1024px) 66vw, 33vw"
								className="object-cover"
							/>
						</div>
						<div className="relative aspect-square overflow-hidden">
							<Image
								src="/scraped-1.png"
								alt="Summer style"
								fill
								sizes="(max-width: 1024px) 33vw, 16vw"
								className="object-cover"
							/>
						</div>
						<div className="relative aspect-square overflow-hidden">
							<Image
								src="/scraped-2.png"
								alt="Summer look"
								fill
								sizes="(max-width: 1024px) 33vw, 16vw"
								className="object-cover"
							/>
						</div>
					</div>

					{/* Text content */}
					<div className="p-8 sm:p-12 lg:p-16">
						<p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Brand new</p>
						<h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide mb-4">
							Summer wear
						</h2>
						<p className="text-muted-foreground leading-relaxed mb-8">
							Check out our comfy crewnecks, lightweight khakis, breathable tanktops and more.
						</p>
						<div className="flex flex-wrap gap-4">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center h-10 px-6 bg-foreground text-primary-foreground text-xs tracking-widest uppercase hover:bg-foreground/90 transition-colors"
							>
								Shop Now
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center h-10 px-6 border border-foreground text-foreground text-xs tracking-widest uppercase hover:bg-foreground hover:text-primary-foreground transition-colors"
							>
								View All
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
