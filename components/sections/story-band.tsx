import Image from "next/image";
import { YnsLink } from "../yns-link";

export function StoryBand() {
	return (
		<section className="bg-[--bone]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
					<div className="lg:col-span-7 relative aspect-[4/3] overflow-hidden">
						<Image
							src="/scraped-3.jpg"
							alt="Coastal lifestyle"
							fill
							sizes="(max-width: 1024px) 100vw, 60vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />
					</div>
					<div className="lg:col-span-5">
						<p className="text-[11px] uppercase tracking-[0.22em] text-[--oxblood] font-semibold">
							Our story
						</p>
						<h2 className="mt-4 display-section text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight">
							Built for movement.
							<br /> Designed for life.
						</h2>
						<p className="mt-6 text-foreground/70 leading-relaxed">
							Born on the coast and tested at sunrise, Your Next Store engineers performance apparel with the
							durability of technical sportswear and the ease of your favorite weekend tee. Soft hand,
							considered cuts, fabrics that move with you.
						</p>
						<p className="mt-4 text-foreground/70 leading-relaxed">
							From the studio to the trail to the after-class coffee run — one wardrobe, infinite reps.
						</p>
						<YnsLink
							href="/products"
							className="mt-8 inline-flex items-center h-11 px-7 bg-[--ink] text-white text-xs tracking-[0.18em] uppercase font-semibold hover:bg-[--ink-soft] transition-colors"
						>
							Read Our Story
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
