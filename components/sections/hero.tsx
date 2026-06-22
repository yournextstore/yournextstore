import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate bg-cream">
			<div className="grid min-h-[68vh] grid-cols-1 md:min-h-[78vh] md:grid-cols-3 lg:min-h-[84vh]">
				{/* LEFT — cinematic close-up, sweat-glossed skin */}
				<div className="relative overflow-hidden hero-glow-cocoa hero-grain">
					<Image
						src="/scraped-0.jpg"
						alt="Editorial close-up portrait"
						fill
						priority
						sizes="(max-width: 768px) 100vw, 33vw"
						className="object-cover mix-blend-luminosity opacity-90"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
					<svg
						aria-hidden="true"
						className="absolute inset-0 h-full w-full opacity-[0.08] mix-blend-overlay"
						preserveAspectRatio="none"
					>
						<title>grain</title>
						<filter id="grainA">
							<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
							<feColorMatrix values="0 0 0 0 0.93  0 0 0 0 0.86  0 0 0 0 0.75  0 0 0 1 0" />
						</filter>
						<rect width="100%" height="100%" filter="url(#grainA)" />
					</svg>
					<div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 lg:p-12">
						<p className="eyebrow text-cream/70">Lookbook · Vol. 01</p>
						<h1 className="mt-4 max-w-md font-display text-3xl font-light leading-[1.05] tracking-tight text-cream sm:text-4xl lg:text-5xl">
							You don&rsquo;t have to sit still to look pretty.
						</h1>
					</div>
				</div>

				{/* CENTER — product still life on cream */}
				<div className="relative overflow-hidden hero-glow-cream">
					<Image
						src="/scraped-1.jpg"
						alt="Product still life on warm cream"
						fill
						priority
						sizes="(max-width: 768px) 100vw, 33vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-cream/0 via-cream/0 to-cream/40" />

					{/* Centered bottle silhouette overlay (SVG) */}
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="relative bottle-shadow">
							<svg
								width="120"
								height="220"
								viewBox="0 0 120 220"
								className="drop-shadow-xl"
								aria-hidden="true"
							>
								<title>Lock &amp; Go</title>
								<defs>
									<linearGradient id="bottleGrad" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#F4ECE2" />
										<stop offset="100%" stopColor="#D9C5B0" />
									</linearGradient>
									<linearGradient id="bottleHi" x1="0" y1="0" x2="1" y2="0">
										<stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
										<stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
										<stop offset="100%" stopColor="rgba(255,255,255,0)" />
									</linearGradient>
								</defs>
								{/* cap */}
								<rect x="42" y="0" width="36" height="34" rx="2" fill="#1E2A3A" />
								{/* neck */}
								<rect x="48" y="34" width="24" height="14" fill="#0B0A08" opacity="0.85" />
								{/* body */}
								<rect x="22" y="48" width="76" height="168" rx="6" fill="url(#bottleGrad)" />
								<rect x="22" y="48" width="20" height="168" rx="6" fill="url(#bottleHi)" />
								{/* navy label band */}
								<rect x="22" y="92" width="76" height="68" fill="#1E2A3A" />
								<text
									x="60"
									y="118"
									textAnchor="middle"
									fontFamily="Cormorant Garamond, serif"
									fontSize="13"
									fill="#F4ECE2"
									letterSpacing="1.5"
								>
									LOCK &amp; GO
								</text>
								<text
									x="60"
									y="134"
									textAnchor="middle"
									fontFamily="Inter, sans-serif"
									fontSize="6"
									fill="#D9C5B0"
									letterSpacing="3"
								>
									SETTING SPRAY
								</text>
								<line x1="32" y1="146" x2="88" y2="146" stroke="#D9C5B0" strokeWidth="0.5" opacity="0.6" />
								<text
									x="60"
									y="154"
									textAnchor="middle"
									fontFamily="Inter, sans-serif"
									fontSize="4"
									fill="#D9C5B0"
									letterSpacing="2"
								>
									50 ML / 1.7 FL OZ
								</text>
							</svg>
						</div>
					</div>

					<div className="absolute inset-x-0 top-0 p-8 sm:p-10 lg:p-12">
						<p className="eyebrow text-ink/60">Debut Product</p>
					</div>
					<div className="absolute inset-x-0 bottom-0 flex justify-center pb-8 sm:pb-10 lg:pb-12">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="eyebrow border-b border-ink/60 pb-1 text-ink transition-colors hover:border-ink hover:text-ink"
						>
							Discover Lock &amp; Go →
						</YnsLink>
					</div>
				</div>

				{/* RIGHT — athletic figure, deep navy */}
				<div className="relative overflow-hidden hero-glow-navy">
					<Image
						src="/scraped-2.jpg"
						alt="Athletic figure in motion"
						fill
						priority
						sizes="(max-width: 768px) 100vw, 33vw"
						className="object-cover mix-blend-luminosity opacity-85"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
					<div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 lg:p-12">
						<p className="eyebrow text-cream/70">Performance Beauty</p>
						<p className="mt-4 max-w-xs font-display text-2xl font-light leading-tight text-cream sm:text-3xl">
							Built for motion. Made to last.
						</p>
					</div>
				</div>
			</div>

			{/* Subtle scroll cue */}
			<div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
				<div className="flex flex-col items-center gap-2 text-cream mix-blend-difference">
					<span className="eyebrow text-[10px]">Scroll</span>
					<div className="h-8 w-px bg-cream/60" />
				</div>
			</div>
		</section>
	);
}
