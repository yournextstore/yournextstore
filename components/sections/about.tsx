import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="about" className="bg-cream-paper grain-overlay relative">
			<div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-24 sm:px-10 lg:grid-cols-12 lg:gap-20 lg:py-32">
				<div className="relative lg:col-span-5">
					<div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary shadow-[0_30px_60px_-20px_rgba(92,29,15,0.35)]">
						<Image
							src="/scraped-4.jpg"
							alt="A jar of small-batch ghee in afternoon light"
							fill
							sizes="(max-width: 1024px) 100vw, 40vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-tr from-mahogany/30 via-transparent to-honey/20" />
					</div>
					<span className="font-mono absolute -bottom-4 left-6 bg-mahogany px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-honey">
						est. small batch
					</span>
				</div>
				<div className="lg:col-span-7 lg:pl-8">
					<p className="font-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-amber-deep">/ our story</p>
					<h2
						className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-mahogany sm:text-5xl lg:text-6xl"
						style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
					>
						a slow-cooked ritual, jarred for the modern pantry.
					</h2>
					<div className="mt-8 grid grid-cols-1 gap-6 text-base leading-relaxed text-mahogany/75 sm:grid-cols-2 sm:gap-10">
						<p>
							Every jar at Your Next Store begins the same way: grass-fed cream, gently simmered in copper
							until the milk solids brown and the room smells of caramel and butterscotch. We stir, skim,
							strain — then bottle, by hand, the same afternoon.
						</p>
						<p>
							No shortcuts, no seed oils, no fillers. Just shelf-stable, lactose-free golden fat with a smoke
							point that handles a roaring cast-iron and a flavor sweet enough to spread on toast. You can
							taste the pasture.
						</p>
					</div>
					<div className="mt-10 flex flex-wrap items-center gap-6">
						<YnsLink
							prefetch="eager"
							href="/products"
							className="font-mono inline-flex h-12 items-center justify-center gap-3 rounded-none bg-mahogany px-7 text-xs uppercase tracking-[0.25em] text-honey transition-colors hover:bg-amber-deep"
						>
							Read the full story
						</YnsLink>
						<span className="font-mono text-[11px] uppercase tracking-[0.25em] text-mahogany/50">
							— Made in Vermont
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
