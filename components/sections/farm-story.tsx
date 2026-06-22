import Image from "next/image";
import { YnsLink } from "../yns-link";

export function FarmStory() {
	return (
		<section id="about" className="bg-[#f5e6d3]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
					<div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-square overflow-hidden rounded-[2rem] border-4 border-[#fbf4e8] shadow-[0_20px_60px_-20px_rgba(74,44,26,0.4)]">
						<Image
							src="/scraped-1.jpg"
							alt="Family farm pasture"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-tr from-[#4a2c1a]/30 via-transparent to-transparent" />
						{/* Folk frame corners */}
						<svg className="absolute -top-3 -left-3 h-12 w-12" viewBox="0 0 48 48" aria-hidden>
							<path
								d="M2 24 L 2 2 L 24 2"
								fill="none"
								stroke="#c99a5e"
								strokeWidth="3"
								strokeLinecap="round"
							/>
						</svg>
						<svg className="absolute -top-3 -right-3 h-12 w-12" viewBox="0 0 48 48" aria-hidden>
							<path
								d="M24 2 L 46 2 L 46 24"
								fill="none"
								stroke="#c99a5e"
								strokeWidth="3"
								strokeLinecap="round"
							/>
						</svg>
						<svg className="absolute -bottom-3 -left-3 h-12 w-12" viewBox="0 0 48 48" aria-hidden>
							<path
								d="M2 24 L 2 46 L 24 46"
								fill="none"
								stroke="#c99a5e"
								strokeWidth="3"
								strokeLinecap="round"
							/>
						</svg>
						<svg className="absolute -bottom-3 -right-3 h-12 w-12" viewBox="0 0 48 48" aria-hidden>
							<path
								d="M24 46 L 46 46 L 46 24"
								fill="none"
								stroke="#c99a5e"
								strokeWidth="3"
								strokeLinecap="round"
							/>
						</svg>
					</div>

					<div className="text-center lg:text-left">
						<p className="font-display text-xs sm:text-sm tracking-[0.32em] uppercase text-[#8b5e3c]">
							Our Roots
						</p>
						<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#4a2c1a] leading-[0.95]">
							From our pasture <span className="italic">to your pantry</span>
						</h2>
						<p className="mt-6 text-base sm:text-lg text-[#5a3a25] leading-relaxed">
							Your Next Store began as a tiny barn project on a family farm — two friends, a wooden spoon, and
							the stubborn belief that good food should taste like the place it came from. Today we still
							ferment in small batches, partner with farmers we know by name, and write the date on every jar
							by hand.
						</p>
						<p className="mt-4 text-base sm:text-lg text-[#5a3a25] leading-relaxed">
							No shortcuts. No mystery ingredients. Just real, wholesome goods made the way grandma
							would&apos;ve made them — if grandma was very into refrigeration.
						</p>
						<div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
							<YnsLink
								prefetch="eager"
								href="/faq"
								className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#4a2c1a] text-[#f5e6d3] text-xs sm:text-sm font-display font-bold tracking-[0.2em] uppercase border-2 border-[#4a2c1a] hover:bg-[#341e10] transition-colors"
							>
								Read Our Story
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
