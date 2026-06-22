import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

export function About() {
	return (
		<section
			id="about"
			className="relative overflow-hidden"
			style={{ background: "linear-gradient(180deg, var(--tizz-cream) 0%, #ffeaa6 100%)" }}
		>
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					{/* Left: oversized headline */}
					<div className="relative">
						<p className="tizz-overline text-[var(--tizz-orange)] text-xs mb-5">The story</p>
						<h2 className="tizz-display text-[var(--tizz-deep)] text-5xl sm:text-7xl lg:text-8xl leading-[0.85]">
							Brewed for
							<br />
							<span className="text-[var(--tizz-orange)]">people</span>
							<br />
							who get
							<br />
							<span className="italic">tizzy.</span>
						</h2>
						<p className="mt-8 max-w-md text-lg text-[var(--tizz-deep)]/80 leading-relaxed">
							Born in a garage in 2021 from a fizzy obsession with bold flavor and louder design. We chase the
							sugar-rush nostalgia of corner-store soda — then remix it with real fruit, lower sugar, and zero
							apologies.
						</p>
						<div className="mt-10 flex flex-wrap gap-3">
							<YnsLink
								href="/products"
								className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[var(--tizz-deep)] text-[var(--tizz-cream)] tizz-overline text-sm hover:bg-[var(--tizz-orange)] transition-colors"
							>
								Crack a can
							</YnsLink>
							<YnsLink
								href="/faq"
								className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 border-[var(--tizz-deep)] text-[var(--tizz-deep)] tizz-overline text-sm hover:bg-[var(--tizz-deep)] hover:text-[var(--tizz-cream)] transition-colors"
							>
								Read the lore
							</YnsLink>
						</div>
					</div>

					{/* Right: lifestyle product image on color block */}
					<div className="relative">
						<div className="absolute inset-0 -rotate-3 rounded-[3rem] bg-[var(--tizz-orange)] tizz-noise" />
						<div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border-4 border-[var(--tizz-deep)]">
							<Image
								src="/scraped-4.jpg"
								alt="Lifestyle product shot"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
							<div className="absolute top-5 right-5 bg-[var(--tizz-yellow)] border-2 border-[var(--tizz-deep)] rounded-full px-4 py-2 tizz-overline text-xs text-[var(--tizz-deep)] -rotate-6">
								Est. 2021
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
