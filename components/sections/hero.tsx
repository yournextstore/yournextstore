import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-soot text-cream">
			{/* Layered flame background */}
			<div aria-hidden className="absolute inset-0 bg-fire" />
			<div aria-hidden className="absolute inset-0 flame-noise animate-flicker" />
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-soot/80 via-soot/30 to-transparent pointer-events-none"
			/>
			<div
				aria-hidden
				className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-soot via-soot/60 to-transparent pointer-events-none"
			/>

			{/* Floating embers (decorative SVG) */}
			<svg
				aria-hidden
				className="absolute inset-0 w-full h-full opacity-70 mix-blend-screen pointer-events-none"
				viewBox="0 0 1200 800"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<radialGradient id="emberGrad" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#FFE08A" stopOpacity="0.95" />
						<stop offset="60%" stopColor="#F26B1F" stopOpacity="0.4" />
						<stop offset="100%" stopColor="#F26B1F" stopOpacity="0" />
					</radialGradient>
				</defs>
				{Array.from({ length: 28 }).map((_, i) => {
					const cx = (i * 137) % 1200;
					const cy = 100 + ((i * 79) % 600);
					const r = 4 + ((i * 3) % 9);
					return (
						<circle
							key={`ember-${i}`}
							cx={cx}
							cy={cy}
							r={r}
							fill="url(#emberGrad)"
							opacity={0.6 + (i % 5) * 0.07}
						/>
					);
				})}
			</svg>

			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center min-h-[640px] lg:min-h-[680px] py-16 lg:py-20">
					{/* Left: floating jar */}
					<div className="relative h-[360px] sm:h-[480px] lg:h-[600px] flex items-center justify-center">
						<div className="absolute inset-x-6 bottom-4 h-12 rounded-full bg-black/60 blur-2xl" aria-hidden />
						<div className="relative w-[280px] sm:w-[360px] lg:w-[420px] aspect-[3/4] animate-float-jar drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)]">
							<Image
								src="/scraped-0.jpg"
								alt="Limited edition pasta sauce jar"
								fill
								priority
								sizes="(max-width: 1024px) 360px, 420px"
								className="object-contain"
							/>
						</div>
					</div>

					{/* Right: blackletter copy */}
					<div className="relative text-center lg:text-left">
						<span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-condensed tracking-[0.32em] text-gold mb-5">
							<span aria-hidden className="h-px w-8 bg-gold/70" />
							New Drop · Batch 003
							<span aria-hidden className="h-px w-8 bg-gold/70" />
						</span>
						<h1 className="font-display text-[44px] sm:text-6xl lg:text-7xl leading-[1.02] text-cream heading-shadow">
							<span className="block italic">Limited Edition</span>
							<span className="block text-white">Red Wine &amp; Reaper Chilli</span>
						</h1>
						<p className="mt-7 font-condensed text-base sm:text-lg tracking-[0.32em] text-cream/95">
							Ready-to-Eat Pasta Sauce
						</p>
						<p className="mt-5 max-w-md mx-auto lg:mx-0 text-sm sm:text-base text-cream/80 leading-relaxed">
							Slow-simmered with sangiovese, charred garlic and a wallop of Carolina Reaper. Sauce that bites
							back — bottled while it&apos;s still angry.
						</p>
						<div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-gold text-soot rounded-none font-condensed tracking-[0.18em] text-sm hover:bg-cream hover:text-ember transition-colors border-2 border-gold shadow-[0_4px_0_rgba(0,0,0,0.4)]"
							>
								Shop The Drop
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#story"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-transparent text-cream rounded-none font-condensed tracking-[0.18em] text-sm border-2 border-cream/40 hover:border-cream hover:bg-cream/10 transition-colors"
							>
								Our Heresy
							</YnsLink>
						</div>

						{/* Small badges */}
						<div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4 text-[11px] font-condensed tracking-[0.22em] text-cream/70">
							<span className="inline-flex items-center gap-2">
								<span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
								Hand-Jarred In Brooklyn
							</span>
							<span className="inline-flex items-center gap-2">
								<span aria-hidden className="h-1.5 w-1.5 rounded-full bg-flame" />
								No Preservatives
							</span>
							<span className="inline-flex items-center gap-2">
								<span aria-hidden className="h-1.5 w-1.5 rounded-full bg-blush" />
								Heat: 9 / 10
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom rule */}
			<div className="relative border-t border-gold/20" />
		</section>
	);
}
