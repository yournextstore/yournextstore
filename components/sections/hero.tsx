import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 sm:py-16 lg:py-24">
					{/* Text Content */}
					<div className="max-w-xl">
						<p className="text-xs tracking-[0.3em] uppercase text-tea font-medium mb-4">Specialty Tea Shop</p>
						<h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.1]">
							A Unique Selection of Fine Teas
						</h1>
						<p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
							Discover our thoughtfully curated collection of premium loose leaf teas from China, Japan, and
							beyond. Crafted with tradition, free from artificial flavors.
						</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase font-medium hover:bg-primary/90 transition-colors"
							>
								Explore Our Teas
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="inline-flex items-center justify-center h-12 px-8 border border-foreground/20 text-sm tracking-[0.15em] uppercase font-medium hover:bg-foreground/5 transition-colors"
							>
								Our Story
							</YnsLink>
						</div>
					</div>

					{/* Hero Image */}
					<div className="relative aspect-[4/3] lg:aspect-square overflow-hidden">
						<Image
							src="/scraped-3.jpg"
							alt="Traditional tea ceremony with artisan teaware"
							fill
							priority
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
