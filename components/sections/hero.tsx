import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-bone-gradient">
			{/* window-light overlay */}
			<div aria-hidden="true" className="hero-window-light pointer-events-none absolute inset-0" />

			{/* horizontal hairline that the headline straddles, like the reference */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-1/2 left-0 right-0 h-px bg-foreground/5"
			/>

			<div className="relative mx-auto max-w-[1600px] px-6 pt-10 pb-16 lg:px-12 lg:pt-14 lg:pb-24">
				{/* Top meta row */}
				<div className="grid grid-cols-12 gap-6 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
					<div className="col-span-6 lg:col-span-3">
						<p>(01) Spring Collection</p>
					</div>
					<div className="col-span-6 lg:col-span-3 lg:col-start-10 text-right">
						<p>2026 — Edition Six</p>
					</div>
				</div>

				{/* Stage */}
				<div className="relative mt-10 lg:mt-14 grid grid-cols-12 gap-x-6 gap-y-10">
					{/* Left editorial caption */}
					<div className="order-2 lg:order-1 col-span-12 lg:col-span-3 lg:pt-8">
						<p className="font-serif text-2xl leading-[1.05] tracking-tight text-foreground">
							70 years
							<br />
							<span className="italic text-clay">of timeless</span>
						</p>
						<p className="mt-4 max-w-[22ch] text-[13px] leading-relaxed text-muted-foreground">
							Celebrating seventy seasons of objects built to outlast trend — bent forms, honest grain, and
							rooms made calmer by their presence.
						</p>
						<div className="mt-6 h-px w-12 bg-foreground/30" />
						<p className="mt-3 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
							Est. 1956 — Made in Denmark
						</p>
					</div>

					{/* Center hero image / SVG composition */}
					<div className="order-1 lg:order-2 col-span-12 lg:col-span-6">
						<HeroStage />
					</div>

					{/* Right metadata column */}
					<div className="order-3 col-span-12 lg:col-span-3 lg:pt-8 lg:text-right">
						<dl className="space-y-6 text-[13px]">
							<div>
								<dt className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
									Iconic shape
								</dt>
								<dd className="mt-1 font-serif text-xl italic text-foreground">Sculpted plywood</dd>
							</div>
							<div>
								<dt className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">Provenance</dt>
								<dd className="mt-1 font-serif text-xl italic text-foreground">Danish design</dd>
							</div>
							<div>
								<dt className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
									Customisable
								</dt>
								<dd className="mt-1 text-muted-foreground leading-relaxed">
									Choose your wood, finish &amp; upholstery from the design menu.
								</dd>
							</div>
						</dl>
					</div>
				</div>

				{/* Oversized split headline overlay */}
				<HeadlineOverlay />

				{/* Bottom row: anniversary tagline + promo card */}
				<div className="relative mt-10 lg:mt-16 grid grid-cols-12 gap-6 items-end">
					<div className="col-span-12 lg:col-span-7 max-w-md">
						<p className="text-[12px] tracking-[0.22em] uppercase text-muted-foreground">
							The Next Edit — A Field Guide to Quiet Objects
						</p>
						<p className="mt-2 text-[13px] text-muted-foreground/80 leading-relaxed">
							A new chapter for Your Next Store. Built around enduring craft, soft daylight, and rooms that
							feel inhabited.
						</p>
					</div>

					<div className="col-span-12 lg:col-span-5 lg:col-start-8">
						<PromoCardPair />
					</div>
				</div>
			</div>
		</section>
	);
}

function HeadlineOverlay() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-x-0 top-[34%] flex flex-col items-center select-none"
		>
			<div className="relative w-full max-w-[1600px] px-6 lg:px-12">
				<div className="flex items-baseline justify-between">
					<h1 className="font-serif font-medium text-foreground tracking-[-0.04em] leading-[0.85] text-[clamp(64px,15vw,260px)]">
						<span className="block">
							<span className="italic text-clay/90 mr-2 text-[0.42em] align-top relative -top-2">(The)</span>
							Next
						</span>
					</h1>
				</div>
				<div className="flex items-baseline justify-end -mt-[0.18em]">
					<h2 className="font-serif font-medium text-foreground tracking-[-0.04em] leading-[0.85] text-[clamp(64px,15vw,260px)]">
						<span className="italic">Seven</span>
						<span className="italic text-clay/90 ml-2 text-[0.42em] align-top relative -top-3">(7)</span>
					</h2>
				</div>
			</div>
		</div>
	);
}

function HeroStage() {
	return (
		<div className="relative mx-auto aspect-[4/5] w-full max-w-[440px]">
			{/* faint cross-hatch grid */}
			<svg
				aria-hidden="true"
				className="absolute inset-0 h-full w-full opacity-[0.07]"
				viewBox="0 0 100 125"
				preserveAspectRatio="none"
			>
				<defs>
					<pattern id="hero-grid" width="10" height="10" patternUnits="userSpaceOnUse">
						<path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.2" />
					</pattern>
				</defs>
				<rect width="100" height="125" fill="url(#hero-grid)" />
			</svg>

			{/* shadow puddle */}
			<div
				aria-hidden="true"
				className="absolute inset-x-8 bottom-6 h-10 rounded-[100%] bg-foreground/15 blur-2xl"
			/>

			{/* SVG of a Series-7-style chair, purely decorative */}
			<svg
				aria-hidden="true"
				viewBox="0 0 320 400"
				className="relative h-full w-full"
				style={{ filter: "drop-shadow(0 30px 30px rgba(60,30,5,0.18))" }}
			>
				<defs>
					<linearGradient id="wood-grad" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="#E8B36C" />
						<stop offset="45%" stopColor="#C98B4A" />
						<stop offset="100%" stopColor="#8E5524" />
					</linearGradient>
					<linearGradient id="wood-shine" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#fff7e7" stopOpacity="0.55" />
						<stop offset="60%" stopColor="#fff" stopOpacity="0" />
					</linearGradient>
					<linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#cfcfcf" />
						<stop offset="50%" stopColor="#9a9a9a" />
						<stop offset="100%" stopColor="#5a5a5a" />
					</linearGradient>
				</defs>

				{/* seat back */}
				<path
					d="M70 70 Q160 -10 250 70 Q260 130 240 200 Q160 160 80 200 Q60 130 70 70 Z"
					fill="url(#wood-grad)"
				/>
				<path
					d="M70 70 Q160 -10 250 70 Q260 130 240 200 Q160 160 80 200 Q60 130 70 70 Z"
					fill="url(#wood-shine)"
				/>
				{/* waist */}
				<path d="M95 195 Q160 175 225 195 L218 220 Q160 205 102 220 Z" fill="#A66B30" />
				{/* seat */}
				<ellipse cx="160" cy="240" rx="115" ry="28" fill="url(#wood-grad)" />
				<ellipse cx="160" cy="232" rx="115" ry="22" fill="url(#wood-shine)" />
				{/* legs (4 chrome) */}
				<path d="M80 248 L40 395" stroke="url(#steel)" strokeWidth="6" strokeLinecap="round" fill="none" />
				<path d="M140 252 L120 395" stroke="url(#steel)" strokeWidth="6" strokeLinecap="round" fill="none" />
				<path d="M180 252 L200 395" stroke="url(#steel)" strokeWidth="6" strokeLinecap="round" fill="none" />
				<path d="M240 248 L280 395" stroke="url(#steel)" strokeWidth="6" strokeLinecap="round" fill="none" />
				{/* leg crossbar */}
				<rect x="60" y="318" width="200" height="3" rx="1.5" fill="#a8a8a8" />
				{/* tiny dot for the iconic single screw on the back */}
				<circle cx="220" cy="100" r="3" fill="#3b2410" />
			</svg>
		</div>
	);
}

function PromoCardPair() {
	return (
		<div className="grid grid-cols-2 gap-3">
			<YnsLink
				prefetch={"eager"}
				href="/products"
				className="group relative aspect-square overflow-hidden rounded-sm bg-amber-gradient"
			>
				<Image
					src="/scraped-2.jpg"
					alt="Tangerine edition"
					fill
					sizes="(max-width: 768px) 50vw, 220px"
					className="object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-[1.04]"
				/>
				<div className="absolute inset-0 bg-gradient-to-tr from-burnt-orange/30 via-transparent to-transparent" />
				<div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
					<span className="text-[10px] tracking-[0.22em] uppercase text-white/90">In Color</span>
					<span className="font-serif italic text-white text-lg leading-none">tangerine</span>
				</div>
			</YnsLink>
			<div className="relative aspect-square overflow-hidden rounded-sm bg-card/60 border border-border/60 p-4 flex flex-col justify-between">
				<div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
					<span>The Series</span>
					<span>№ 07</span>
				</div>
				<div>
					<p className="font-serif text-xl leading-tight tracking-tight text-foreground">
						The <span className="italic text-clay">Chair</span>
					</p>
					<p className="mt-1 text-[11px] text-muted-foreground">From $429 · 12 finishes</p>
				</div>
				<YnsLink
					prefetch={"eager"}
					href="/products"
					className="self-start inline-flex items-center gap-1 text-[11px] tracking-[0.22em] uppercase text-foreground hover:text-clay transition-colors"
				>
					Configure →
				</YnsLink>
			</div>
		</div>
	);
}
