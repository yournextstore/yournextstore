import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-pop-hero">
			{/* dotted texture */}
			<div aria-hidden className="absolute inset-0 bg-pop-dots opacity-25 mix-blend-overlay" />

			{/* mint deck baseline */}
			<div
				aria-hidden
				className="absolute inset-x-0 bottom-0 h-[28%] bg-pop-mint-deck"
				style={{ boxShadow: "0 -2px 0 rgba(0,0,0,0.05)" }}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-10 items-center pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pt-28 lg:pb-32 min-h-[640px]">
					{/* Copy */}
					<div className="relative z-10 max-w-xl">
						<span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] font-semibold text-pop-ink shadow-sm">
							<span className="h-1.5 w-1.5 rounded-full bg-primary" />
							New · Summer drop
						</span>
						<h1 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.92] uppercase text-primary drop-shadow-[2px_3px_0_rgba(255,255,255,0.7)]">
							Your favorite
							<br />
							<span className="text-pop-orange">boozy pop!</span>
						</h1>
						<p className="mt-6 max-w-md text-base sm:text-lg text-pop-ink/85 leading-relaxed">
							Hand-crafted alcoholic frozen treats in tropical flavors. 21% ABV. Cold-pressed real fruit.
							Pool-deck ready.
						</p>

						<div className="mt-9 flex flex-wrap items-center gap-4">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="group relative inline-flex h-14 items-center justify-center gap-2 bg-primary px-10 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-[6px_6px_0_rgba(47,47,47,0.92)] transition-transform hover:-translate-y-0.5 hover:shadow-[8px_8px_0_rgba(47,47,47,0.92)]"
							>
								Shop Now
								<span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#flavors"
								className="text-sm font-semibold uppercase tracking-[0.25em] text-pop-ink hover:text-primary underline decoration-2 underline-offset-[6px] decoration-primary"
							>
								See the flavors
							</YnsLink>
						</div>

						<div className="mt-10 flex items-center gap-6 text-[11px] uppercase tracking-[0.22em] text-pop-ink/80 font-semibold">
							<span className="inline-flex items-center gap-2">
								<span className="h-2 w-2 rotate-45 bg-pop-orange" />
								21+ Verified
							</span>
							<span className="inline-flex items-center gap-2">
								<span className="h-2 w-2 rotate-45 bg-primary" />
								Real fruit
							</span>
							<span className="inline-flex items-center gap-2">
								<span className="h-2 w-2 rotate-45 bg-accent" />
								Gluten-free
							</span>
						</div>
					</div>

					{/* Imagery */}
					<div className="relative h-[460px] sm:h-[540px] lg:h-[600px]">
						{/* sun burst */}
						<svg
							aria-hidden
							viewBox="0 0 400 400"
							className="absolute -top-10 -right-10 h-[380px] w-[380px] sm:h-[460px] sm:w-[460px] opacity-90 animate-wiggle"
						>
							<title>sunburst</title>
							<g fill="#fff" opacity="0.7">
								{Array.from({ length: 24 }).map((_, i) => (
									<rect
										key={`sb-${i}`}
										x="196"
										y="20"
										width="8"
										height="60"
										rx="3"
										transform={`rotate(${i * 15} 200 200)`}
									/>
								))}
							</g>
							<circle cx="200" cy="200" r="120" fill="#FFD954" />
						</svg>

						{/* succulent / plant accent */}
						<div className="absolute bottom-6 left-2 sm:left-6 w-[150px] sm:w-[180px] aspect-square z-10">
							<Image
								src="/scraped-2.jpg"
								alt=""
								fill
								sizes="200px"
								className="object-contain drop-shadow-[8px_12px_18px_rgba(0,0,0,0.18)]"
							/>
						</div>

						{/* coupe glass accent */}
						<div className="absolute bottom-10 left-32 sm:left-44 w-[200px] sm:w-[260px] aspect-[3/4] z-10">
							<Image
								src="/scraped-4.jpg"
								alt=""
								fill
								sizes="260px"
								className="object-contain drop-shadow-[8px_18px_28px_rgba(0,0,0,0.25)]"
							/>
						</div>

						{/* hero popsicle — tilted */}
						<div className="absolute -bottom-6 right-2 sm:right-8 w-[260px] sm:w-[320px] lg:w-[380px] aspect-[2/5] rotate-[8deg] z-20">
							<Image
								src="/scraped-0.jpg"
								alt="Featured boozy popsicle"
								fill
								sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 380px"
								className="object-contain drop-shadow-[12px_22px_36px_rgba(0,0,0,0.28)]"
								priority
							/>
						</div>

						{/* little sticker badge */}
						<div className="absolute top-6 left-2 hidden sm:flex h-24 w-24 items-center justify-center rounded-full bg-pop-pink text-white text-[11px] font-bold uppercase tracking-[0.18em] rotate-[-12deg] shadow-lg animate-wiggle">
							<span className="text-center leading-tight">
								21%
								<br />
								ABV
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* scallop edge transition */}
			<svg
				aria-hidden
				className="block w-full h-6 sm:h-8 text-background"
				viewBox="0 0 1200 40"
				preserveAspectRatio="none"
			>
				<title>edge</title>
				<path
					d="M0 40 Q60 0 120 40 T240 40 T360 40 T480 40 T600 40 T720 40 T840 40 T960 40 T1080 40 T1200 40 L1200 40 L0 40 Z"
					fill="currentColor"
				/>
			</svg>
		</section>
	);
}
