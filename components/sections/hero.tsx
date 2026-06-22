import { Star } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden brick-hero-gradient text-white">
			{/* Ambient blue glow */}
			<div
				aria-hidden
				className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,91,255,0.35)_0%,transparent_60%)] blur-2xl brick-pulse-glow"
			/>
			{/* Subtle grain */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-[1.1fr_1fr] items-center gap-10 lg:gap-6 min-h-[560px] py-16 sm:py-24 lg:py-32">
					{/* Left column — copy */}
					<div className="max-w-xl">
						<div className="inline-flex items-center gap-2 rounded-full">
							<span className="flex items-center gap-0.5 text-[color:var(--brick-lavender)]">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={`star-${i}`} className="h-4 w-4 fill-current" />
								))}
							</span>
							<span className="text-sm text-white/80">35,000+ 5-star reviews</span>
						</div>

						<h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight">
							Take Back
							<br />
							Your Time
						</h1>

						<p className="mt-6 max-w-md text-base sm:text-lg text-white/70 leading-relaxed">
							Rediscover your phone&apos;s true purpose with a simple tap. Intentional tech, calmer days.
						</p>

						<div className="mt-10 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-base font-semibold text-primary-foreground transition-all hover:bg-[color:var(--brick-cobalt-deep)] hover:shadow-2xl hover:shadow-primary/40"
							>
								Shop Now
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#story"
								className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-8 text-base font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
							>
								Watch the story
							</YnsLink>
						</div>

						<dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
							<div>
								<dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Saved</dt>
								<dd className="mt-1 font-display text-2xl font-semibold">2.4h/day</dd>
							</div>
							<div>
								<dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Devices</dt>
								<dd className="mt-1 font-display text-2xl font-semibold">iOS &amp; Android</dd>
							</div>
							<div>
								<dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Returns</dt>
								<dd className="mt-1 font-display text-2xl font-semibold">30 days</dd>
							</div>
						</dl>
					</div>

					{/* Right column — floating product */}
					<div className="relative h-[420px] sm:h-[520px] lg:h-[620px] w-full">
						<div
							aria-hidden
							className="absolute left-1/2 top-1/2 h-72 w-72 sm:h-96 sm:w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(143,163,255,0.18)_0%,rgba(45,91,255,0.05)_45%,transparent_70%)] blur-2xl"
						/>
						<div className="absolute inset-0 grid place-items-center brick-float">
							<div className="relative">
								<div className="relative h-[260px] w-[260px] sm:h-[340px] sm:w-[340px] lg:h-[400px] lg:w-[400px] rounded-[44px] bg-gradient-to-br from-[#e7e3dd] via-[#cfcac3] to-[#a8a39c] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7),inset_0_-8px_24px_rgba(0,0,0,0.18),inset_0_4px_6px_rgba(255,255,255,0.4)]">
									{/* Inner bracket marks */}
									<svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
										<g stroke="#8c8780" strokeWidth="5" strokeLinecap="round" fill="none">
											<path d="M70 110 L70 70 L110 70" />
											<path d="M330 110 L330 70 L290 70" />
											<path d="M70 290 L70 330 L110 330" />
											<path d="M330 290 L330 330 L290 330" />
										</g>
										<text
											x="50%"
											y="55%"
											textAnchor="middle"
											fontFamily="var(--font-inter-tight), sans-serif"
											fontWeight="700"
											fontSize="56"
											letterSpacing="6"
											fill="#5d5750"
										>
											YNS
										</text>
									</svg>
									{/* Specular highlight */}
									<div className="pointer-events-none absolute inset-0 rounded-[44px] bg-[radial-gradient(120%_50%_at_30%_10%,rgba(255,255,255,0.55)_0%,transparent_45%)]" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Scroll cue */}
			<div className="relative flex justify-center pb-6">
				<div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/50">
					<span className="h-px w-8 bg-white/30" />
					Scroll
					<span className="h-px w-8 bg-white/30" />
				</div>
			</div>
		</section>
	);
}
