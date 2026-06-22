import Image from "next/image";
import { YnsLink } from "../yns-link";

export function EditorialSplit() {
	return (
		<section id="about" className="relative bg-cream">
			<div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
				<div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
					<div className="relative aspect-[4/5] overflow-hidden lg:col-span-7">
						<Image
							src="/scraped-3.jpg"
							alt="Athlete in motion"
							fill
							sizes="(max-width: 1024px) 100vw, 60vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-tr from-ink/30 via-transparent to-transparent" />
					</div>

					<div className="flex flex-col justify-center lg:col-span-5">
						<p className="eyebrow text-bronze">A Manifesto</p>
						<h2 className="mt-5 font-display text-4xl font-light leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
							Beauty shouldn&rsquo;t flinch when life moves fast.
						</h2>
						<div className="mt-8 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
							<p>
								We started Your Next Store because the rituals we love kept failing us at the worst possible
								moments. Mascara on the pillowcase. Foundation on a collar. Lipstick across a coffee cup.
							</p>
							<p>
								So we built a line of performance beauty that holds — through sprints, presentations, plot
								twists. Cleaner ingredients. Cinematic finishes. Engineered to outlast every version of you.
							</p>
						</div>
						<div className="mt-10 flex items-center gap-6">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="eyebrow inline-flex items-center gap-2 bg-ink px-6 py-3 text-cream transition-colors hover:bg-cocoa"
							>
								Read our story
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#impact"
								className="eyebrow border-b border-ink/60 pb-1 text-ink/80 hover:text-ink"
							>
								Our ingredients →
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
