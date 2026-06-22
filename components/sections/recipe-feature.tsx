import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function RecipeFeature() {
	return (
		<section id="recipes" className="relative bg-[var(--brand-espresso)] text-[var(--brand-cream)]">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				<div className="grid items-stretch gap-0 lg:grid-cols-[1.15fr_1fr]">
					{/* Photograph */}
					<div className="relative h-[420px] overflow-hidden sm:h-[520px] lg:h-[640px]">
						<Image
							src="/scraped-2.jpg"
							alt="A bottle of sauce on a sunlit table beside fresh ingredients"
							fill
							sizes="(max-width: 1024px) 100vw, 56vw"
							className="object-cover"
							priority={false}
						/>
						{/* Color overlay for atmosphere */}
						<div
							aria-hidden="true"
							className="absolute inset-0"
							style={{
								background:
									"linear-gradient(120deg, rgba(61,42,31,0.18) 0%, transparent 35%, rgba(61,42,31,0.35) 100%)",
							}}
						/>
						{/* Issue badge */}
						<div className="absolute left-6 top-6 inline-flex items-center gap-2 border border-[var(--brand-cream)]/40 bg-[var(--brand-cream)]/10 px-3 py-1.5 font-mono-ed text-[10px] uppercase tracking-[0.22em] text-[var(--brand-cream)] backdrop-blur-md">
							<span className="size-1.5 rounded-full bg-[var(--brand-ember)]" />
							Recipe — Issue 03
						</div>
					</div>

					{/* Pull quote panel */}
					<div className="relative flex flex-col justify-between gap-10 px-2 py-14 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
						<div>
							<p className="font-mono-ed text-[10px] uppercase tracking-[0.32em] text-[var(--brand-wheat)]">
								From the kitchen
							</p>
							<blockquote className="mt-8 font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium italic leading-[1.15] tracking-[-0.01em] text-[var(--brand-cream)]">
								&ldquo;A good sauce shouldn't need a paragraph. Three honest ingredients can change a Tuesday
								dinner.&rdquo;
							</blockquote>
							<p className="mt-8 font-mono-ed text-[11px] uppercase tracking-[0.18em] text-[var(--brand-cream)]/70">
								— Maya Reyes, Head of Recipes
							</p>
						</div>

						<div className="space-y-6 border-t border-[var(--brand-cream)]/15 pt-8">
							<p className="max-w-md font-mono-ed text-[12px] leading-relaxed text-[var(--brand-cream)]/75">
								This week: charred sourdough, soft-scrambled eggs, and a generous spoon of our House Drop.
								Twelve minutes, start to plate.
							</p>
							<YnsLink
								prefetch={"eager"}
								href="#recipes"
								className="group inline-flex items-center gap-3 border-b border-[var(--brand-cream)] pb-1 font-mono-ed text-[11px] uppercase tracking-[0.2em] text-[var(--brand-cream)]"
							>
								Read the recipe
								<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
