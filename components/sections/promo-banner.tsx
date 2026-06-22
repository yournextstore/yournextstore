import Image from "next/image";
import { YnsLink } from "../yns-link";

export function PromoBanner() {
	return (
		<section aria-label="Seasonal promo" className="bg-confetti">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
					<div className="relative aspect-[5/4] sm:aspect-[6/5] rounded-[36px] overflow-hidden bg-white shadow-[0_24px_60px_-24px_rgba(31,42,48,0.35)]">
						<Image
							src="/scraped-2.jpg"
							alt="A cozy storybook scene with plush characters"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-ink)] backdrop-blur">
							<span className="h-1.5 w-1.5 rounded-full bg-[var(--color-mint-deep)]" /> Editor&apos;s pick
						</div>
					</div>
					<div className="text-center lg:text-left">
						<span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-ink)]/70">
							Bedtime stories
						</span>
						<h2
							className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl text-[var(--color-ink)] leading-[1.05]"
							style={{ fontVariationSettings: "'SOFT' 100" }}
						>
							A little softness for sleepy heads.
						</h2>
						<p className="mt-5 max-w-md mx-auto lg:mx-0 text-[var(--color-ink)]/70 leading-relaxed">
							From midnight cuddles to morning wiggles — our sleep-time collection is hand-stitched with the
							dreamiest, most touchable fabrics.
						</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-sm font-semibold tracking-wide hover:bg-[var(--color-ink)]/85 transition-colors"
							>
								Shop the bedtime edit
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/faq"
								className="inline-flex items-center justify-center h-12 px-7 rounded-full border-[1.5px] border-[var(--color-ink)] text-[var(--color-ink)] text-sm font-semibold tracking-wide hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors"
							>
								Read the story
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
