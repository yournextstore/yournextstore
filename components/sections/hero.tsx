import { Star } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-stage film-grain">
			{/* Ambient ember glow */}
			<div
				aria-hidden="true"
				className="absolute -top-32 right-[10%] h-[520px] w-[520px] rounded-full bg-ember/20 blur-3xl ember-pulse"
			/>
			<div
				aria-hidden="true"
				className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[80%] bg-gradient-to-t from-bone/8 to-transparent blur-2xl"
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[78vh] py-16 lg:py-20">
					{/* Left: copy stack */}
					<div className="lg:col-span-5 relative z-10 lg:pt-20">
						<div className="flex items-center gap-2 text-bone/90">
							<div className="flex" role="img" aria-label="5 star reviews">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={`star-${i}`} className="h-3.5 w-3.5 fill-bone text-bone" strokeWidth={0} />
								))}
							</div>
							<span className="text-xs font-medium tracking-wide">1000+ 5 Star Reviews</span>
						</div>

						<h1 className="mt-7 font-display text-[44px] sm:text-5xl lg:text-[58px] leading-[1.02] font-bold tracking-tight text-bone text-balance">
							Block distracting apps
							<br />
							in a single tap.
						</h1>
						<p className="mt-5 text-lg text-bone/85 max-w-md">
							Reduce your screen time with Your Next Store.
						</p>

						<div className="mt-9 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-12 px-7 bg-bone text-black rounded-full text-[15px] font-medium hover:bg-white transition-colors shadow-[0_0_40px_-10px_rgba(245,240,232,0.4)]"
							>
								disconnect now
							</YnsLink>
						</div>

						<ul className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-bone/90 text-[15px]">
							<li className="flex items-center gap-2">
								<Check />
								Reduce screen time
							</li>
							<li className="flex items-center gap-2">
								<Check />
								Stop doomscrolling
							</li>
						</ul>
					</div>

					{/* Right: hero phone visual built with SVG/CSS */}
					<div className="lg:col-span-7 relative z-0">
						<HeroVisual />
					</div>
				</div>

				{/* Floating product anchor (NFC tag) */}
				<div className="relative -mt-4 sm:-mt-10 lg:-mt-16 pb-14 lg:pb-20 z-10">
					<div className="relative mx-auto flex justify-center">
						<div className="relative">
							{/* Spotlit floor */}
							<div
								aria-hidden="true"
								className="absolute left-1/2 -translate-x-1/2 -bottom-12 h-32 w-[420px] rounded-[50%] bg-gradient-to-t from-bone/12 via-bone/4 to-transparent blur-md"
							/>
							<div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gradient-to-b from-[#222] via-black to-black shadow-[0_30px_50px_-15px_rgba(232,115,44,0.4),inset_0_2px_4px_rgba(255,255,255,0.06)] flex items-center justify-center ring-1 ring-bone/5">
								<span className="font-display italic text-bone/90 text-2xl font-bold tracking-tight">
									yns<span className="text-ember">.</span>
								</span>
								{/* highlight */}
								<div aria-hidden className="absolute inset-x-6 top-3 h-3 rounded-full bg-bone/15 blur-sm" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function Check() {
	return (
		<svg viewBox="0 0 16 16" className="h-4 w-4 text-bone" fill="none" aria-hidden>
			<path
				d="M3 8.5l3 3 7-7"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function HeroVisual() {
	return (
		<div className="relative mx-auto aspect-[4/5] max-w-[640px] flex items-center justify-center">
			{/* Soft amber glow behind phone */}
			<div
				aria-hidden
				className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[70%] h-[60%] rounded-full bg-ember/25 blur-3xl"
			/>

			{/* Phone-like device */}
			<div className="relative h-[88%] aspect-[9/19] rounded-[44px] bg-gradient-to-b from-[#1c1c1c] via-[#0a0a0a] to-black ring-1 ring-bone/10 shadow-[0_60px_120px_-30px_rgba(232,115,44,0.45)] overflow-hidden">
				{/* screen */}
				<div className="absolute inset-[6px] rounded-[38px] overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-b from-[#2a1408] via-[#150805] to-black" />
					{/* amber glow at top */}
					<div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[140%] h-[55%] rounded-full bg-ember/70 blur-3xl" />
					<div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[80%] h-[35%] rounded-full bg-gradient-to-b from-ember-soft/70 to-ember/0 blur-2xl" />

					{/* status pills */}
					<div className="absolute top-3 left-1/2 -translate-x-1/2 h-5 w-20 rounded-full bg-black/80" />

					{/* control row */}
					<div className="absolute top-12 left-3 right-3 flex items-center gap-2">
						<div className="h-7 w-7 rounded-full bg-black/40 ring-1 ring-bone/10 flex items-center justify-center">
							<svg
								viewBox="0 0 24 24"
								className="h-3.5 w-3.5 text-bone/80"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden
							>
								<circle cx="12" cy="12" r="3" />
								<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1z" />
							</svg>
						</div>
						<div className="flex-1 h-7 rounded-full bg-black/30 ring-1 ring-bone/10 flex items-center justify-around px-3">
							<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-bone/70" fill="currentColor" aria-hidden>
								<path d="M3 12h2v6H3zm4-4h2v10H7zm4-3h2v13h-2zm4 6h2v7h-2zm4-3h2v10h-2z" />
							</svg>
							<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-bone/70" fill="currentColor" aria-hidden>
								<path d="M5 12a7 7 0 0114 0M8 12a4 4 0 018 0M12 12a1 1 0 110-.001" />
							</svg>
							<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-bone/70" fill="currentColor" aria-hidden>
								<path d="M2 8h20v8H2z" />
							</svg>
						</div>
					</div>

					{/* "Default mode" pill - rotated vertically */}
					<div className="absolute right-3 top-[44%] -translate-y-1/2 rotate-90 origin-right">
						<div className="rounded-full bg-black/60 ring-1 ring-bone/10 px-3 py-1 text-[10px] tracking-wider text-bone/70 uppercase whitespace-nowrap">
							Default mode
						</div>
					</div>

					{/* time */}
					<div className="absolute bottom-14 left-4 text-bone/60 text-[10px] font-medium tracking-wider">
						6:57 ⏵
					</div>

					{/* home indicator */}
					<div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-24 rounded-full bg-bone/50" />
				</div>

				{/* speaker / camera */}
				<div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 w-24 rounded-full bg-black" />
			</div>

			{/* hand silhouette behind */}
			<div
				aria-hidden
				className="absolute bottom-[-4%] right-[6%] w-[55%] h-[65%] rounded-[60%_40%_50%_50%/55%_45%_50%_50%] bg-gradient-to-tl from-[#2c1810] via-[#1a0d08] to-transparent opacity-90 blur-md"
			/>
		</div>
	);
}
