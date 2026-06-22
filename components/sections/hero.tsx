import { Play } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative w-full overflow-hidden bg-bone" aria-label="The Pre-Spring Collection">
			{/* Editorial cinematic backdrop: sunlit plaster wall + warm oak floor + diagonal sunlight */}
			<div className="relative h-[78vh] min-h-[640px] max-h-[860px] w-full">
				{/* Layered backdrop */}
				<div className="absolute inset-0 bg-sunlight-soft" aria-hidden="true" />

				{/* Diagonal raked light */}
				<div
					className="absolute inset-0 mix-blend-multiply opacity-90"
					style={{
						background:
							"linear-gradient(112deg, transparent 0%, transparent 30%, rgba(28,26,24,0.10) 33%, rgba(28,26,24,0.18) 50%, rgba(28,26,24,0.05) 65%, transparent 70%)",
					}}
					aria-hidden="true"
				/>

				{/* Window light streak */}
				<div
					className="absolute -top-10 -left-10 h-[60%] w-[55%] rotate-[14deg] opacity-90 blur-2xl"
					style={{
						background: "linear-gradient(180deg, rgba(255,247,228,0.65) 0%, rgba(255,247,228,0.0) 70%)",
					}}
					aria-hidden="true"
				/>

				{/* Floor */}
				<div
					className="absolute inset-x-0 bottom-0 h-[22%]"
					style={{
						background: "linear-gradient(180deg, #8a6a48 0%, #6f4d2c 35%, #5c3a1e 65%, #4a2e18 100%)",
					}}
					aria-hidden="true"
				/>
				<div
					className="absolute inset-x-0 bottom-0 h-[22%] opacity-50 mix-blend-overlay"
					style={{
						backgroundImage:
							"repeating-linear-gradient(90deg, rgba(0,0,0,0.0) 0px, rgba(0,0,0,0.0) 80px, rgba(0,0,0,0.18) 80px, rgba(0,0,0,0.18) 82px)",
					}}
					aria-hidden="true"
				/>

				{/* Silhouette of model — pure SVG for crisp full-bleed feel */}
				<svg
					viewBox="0 0 600 800"
					preserveAspectRatio="xMidYMax meet"
					className="absolute bottom-0 left-1/2 h-[88%] -translate-x-1/2"
					aria-hidden="true"
				>
					<defs>
						<linearGradient id="suit" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#2a2622" />
							<stop offset="60%" stopColor="#1c1a18" />
							<stop offset="100%" stopColor="#100f0d" />
						</linearGradient>
						<linearGradient id="tee" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#9a9388" />
							<stop offset="100%" stopColor="#7a7468" />
						</linearGradient>
						<radialGradient id="skin" cx="0.5" cy="0.35" r="0.55">
							<stop offset="0%" stopColor="#d6bfa6" />
							<stop offset="100%" stopColor="#b69a7b" />
						</radialGradient>
					</defs>
					{/* Head */}
					<ellipse cx="300" cy="120" rx="46" ry="58" fill="url(#skin)" />
					{/* Hair */}
					<path
						d="M260 88 Q300 56 340 88 Q346 110 332 122 Q320 96 300 92 Q280 96 268 122 Q254 110 260 88 Z"
						fill="#241d18"
					/>
					{/* Neck/shoulders tee */}
					<path d="M278 168 L322 168 L330 198 L270 198 Z" fill="url(#tee)" />
					{/* Wrap blazer body */}
					<path
						d="M232 200 Q300 188 368 200 L386 360 Q380 420 360 460 L348 540 Q340 560 332 568 L268 568 Q260 560 252 540 L240 460 Q220 420 214 360 Z"
						fill="url(#suit)"
					/>
					{/* Wrap tie knot */}
					<path d="M270 360 Q300 372 330 360 L344 392 Q320 408 300 404 Q280 408 256 392 Z" fill="#0f0d0b" />
					{/* Wrap tail */}
					<path d="M330 392 L356 470 L342 478 L322 408 Z" fill="#0f0d0b" />
					{/* Shorts */}
					<path
						d="M252 560 L348 560 L356 700 Q336 720 320 720 L312 700 L300 700 L288 700 L280 720 Q264 720 244 700 Z"
						fill="#0f0d0b"
					/>
					{/* Legs */}
					<path d="M278 700 L286 800 L304 800 L296 700 Z" fill="#d6bfa6" opacity="0.7" />
					<path d="M312 700 L320 800 L338 800 L330 700 Z" fill="#d6bfa6" opacity="0.7" />
					{/* Shoes */}
					<ellipse cx="296" cy="800" rx="18" ry="8" fill="#0f0d0b" />
					<ellipse cx="330" cy="800" rx="18" ry="8" fill="#0f0d0b" />
				</svg>

				{/* Cast shadow under model on the floor */}
				<div
					className="absolute bottom-[18%] left-1/2 h-[24px] w-[200px] -translate-x-1/2 rounded-[50%] blur-md"
					style={{ background: "rgba(0,0,0,0.45)" }}
					aria-hidden="true"
				/>

				{/* Headline overlay */}
				<div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-between px-6 py-10 lg:px-10">
					<div />
					<div className="max-w-xl">
						<p className="eyebrow text-ink/80">The Pre-Spring Collection</p>
						<h1 className="mt-3 font-display text-[40px] leading-[1.05] text-ink sm:text-5xl lg:text-[64px] lg:tracking-[-0.02em]">
							New Tailoring
						</h1>
					</div>
					<div className="flex items-end justify-between">
						<div className="max-w-md">
							<p className="text-sm leading-relaxed text-ink/80 sm:text-base">
								New trousers, shirts and suiting for brighter days ahead. Tell your closet.
							</p>
							<div className="mt-4 flex items-center gap-6">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm font-medium text-ink underline underline-offset-[6px] decoration-[1px] hover:decoration-2 transition-all"
								>
									Shop Now
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="#editorial"
									className="text-sm font-medium text-ink underline underline-offset-[6px] decoration-[1px] hover:decoration-2 transition-all"
								>
									View Edit
								</YnsLink>
							</div>
						</div>
						<button
							type="button"
							aria-label="Play campaign film"
							className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-ink/40 bg-cream/40 backdrop-blur-sm text-ink hover:bg-cream/70 transition-colors"
						>
							<Play className="h-3.5 w-3.5 fill-current" />
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
